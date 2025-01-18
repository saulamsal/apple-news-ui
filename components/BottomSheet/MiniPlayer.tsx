import { StyleSheet, Pressable, Image, Platform, ImageBackground, View, Text, Animated as RNAnimated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAudio } from '@/contexts/AudioContext';
import Animated, { useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

export function MiniPlayer({ onPress }: { onPress: () => void }) {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const { currentEpisode, isPlaying, togglePlayPause, seek, closePlayer } = useAudio();
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = async () => {
        setIsClosing(true);
        await closePlayer();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: isClosing ? withTiming(0, { duration: 300 }) : 1,
        transform: [
            { 
                translateY: isClosing ? 
                    withSpring(100, { damping: 15, stiffness: 100 }) : 
                    withSpring(0, { damping: 15, stiffness: 100 }) 
            }
        ]
    }));

    if (!currentEpisode) return null;

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Pressable onPress={onPress} style={styles.pressable}>
                <ImageBackground
                    source={{ uri: currentEpisode.artwork.url }}
                    style={styles.backgroundImage}
                    blurRadius={20}
                >
                    {Platform.OS === 'ios' ? (
                        <BlurView
                            tint={'systemThickMaterialDark'}
                            intensity={99}
                            style={[styles.content, styles.blurContainer]}
                        >
                            <MiniPlayerContent 
                                episode={currentEpisode}
                                isPlaying={isPlaying}
                                onPlayPause={togglePlayPause}
                                onClose={handleClose}
                            />
                        </BlurView>
                    ) : (
                        <View style={[styles.content, styles.androidContainer]}>
                            <MiniPlayerContent 
                                episode={currentEpisode}
                                isPlaying={isPlaying}
                                onPlayPause={togglePlayPause}
                                onClose={handleClose}
                            />
                        </View>
                    )}
                </ImageBackground>
            </Pressable>
        </Animated.View>
    );
}

function MiniPlayerContent({ 
    episode,
    isPlaying,
    onPlayPause,
    onClose
}: {
    episode: any;
    isPlaying: boolean;
    onPlayPause: () => void;
    onClose: () => void;
}) {
    const scrollX = useRef(new RNAnimated.Value(0)).current;
    const { seek } = useAudio();
    
    useEffect(() => {
        const startAnimation = () => {
            RNAnimated.sequence([
                RNAnimated.timing(scrollX, {
                    toValue: -1000,
                    duration: 15000,
                    useNativeDriver: true,
                }),
                RNAnimated.delay(1000),
                RNAnimated.timing(scrollX, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                })
            ]).start(() => startAnimation());
        };

        startAnimation();
    }, [episode.title]);

    const rewind15Seconds = () => {
        seek(-15);
    };

    return (
        <View style={styles.miniPlayerContent}>
            <View style={styles.leftSection}>
                <Text style={styles.source} numberOfLines={1}>{episode.showTitle}</Text>
                <RNAnimated.View style={{ transform: [{ translateX: scrollX }] }}>
                    <Text style={styles.title} numberOfLines={1}>{episode.title}</Text>
                </RNAnimated.View>
            </View>
            <View style={styles.controls}>
                <Pressable 
                    style={styles.controlButton} 
                    onPress={rewind15Seconds}
                >
                    <BlurView
                        tint="dark"
                        intensity={80}
                        style={styles.buttonBlur}
                    >
                        <Ionicons 
                            name="play-back" 
                            size={18} 
                            color={'#fff'} 
                        />
                    </BlurView>
                </Pressable>
                <Pressable style={styles.controlButton} onPress={onPlayPause}>
                    <BlurView
                        tint="dark"
                        intensity={80}
                        style={styles.buttonBlur}
                    >
                        <Ionicons 
                            name={isPlaying ? "pause" : "play"} 
                            size={20} 
                            color={'#fff'} 
                        />
                    </BlurView>
                </Pressable>
                <Pressable style={styles.controlButton} onPress={onClose}>
                    <BlurView
                        tint="dark"
                        intensity={80}
                        style={styles.buttonBlur}
                    >
                        <Ionicons 
                            name="close" 
                            size={18} 
                            color={'#fff'} 
                        />
                    </BlurView>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Platform.OS === 'ios' ? 80 : 60,
        height: 86,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        marginHorizontal: 10,
    },
    pressable: {
        flex: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: 1000,
        flex: 1,
        paddingVertical: 0,
    },
    miniPlayerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    leftSection: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        marginRight: 16,
    },
    source: {
        color: '#rgba(255,255,255,0.7)',
        fontSize: 13,
        marginBottom: 2,
    },
    title: {
        fontWeight: '500',
        color: '#fff',
        fontSize: 15,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'transparent',
    },
    controlButton: {
        padding: 2,
    },
    buttonBlur: {
        borderRadius: 16,
        width: 32,
        height: 32,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    blurContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: 1000,
        flex: 1,
        paddingVertical: 0,
    },
    androidContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: 1000,
        flex: 1,
        paddingVertical: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
});
