import { Tabs } from '@/components/navigation/NativeTabs';
import React from 'react';
import { Platform, StyleSheet, StatusBar } from 'react-native';
import { AppleNewsLogo } from '@/components/icons/AppleNewsLogo';
import { MiniPlayer } from '@/components/BottomSheet/MiniPlayer';
import { useAudio } from '@/contexts/AudioContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const unstable_settings = {
  initialRouteName: '(home)',
};

export default function TabLayout() {
  const router = useRouter();
  const { currentSong, isPlaying, togglePlayPause } = useAudio();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FA2D48',
          headerShown: false,
        }}>
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
            tabBarIcon: Platform.select({
              ios: () => ({ sfSymbol: 'newspaper.fill' }),
              android: ({ color }) => <Ionicons name="newspaper" size={24} color={color} />
            }),
          }}
        />
        <Tabs.Screen
          name="(news+)"
          options={{
            title: 'News+',
            tabBarIcon: Platform.select({
              ios: () => ({ sfSymbol: 'square.grid.2x2.fill' }),
              android: ({ color }) => <Ionicons name="grid" size={24} color={color} />
            }),
          }}
        />
        <Tabs.Screen
          name="(sports)"
          options={{
            title: 'Sports',
            tabBarIcon: Platform.select({
              ios: () => ({ sfSymbol: 'football.fill' }),
              android: ({ color }) => <Ionicons name="football" size={24} color={color} />
            }),
          }}
        />
        <Tabs.Screen
          name="(audio)"
          options={{
            title: 'Audio',
            tabBarIcon: Platform.select({
              ios: () => ({ sfSymbol: 'headphones' }),
              android: ({ color }) => <Ionicons name="headset" size={24} color={color} />
            }),
          }}
        />
        <Tabs.Screen
          name="(search)"
          options={{
            title: 'Following',
            tabBarIcon: Platform.select({
              ios: () => ({ sfSymbol: 'heart.fill' }),
              android: ({ color }) => <Ionicons name="heart" size={24} color={color} />
            }),
          }}
        />
      </Tabs>

      {currentSong && (
        <MiniPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onPress={() => router.push(`/audio/${currentSong.id}`)}
        />
      )}
    </>
  );
}
