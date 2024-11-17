import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { PodcastEpisode } from '@/types/podcast';
import podcastData from '@/data/podcasts.json';

interface AudioContextType {
    sound: Audio.Sound | null;
    isPlaying: boolean;
    currentEpisode: PodcastEpisode | null;
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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
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

    const playEpisode = async (episode: PodcastEpisode) => {
        try {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
                setSound(null);
            }

            console.log('Playing episode:', episode.title, 'URL:', episode.streamUrl);

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: episode.streamUrl },
                { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setCurrentEpisode(episode);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing episode:', error);
            setSound(null);
            setIsPlaying(false);
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

        if (isPlaying) {
            await pauseSound();
        } else {
            await sound.playAsync();
            setIsPlaying(true);
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

    return (
        <AudioContext.Provider value={{
            sound,
            isPlaying,
            currentEpisode,
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
