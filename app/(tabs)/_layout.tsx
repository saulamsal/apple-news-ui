import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

// Helper component for cross-platform icons
function TabIcon({ sfSymbol, ionIcon, color }: { sfSymbol: string; ionIcon: string; color: string }) {
  // if (Platform.OS === 'ios') {
  //   return (
  //     <SymbolView
  //       name={sfSymbol}
  //       size={24}
  //       tintColor={color}
  //       fallback={<TabBarIcon name={ionIcon} color={color} />}
  //     />
  //   );
  // }
  return <TabBarIcon name={ionIcon} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FA2D48',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.select({
            ios: 'transparent',
            android: 'rgba(255, 255, 255, 0.8)', // Fallback for Android
          }),
          borderTopWidth: 0,
          elevation: 0,
          height: 94,
          paddingTop: 0,
          paddingBottom: 40,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              tint={colorScheme === 'dark' ? 'systemThickMaterialDark' : 'systemThickMaterialLight'}
              intensity={80}
              style={StyleSheet.absoluteFill}
            />
          ) : null
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabIcon
              sfSymbol="music.note.house"
              ionIcon="home-sharp"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: 'New',
          tabBarIcon: ({ color }) => (
            <TabIcon
              sfSymbol="square.grid.2x2.fill"
              ionIcon="apps-sharp"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="radio"
        options={{
          title: 'Radio',
          tabBarIcon: ({ color }) => (
            <TabIcon
              sfSymbol="dot.radiowaves.left.and.right"
              ionIcon="radio-outline"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => (
            <TabIcon
              sfSymbol="music.note.list"
              ionIcon="musical-notes"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <TabIcon
              sfSymbol="magnifyingglass"
              ionIcon="search"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
