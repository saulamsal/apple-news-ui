import { BlurView as ExpoBlurView } from 'expo-blur';
import { forwardRef } from 'react';
import { Platform, View } from 'react-native';
import type { BlurViewProps } from 'expo-blur';

export default forwardRef<ExpoBlurView, BlurViewProps>((props, ref) => {
  if (Platform.OS === 'web') {
    return (
      <View
        {...props}
        ref={ref}
        style={[
          props.style,
          {
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
          }
        ]}
        className="test-ss"
      />
    );
  }

  return <ExpoBlurView intensity={90} tint="light" {...props} ref={ref} />;
});
