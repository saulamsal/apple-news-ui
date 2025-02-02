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
import { usePathname } from 'expo-router';
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
  onPlayPause: () => void;
}

export const MiniPlayer = memo(({ onPress, episode, onPlayPause }: Omit<MiniPlayerProps, 'isPlaying'>) => {
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const slideAnim = useSharedValue(100);
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const { sharedValues } = useAudio();
    const { isLoading, isPlaying } = sharedValues;

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

    if (pathname?.startsWith('/audio/')) {
        return null;
    }

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
                    blurRadius={10}
                >
                    {Platform.OS === 'ios' ? (
                        <BlurView
                            tint={'systemThickMaterialDark'}
                            intensity={80}
                            style={[styles.content, styles.blurContainer]}
                        >
                            <MiniPlayerContent 
                                episode={episode}
                                isPlayingValue={isPlaying}
                                onPlayPause={onPlayPause}
                            />
                        </BlurView>
                    ) : (
                        <View style={[styles.content, styles.androidContainer]}>
                            <MiniPlayerContent 
                                episode={episode}
                                isPlayingValue={isPlaying}
                                onPlayPause={onPlayPause}
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
    isPlayingValue: { value: boolean };
    onPlayPause: () => void;
}

const MiniPlayerContent = ({ episode, isPlayingValue, onPlayPause }: MiniPlayerContentProps) => {
    const colorScheme = useColorScheme();
    const scrollX = useSharedValue(0);
    const { width } = Dimensions.get('window');
    const { commands, sharedValues } = useAudio();
    const { seek, closePlayer } = commands;
    const { isLoading } = sharedValues;
    const isMobile = width < 768;
    const [isPlayingLocal, setIsPlayingLocal] = useState(isPlayingValue.value);
    const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useAnimatedReaction(
        () => isPlayingValue.value,
        (value) => {
            if (!hasStartedPlaying) {
                // First time loading
                if (value) {
                    runOnJS(setHasStartedPlaying)(true);
                    runOnJS(setIsPlayingLocal)(value);
                }
            } else {
                // Subsequent play/pause
                if (value && isLoading.value) {
                    // If trying to play and loading, don't update state yet
                    runOnJS(setIsTransitioning)(true);
                } else {
                    runOnJS(setIsTransitioning)(false);
                    runOnJS(setIsPlayingLocal)(value);
                }
            }
        }
    );

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

    const PlayPauseButton = () => {
        const buttonIcon = (() => {
            if (!hasStartedPlaying && isLoading.value) {
                return <ActivityIndicator size="small" color="#fff" />;
            }
            
            if (isTransitioning) {
                return <FontAwesome name="play" size={20} color={'#fff'} />;
            }

            return (
                <FontAwesome 
                    name={isPlayingLocal ? "pause" : "play"} 
                    size={20} 
                    color={'#fff'} 
                />
            );
        })();

        return (
            <Pressable style={styles.controlButton} onPress={onPlayPause}>
                {buttonIcon}
            </Pressable>
        );
    };

    return (
        <View style={styles.miniPlayerContent}>
            {!isMobile && (
                <Image 
                    source={{ uri: episode.artwork.url }} 
                    style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }}
                />
            )}
            <View style={styles.leftSection}>
                <Text numberOfLines={1} 
                className='text-gray-300 font-semibold text-sm tracking-tighter '>
                    {episode.showTitle}</Text>
                <View style={{ overflow: 'hidden' }}>
                    <Animated.Text 
                        className='text-white font-semibold text-lg tracking-tighter flex-nowrap'
                        numberOfLines={1}
                        style={scrollStyle}
                    >
                        {episode.title}
                    </Animated.Text>
                </View>
            </View>
            <View style={styles.controls}>
                <Pressable style={styles.controlButton} onPress={rewind15Seconds}>
                    <BlurView tint="dark" intensity={80} style={styles.buttonBlur}>
                        <Ionicons name="play-back" size={18} color={'#fff'} />
                    </BlurView>
                </Pressable>
                <PlayPauseButton />
                <Pressable style={styles.controlButton} onPress={closePlayer}>
                    <BlurView tint="dark" intensity={80} style={styles.buttonBlur}>
                        <Ionicons name="close" size={Platform.OS === 'web' ? 24 : 18} color={'#fff'} />
                    </BlurView>
                </Pressable>
            </View>
        </View>
    );
};

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
        marginTop: -36,
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
        paddingHorizontal: 10,
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