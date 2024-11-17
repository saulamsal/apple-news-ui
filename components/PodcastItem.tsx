import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PodcastEpisode } from '@/types/podcast';
import { useRouter } from 'expo-router';
import { useAudio } from '@/contexts/AudioContext';

interface PodcastItemProps {
  episode: any; // Using any temporarily for the raw podcast data
  index?: number;
  totalItems?: number;
}

export function PodcastItem({ episode, index, totalItems = 0 }: PodcastItemProps) {
  const { playEpisode, currentEpisode } = useAudio();
  
  const durationInMinutes = episode.duration ? Math.floor(episode.duration / 60) : 0;
  const releaseDate = episode.releaseDate ? new Date(episode.releaseDate).toLocaleDateString() : '';
  
  // Extract artwork URL from either episodeArtwork or icon
  const imageUrl = episode.episodeArtwork?.template?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') ||
                  episode.icon?.template?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') ||
                  'https://via.placeholder.com/300';

  const handlePress = () => {
    if (playEpisode) {
      // Extract streamUrl from playAction.episodeOffer
      const streamUrl = episode.playAction?.episodeOffer?.streamUrl;
      
      if (!streamUrl) {
        console.error('No stream URL found for episode:', episode.id);
        return;
      }

      const podcastEpisode: PodcastEpisode = {
        id: episode.id,
        title: episode.title,
        streamUrl: streamUrl,
        artwork: {
          url: imageUrl
        },
        showTitle: episode.showTitle,
        duration: episode.duration,
        releaseDate: episode.releaseDate,
        summary: episode.summary
      };

      playEpisode(podcastEpisode);
    }
  };

  const isCurrentlyPlaying = currentEpisode?.id === episode.id;

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        index === 0 && styles.firstItem,
      ]} 
      onPress={handlePress}
    >
  
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
  firstItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  artwork: {
    width: 100,
    height: 100,
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
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.8,
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