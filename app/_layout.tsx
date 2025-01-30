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
  const { currentEpisode } = useAudio();
  const isIOS = Platform.OS === 'ios';

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    if (!isIOS) return {
      backgroundColor: '#fff'
    };

    const progress = Math.max(0, Math.min(1, (scale.value - 0.83) / 0.17));
    const borderRadius = interpolate(
      progress,
      [0, 1],
      [20, 50],
      'clamp'
    );

    return {
      transform: [
        { scale: scale.value },
        { translateY: (1 - scale.value) * -150 }
      ],
      borderRadius,
      backgroundColor: '#fff',
    };
  }, [isIOS]);

  const containerStyle = useAnimatedStyle(() => {
    'worklet';
    if (!isIOS) {
      return {
        flex: 1,
        backgroundColor: '#000',
      };
    }

    const progress = Math.max(0, Math.min(1, (scale.value - 0.83) / 0.17));
    const backgroundColor = interpolateColor(
      progress,
      [0, 1],
      ['#000', '#000']
    );

    return {
      flex: 1,
      backgroundColor,
    };
  }, [isIOS]);
  
  const handleMiniPlayerPress = () => {
    router.push('/audio/current');
  };

  return (
    <Animated.View style={containerStyle}>
      <Animated.View 
        style={[
          styles.stackContainer,
          animatedStyle,

          !isIOS && { 
            backgroundColor: '#fff'
           },
           (Platform.OS === 'web') && {
            overflow: 'unset!important', 
            position: 'relative'
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
          <Stack.Screen name="stocks" />
          <Stack.Screen name="edit" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Animated.View>
      <MiniPlayer onPress={handleMiniPlayerPress} />
    </Animated.View>
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
    flex: 1,
    backgroundColor: 'black',
  },
  stackContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});

