import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PodcastEpisode } from '@/types/podcast';
import { useAudio } from '@/contexts/AudioContext';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

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

  const remainingTime = isCurrentlyPlaying && episode.duration && progress.value ? 
    Math.floor((episode.duration - progress.value * episode.duration) / 60) : null;

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${(progress.value || 0) * 100}%`, { duration: 100 }),
    };
  });

  return (
    <TouchableOpacity 
      className={`flex-row p-3 items-center bg-white border-b border-[#E5E5EA] ${index === 0 ? 'rounded-t-lg' : ''}`}
      onPress={handlePress}
    >
      <Image source={{ uri: imageUrl }} className="w-25 h-25 rounded-lg bg-[#f0f0f0]" />
      <View className="flex-1 ml-3 mr-2 justify-center">
        <Text className="text-lg font-semibold tracking-tight text-black mb-1 leading-[22px]" numberOfLines={2}>
          {episode.title}
        </Text>
        <View className="gap-0.5">
          <Text className="text-[15px] text-[#666] leading-5" numberOfLines={1}>
            {episode.showTitle}
          </Text>
          
          <View className="flex-row items-center justify-between mt-1">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={handleSeeDetails}>
                <Text className="text-sm text-apple-news font-semibold">See Details</Text>
              </TouchableOpacity>
            
              {isCurrentlyPlaying ? (
                <View className="h-0.5 bg-[#E5E5EA] mt-2 rounded-sm">
                  <Animated.View className="h-full bg-apple-news rounded-sm" style={progressBarStyle} />
                  <Text className="text-sm text-apple-news">{remainingTime}</Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="headset-outline" size={16} color="#8E8E93" />
                  <Text className="text-sm text-[#8E8E93]">
                    {isCurrentlyPlaying && remainingTime != null ? 
                      `-${remainingTime}` : 
                      durationInMinutes ? `${durationInMinutes}` : '--'} min
                  </Text>
                </View>
              )}
            </View>
            <Ionicons name="ellipsis-horizontal" size={24} color="#8E8E93" className="p-2 -mr-2" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
} 