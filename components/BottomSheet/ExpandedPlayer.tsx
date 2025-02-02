import { View, Text, StyleSheet, Image, Pressable, Dimensions, Platform, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
const { width } = Dimensions.get('window');
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Foundation from '@expo/vector-icons/Foundation';
import { router } from 'expo-router';
import Animated, { 
    useAnimatedStyle, 
    withTiming, 
    withSequence, 
    withDelay, 
    useSharedValue,
    useAnimatedReaction,
    runOnJS
} from 'react-native-reanimated';

interface ExpandedPlayerProps {
    scrollComponent?: (props: any) => React.ReactElement;
}

export function ExpandedPlayer({ scrollComponent }: ExpandedPlayerProps) {
    const ScrollComponentToUse = scrollComponent || View;
    const { sharedValues, commands, currentEpisode } = useAudio();
    const { position, duration, isPlaying } = sharedValues;
    const { togglePlayPause, seek } = commands;
    const insets = useSafeAreaInsets();
    const scrollX = useSharedValue(0);
    const [isPlayingState, setIsPlayingState] = useState(false);

    useAnimatedReaction(
        () => isPlaying.value,
        (playing) => {
            runOnJS(setIsPlayingState)(playing);
        }
    );

    useEffect(() => {
        if (!currentEpisode) return;

        const startAnimation = () => {
            scrollX.value = withSequence(
                withTiming(0, { duration: 0 }),
                withTiming(-width/2, { duration: 8000 }),
                withDelay(2000, withTiming(0, { duration: 0 }))
            );
        };

        const interval = setInterval(startAnimation, 10000);
        startAnimation();

        return () => clearInterval(interval);
    }, [currentEpisode]);

    const scrollStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: scrollX.value }]
        };
    });

    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration.value > 0 ? (position.value / duration.value) * 100 : 0;
    const rewind15Seconds = () => seek(-15);

    if (!currentEpisode) return null;

    return (
        <ImageBackground
            source={{ uri: currentEpisode.artwork.url }}
            style={[styles.rootContainer, {
                borderRadius: Platform.OS === 'ios' ? 40 : 0
            }]}
            blurRadius={20}
        >
            {Platform.OS === 'ios' ? (
                <BlurView
                    tint="dark"
                    intensity={80}
                    style={styles.blurContainer}
                >
                    <ScrollComponentToUse style={styles.scrollView}>
                        <View style={{
                            width: 50,
                            height: 6,
                            backgroundColor: '#fff',
                            alignSelf: 'center',
                            borderRadius: 20,
                            marginVertical: 8,
                            opacity: 0.5,
                            marginBottom: 40,
                        }}>
                        </View>
                        <View style={styles.container} className="mx-5 gap-8">
                            <Image
                                source={{ uri: currentEpisode.artwork.url }}
                                style={styles.artwork}
                            />

                            <View style={styles.contentContainer}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.source}>{currentEpisode.showTitle}</Text>
                                    <View style={styles.titleWrapper}>
                                        <Animated.Text 
                                            numberOfLines={1} 
                                            style={[styles.title, scrollStyle]}
                                        >
                                            {currentEpisode.title}
                                        </Animated.Text>
                                    </View>
                                </View>

                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progress, { width: `${progress}%` }]} />
                                    </View>
                                    <View style={styles.timeContainer}>
                                        <Text style={styles.timeText}>{formatTime(position.value)}</Text>
                                        <Text style={styles.timeText}>-{formatTime(Math.max(0, duration.value - position.value))}</Text>
                                    </View>
                                </View>

                                <View style={styles.controls}>
                                    <Pressable onPress={rewind15Seconds} style={styles.controlButton}>
                                        <View style={{ alignItems: 'center', position: 'relative' }}>
                                            <Ionicons name="refresh-sharp" size={60} color="#fff" style={{ transform: [{ scaleX: -1 }] }} />
                                            <Text style={{ color: '#fff', fontSize: 14, marginTop: 4, position: 'absolute', top: 26, left: 22 }}>15</Text>
                                        </View>
                                    </Pressable>

                                    <Pressable onPress={togglePlayPause} style={[styles.controlButton, styles.playButton]}>
                                        <Ionicons name={isPlayingState ? "pause" : "play"} size={60} color="#fff" />
                                    </Pressable>

                                    <Pressable style={styles.controlButton}>
                                        <Foundation name="fast-forward" size={60} color="#fff" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </ScrollComponentToUse>
                </BlurView>
            ) : (
                <View className="max-w-[400px] m-auto w-full">
                    {Platform.OS === 'web' && (
                        <Pressable 
                            onPress={() => router.back()}
                            style={{
                                position: 'absolute',
                                left: -80,
                                top: -80,
                                zIndex: 10,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                padding: 8,
                                borderRadius: 20,
                            }}
                        >
                            <Ionicons name="close" size={24} color="#fff" />
                        </Pressable>
                    )}
                    <ScrollComponentToUse style={styles.scrollView}>
                        <View style={styles.container}>
                            <Image
                                source={{ uri: currentEpisode.artwork.url }}
                                style={styles.artwork}
                            />

                            <View style={styles.contentContainer}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.source}>{currentEpisode.showTitle}</Text>
                                    <View style={styles.titleWrapper}>
                                        <Animated.Text 
                                            numberOfLines={1} 
                                            style={[styles.title, scrollStyle]}
                                        >
                                            {currentEpisode.title}
                                        </Animated.Text>
                                    </View>
                                </View>

                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progress, { width: `${progress}%` }]} />
                                    </View>
                                    <View style={styles.timeContainer}>
                                        <Text style={styles.timeText}>{formatTime(position.value)}</Text>
                                        <Text style={styles.timeText}>-{formatTime(Math.max(0, duration.value - position.value))}</Text>
                                    </View>
                                </View>

                                <View style={styles.controls}>
                                    <Pressable onPress={rewind15Seconds} style={styles.controlButton}>
                                        <BlurView intensity={80} tint="dark" style={styles.buttonBlur}>
                                            <Ionicons name="play-back" size={24} color="#fff" />
                                        </BlurView>
                                    </Pressable>

                                    <Pressable onPress={togglePlayPause} style={[styles.controlButton, styles.playButton]}>
                                        <BlurView intensity={80} tint="dark" style={styles.buttonBlur}>
                                            <Ionicons name={isPlayingState ? "pause" : "play"} size={30} color="#fff" />
                                        </BlurView>
                                    </Pressable>

                                    <Pressable style={styles.controlButton}>
                                        <BlurView intensity={80} tint="dark" style={styles.buttonBlur}>
                                            <Ionicons name="close" size={24} color="#fff" />
                                        </BlurView>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </ScrollComponentToUse>
                </View>
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: 'black',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1000,
        height: '100%',
        width: '100%',
    },
    blurContainer: {
        flex: 1,
        paddingTop: 60,
        borderRadius: 40,
        overflow: 'hidden',
    },
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    artwork: {
        width: '100%',
        height: 400,
        resizeMode: 'cover',
        borderRadius: 12,
    },
    contentContainer: {
        width: '100%',
        flex: 1,
    },
    textContainer: {
        marginBottom: 30,
    },
    source: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 8,
        fontWeight: '600',
        marginTop: 20,
    },
    titleWrapper: {
        overflow: 'hidden',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '600',
        lineHeight: 32,
        width: 'auto',
    },
    progressContainer: {
        marginBottom: 30,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        marginBottom: 8,
    },
    progress: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        marginHorizontal: 20,
        marginTop: 20,
        height: 60,
    },
    controlButton: {
        borderRadius: 25,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBlur: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 50,
        overflow: 'hidden',
    },
    playButton: {
        transform: [{ scale: 1.2 }],
    },
});
