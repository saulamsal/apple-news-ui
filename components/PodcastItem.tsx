import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PodcastEpisode } from '@/types/podcast';
import { useAudio } from '@/contexts/AudioContext';
import Animated, { useAnimatedStyle, withTiming, FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as ContextMenu from 'zeego/context-menu';

interface PodcastItemProps {
  episode: {
    id: string;
    type: string;
    attributes: {
      itunesTitle: string;
      name: string;
      kind: string;
      description: {
        standard: string;
        short: string;
      };
      artwork: {
        url: string;
        width: number;
        height: number;
      };
      durationInMilliseconds: number;
      releaseDateTime: string;
      assetUrl: string;
      artistName: string;
    };
  };
  index?: number;
  totalItems?: number;
}

export function PodcastItem({ episode, index, totalItems = 0 }: PodcastItemProps) {
  const { playEpisode, currentEpisode, progress } = useAudio();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  
  const durationInMinutes = episode.attributes.durationInMilliseconds ? Math.floor(episode.attributes.durationInMilliseconds / 60000) : null;
  
  const imageUrl = episode.attributes.artwork?.url?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') || 'https://via.placeholder.com/300';

  const handlePress = () => {
    if (playEpisode) {
      const streamUrl = episode.attributes.assetUrl;
      
      if (!streamUrl) {
        console.error('No stream URL found for episode:', episode.id);
        return;
      }

      const podcastEpisode: PodcastEpisode = {
        id: episode.id,
        title: episode.attributes.name,
        streamUrl: streamUrl,
        artwork: { url: imageUrl },
        showTitle: episode.attributes.artistName,
        duration: episode.attributes.durationInMilliseconds,
        releaseDate: episode.attributes.releaseDateTime,
        summary: episode.attributes.description.standard
      };

      playEpisode(podcastEpisode);
    }
  };

  const handleSeeDetails = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const isCurrentlyPlaying = currentEpisode?.id === episode.id;

  const remainingTime = isCurrentlyPlaying && episode.attributes.durationInMilliseconds && progress.value ? 
    Math.floor((episode.attributes.durationInMilliseconds - progress.value * episode.attributes.durationInMilliseconds) / 60000) : null;

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${(progress.value || 0) * 100}%`, { duration: 100 }),
    };
  });

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <View className={`flex-row p-3 items-center bg-white border-b border-[#E5E5EA] ${index === 0 ? 'rounded-t-lg' : ''}`}>
          <TouchableOpacity onPress={handlePress}>
            <Image 
              source={{ uri: imageUrl }} 
              className="w-24 h-24 rounded-lg bg-[#f0f0f0]" 
            />
          </TouchableOpacity>
          
          <View className="flex-1 ml-3 mr-2 justify-center">
            <TouchableOpacity onPress={handlePress}>
              <Text className="text-lg font-semibold tracking-tight text-black mb-1 leading-[22px]" numberOfLines={2}>
                {episode.attributes.name}
              </Text>
              <Text className="text-[15px] text-[#666] leading-5" numberOfLines={1}>
                {episode.attributes.artistName}
              </Text>
            </TouchableOpacity>
            
            <View className="flex-row items-center justify-between mt-1">
              <View className="flex-row items-center gap-4">
                <TouchableOpacity onPress={handleSeeDetails}>
                  <Text className="text-sm text-apple-news font-semibold">See Details</Text>
                </TouchableOpacity>
              
                {isCurrentlyPlaying ? (
                  <View className="h-0.5 bg-[#E5E5EA] mt-2 rounded-sm">
                    <Animated.View className="h-full bg-apple-news rounded-sm" style={progressBarStyle} />
                    <Text className="text-sm text-apple-news">{remainingTime} min</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="headset-outline" size={16} color="#8E8E93" />
                    <Text className="text-sm text-[#8E8E93]">
                      {durationInMinutes ? `${durationInMinutes}` : '--'} min
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={24} color="#8E8E93" className="p-2 -mr-2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Group>
          <ContextMenu.Item key="read" onSelect={() => handlePress()}>
            <ContextMenu.ItemTitle>Read Story</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        </ContextMenu.Group>

        <ContextMenu.Group>
          <ContextMenu.Item key="suggest-more" onSelect={() => console.log('Suggest More')}>
            <ContextMenu.ItemTitle>Suggest More</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Item key="suggest-less" onSelect={() => console.log('Suggest Less')}>
            <ContextMenu.ItemTitle>Suggest Less</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        </ContextMenu.Group>

        <ContextMenu.Group>
          <ContextMenu.Item key="channel" onSelect={() => router.push(`/channel/${episode.id}`)}>
            <ContextMenu.ItemTitle>Go to Channel</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Item key="follow" onSelect={() => console.log('Follow Channel')}>
            <ContextMenu.ItemTitle>Follow Channel</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Item key="block" onSelect={() => console.log('Block Channel')}>
            <ContextMenu.ItemTitle>Block Channel</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        </ContextMenu.Group>
      </ContextMenu.Content>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
        presentationStyle="fullScreen"
        onDismiss={handleCloseModal}
      >
        <BlurView intensity={20} className="absolute inset-0">
          <Pressable className="flex-1" onPress={handleCloseModal}>
            <View className="flex-1 bg-white mt-[10%] rounded-t-xl overflow-hidden">
              <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
              
              <View className="p-4">
                <Image 
                  source={{ uri: imageUrl }} 
                  className="w-full h-48 rounded-lg bg-[#f0f0f0]" 
                />
                
                <Text className="text-2xl font-bold mt-4 mb-2 text-black">
                  {episode.attributes.name}
                </Text>
                
                <Text className="text-lg text-[#666] mb-4">
                  {episode.attributes.artistName}
                </Text>

                <Text className="text-base text-[#333] leading-6 mb-6">
                  {episode.attributes.description.standard || 'No description available'}
                </Text>

                <TouchableOpacity 
                  onPress={handlePress}
                  className="bg-apple-news py-3 px-6 rounded-full flex-row items-center justify-center"
                >
                  <Ionicons name={isCurrentlyPlaying ? "pause" : "play"} size={20} color="#fff" />
                  <Text className="text-white font-semibold ml-2">
                    {isCurrentlyPlaying ? 'Pause Episode' : 'Play Episode'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </BlurView>
      </Modal>
    </ContextMenu.Root>
  );
} 