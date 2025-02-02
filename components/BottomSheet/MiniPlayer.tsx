import { StyleSheet, Pressable, Image, Platform, ImageBackground, View, Text, Dimensions, ActivityIndicator, Animated as RNAnimated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef, memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAudio } from '@/contexts/AudioContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useWindowDimensions } from 'react-native';
import { PodcastEpisode } from '@/types/podcast';
import Animated, { 
    useAnimatedStyle, 
    withSpring,
    withTiming,
    withSequence,
    withDelay,
    useSharedValue,
    useAnimatedReaction,
    runOnJS
} from 'react-native-reanimated';

interface MiniPlayerProps {
  onPress: () => void;
  episode: PodcastEpisode;
}

export const MiniPlayer = memo(({ onPress, episode }: MiniPlayerProps) => {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const slideAnim = useSharedValue(100);
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const { sharedValues, commands } = useAudio();
    const { isPlaying } = sharedValues;
    const { togglePlayPause } = commands;
    const [isPlayingState, setIsPlayingState] = useState(false);

    useAnimatedReaction(
        () => isPlaying.value,
        (playing) => {
            runOnJS(setIsPlayingState)(playing);
        }
    );

    useEffect(() => {
        if (episode) {
            slideAnim.value = withSpring(0, {
                damping: 20,
                stiffness: 90
            });
        } else {
            slideAnim.value = 100;
        }
    }, [episode]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: slideAnim.value }]
        };
    });

    const bottomPosition = Platform.OS === 'ios' ? insets.bottom + 57 : 60;

    return (
        <Animated.View 
        style={[
          animatedStyle,
          Platform.OS === 'web' && { 
            position: 'fixed',
            bottom: 0,
            
            width: '100%',
            maxWidth: 800,
            marginHorizontal: 'auto',
            right: isMobile ? 0 : 110,
            left: isMobile ? 0 : 50,
            zIndex: 1000,
         }
        ]}>
            <Pressable 
                onPress={onPress} 
                style={[styles.container, 
                    { bottom: 0 },
                    Platform.OS === "web" && { 
                        bottom: isMobile ? 70 : 0,
                        marginLeft: 10,
                        marginRight: 10,
                        borderRadius: 30,
                        height: 68,
                        borderBottomLeftRadius: isMobile ? 30 : 0,
                        borderBottomRightRadius: isMobile ? 30 : 0,
                     }
                ]}
            >
                <ImageBackground
                    source={{ uri: episode.artwork.url }}
                    style={styles.backgroundImage}
                    blurRadius={20}
                >
                    {Platform.OS === 'ios' ? (
                        <BlurView
                            tint={'systemThickMaterialDark'}
                            intensity={80}
                            style={[styles.content, styles.blurContainer]}
                        >
                            <MiniPlayerContent 
                                episode={episode}
                                isPlayingState={isPlayingState}
                            />
                        </BlurView>
                    ) : (
                        <View style={[styles.content, styles.androidContainer]}>
                            <MiniPlayerContent 
                                episode={episode}
                                isPlayingState={isPlayingState}
                            />
                        </View>
                    )}
                </ImageBackground>
            </Pressable>
        </Animated.View>
    );
});

interface MiniPlayerContentProps {
    episode: PodcastEpisode;
    isPlayingState: boolean;
}

const MiniPlayerContent = memo(({ episode, isPlayingState }: MiniPlayerContentProps) => {
    const colorScheme = useColorScheme();
    const scrollX = useSharedValue(0);
    const { width } = Dimensions.get('window');
    const { commands, sharedValues } = useAudio();
    const { seek, closePlayer, togglePlayPause } = commands;
    const { isLoading } = sharedValues;
    
    useEffect(() => {
        const startAnimation = () => {
            scrollX.value = withSequence(
                withTiming(0, { duration: 0 }),
                withTiming(-width/2, { 
                    duration: Platform.OS === 'web' ? 24000 : 8000 
                }),
                withDelay(2000, withTiming(0, { duration: 0 }))
            );
        };

        const interval = setInterval(startAnimation, Platform.OS === 'web' ? 26000 : 10000);
        startAnimation();

        return () => clearInterval(interval);
    }, [episode.title]);

    const scrollStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: scrollX.value }],
            flexShrink: 0,
            color: '#fff'
        };
    });

    const rewind15Seconds = () => {
        seek(-15);
    };

    return (
        <View style={styles.miniPlayerContent}>
            <View style={styles.leftSection}>
                <Text numberOfLines={1} 
                className='text-gray-300 font-bold text-base tracking-tighter '>
                    {episode.showTitle}</Text>
                <View style={{ overflow: 'hidden' }}>
                    <Animated.Text 
                        className='text-white font-bold text-lg tracking-tighter flex-nowrap'
                        numberOfLines={1}
                        style={scrollStyle}
                    >
                        {episode.title}
                    </Animated.Text>
                </View>
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
                <Pressable style={styles.controlButton} onPress={togglePlayPause}>
                    <FontAwesome 
                        name={isPlayingState ? "pause" : "play"} 
                        size={20} 
                        color={'#fff'} 
                    />
                </Pressable>
                <Pressable style={styles.controlButton} onPress={closePlayer}>
                    <BlurView
                        tint="dark"
                        intensity={80}
                        style={styles.buttonBlur}
                    >
                        <Ionicons 
                            name="close" 
                            size={Platform.OS === 'web' ? 24 : 18} 
                            color={'#fff'} 
                        />
                    </BlurView>
                </Pressable>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        left: 0,
        right: 0,
        zIndex: 1,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        marginTop: -40,
        overflow: 'hidden',
        paddingTop: Platform.OS === 'web' ? 0 : 5,
        height: 90,
        bottom: 0,
        backgroundColor: '#000',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
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
        marginBottom: Platform.OS === 'web' ? 0 : 16,
    },
    leftSection: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        marginRight:10,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
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
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
});