import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { StyleSheet, useColorScheme, View, Platform, Animated } from 'react-native';
import { RootScaleProvider } from '@/contexts/RootScaleContext';
import { useRootScale } from '@/contexts/RootScaleContext';
import { useAnimatedStyle } from 'react-native-reanimated';
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
  const { currentEpisode } = useAudio();
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentEpisode) {
      Animated.spring(contentAnim, {
        toValue: -10,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      Animated.spring(contentAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }
  }, [currentEpisode]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: (1 - scale.value) * -200 },
        { scale: scale.value },
      ],
      borderRadius: scale.value >= 1 ? 0 : scale.value * 40,
    };
  });

  const shouldAnimate = Platform.OS === 'ios';
  
  const handleMiniPlayerPress = () => {
    router.push('/audio/current');
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View 
        style={[
          styles.stackContainer, 
          shouldAnimate ? animatedStyle : undefined,
          { transform: [{ translateY: contentAnim }] }
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
                backgroundColor: Platform.OS === 'android' 
                  ? 'transparent' 
                  : 'transparent',
              },
            }}
          />
          <Stack.Screen  name="stocks" />
          <Stack.Screen name="edit" 
           options={{
            // presentation: 'formSheet',
            // gestureDirection: "vertical",
            // animation: "slide_from_bottom",
            // headerShown: false,
            // sheetGrabberVisible: true,
            // sheetInitialDetentIndex: 0,
            // sheetAllowedDetents: [0.5],
  
          }}  />
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

