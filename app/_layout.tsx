import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { RootScaleProvider } from '@/contexts/RootScaleContext';
import { useRootScale } from '@/contexts/RootScaleContext';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverlayProvider } from '@/components/Overlay/OverlayProvider';
import { AudioProvider } from '@/contexts/AudioContext';
import { MiniPlayer } from '@/components/BottomSheet/MiniPlayer';
import { useRouter } from 'expo-router';
import { useAudio } from '@/contexts/AudioContext';

function AnimatedStack() {
  const { scale } = useRootScale();
  const router = useRouter();
  const { currentSong, isPlaying, togglePlayPause } = useAudio();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        {
          translateY: (1 - scale.value) * -150,
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.stackContainer, animatedStyle]}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="music/[id]"
            options={{
              presentation: 'transparentModal',
              headerShown: false,
              contentStyle: {
                backgroundColor: 'transparent',
              },
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>


        {currentSong && (
          <MiniPlayer
            song={currentSong}
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onPress={() => router.push(`/music/${currentSong.id}`)}
          />
        )}


      </Animated.View>

      {/* putting anything here is not scalled down upon modal open */}
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
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
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  stackContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 50,
  },
});

