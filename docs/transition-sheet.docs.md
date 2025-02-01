# Transition Sheet Documentation

## Overview
The transition sheet is a custom modal implementation that provides a smooth, gesture-driven interface similar to Apple Music's player sheet. It features a draggable interface with spring animations, scale transformations of the root view, and fluid gesture handling. The sheet also integrates with the audio system to provide a seamless audio playback experience.

## Key Features
- Gesture-driven modal with real-time tracking
- Dynamic root view scaling during transitions
- Haptic feedback at key interaction points
- Smooth animations with cubic easing
- Threshold-based dismiss behavior
- Status bar style adaptation based on gesture position
- Integrated audio playback controls
- Platform-specific optimizations for iOS, Android, and Web

## Audio Integration

### Web-Specific Behavior
```typescript
// Initial audio loading without auto-play (web)
const loadInitialAudio = async () => {
  if (Platform.OS === 'web') {
    const firstEpisode = episodes[0];
    await loadEpisodeWithoutPlaying(firstEpisode);
  }
};
```

### Audio State Management
```typescript
interface AudioState {
  isPlaying: SharedValue<boolean>;
  isLoading: SharedValue<boolean>;
  position: SharedValue<number>;
  duration: SharedValue<number>;
}

// Audio commands available
interface AudioCommands {
  playEpisode: (episode: PodcastEpisode) => Promise<void>;
  loadEpisodeWithoutPlaying: (episode: PodcastEpisode) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seek: (seconds: number) => Promise<void>;
  closePlayer: () => Promise<void>;
}
```

### Platform-Specific Audio Handling
- **Web**: Loads audio without auto-playing, requires user interaction for playback
- **Mobile**: Auto-plays when episode is selected
- **Background Audio**: Continues playback when app is in background
- **Silent Mode**: Respects device audio settings while ensuring playback

## Implementation Details

### Core Components
- Uses `GestureDetector` from `react-native-gesture-handler`
- Animated values managed by `react-native-reanimated`
- Root scale context for background view transformations
- Platform-specific optimizations for iOS, Android, and Web
- Audio context for state management and playback control

### Shared Values
```typescript
const translateY = useSharedValue(0);
const isClosing = useSharedValue(false);
const statusBarStyle = useSharedValue<'light' | 'dark'>('light');
const windowHeight = useSharedValue(Dimensions.get('window').height);
const dragProgress = useSharedValue(0);
```

### Audio Integration Constants
```typescript
const AUDIO_SETUP = {
  AUTOPLAY: Platform.OS !== 'web',
  BACKGROUND_MODE: true,
  INTERRUPTION_MODE: {
    ios: InterruptionModeIOS.DoNotMix,
    android: InterruptionModeAndroid.DoNotMix
  }
};
```

### Constants
```typescript
const SCALE_FACTOR = 0.83; // Background scale when modal is open
const DRAG_THRESHOLD = Math.min(Dimensions.get('window').height * 0.20, 150);
```

### Gesture Handling

#### Start
```typescript
.onStart(() => {
    'worklet';
    translateY.value = 0;
    dragProgress.value = 0;
    isClosing.value = false;
    // Initial scale setup
})
```

#### Update (During Drag)
```typescript
.onUpdate((event) => {
    'worklet';
    const dy = Math.max(0, event.translationY);
    translateY.value = dy;
    dragProgress.value = Math.min(dy / 300, 1);
    // Update scale and status bar
})
```

#### End (Release)
```typescript
.onEnd((event) => {
    'worklet';
    const shouldClose = event.translationY > DRAG_THRESHOLD;
    // Handle closing or bouncing back
})
```

## Animation Configurations

### Closing Animation
```typescript
withTiming(windowHeight.value, {
    duration: 300,
    easing: Easing.out(Easing.cubic)
})
```

### Bounce Back Animation
```typescript
withSpring(0, {
    damping: 20,
    stiffness: 100,
    mass: 1
})
```

## Known Issues & Solutions

### 1. Root Scale Responsiveness
**Issue**: Root scale transitions don't feel 100% real-time despite no FPS drops.
**Current Implementation**:
```typescript
if (isIOS) {
    const newScale = interpolate(
        dragProgress.value,
        [0, 1],
        [SCALE_FACTOR, 1],
        'clamp'
    );
    setScale(newScale);
}
```
**Potential Solutions**:
1. Move scale calculations to a derived value
2. Use `withSpring` for smoother transitions
3. Adjust interpolation curve
4. Consider using native driver for scale animations

### 2. Gesture Interruption
**Solution**: Using `isClosing` shared value to track state and prevent unwanted interruptions.

### 3. Threshold Behavior
**Solution**: Only checking threshold on release, allowing full gesture control during drag.

## Best Practices

1. **Audio Loading**
   - Pre-load audio on web without auto-playing
   - Show loading states in UI during audio preparation
   - Handle audio interruptions gracefully
   - Cache audio resources when possible

2. **Gesture Control**
   - Allow continuous dragging even after threshold
   - Only commit to actions on gesture release
   - Provide visual feedback during drag
   - Coordinate gestures with audio controls

3. **Performance**
   - Use worklets for all animations
   - Minimize bridge communication
   - Keep shared values in sync
   - Optimize audio buffer sizes

## Usage Example

```typescript
// Initialize audio in layout
useEffect(() => {
  const loadInitialAudio = async () => {
    if (Platform.OS === 'web') {
      const firstEpisode = episodes[0];
      await loadEpisodeWithoutPlaying(firstEpisode);
    }
  };
  loadInitialAudio();
}, []);

// Mini player implementation
<GestureDetector gesture={panGesture}>
    <Animated.View style={[styles.modalContent, animatedStyle]}>
        <MiniPlayer 
          episode={currentEpisode}
          onPress={handleExpandPlayer}
        />
    </Animated.View>
</GestureDetector>
```

## Future Improvements

1. **Audio Features**
   - Add offline playback support
   - Implement audio quality selection
   - Add crossfade between tracks
   - Support for playlists and queues

2. **Gesture Refinements**
   - Add velocity-based dismissal
   - Implement diagonal drag handling
   - Add resistance at edges

3. **Animation Polish**
   - Fine-tune spring configurations
   - Add subtle parallax effects
   - Improve haptic feedback timing

## Platform Considerations

### Web
- No auto-play without user interaction
- Pre-load audio for instant playback
- Handle browser audio policies
- Support keyboard controls

### iOS
- Uses blur effects
- Handles status bar transitions
- Implements root view scaling
- Background audio support

### Android
- Uses opacity for background dimming
- Simplified animation model
- Platform-specific gesture handling
- Service-based audio playback

## Debugging Tips

1. Monitor shared values using `useAnimatedReaction`
2. Log gesture state changes in development
3. Use React Native Debugger for animation inspection
4. Profile performance with systrace
5. Monitor audio state transitions
6. Test on all platforms for consistent behavior 