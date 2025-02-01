import { StyleSheet, Pressable, Image, Platform, ImageBackground, View, Text, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAudio } from '@/contexts/AudioContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useWindowDimensions } from 'react-native';
import { PodcastEpisode } from '@/types/podcast';

interface MiniPlayerProps {
  onPress: () => void;
  episode: PodcastEpisode;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function MiniPlayer({ onPress, episode, isPlaying, onPlayPause }: MiniPlayerProps) {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const slideAnim = useRef(new Animated.Value(100)).current;
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    useEffect(() => {
        if (episode) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11
            }).start();
        } else {
            slideAnim.setValue(100);
        }
    }, [episode]);

    const bottomPosition = Platform.OS === 'ios' ? insets.bottom + 57 : 60;

    return (
        <Animated.View 
        style={[
          { transform: [{ translateY: slideAnim }] },
          Platform.OS === 'web' && { 
            position: 'fixed',
            bottom: 0,
            width: '100%',
            maxWidth: 380,
            marginHorizontal: 'auto',
            right: isMobile ? 0 : 110,
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
                                isPlaying={isPlaying}
                                onPlayPause={onPlayPause}
                            />
                        </BlurView>
                    ) : (
                        <View style={[styles.content, styles.androidContainer]}>
                            <MiniPlayerContent 
                                episode={episode}
                                isPlaying={isPlaying}
                                onPlayPause={onPlayPause}
                            />
                        </View>
                    )}
                </ImageBackground>
            </Pressable>
        </Animated.View>
    );
}

interface MiniPlayerContentProps {
    episode: PodcastEpisode;
    isPlaying: boolean;
    onPlayPause: () => void;
}

function MiniPlayerContent({ episode, isPlaying, onPlayPause }: MiniPlayerContentProps) {
    const colorScheme = useColorScheme();
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const { seek } = useAudio();
    const { width } = Dimensions.get('window');
    
    useEffect(() => {
        const startAnimation = () => {
            scrollAnim.setValue(0);
            Animated.sequence([
                Animated.timing(scrollAnim, {
                    toValue: 1,
                    duration: Platform.OS === 'web' ? 24000 : 8000,
                    useNativeDriver: true,
                }),
                Animated.delay(2000),
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
                <Text numberOfLines={1} 
                className='text-gray-300 font-bold text-base tracking-tighter '>
                    {episode.showTitle}</Text>
                <View style={{ overflow: 'hidden' }}>
                    <Animated.Text 
                        className='text-white font-bold text-lg tracking-tighter flex-nowrap'
                        numberOfLines={1}
                        style={{
                            transform: [{
                                translateX: scrollAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -width/2]
                                })
                            }],
                            flexShrink: 0,
                            color: '#fff'
                        }}
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
                <Pressable style={styles.controlButton} onPress={onPlayPause}>
                    <FontAwesome 
                        name={isPlaying ? "pause" : "play"} 
                        size={20} 
                        color={'#fff'} 
                    />
                </Pressable>
                <Pressable style={styles.controlButton}>
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
}

const styles = StyleSheet.create({
    container: {
        // borderRadius: 12,
        // position: 'absolute',
        left: 0,
        right: 0,
        // height: 60,
        zIndex: 1,
        // shadowColor: 'red',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        marginTop: -40,
        // backgroundColor: 'red',
        overflow: 'hidden',
        paddingTop: Platform.OS === 'web' ? 0 : 5,
        height: 90,
        // position: 'absolute',
        bottom: 0,
        backgroundColor: '#000',
       
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        // height: 80,
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