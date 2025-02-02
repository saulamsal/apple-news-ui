import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { StyleSheet, useColorScheme, View, Platform } from 'react-native';
import { RootScaleProvider } from '@/contexts/RootScaleContext';
import { useRootScale } from '@/contexts/RootScaleContext';
import { useAnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverlayProvider } from '@/components/Overlay/OverlayProvider';
import { AudioProvider } from '@/contexts/AudioContext';
import { useRouter, useSegments } from 'expo-router';
import { useAudio } from '@/contexts/AudioContext';
import { StatusBar } from 'expo-status-bar';
import { MiniPlayer } from '@/components/BottomSheet/MiniPlayer';
import '../global.css';
import {Appearance} from '@/helper/appearance';
import { interpolate, interpolateColor } from 'react-native-reanimated';


function AnimatedStack() {
  const segments = useSegments();
  const router = useRouter();
  const { scale } = useRootScale();
  const { currentEpisode, isPlaying, togglePlayPause } = useAudio();
  const isIOS = Platform.OS === 'ios';

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { scale: scale.value },
        { translateY: (1 - scale.value) * -150 }
      ],
      borderRadius: scale.value === 1 ? 0 : 50,
      backgroundColor: '#fff',
    };
  }, []);

  const containerStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      flex: 1,
      backgroundColor: '#000',
    };
  }, []);

  // const handleMiniPlayerPress = () => {
  //   router.push('/audio/current');
  // };

  return (
    <Animated.View style={containerStyle}>
      <Animated.View 
        style={[
          styles.stackContainer,
          Platform.OS === 'ios' && Platform.OS !== 'web' && animatedStyle,
          Platform.OS === 'web' && {
            position: 'relative',
            overflow: 'unset!important', 
            height: 'auto'
          }
        ]}  
      >
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="audio/[id]"
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              headerShown: false,
              contentStyle: {
                backgroundColor: 'transparent',
              },
            }}
          />
          <Stack.Screen name="edit" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Animated.View>
      {currentEpisode && (
        <MiniPlayer
          episode={currentEpisode}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onPress={
            () => 
            {
              // alert(currentEpisode.id)
              // return;
              router.push(`/audio/${currentEpisode.id}`)
            }
          }
        />
      )}
    </Animated.View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();


  Appearance.setColorScheme('light');

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
      <View style={{ flex: 1}}>
        <StatusBar 
          style={'dark'} 
          backgroundColor="transparent" 
          translucent={true} 
        />
        <GestureHandlerRootView style={styles.container}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootScaleProvider>
              <AudioProvider>
                <OverlayProvider>
                  <AnimatedStack />
                </OverlayProvider>
              </AudioProvider>
            </RootScaleProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: Platform.OS === "ios" ? 1 : 0,
    backgroundColor: Platform.OS === "ios" ? 'black' : 'transparent',
  },
  stackContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});

