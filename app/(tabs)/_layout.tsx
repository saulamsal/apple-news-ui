import { Tabs } from '@/components/navigation/NativeTabs';
import React from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SymbolView } from 'expo-symbols';

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

  const renderIcon = (props: TabBarIconProps, iconName: keyof typeof Ionicons.glyphMap, sfSymbolName: string) => {
    if (Platform.OS === 'ios') {
      return (
        <SymbolView
          name={sfSymbolName}
          style={{
            width: props.size,
            height: props.size
          }}
          weight={props.focused ? "bold" : "regular"}
          scale="large"
          tintColor={props.color}
          type={props.focused ? 'hierarchical' : 'monochrome'}
        />
      );
    }
    
    return (
      <Ionicons 
        name={props.focused ? iconName : `${iconName}-outline`}
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
          title: 'Today',
          tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'newspaper', 'text.book.closed'),
        }}
      />
      <Tabs.Screen
        name="(news+)"
        options={{
          title: 'News+',
          tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'grid', 'rectangle.stack.badge.plus'),
        }}
      />
      <Tabs.Screen
        name="(sports)"
        options={{
          title: 'Sports',
          tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'football', 'figure.american.football'),
        }}
      />
      <Tabs.Screen
        name="(audio)"
        options={{
          title: 'Audio',
          tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'headset', 'headphones'),
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          title: 'Following',
          tabBarIcon: (props: TabBarIconProps) => renderIcon(props, 'heart', 'heart.circle'),
        }}
      />
    </Tabs>
  );
}
