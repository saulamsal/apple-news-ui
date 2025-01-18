import { Tabs } from '@/components/navigation/NativeTabs';
import React from 'react';
import { Platform } from 'react-native';
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

export default function TabLayout() {
  const router = useRouter();

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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FA2D48',
        headerShown: false,
      }}>
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
          tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'grid', 'grid-outline'),
        }}
      />
      <Tabs.Screen
        name="(sports)"
        options={{
          title: 'Sports',
          tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'football', 'football-outline'),
        }}
      />
      <Tabs.Screen
        name="(audio)"
        options={{
          title: 'Audio',
          tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'headset', 'headset-outline'),
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
  );
}
