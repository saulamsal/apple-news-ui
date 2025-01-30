import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

interface EditorPickItemProps {
  episode: {
    id: string;
    attributes: {
      name: string;
      artwork: {
        url: string;
      };
      artistName: string;
      durationInMilliseconds: number;
    };
  };
}

const EditorPickItem = ({ episode, index }: EditorPickItemProps & { index: number }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const imageUrl = episode.attributes.artwork?.url?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') || 'https://via.placeholder.com/300';
  const durationInMinutes = Math.floor(episode.attributes.durationInMilliseconds / 60000);

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).springify()}
    >
      <TouchableOpacity 
        className="w-[300px] ml-4"
        onPress={() => router.push(`/audio/${episode.id}`)}
      >
        <Image 
          source={{ uri: imageUrl }}
          className="w-[300px] h-[250px] rounded-lg bg-[#f0f0f0]"
        />
        <View className="mt-2">
          <Text 
            className="text-xl font-bold" 
            style={{ color: '#000' }}
            numberOfLines={2}
          >
            {episode.attributes.name}
          </Text>
          <Text className="text-sm text-[#666] mt-1" numberOfLines={1}>
            {episode.attributes.artistName} • {durationInMinutes} min
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export function PodcastEditorsPickItem({ episodes }: { episodes: any[] }) {
  return (
    <Animated.View 
      className="mt-6 mb-8 -mr-5 -ml-5"
      entering={FadeIn.duration(400)}
    >
      <View className="mb-4 px-4">
        <Text className="text-3xl font-bold">Editors' Picks</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        {episodes.slice(0, 5).map((episode, index) => (
          <EditorPickItem key={episode.id} episode={episode} index={index} />
        ))}
      </ScrollView>
    </Animated.View>
  );
} 