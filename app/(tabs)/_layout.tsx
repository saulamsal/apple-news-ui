import { Tabs } from '@/components/navigation/NativeTabs';
import React from 'react';
import { Platform } from 'react-native';
import { MiniPlayer } from '@/components/BottomSheet/MiniPlayer';
import { useAudio } from '@/contexts/AudioContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Home, NewsPlus, Sports, Search } from '@/assets/svg/tab-icons'

export const unstable_settings = {
  initialRouteName: '(index)',
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
          name="(index)"
          options={{
            title: 'Home',
            // tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'newspaper', 'newspaper-outline'),
            tabBarIcon: (props: TabBarIconProps) => <Home width={24} height={24} color={props.focused ? '#FA2D48' : '#8E8E8F'} />,
          }}
        />
        <Tabs.Screen
          name="(news+)"
          options={{
            title: 'News+',
            // tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'beaker', 'beaker'),
            tabBarIcon: (props: TabBarIconProps) => <NewsPlus width={24} height={24} color={props.focused ? '#FA2D48' : '#8E8E8F'} />,
          }}
        />
        <Tabs.Screen
          name="(sports)"
          options={{
            title: 'Sports',
            // tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'basketball', 'basketball-outline'),
            tabBarIcon: (props: TabBarIconProps) => <Sports width={30} height={30} color={props.focused ? '#FA2D48' : '#8E8E8F'} />,
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
            // tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'heart', 'heart-outline'),
            tabBarIcon: (props: TabBarIconProps) => <Search width={24} height={24} color={props.focused ? '#FA2D48' : '#8E8E8F'} />,
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
