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
import { useRouter } from 'expo-router';
import { useAudio } from '@/contexts/AudioContext';
import { StatusBar } from 'expo-status-bar';

function AnimatedStack() {
  const { scale } = useRootScale();
  const router = useRouter();
  const { currentSong, isPlaying, togglePlayPause } = useAudio();

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
  
  return (
    <View style={{ flex: 1, }}>
      <Animated.View style={[
        styles.stackContainer, 
        shouldAnimate ? animatedStyle : undefined
      ]}>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(tabs)/(index,news+,sports,audio,search)" options={{ headerShown: false }} />
          <Stack.Screen
            name="music/[id]"
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
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
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
    </>
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

