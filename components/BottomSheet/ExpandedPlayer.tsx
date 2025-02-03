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
    const [currentPosition, setCurrentPosition] = useState(0);
    const [currentDuration, setCurrentDuration] = useState(0);

    useAnimatedReaction(
        () => isPlaying.value,
        (playing) => {
            runOnJS(setIsPlayingState)(playing);
        }
    );

    useAnimatedReaction(
        () => position.value,
        (pos) => {
            runOnJS(setCurrentPosition)(pos);
        }
    );

    useAnimatedReaction(
        () => duration.value,
        (dur) => {
            runOnJS(setCurrentDuration)(dur);
        }
    );

    useEffect(() => {
        if (!currentEpisode) return;
        let intervalId: NodeJS.Timeout;

        const startAnimation = () => {
            if (!currentEpisode) return; // Additional safety check
            scrollX.value = withSequence(
                withTiming(0, { duration: 0 }),
                withTiming(-width/2, { duration: 8000 }),
                withDelay(2000, withTiming(0, { duration: 0 }))
            );
        };

        // Start initial animation after a short delay
        const timeoutId = setTimeout(() => {
            startAnimation();
            intervalId = setInterval(startAnimation, 10000);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
            scrollX.value = 0;
        };
    }, [currentEpisode?.id]); // Only depend on episode ID

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

    const progress = currentDuration > 0 ? (currentPosition / currentDuration) * 100 : 0;
    const rewind15Seconds = () => seek(-15);

    const renderControls = () => (
        <View style={styles.controls}>
            <Pressable onPress={rewind15Seconds} style={styles.controlButton}>
                <View style={{ alignItems: 'center', position: 'relative' }}>
                    <Ionicons name="refresh-sharp" size={60} color="#fff" style={{ transform: [{ scaleX: -1 }] }} />
                    <Text style={{ color: '#fff', fontSize: 14, marginTop: 4, position: 'absolute', top: 26, left: 22 }}>15</Text>
                </View>
            </Pressable>

            <Pressable onPress={togglePlayPause} style={[styles.controlButton, styles.playButton]}>
                <BlurView intensity={80} tint="dark" style={styles.buttonBlur}>
                    <Ionicons name={isPlayingState ? "pause" : "play"} size={30} color="#fff" />
                </BlurView>
            </Pressable>

            <Pressable style={[styles.controlButton, { opacity: 0.5 }]}>
                <Foundation name="fast-forward" size={60} color="#fff" />
            </Pressable>
        </View>
    );

    const renderContent = () => {
        if (!currentEpisode) return null;
        
        return (
            <View style={styles.container} className={Platform.OS === 'ios' ? "mx-5 gap-8" : ""}>
                {Platform.OS === 'web' && (
                    <Pressable 
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/');
                            }
                        }}
                        style={styles.webCloseButton}
                    >
                        <Ionicons name="close" size={24} color="#fff" />
                    </Pressable>
                )}
                
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
                            <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
                            <Text style={styles.timeText}>-{formatTime(Math.max(0, currentDuration - currentPosition))}</Text>
                        </View>
                    </View>

                    {renderControls()}
                </View>
            </View>
        );
    };

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
                        <View style={styles.dragIndicator} />
                        {renderContent()}
                    </ScrollComponentToUse>
                </BlurView>
            ) : (
                <View className="max-w-[400px] m-auto w-full">
                    <ScrollComponentToUse style={styles.scrollView}>
                        {renderContent()}
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
    webCloseButton: {
        position: 'absolute',
        left: 0,
        top: -80,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 20,
    },
    dragIndicator: {
        width: 50,
        height: 6,
        backgroundColor: '#fff',
        alignSelf: 'center',
        borderRadius: 20,
        marginVertical: 8,
        opacity: 0.5,
        marginBottom: 40,
    },
});
