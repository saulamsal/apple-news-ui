import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { PodcastEpisode } from '@/types/podcast';
import podcastsData from '@/data/podcasts.json';
import { useSharedValue } from 'react-native-reanimated';

// Store to track active audio globally
let activeAudioRef: { sound: Audio.Sound | null } = { sound: null };

interface AudioContextType {
    sound: Audio.Sound | null;
    isPlaying: boolean;
    currentEpisode: PodcastEpisode | null;
    currentAudioId: string | null;
    position: number;
    duration: number;
    isLoading: boolean;
    setSound: (sound: Audio.Sound | null) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentEpisode: (episode: PodcastEpisode) => void;
    playEpisode: (episode: PodcastEpisode) => Promise<void>;
    pauseSound: () => Promise<void>;
    togglePlayPause: () => Promise<void>;
    playNext: () => Promise<void>;
    playPreviousEpisode: () => Promise<void>;
    progress: any;
    seek: (seconds: number) => Promise<void>;
    closePlayer: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
    const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const progress = useSharedValue(0);
    const isPlaybackOperationInProgress = useRef(false);

    useEffect(() => {
        const setupAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    staysActiveInBackground: true,
                    playsInSilentModeIOS: true,
                    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                    shouldDuckAndroid: false,
                    playThroughEarpieceAndroid: false
                });
            } catch (error) {
                console.error('Error setting up audio mode:', error);
            }
        };

        setupAudio();
    }, []);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
                activeAudioRef.sound = null;
            }
        };
    }, []);

    const playEpisode = async (episode: PodcastEpisode) => {
        if (isPlaybackOperationInProgress.current) return;
        isPlaybackOperationInProgress.current = true;
        setIsLoading(true);

        try {
            // Start loading the new sound immediately
            const soundPromise = Audio.Sound.createAsync(
                { uri: episode.streamUrl },
                { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
                onPlaybackStatusUpdate
            );

            // Cleanup previous sounds in parallel
            const cleanupPromise = (async () => {
                if (activeAudioRef.sound) {
                    try {
                        await activeAudioRef.sound.stopAsync();
                        await activeAudioRef.sound.unloadAsync();
                    } catch (error) {
                        console.warn('Error stopping previous sound:', error);
                    }
                    activeAudioRef.sound = null;
                }

                if (sound) {
                    try {
                        await sound.stopAsync();
                        await sound.unloadAsync();
                    } catch (error) {
                        console.warn('Error cleaning up existing sound:', error);
                    }
                    setSound(null);
                }
            })();

            // Update UI state immediately
            setCurrentEpisode(episode);
            setCurrentAudioId(episode.id);

            // Wait for both operations to complete
            const [{ sound: newSound }] = await Promise.all([
                soundPromise,
                cleanupPromise
            ]);

            // Set as active audio globally and update state
            activeAudioRef.sound = newSound;
            setSound(newSound);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing episode:', error);
            await closePlayer();
            throw error;
        } finally {
            isPlaybackOperationInProgress.current = false;
            setIsLoading(false);
        }
    };

    const playNextEpisode = async () => {
        if (!currentEpisode || !podcastsData?.results?.['podcast-episodes']?.[0]?.data) return;
        
        const episodes = podcastsData.results['podcast-episodes'][0].data;
        const currentIndex = episodes.findIndex((ep: any) => ep.id === currentEpisode.id);
        if (currentIndex === -1) return;

        const nextEpisode = episodes[(currentIndex + 1) % episodes.length];
        if (!nextEpisode?.attributes) return;
        
        const streamUrl = nextEpisode.attributes.assetUrl;
        if (!streamUrl) return;
        
        const imageUrl = nextEpisode.attributes.artwork?.url?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') || '';

        await playEpisode({
            id: nextEpisode.id,
            title: nextEpisode.attributes.name,
            streamUrl: streamUrl,
            artwork: { url: imageUrl },
            showTitle: nextEpisode.attributes.artistName,
            duration: nextEpisode.attributes.durationInMilliseconds,
            releaseDate: nextEpisode.attributes.releaseDateTime,
            summary: nextEpisode.attributes.description?.standard
        });
    };

    const playNext = useCallback(playNextEpisode, [currentEpisode, playEpisode]);

    const onPlaybackStatusUpdate = useCallback(async (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;

        // Batch state updates
        const updates = () => {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
        };
        updates();

        if (status.didJustFinish && !status.isPlaying) {
            await playNext();
        }
    }, [playNext]);

    const pauseSound = async () => {
        if (isPlaybackOperationInProgress.current) return;
        isPlaybackOperationInProgress.current = true;

        try {
            if (sound) {
                await sound.pauseAsync();
                setIsPlaying(false);
            }
        } catch (error) {
            console.error('Error pausing sound:', error);
        } finally {
            isPlaybackOperationInProgress.current = false;
        }
    };

    const togglePlayPause = async () => {
        if (!sound || !currentEpisode || isPlaybackOperationInProgress.current) return;
        isPlaybackOperationInProgress.current = true;

        try {
            const newIsPlaying = !isPlaying;
            const operation = newIsPlaying ? sound.playAsync() : sound.pauseAsync();
            
            // Update UI immediately
            setIsPlaying(newIsPlaying);
            
            // Wait for operation to complete
            await operation;
        } catch (error) {
            console.error('Error toggling play/pause:', error);
            setIsPlaying(!isPlaying); // Revert state if operation fails
        } finally {
            isPlaybackOperationInProgress.current = false;
        }
    };

    const playPreviousEpisode = useCallback(async () => {
        if (!currentEpisode || !podcastsData?.results?.['podcast-episodes']?.[0]?.data) return;
        
        const episodes = podcastsData.results['podcast-episodes'][0].data;
        const currentIndex = episodes.findIndex((ep: any) => ep.id === currentEpisode.id);
        if (currentIndex === -1) return;

        const previousIndex = currentIndex === 0 ? episodes.length - 1 : currentIndex - 1;
        const previousEpisode = episodes[previousIndex];
        if (!previousEpisode?.attributes) return;

        const streamUrl = previousEpisode.attributes.assetUrl;
        if (!streamUrl) return;
        
        const imageUrl = previousEpisode.attributes.artwork?.url?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') || '';

        await playEpisode({
            id: previousEpisode.id,
            title: previousEpisode.attributes.name,
            streamUrl: streamUrl,
            artwork: { url: imageUrl },
            showTitle: previousEpisode.attributes.artistName,
            duration: previousEpisode.attributes.durationInMilliseconds,
            releaseDate: previousEpisode.attributes.releaseDateTime,
            summary: previousEpisode.attributes.description?.standard
        });
    }, [currentEpisode, playEpisode]);

    const seek = async (seconds: number) => {
        if (!sound || isPlaybackOperationInProgress.current) return;
        isPlaybackOperationInProgress.current = true;

        try {
            const status = await sound.getStatusAsync();
            if (!status.isLoaded) return;

            const newPosition = status.positionMillis + (seconds * 1000);
            await sound.setPositionAsync(newPosition);
        } catch (error) {
            console.error('Error seeking:', error);
        } finally {
            isPlaybackOperationInProgress.current = false;
        }
    };

    const closePlayer = async () => {
        if (isPlaybackOperationInProgress.current) return;
        isPlaybackOperationInProgress.current = true;

        try {
            if (sound) {
                try {
                    await sound.stopAsync();
                    await sound.unloadAsync();
                    activeAudioRef.sound = null;
                } catch (error) {
                    console.error('Error stopping sound:', error);
                }
            }

            setSound(null);
            setCurrentEpisode(null);
            setIsPlaying(false);
            setPosition(0);
            setDuration(0);
            setCurrentAudioId(null);
            progress.value = 0;
        } finally {
            isPlaybackOperationInProgress.current = false;
        }
    };

    return (
        <AudioContext.Provider value={{
            sound,
            isPlaying,
            currentEpisode,
            currentAudioId,
            position,
            duration,
            isLoading,
            setSound,
            setIsPlaying,
            setCurrentEpisode,
            playEpisode,
            pauseSound,
            togglePlayPause,
            playNext,
            playPreviousEpisode,
            progress,
            seek,
            closePlayer
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
