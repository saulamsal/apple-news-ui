import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import { songs } from '@/data/songs.json';

interface Song {
    id: number;
    title: string;
    artist: string;
    artwork: string;
    artwork_bg_color?: string;
    mp4_link?: string;
}

interface AudioContextType {
    sound: Audio.Sound | null;
    isPlaying: boolean;
    currentSong: Song | null;
    position: number;
    duration: number;
    setSound: (sound: Audio.Sound | null) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentSong: (song: Song) => void;
    playSound: (song: Song) => Promise<void>;
    pauseSound: () => Promise<void>;
    togglePlayPause: () => Promise<void>;
    playNextSong: () => Promise<void>;
    playPreviousSong: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

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

    const playSound = async (song: Song) => {
        try {
            // If there's already a sound playing, stop it
            if (sound) {
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: song.mp4_link },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setCurrentSong(song);
            setIsPlaying(true);
            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const pauseSound = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const togglePlayPause = async () => {
        if (!sound || !currentSong) return;

        if (isPlaying) {
            await pauseSound();
        } else {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    const onPlaybackStatusUpdate = useCallback(async (status: Audio.PlaybackStatus) => {
        if (!status.isLoaded) return;

        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);
        setIsPlaying(status.isPlaying);

        // Check if the song has finished and isn't already loading the next song
        if (status.didJustFinish && !status.isPlaying) {
            console.log('Song finished, playing next song'); // Debug log
            await playNextSong();
        }
    }, [playNextSong]);

    const playNextSong = useCallback(async () => {
        const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
        if (currentIndex === -1) return;

        const nextSong = songs[(currentIndex + 1) % songs.length];
        await playSound(nextSong);
    }, [currentSong, songs]);

    const playPreviousSong = useCallback(async () => {
        const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
        if (currentIndex === -1) return;

        const previousIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
        const previousSong = songs[previousIndex];
        await playSound(previousSong);
    }, [currentSong, songs]);

    return (
        <AudioContext.Provider value={{
            sound,
            isPlaying,
            currentSong,
            position,
            duration,
            setSound,
            setIsPlaying,
            setCurrentSong,
            playSound,
            pauseSound,
            togglePlayPause,
            playNextSong,
            playPreviousSong,
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
