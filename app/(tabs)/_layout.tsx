import { Tabs } from '@/components/navigation/NativeTabs';
import React from 'react';
import { Platform } from 'react-native';
import { MiniPlayer } from '@/components/BottomSheet/MiniPlayer';
import { useAudio } from '@/contexts/AudioContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const unstable_settings = {
  initialRouteName: '(home)',
};

type TabBarIconProps = {
  color: string;
  focused: boolean;
  size: number;
};

interface AudioContextType {
  currentEpisode: any;
  isPlaying: boolean;
  togglePlayPause: () => Promise<void>;
}

export default function TabLayout() {
  const router = useRouter();
  const { currentEpisode, isPlaying, togglePlayPause } = useAudio() as AudioContextType;

  const renderIcon = (props: TabBarIconProps, iconName: keyof typeof Ionicons.glyphMap, outlineIconName: keyof typeof Ionicons.glyphMap) => {
    return (
      <Ionicons 
        name={props.focused ? iconName : outlineIconName}
        size={props.size} 
        color={props.color}
      />
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FA2D48',
          headerShown: false,
        }}
        
        >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
            tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'newspaper', 'newspaper-outline'),
          }}
        />
        <Tabs.Screen
          name="(news+)"
          options={{
            title: 'News+',
            tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'beaker', 'beaker'),
          }}
        />
        <Tabs.Screen
          name="(sports)"
          options={{
            title: 'Sports',
            tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'basketball', 'basketball-outline'),
          }}
        />
        <Tabs.Screen
          name="(audio)"
          options={{
            title: 'Audio',
            tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'headset', 'headset'),
          }}
        />
        <Tabs.Screen
          name="(search)"
          options={{
            title: 'Following',
            tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'heart', 'heart-outline'),
          }}
        />
      </Tabs>

      {currentEpisode && (
        <MiniPlayer
          onPress={() => router.push(`/audio/${currentEpisode.id}`)}
        />
      )}
    </>
  );
}
