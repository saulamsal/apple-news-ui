import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { PodcastEpisode } from '@/types/podcast';
import podcastData from '@/data/podcasts.json';
import { useSharedValue } from 'react-native-reanimated';

interface AudioContextType {
    sound: Audio.Sound | null;
    isPlaying: boolean;
    currentEpisode: PodcastEpisode | null;
    currentAudioId: string | null;
    position: number;
    duration: number;
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
    const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
    const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const progress = useSharedValue(0);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        const setupAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: true,
                    shouldDuckAndroid: true,
                });
            } catch (error) {
                console.error('Error setting up audio mode:', error);
            }
        };

        setupAudio();
    }, []);

    const playEpisode = async (episode: PodcastEpisode) => {
        try {
            // If there's an existing sound, just stop and unload it
            // but don't reset UI states yet
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
                setSound(null);
            }

            // Set the new episode info before loading audio
            // This maintains the UI while audio loads
            setCurrentEpisode(episode);
            setCurrentAudioId(episode.id);
            setIsPlaying(false); // Temporarily set to false while loading

            // Create and play the new sound
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: episode.streamUrl },
                { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing episode:', error);
            // On error, do full cleanup
            await closePlayer();
            throw error;
        }
    };

    const playNextEpisode = async () => {
        if (!currentEpisode || !podcastData?.[0]?.data?.shelves?.[0]?.items) return;
        
        const episodes = podcastData[0].data.shelves[0].items;
        const currentIndex = episodes.findIndex((ep: any) => ep.id === currentEpisode.id);
        if (currentIndex === -1) return;

        const nextEpisode = episodes[(currentIndex + 1) % episodes.length];
        
        const streamUrl = nextEpisode.playAction?.episodeOffer?.streamUrl;
        if (!streamUrl) return;
        
        const imageUrl = nextEpisode.episodeArtwork?.template?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') ||
                        nextEpisode.icon?.template?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg');

        await playEpisode({
            id: nextEpisode.id,
            title: nextEpisode.title,
            streamUrl: streamUrl,
            artwork: { url: imageUrl || '' },
            showTitle: nextEpisode.showTitle,
            duration: nextEpisode.duration,
            releaseDate: nextEpisode.releaseDate,
            summary: nextEpisode.summary
        });
    };

    const playNext = useCallback(playNextEpisode, [currentEpisode, playEpisode]);

    const onPlaybackStatusUpdate = useCallback(async (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;

        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);
        setIsPlaying(status.isPlaying);

        if (status.didJustFinish && !status.isPlaying) {
            await playNext();
        }
    }, [playNext]);

    const pauseSound = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const togglePlayPause = async () => {
        if (!sound || !currentEpisode) return;

        // Set state immediately for UI responsiveness
        const newIsPlaying = !isPlaying;
        setIsPlaying(newIsPlaying);

        try {
            if (newIsPlaying) {
                await sound.playAsync();
            } else {
                await sound.pauseAsync();
            }
        } catch (error) {
            // Revert state if operation fails
            console.error('Error toggling play/pause:', error);
            setIsPlaying(!newIsPlaying);
        }
    };

    const playPreviousEpisode = useCallback(async () => {
        if (!currentEpisode || !podcastData?.[0]?.data?.shelves?.[0]?.items) return;
        
        const episodes = podcastData[0].data.shelves[0].items;
        const currentIndex = episodes.findIndex((ep: any) => ep.id === currentEpisode.id);
        if (currentIndex === -1) return;

        const previousIndex = currentIndex === 0 ? episodes.length - 1 : currentIndex - 1;
        const previousEpisode = episodes[previousIndex];
        await playEpisode(previousEpisode);
    }, [currentEpisode, playEpisode]);

    const seek = async (seconds: number) => {
        if (!sound) return;
        
        const status = await sound.getStatusAsync();
        if (!status.isLoaded) return;

        const newPosition = status.positionMillis + (seconds * 1000);
        await sound.setPositionAsync(newPosition);
    };

    const closePlayer = async () => {
        // Stop and unload the sound first
        if (sound) {
            try {
                await sound.stopAsync();
                await sound.unloadAsync();
            } catch (error) {
                console.error('Error stopping sound:', error);
            }
        }

        // Reset all states
        setSound(null);
        setCurrentEpisode(null);
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
        setCurrentAudioId(null);
        progress.value = 0;
    };

    return (
        <AudioContext.Provider value={{
            sound,
            isPlaying,
            currentEpisode,
            currentAudioId,
            position,
            duration,
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
