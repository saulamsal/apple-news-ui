import { StyleSheet, Pressable, Image, Platform, ImageBackground, View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAudio } from '@/contexts/AudioContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export function MiniPlayer({ onPress }: { onPress: () => void }) {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const { currentEpisode, isPlaying, togglePlayPause, seek, closePlayer } = useAudio();

    // Don't render if no episode is selected
    if (!currentEpisode) return null;

    const bottomPosition = Platform.OS === 'ios' ? insets.bottom + 57 : 60;

    return (
        <Pressable 
            onPress={onPress} 
            style={[styles.container, { bottom: 0 }]}
        >
            <ImageBackground
                source={{ uri: currentEpisode.artwork.url }}
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
                            episode={currentEpisode}
                            isPlaying={isPlaying}
                            onPlayPause={togglePlayPause}
                            onClose={closePlayer}
                        />
                    </BlurView>
                ) : (
                    <View style={[styles.content, styles.androidContainer]}>
                        <MiniPlayerContent 
                            episode={currentEpisode}
                            isPlaying={isPlaying}
                            onPlayPause={togglePlayPause}
                            onClose={closePlayer}
                        />
                    </View>
                )}
            </ImageBackground>
        </Pressable>
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
    const colorScheme = useColorScheme();
    const scrollX = useRef(new Animated.Value(0)).current;
    const { seek } = useAudio();
    
    // Animation for long titles
    useEffect(() => {
        const startAnimation = () => {
            Animated.sequence([
                Animated.timing(scrollX, {
                    toValue: -1000,
                    duration: 15000,
                    useNativeDriver: true,
                }),
                Animated.delay(1000),
                Animated.timing(scrollX, {
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
                <Text  numberOfLines={1} className='text-white font-bold text-base tracking-tighter opacity-60'>{episode.showTitle}</Text>
                {/* <Animated.View style={{ transform: [{ translateX: scrollX }] }}> */}
                    <Text className='text-white font-bold text-lg tracking-tighter' numberOfLines={1}>{episode.title}</Text>
                {/* </Animated.View> */}
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
        // borderRadius: 12,
        // position: 'absolute',
        left: 0,
        right: 0,
        // height: 60,
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        marginTop: -20,
        backgroundColor: '#000',
        overflow: 'hidden',
        paddingTop: 5,
    },
    backgroundImage: {
        width: '100%',
        // height: '100%',
        height: 80,
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
        marginBottom: 16,
   
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
        backgroundColor: 'rgba(0,0,0,0.8)',
        
    },
});