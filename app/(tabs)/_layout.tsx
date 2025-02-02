import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
import BlurView from '@/components/BlurView';
import { Platform, StyleSheet, StatusBar, View, useColorScheme } from 'react-native';
import { AppleNewsLogo } from '@/components/icons/AppleNewsLogo';
import { MiniPlayer } from '@/components/BottomSheet/MiniPlayer';
import { useAudio } from '@/contexts/AudioContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Home, NewsPlus, Sports, Search } from '@/assets/svg/tab-icons'


// Helper component for cross-platform icons
function TabIcon({ sfSymbol, ionIcon, color }: { 
  sfSymbol: string; 
  ionIcon: keyof typeof Ionicons.glyphMap; 
  color: string 
}) {
  return <TabBarIcon name={ionIcon} color={color} />;
}

export const unstable_settings = {
  initialRouteName: '(index)',
};

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
              android: 'rgba(255, 255, 255, 1)',
            }),
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor:  'rgba(0,0,0,0.2)',
            elevation: 0,
            marginBottom: currentSong ? 86 : 0,
          },
          headerStyle: {
            height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          },
          tabBarBackground: () => (
            Platform.OS === 'ios' ? (
              <BlurView
                tint={ 'systemThickMaterialLight'}
                intensity={80}
                style={StyleSheet.absoluteFill}
              />
            ) : null
          ),
        }}>
        <Tabs.Screen
          name="(index)"
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
          name="(news+)"
          options={{
            title: 'News+',
            tabBarIcon: (props) => <NewsPlus width={24} height={24} color={props.focused ? '#FA2D48' : '#8E8E8F'} />,
          }}
        />
        <Tabs.Screen
          name="(sports)"
          options={{
            title: 'Sports',
            tabBarIcon: (props) => <Sports width={30} height={30} color={props.focused ? '#FA2D48' : '#8E8E8F'} />,
          }}
        />
        <Tabs.Screen
          name="(audio)"
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
          name="(search)"
          options={{
            title: 'Following',
            headerShown: false,
            tabBarIcon: (props) => <Search width={24} height={24} color={props.focused ? '#FA2D48' : '#8E8E8F'} />,
          }}
        />
      </Tabs>

 
{/* 
      {currentSong && (
        <MiniPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onPress={() => router.push(`/audio/${currentSong.id}`)}
        />
      )} */}
    </>
  );
}