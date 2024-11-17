import { StyleSheet, Pressable, Image, Platform, ImageBackground, View, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAudio } from '@/contexts/AudioContext';

export function MiniPlayer({ onPress }: { onPress: () => void }) {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const { currentEpisode, isPlaying, togglePlayPause } = useAudio();

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
                        intensity={99}
                        style={[styles.content, styles.blurContainer]}
                    >
                        <MiniPlayerContent 
                            episode={currentEpisode}
                            isPlaying={isPlaying}
                            onPlayPause={togglePlayPause}
                        />
                    </BlurView>
                ) : (
                    <ThemedView style={[styles.content, styles.androidContainer]}>
                        <MiniPlayerContent 
                            episode={currentEpisode}
                            isPlaying={isPlaying}
                            onPlayPause={togglePlayPause}
                        />
                    </ThemedView>
                )}
            </ImageBackground>
        </Pressable>
    );
}

function MiniPlayerContent({ 
    episode,
    isPlaying,
    onPlayPause 
}: {
    episode: any;
    isPlaying: boolean;
    onPlayPause: () => void;
}) {
    const colorScheme = useColorScheme();

    return (
        <ThemedView style={[
            styles.miniPlayerContent, 
            { backgroundColor: colorScheme === 'light' ? '#ffffffa4' : 'transparent' }
        ]}>
            <ThemedView style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{episode.title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{episode.showTitle}</Text>
            </ThemedView>
            <ThemedView style={styles.controls}>
                <Pressable style={styles.controlButton} onPress={onPlayPause}>
                    <Ionicons 
                        name={isPlaying ? "pause" : "play"} 
                        size={24} 
                        color={'#fff'} 
                    />
                </Pressable>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
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
    },
    blurContainer: {
        backgroundColor: 'transparent',
    },
    androidContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    title: {
        fontWeight: '500',
        color: '#fff',
        fontSize: 16,
    },
    subtitle: {
        color: '#rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
        backgroundColor: 'transparent',
        justifyContent: 'center',
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
});
