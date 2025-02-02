import { createContext, useContext, useRef, useCallback, useState, useEffect } from 'react';
import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { PodcastEpisode } from '@/types/podcast';
import songs from '@/data/songs.json';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import { Platform } from 'react-native';

// Store to track active audio globally
let activeAudioRef: { sound: Audio.Sound | null } = { sound: null };

interface AudioContextType {
    soundRef: React.RefObject<Audio.Sound | null>;
    sharedValues: {
        position: any; // SharedValue<number>
        duration: any; // SharedValue<number>
        isPlaying: any; // SharedValue<boolean>
        isLoading: any; // SharedValue<boolean>
    };
    currentEpisode: PodcastEpisode | null;
    isPlaying: boolean;
    togglePlayPause: () => Promise<void>;
    commands: {
        playEpisode: (episode: PodcastEpisode) => Promise<void>;
        pauseSound: () => Promise<void>;
        togglePlayPause: () => Promise<void>;
        playNext: () => Promise<void>;
        playPreviousEpisode: () => Promise<void>;
        seek: (seconds: number) => Promise<void>;
        closePlayer: () => Promise<void>;
        loadEpisodeWithoutPlaying: (episode: PodcastEpisode) => Promise<void>;
    };
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const soundRef = useRef<Audio.Sound | null>(null);
    const position = useSharedValue(0);
    const duration = useSharedValue(0);
    const isPlaying = useSharedValue(false);
    const isLoading = useSharedValue(false);
    const currentEpisodeRef = useRef<PodcastEpisode | null>(null);
    const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);

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
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;

        position.value = status.positionMillis;
        duration.value = status.durationMillis || 0;
        isPlaying.value = status.isPlaying;
        isLoading.value = status.isBuffering;

        if (status.didJustFinish && !status.isPlaying) {
            runOnJS(playNext)();
        }
    }, []);

    const playEpisode = async (episode: PodcastEpisode) => {
        try {
            isLoading.value = true;
            // Set episode immediately for instant UI update
            currentEpisodeRef.current = episode;
            setCurrentEpisode(episode);

            if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
            }

            const streamUrl = episode.attributes?.offers?.find(offer => 
                offer.type === "STDQ" || offer.type === "PSUB"
            )?.hlsUrl || episode.streamUrl;

            if (!streamUrl) {
                throw new Error('No valid stream URL found');
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: streamUrl },
                { shouldPlay: true }, // Always try to play immediately
                onPlaybackStatusUpdate
            );

            soundRef.current = newSound;
            
            if (episode.attributes?.offers) {
                const offer = episode.attributes.offers.find(o => o.type === "PSUB");
                if (offer?.durationInMilliseconds) {
                    duration.value = offer.durationInMilliseconds;
                }
            }

            try {
                await newSound.playAsync();
                isPlaying.value = true;
            } catch (error) {
                // If autoplay fails (e.g., on web without user interaction), just load the audio
                console.log('Auto-play failed, audio loaded and ready to play');
                isPlaying.value = false;
            }
        } catch (error) {
            console.error('Error playing episode:', error);
            await closePlayer();
        } finally {
            isLoading.value = false;
        }
    };

    const pauseSound = async () => {
        try {
            if (soundRef.current) {
                await soundRef.current.pauseAsync();
                isPlaying.value = false;
            }
        } catch (error) {
            console.error('Error pausing sound:', error);
        }
    };

    const togglePlayPause = async () => {
        if (!soundRef.current || !currentEpisodeRef.current) return;

        try {
            if (isPlaying.value) {
                await soundRef.current.pauseAsync();
                isPlaying.value = false;
            } else {
                await soundRef.current.playAsync();
                isPlaying.value = true;
            }
        } catch (error) {
            console.error('Error toggling play/pause:', error);
        }
    };

    const closePlayer = async () => {
        try {
            if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
            }
            soundRef.current = null;
            currentEpisodeRef.current = null;
            setCurrentEpisode(null);
            isPlaying.value = false;
            position.value = 0;
            duration.value = 0;
        } catch (error) {
            console.error('Error closing player:', error);
        }
    };

    const seek = async (seconds: number) => {
        try {
            if (soundRef.current) {
                const status = await soundRef.current.getStatusAsync();
                if (!status.isLoaded) return;

                const newPosition = status.positionMillis + (seconds * 1000);
                await soundRef.current.setPositionAsync(newPosition);
            }
        } catch (error) {
            console.error('Error seeking:', error);
        }
    };

    const playNext = useCallback(async () => {
        if (!currentEpisodeRef.current) return;
        
        const currentSong = songs.songs.find(song => song.title === currentEpisodeRef.current?.title);
        const currentIndex = songs.songs.indexOf(currentSong!);
        if (currentIndex === -1) return;

        const nextSong = songs.songs[(currentIndex + 1) % songs.songs.length];
        
        const nextEpisode: PodcastEpisode = {
            id: String(nextSong.id),
            title: nextSong.title,
            streamUrl: nextSong.mp4_link!,
            artwork: { url: nextSong.artwork },
            showTitle: nextSong.artist,
            duration: 0,
            releaseDate: new Date().toISOString(),
            summary: '',
            attributes: {
                offers: [{
                    kind: 'get',
                    type: 'STDQ',
                    hlsUrl: nextSong.mp4_link
                }],
                durationInMilliseconds: 0,
                name: nextSong.title,
                artistName: nextSong.artist
            }
        };

        await playEpisode(nextEpisode);
    }, []);

    const playPreviousEpisode = useCallback(async () => {
        if (!currentEpisodeRef.current) return;
        
        const currentSong = songs.songs.find(song => song.title === currentEpisodeRef.current?.title);
        const currentIndex = songs.songs.indexOf(currentSong!);
        if (currentIndex === -1) return;

        const prevIndex = currentIndex === 0 ? songs.songs.length - 1 : currentIndex - 1;
        const prevSong = songs.songs[prevIndex];
        
        const prevEpisode: PodcastEpisode = {
            id: String(prevSong.id),
            title: prevSong.title,
            streamUrl: prevSong.mp4_link!,
            artwork: { url: prevSong.artwork },
            showTitle: prevSong.artist,
            duration: 0,
            releaseDate: new Date().toISOString(),
            summary: '',
            attributes: {
                offers: [{
                    kind: 'get',
                    type: 'STDQ',
                    hlsUrl: prevSong.mp4_link
                }],
                durationInMilliseconds: 0,
                name: prevSong.title,
                artistName: prevSong.artist
            }
        };

        await playEpisode(prevEpisode);
    }, []);

    const loadEpisodeWithoutPlaying = async (episode: PodcastEpisode) => {
        try {
            isLoading.value = true;
            // Set episode immediately for UI update
            currentEpisodeRef.current = episode;
            setCurrentEpisode(episode);

            if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
            }

            const streamUrl = episode.attributes?.offers?.find(offer => 
                offer.type === "STDQ" || offer.type === "PSUB"
            )?.hlsUrl || episode.streamUrl;

            if (!streamUrl) {
                throw new Error('No valid stream URL found');
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: streamUrl },
                { shouldPlay: false }, // Don't auto-play
                onPlaybackStatusUpdate
            );

            soundRef.current = newSound;
            isPlaying.value = false;
            
            if (episode.attributes?.offers) {
                const offer = episode.attributes.offers.find(o => o.type === "PSUB");
                if (offer?.durationInMilliseconds) {
                    duration.value = offer.durationInMilliseconds;
                }
            }
        } catch (error) {
            console.error('Error loading episode:', error);
            await closePlayer();
        } finally {
            isLoading.value = false;
        }
    };

    return (
        <AudioContext.Provider value={{
            soundRef,
            sharedValues: {
                position,
                duration,
                isPlaying,
                isLoading
            },
            currentEpisode,
            isPlaying: isPlaying.value,
            togglePlayPause,
            commands: {
                playEpisode,
                pauseSound,
                togglePlayPause,
                playNext,
                playPreviousEpisode,
                seek,
                closePlayer,
                loadEpisodeWithoutPlaying
            }
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
