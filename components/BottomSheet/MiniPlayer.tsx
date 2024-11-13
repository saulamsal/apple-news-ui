import { StyleSheet, Pressable, Image, Platform, ImageBackground, View, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAudio } from '@/contexts/AudioContext';

export function MiniPlayer({ onPress, song, isPlaying, onPlayPause }: MiniPlayerProps) {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();

    const bottomPosition = Platform.OS === 'ios' ? insets.bottom + 57 : 60;

    return (
        <Pressable onPress={onPress} style={[
            styles.container,
            { bottom: 0 }
        ]}>
            <ImageBackground
                source={{ uri: 'https://www.hollywoodreporter.com/wp-content/uploads/2024/11/FotoJet-2024-11-06T105229.459.jpg' }}
                style={styles.backgroundImage}
                blurRadius={20}
            >
                {Platform.OS === 'ios' ? (
                    <BlurView
                        tint={'systemThickMaterialDark'}
                        intensity={99}
                        style={[styles.content, styles.blurContainer]}>
                        <MiniPlayerContent song={song} isPlaying={isPlaying} onPlayPause={onPlayPause} />
                    </BlurView>
                ) : (
                    <ThemedView style={[styles.content, styles.androidContainer]}>
                        <MiniPlayerContent song={song} isPlaying={isPlaying} onPlayPause={onPlayPause} />
                    </ThemedView>
                )}
            </ImageBackground>
        </Pressable>
    );
}
const Rewind15SecIcon = () => {
    const colorScheme = useColorScheme();
    return (
        <View style={styles.controlButton}>
            <View>
                <View style={{ position: 'relative' }}>
                    <Ionicons name="refresh-sharp" size={28} color={'#fff'} style={{ transform: [{ scaleX: -1 }] }} />
                    <Text style={{
                        color: '#fff',
                        position: 'absolute',
                        fontSize: 8,
                        top: '50%',
                        left: '50%',
                        fontWeight: '500',
                        transform: [{ translateX: -5 }, { translateY: -2 }]
                    }}>15</Text>
                </View>
            </View>
        </View>
    )
}

// Extract the content into a separate component for reusability
function MiniPlayerContent({ song, isPlaying, onPlayPause }: {
    song: any;
    isPlaying: boolean;
    onPlayPause: () => void;
}) {
    const colorScheme = useColorScheme();
    const { playNext } = useAudio();

    return (
        <ThemedView style={[styles.miniPlayerContent, { backgroundColor: colorScheme === 'light' ? '#ffffffa4' : 'transparent' }]}>

            <ThemedView style={styles.textContainer}>
                <Text style={styles.title}>How Starbucks become Teen Emporium</Text>
            </ThemedView>
            <ThemedView style={styles.controls}>
                <Pressable style={styles.controlButton} onPress={playNext}>
                    <Rewind15SecIcon />
                </Pressable>

                <Pressable style={styles.controlButton} onPress={onPlayPause}>
                    <Ionicons name={isPlaying ? "pause" : "play"} size={24} color={'#fff'} />
                </Pressable>
                <Pressable
                    style={[styles.controlButton, styles.closeButton]}
                    onPress={playNext}
                >
                    <BlurView
                        tint={colorScheme === 'light' ? 'light' : 'dark'}
                        intensity={99}
                        style={styles.closeButtonBlur}>
                        <Ionicons
                            name="close-sharp"
                            size={24}
                            color={'#fff'}
                        />
                    </BlurView>
                </Pressable>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        // position: 'absolute',
        left: 0,
        right: 0,
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
        marginTop: -20,
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        // height: 40,
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
        height: '100%',
        paddingHorizontal: 10,
        // backgroundColor: 'red',

    },
    blurContainer: {
        // backgroundColor: '#00000000',
    },
    androidContainer: {

    },
    title: {
        fontWeight: '500',
    },

    textContainer: {
        flex: 1,
        marginLeft: 12,
        backgroundColor: 'transparent',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginRight: 4,
        backgroundColor: 'transparent',
    },
    controlButton: {
        padding: 8,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        overflow: 'hidden',
        borderRadius: 20,
        padding: 0,
    },
    closeButtonBlur: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

interface MiniPlayerProps {
    onPress: () => void;
    song: any;
    sound?: Audio.Sound | null;
    isPlaying: boolean;
    onPlayPause: () => void;
}
