# Transition Sheet Documentation

## Overview
The transition sheet is a custom modal implementation that provides a smooth, gesture-driven interface similar to Apple Music's player sheet. It features a draggable interface with spring animations, scale transformations of the root view, and fluid gesture handling.

## Key Features
- Gesture-driven modal with real-time tracking
- Dynamic root view scaling during transitions
- Haptic feedback at key interaction points
- Smooth animations with cubic easing
- Threshold-based dismiss behavior
- Status bar style adaptation based on gesture position

## Implementation Details

### Core Components
- Uses `GestureDetector` from `react-native-gesture-handler`
- Animated values managed by `react-native-reanimated`
- Root scale context for background view transformations
- Platform-specific optimizations for iOS and Android

### Shared Values
```typescript
const translateY = useSharedValue(0);
const isClosing = useSharedValue(false);
const statusBarStyle = useSharedValue<'light' | 'dark'>('light');
const windowHeight = useSharedValue(Dimensions.get('window').height);
const dragProgress = useSharedValue(0);
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

1. **Gesture Control**
   - Allow continuous dragging even after threshold
   - Only commit to actions on gesture release
   - Provide visual feedback during drag

2. **Animation Timing**
   - Use cubic easing for natural movement
   - Keep animations under 300ms for responsiveness
   - Use spring configurations for bounce-back

3. **Performance**
   - Use worklets for all animations
   - Minimize bridge communication
   - Keep shared values in sync

## Usage Example

```typescript
<GestureDetector gesture={panGesture}>
    <Animated.View 
        style={[
            styles.modalContent, 
            animatedStyle,
            { backgroundColor: '#fff' }
        ]}
    >
        <ExpandedPlayer />
    </Animated.View>
</GestureDetector>
```

## Future Improvements

1. **Root Scale Performance**
   - Implement native driver support
   - Optimize interpolation calculations
   - Consider using derived shared values

2. **Gesture Refinements**
   - Add velocity-based dismissal
   - Implement diagonal drag handling
   - Add resistance at edges

3. **Animation Polish**
   - Fine-tune spring configurations
   - Add subtle parallax effects
   - Improve haptic feedback timing

## Platform Considerations

### iOS
- Uses blur effects
- Handles status bar transitions
- Implements root view scaling

### Android
- Uses opacity for background dimming
- Simplified animation model
- Platform-specific gesture handling

## Debugging Tips

1. Monitor shared values using `useAnimatedReaction`
2. Log gesture state changes in development
3. Use React Native Debugger for animation inspection
4. Profile performance with systrace 