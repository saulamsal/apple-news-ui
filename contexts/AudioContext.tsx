import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { PodcastEpisode } from '@/types/podcast';
import songs from '@/data/songs.json';

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
    const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const setupAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: true,
                    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                    shouldDuckAndroid: true,
                });
            } catch (error) {
                console.error('Error setting up audio mode:', error);
            }
        };

        setupAudio();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;

        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);
        setIsPlaying(status.isPlaying);

        if (status.didJustFinish && !status.isPlaying) {
            playNext();
        }
    }, []);

    const playEpisode = async (episode: PodcastEpisode) => {
        try {
            setIsLoading(true);

            // Stop and unload any existing audio
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }

            // Create and load the new sound
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: episode.streamUrl },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setCurrentEpisode(episode);
            setIsPlaying(true);
            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing episode:', error);
            await closePlayer();
        } finally {
            setIsLoading(false);
        }
    };

    const pauseSound = async () => {
        try {
            if (sound) {
                await sound.pauseAsync();
                setIsPlaying(false);
            }
        } catch (error) {
            console.error('Error pausing sound:', error);
        }
    };

    const togglePlayPause = async () => {
        if (!sound || !currentEpisode) return;

        try {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
            setIsPlaying(!isPlaying);
        } catch (error) {
            console.error('Error toggling play/pause:', error);
        }
    };

    const closePlayer = async () => {
        try {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }
            setSound(null);
            setCurrentEpisode(null);
            setIsPlaying(false);
            setPosition(0);
            setDuration(0);
        } catch (error) {
            console.error('Error closing player:', error);
        }
    };

    const seek = async (seconds: number) => {
        try {
            if (sound) {
                const status = await sound.getStatusAsync();
                if (!status.isLoaded) return;

                const newPosition = status.positionMillis + (seconds * 1000);
                await sound.setPositionAsync(newPosition);
            }
        } catch (error) {
            console.error('Error seeking:', error);
        }
    };

    const playNext = useCallback(async () => {
        if (!currentEpisode) return;
        
        // Find matching song from songs.json for faster loading
        const currentSong = songs.songs.find(song => song.title === currentEpisode.title);
        const currentIndex = songs.songs.indexOf(currentSong!);
        if (currentIndex === -1) return;

        const nextSong = songs.songs[(currentIndex + 1) % songs.songs.length];
        
        await playEpisode({
            id: String(nextSong.id),
            title: nextSong.title,
            streamUrl: nextSong.mp4_link!,
            artwork: { url: nextSong.artwork },
            showTitle: nextSong.artist,
            duration: 0,
            releaseDate: new Date().toISOString(),
            summary: ''
        });
    }, [currentEpisode]);

    const playPreviousEpisode = useCallback(async () => {
        if (!currentEpisode) return;
        
        // Find matching song from songs.json for faster loading
        const currentSong = songs.songs.find(song => song.title === currentEpisode.title);
        const currentIndex = songs.songs.indexOf(currentSong!);
        if (currentIndex === -1) return;

        const prevIndex = currentIndex === 0 ? songs.songs.length - 1 : currentIndex - 1;
        const prevSong = songs.songs[prevIndex];
        
        await playEpisode({
            id: String(prevSong.id),
            title: prevSong.title,
            streamUrl: prevSong.mp4_link!,
            artwork: { url: prevSong.artwork },
            showTitle: prevSong.artist,
            duration: 0,
            releaseDate: new Date().toISOString(),
            summary: ''
        });
    }, [currentEpisode]);

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
