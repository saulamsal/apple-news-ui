import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, StatusBar } from 'react-native';
import { AppleNewsLogo } from '@/components/icons/AppleNewsLogo';
import { MiniPlayer } from '@/components/BottomSheet/MiniPlayer';
import { useAudio } from '@/contexts/AudioContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Helper component for cross-platform icons
function TabIcon({ sfSymbol, ionIcon, color }: { 
  sfSymbol: string; 
  ionIcon: keyof typeof Ionicons.glyphMap; 
  color: string 
}) {
  return <TabBarIcon name={ionIcon} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { currentSong, isPlaying, togglePlayPause } = useAudio();

  return (
    <>
      <Tabs
        screenOptions={{
          animation: 'shift',
          tabBarActiveTintColor: '#FA2D48',
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: Platform.select({
              ios: 'transparent',
              android: 'rgba(255, 255, 255, 0.8)',
            }),
            borderTopWidth: 0,
            elevation: 0,
          },
          headerStyle: {
            height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
            tabBarIcon: ({ color, focused }) => (
              <AppleNewsLogo
                color={focused ? '#FA2D48' : color}
                width={30}
                height={30}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="news+"
          options={{
            title: 'News+',
            tabBarIcon: ({ color }) => (
              <TabIcon
                sfSymbol="square.grid.2x2.fill"
                ionIcon="newspaper"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="sports"
          options={{
            title: 'Sports',
            tabBarIcon: ({ color }) => (
              <TabIcon
                sfSymbol="dot.radiowaves.left.and.right"
                ionIcon="football"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="audio"
          options={{
            title: 'Audio',
            tabBarIcon: ({ color }) => (
              <TabIcon
                sfSymbol="music.note.list"
                ionIcon="headset"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Following',
            tabBarIcon: ({ color }) => (
              <TabIcon
                sfSymbol="magnifyingglass"
                ionIcon="heart"
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      {/* <Tabs.Screen name="content/[id]" options={{ href:null }} /> */}

      {currentSong && (
        <MiniPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onPress={() => router.push(`/music/${currentSong.id}`)}
        />
      )}
    </>
  );
}
