import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, useColorScheme, View, Platform } from 'react-native';
import { RootScaleProvider } from '@/contexts/RootScaleContext';
import { useRootScale } from '@/contexts/RootScaleContext';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverlayProvider } from '@/components/Overlay/OverlayProvider';
import { AudioProvider } from '@/contexts/AudioContext';
import { useRouter, useSegments } from 'expo-router';
import { useAudio } from '@/contexts/AudioContext';
import { StatusBar } from 'expo-status-bar';
import { MiniPlayer } from '@/components/BottomSheet/MiniPlayer';
import '../global.css';

function AnimatedStack() {
  const segments = useSegments();
  const router = useRouter();
  const { scale } = useRootScale();
  const { currentEpisode, isPlaying, togglePlayPause } = useAudio();

  useEffect(() => {
    // If we're not on welcome screen and not in tabs, redirect to welcome
    if (segments[0] !== 'welcome' && segments[0] !== '(tabs)') {
      router.replace('/welcome');
    }
  }, [segments]);

  const animatedStyle = useAnimatedStyle(() => {
    console.log(scale.value)
    return {
      transform: [
        { scale: scale.value },
        {
          translateY: (1 - scale.value) * -150,
        },
      ],
      borderRadius: scale.value >= 1 ? 0 : scale.value * 50,
    };
  });

  const shouldAnimate = Platform.OS === 'ios';
  
  const handleMiniPlayerPress = () => {
    router.push('/audio/current');
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[
        styles.stackContainer, 
        shouldAnimate ? animatedStyle : undefined
      ]}>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="audio/[id]"
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              headerShown: false,
              contentStyle: {
                backgroundColor: Platform.OS === 'android' 
                  ? 'transparent' 
                  : 'transparent',
              },
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Animated.View>
      <MiniPlayer onPress={handleMiniPlayerPress} />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
      <View style={{ flex: 1 }}>
        <StatusBar 
          style={colorScheme === 'dark' ? 'light' : 'dark'} 
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
    flex: 1,
    backgroundColor: Platform.OS === 'android' ? 'transparent' : '#000',
  },
  stackContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});

