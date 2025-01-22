import { View, Text, StyleSheet, Image, Pressable, Dimensions, Platform, ImageBackground, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
const { width } = Dimensions.get('window');
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Foundation from '@expo/vector-icons/Foundation';


interface ExpandedPlayerProps {
    scrollComponent?: (props: any) => React.ReactElement;
}

export function ExpandedPlayer({ scrollComponent }: ExpandedPlayerProps) {
    const ScrollComponentToUse = scrollComponent || View;
    const { isPlaying, position, duration, togglePlayPause, seek, currentEpisode } = useAudio();
    const insets = useSafeAreaInsets();
    const scrollAnim = new Animated.Value(0);

    useEffect(() => {
        if (!currentEpisode) return;

        const startAnimation = () => {
            scrollAnim.setValue(0);
            Animated.sequence([
                Animated.timing(scrollAnim, {
                    toValue: 1,
                    duration: 8000,
                    useNativeDriver: true,
                }),
                Animated.delay(2000),
            ]).start(() => startAnimation());
        };

        startAnimation();
    }, [currentEpisode]);

    const formatTime = (millis: number) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    const progress = duration > 0 ? (position / duration) * 100 : 0;
    const rewind15Seconds = () => seek(-15);

    if (!currentEpisode) return null;

    return (
        <ImageBackground
            source={{ uri: currentEpisode.artwork.url }}
            style={[styles.rootContainer, {
                // paddingTop: insets.top + (Platform.OS === 'android' ? 30 : 0),
                // marginTop: Platform.OS === 'android' ? -30 : 0,
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
                                            style={[
                                                styles.title,
                                                {
                                                    transform: [{
                                                        translateX: scrollAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [0, -width/2]
                                                        })
                                                    }]
                                                }
                                            ]}
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
                                        <Text style={styles.timeText}>{formatTime(position)}</Text>
                                        <Text style={styles.timeText}>-{formatTime(Math.max(0, duration - position))}</Text>
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
                                            <Ionicons name={isPlaying ? "pause" : "play"} size={60} color="#fff" />
                                       
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
                <View style={[styles.blurContainer, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
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
                                            style={[
                                                styles.title,
                                                {
                                                    transform: [{
                                                        translateX: scrollAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [0, -width/2]
                                                        })
                                                    }]
                                                }
                                            ]}
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
                                        <Text style={styles.timeText}>{formatTime(position)}</Text>
                                        <Text style={styles.timeText}>-{formatTime(Math.max(0, duration - position))}</Text>
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
                                            <Ionicons name={isPlaying ? "pause" : "play"} size={30} color="#fff" />
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
        // height: '100%',
        // width: '100%',
        borderRadius: 40,
        overflow: 'hidden',
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
        // padding: 20,
        flex: 1,
    },
    textContainer: {
        marginBottom: 30,
    },
    source: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 8,
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
    },
    playButton: {
        transform: [{ scale: 1.2 }],
    },
});
