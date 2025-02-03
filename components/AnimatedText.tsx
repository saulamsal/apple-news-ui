import React from 'react';
import { Platform, StyleSheet, TextProps as RNTextProps } from 'react-native';
import { TextInput } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedReaction,
} from 'react-native-reanimated';
import type { SharedValue, AnimatedProps } from 'react-native-reanimated';

Animated.addWhitelistedNativeProps({ text: true });

interface AnimatedTextProps {
  text: SharedValue<string>;
  style?: AnimatedProps<RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const AnimatedText = ({ text, style }: AnimatedTextProps) => {
  const inputRef = React.useRef<any>(null);

  if (Platform.OS === 'web') {
    useAnimatedReaction(
      () => text.value,
      (data, prevData) => {
        if (data !== prevData && inputRef.current) {
          inputRef.current.value = data;
        }
      },
      [text]
    );
  }

  const animatedProps = useAnimatedProps(() => ({
    text: text.value,
  }));

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      ref={Platform.select({ web: inputRef })}
      value={text.value}
      style={[styles.text, style]}
      animatedProps={animatedProps}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
}); 