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

### Navigation & State Management
```typescript
// Two ways to access the expanded player:

// 1. From MiniPlayer (continues playback)
router.push({
    pathname: "/audio/[id]",
    params: { 
        id: currentEpisode.id,
        via: 'miniplayer' 
    }
});

// 2. Direct URL (loads new audio)
// /audio/123 -> Loads episode with ID 123

// State handling in [id].tsx
useEffect(() => {
    // Skip loading if coming from MiniPlayer (audio already in context)
    if (via === 'miniplayer') return;
    
    // Load audio only for direct navigation
    if (!episode || !episode.attributes.assetUrl) return;
    loadPodcast();
}, [episode?.id, via]);
```

### Global Audio Context
The audio state is managed globally through AudioContext, which:
- Maintains current episode info
- Handles playback state (play/pause)
- Controls audio loading/unloading
- Manages player visibility

This means:
- MiniPlayer appears whenever there's audio in context
- Expanded player reads from same context
- Audio persists across navigation
- No reload needed when switching views

### Loading States and Transitions
```typescript
interface LoadingStates {
  hasStartedPlaying: boolean;  // Tracks if audio has ever started playing
  isTransitioning: boolean;    // Tracks play/pause transitions
}

// Loading state management in MiniPlayer
const PlayPauseButton = () => {
  // Initial loading - show spinner
  if (!hasStartedPlaying && isLoading.value) {
    return <ActivityIndicator />;
  }
  
  // During play/pause transitions - maintain play icon
  if (isTransitioning) {
    return <PlayIcon />;
  }

  // Normal state - show current play/pause state
  return <Icon name={isPlaying ? "pause" : "play"} />;
};

// State updates during transitions
useAnimatedReaction(
  () => isPlaying.value,
  (value) => {
    if (!hasStartedPlaying) {
      // First time loading
      if (value) {
        setHasStartedPlaying(true);
        setIsPlayingLocal(value);
      }
    } else {
      // Subsequent play/pause
      if (value && isLoading.value) {
        // Keep current icon during transition
        setIsTransitioning(true);
      } else {
        setIsTransitioning(false);
        setIsPlayingLocal(value);
      }
    }
  }
);
```

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

### Title Animation
```typescript
// Measure title width to determine if animation is needed
const titleRef = useRef<Text>(null);
const containerRef = useRef<View>(null);
const shouldAnimate = useSharedValue(false);

useEffect(() => {
  // Measure both container and text width
  const measureWidths = async () => {
    if (titleRef.current && containerRef.current) {
      const [titleWidth, containerWidth] = await Promise.all([
        new Promise<number>(resolve => 
          titleRef.current?.measure((_, __, width) => resolve(width))
        ),
        new Promise<number>(resolve => 
          containerRef.current?.measure((_, __, width) => resolve(width))
        )
      ]);
      shouldAnimate.value = titleWidth > containerWidth;
    }
  };
  measureWidths();
}, [episode.title]);

// Only animate if title is longer than container
const scrollStyle = useAnimatedStyle(() => {
  if (!shouldAnimate.value) return {};
  return {
    transform: [{ translateX: scrollX.value }]
  };
});
```

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

### 4. Play/Pause State Transitions
**Issue**: Play/pause icon can flicker during state transitions due to loading states.
**Current Implementation**:
```typescript
// Track multiple states to handle transitions smoothly
const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
const [isTransitioning, setIsTransitioning] = useState(false);

// Maintain play icon during loading transitions
if (value && isLoading.value) {
    setIsTransitioning(true);
} else {
    setIsTransitioning(false);
    setIsPlayingLocal(value);
}
```
**Solution**:
1. Show loading spinner only on initial load
2. Maintain play icon during transitions until loading completes
3. Use transition state to prevent premature icon updates
4. Handle loading states separately from play/pause states

## Best Practices

1. **Audio Loading**
   - Show loading spinner only on initial load
   - Maintain consistent UI during transitions
   - Prevent icon flickering during state changes
   - Handle loading and playing states independently

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