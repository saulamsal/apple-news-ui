import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PodcastEpisode } from '@/types/podcast';
import { useAudio } from '@/contexts/AudioContext';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface PodcastItemProps {
  episode: any;
  index?: number;
  totalItems?: number;
}

export function PodcastItem({ episode, index, totalItems = 0 }: PodcastItemProps) {
  const { playEpisode, currentEpisode, progress } = useAudio();
  
  const durationInMinutes = episode.duration ? Math.floor(episode.duration / 60) : null;
  
  const imageUrl = episode.episodeArtwork?.template?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') ||
                  episode.icon?.template?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') ||
                  'https://via.placeholder.com/300';

  const handlePress = () => {
    if (playEpisode) {
      const streamUrl = episode.playAction?.episodeOffer?.streamUrl;
      
      if (!streamUrl) {
        console.error('No stream URL found for episode:', episode.id);
        return;
      }

      const podcastEpisode: PodcastEpisode = {
        id: episode.id,
        title: episode.title,
        streamUrl: streamUrl,
        artwork: { url: imageUrl },
        showTitle: episode.showTitle,
        duration: episode.duration,
        releaseDate: episode.releaseDate,
        summary: episode.summary
      };

      playEpisode(podcastEpisode);
    }
  };

  const handleSeeDetails = () => {
    Alert.alert('Details', episode.summary || 'No details available');
  };

  const isCurrentlyPlaying = currentEpisode?.id === episode.id;

  // Calculate remaining time for currently playing episode
  const remainingTime = isCurrentlyPlaying && episode.duration && progress.value ? 
    Math.floor((episode.duration - progress.value * episode.duration) / 60) : null;

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${(progress.value || 0) * 100}%`, { duration: 100 }),
    };
  });

  return (
    <TouchableOpacity 
      style={[styles.container, index === 0 && styles.firstItem]} 
      onPress={handlePress}
    >
      <Image source={{ uri: imageUrl }} style={styles.artwork} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{episode.title}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.showTitle} numberOfLines={1}>{episode.showTitle}</Text>
          
          <View style={styles.metadataContainer}>
            <TouchableOpacity onPress={handleSeeDetails}>
              <Text style={styles.seeDetails}>See Details</Text>
            </TouchableOpacity>
            
            <View style={styles.durationContainer}>
              <Ionicons name="headset-outline" size={16} color="#8E8E93" />
              <Text style={styles.duration}>
                {isCurrentlyPlaying && remainingTime != null ? 
                  `-${remainingTime}` : 
                  durationInMinutes ? `${durationInMinutes}` : '--'} min
              </Text>
            </View>
          </View>
        </View>
        
        {isCurrentlyPlaying && (
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, progressBarStyle]} />
          </View>
        )}
      </View>
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
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 13,
    color: '#8E8E93',
  },
  seeDetails: {
    fontSize: 13,
    color: '#0066CC',
    fontWeight: '500',
  },
  progressContainer: {
    height: 2,
    backgroundColor: '#E5E5EA',
    marginTop: 8,
    borderRadius: 1,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0066CC',
    borderRadius: 1,
  },
}); 