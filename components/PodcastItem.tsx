import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PodcastEpisode } from '@/types/podcast';
import { useRouter } from 'expo-router';
import { useAudio } from '@/contexts/AudioContext';

interface PodcastItemProps {
  episode: PodcastEpisode;
}

export function PodcastItem({ episode }: PodcastItemProps) {
  const router = useRouter();
  const { playSound, currentSong } = useAudio();
  
  const durationInMinutes = Math.floor(episode.duration / 60);
  const releaseDate = new Date(episode.releaseDate).toLocaleDateString();
  
  const imageUrl = episode.episodeArtwork?.template 
    ? episode.episodeArtwork.template
        .replace('{w}', '300')
        .replace('{h}', '300')
        .replace('{f}', 'jpg')
    : episode.icon?.template
        ? episode.icon.template
            .replace('{w}', '300')
            .replace('{h}', '300')
            .replace('{f}', 'jpg')
        : 'https://via.placeholder.com/300';

  const handlePress = () => {
    // Convert podcast episode to song format
    const podcastAsSong = {
      id: parseInt(episode.id),
      title: episode.title,
      artist: episode.showTitle,
      artwork: imageUrl,
      mp4_link: episode.streamUrl,
      artwork_bg_color: '#000000'
    };

    // Play the podcast
    playSound(podcastAsSong);
    
    // Navigate to the audio player screen using the existing route
    router.push(`/audio/${episode.id}`);
  };

  const isCurrentlyPlaying = currentSong?.id === parseInt(episode.id);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.artwork}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{episode.title}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.showTitle} numberOfLines={1}>{episode.showTitle}</Text>
          <Text style={styles.metadata}>
            {releaseDate} • {durationInMinutes} min
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={handlePress}>
        <Ionicons 
          name={isCurrentlyPlaying ? "pause-circle-outline" : "play-circle-outline"} 
          size={40} 
          color="#0066CC" 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000',
    marginBottom: 4,
    lineHeight: 22,
  },
  subtitleContainer: {
    gap: 2,
  },
  showTitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },
  metadata: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  playButton: {
    padding: 4,
    marginLeft: 8,
  },
}); 