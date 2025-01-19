import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

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

const EditorPickItem = ({ episode }: EditorPickItemProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const imageUrl = episode.attributes.artwork?.url?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') || 'https://via.placeholder.com/300';
  const durationInMinutes = Math.floor(episode.attributes.durationInMilliseconds / 60000);

  return (
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
          style={{ color: colorScheme === 'light' ? '#000' : '#fff' }}
          numberOfLines={2}
        >
          {episode.attributes.name}
        </Text>
        <Text className="text-sm text-[#666] mt-1" numberOfLines={1}>
          {episode.attributes.artistName} • {durationInMinutes} min
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export function PodcastEditorsPickItem({ episodes }: { episodes: any[] }) {
  return (
    <View className="mt-6 mb-8 -mr-5 -ml-5">
      <View className="mb-4 px-4">
        <Text className="text-3xl font-bold">Editors' Picks</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {episodes.slice(0, 5).map((episode, index) => (
          <EditorPickItem key={episode.id} episode={episode} />
        ))}
      </ScrollView>
    </View>
  );
} 