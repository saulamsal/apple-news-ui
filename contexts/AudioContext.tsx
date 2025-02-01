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
    seek: (seconds: number) => Promise<void>;
    closePlayer: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
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

        return () => {
            if (sound) {
                sound.unloadAsync();
                activeAudioRef.sound = null;
            }
        };
    }, []);

    const onPlaybackStatusUpdate = useCallback(async (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;

        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);
        setIsPlaying(status.isPlaying);

        if (status.didJustFinish && !status.isPlaying) {
            await playNext();
        }
    }, []);

    const playEpisode = async (episode: PodcastEpisode) => {
        if (isPlaybackOperationInProgress.current) return;
        isPlaybackOperationInProgress.current = true;
        setIsLoading(true);

        try {
            if (activeAudioRef.sound) {
                await activeAudioRef.sound.stopAsync();
                await activeAudioRef.sound.unloadAsync();
                activeAudioRef.sound = null;
            }

            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
                setSound(null);
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: episode.streamUrl },
                { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
                onPlaybackStatusUpdate
            );

            activeAudioRef.sound = newSound;
            setSound(newSound);
            setCurrentEpisode(episode);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing episode:', error);
            await closePlayer();
        } finally {
            isPlaybackOperationInProgress.current = false;
            setIsLoading(false);
        }
    };

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
            setIsPlaying(newIsPlaying);
            await (newIsPlaying ? sound.playAsync() : sound.pauseAsync());
        } catch (error) {
            console.error('Error toggling play/pause:', error);
            setIsPlaying(!isPlaying);
        } finally {
            isPlaybackOperationInProgress.current = false;
        }
    };

    const playNext = useCallback(async () => {
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
    }, [currentEpisode]);

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
    }, [currentEpisode]);

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
                await sound.stopAsync();
                await sound.unloadAsync();
                activeAudioRef.sound = null;
            }

            setSound(null);
            setCurrentEpisode(null);
            setIsPlaying(false);
            setPosition(0);
            setDuration(0);
        } finally {
            isPlaybackOperationInProgress.current = false;
        }
    };

    return (
        <AudioContext.Provider value={{
            sound,
            isPlaying,
            currentEpisode,
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
