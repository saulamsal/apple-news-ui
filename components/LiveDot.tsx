import React from 'react';
import { View, StyleSheet } from 'react-native';

interface LiveDotProps {
  color?: string;
  size?: number;
}

export const LiveDot = ({ color = '#FF3B30', size = 6 }: LiveDotProps) => (
  <View
    style={[
      styles.liveDot,
      {
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: size / 2,
      }
    ]}
    className="animate-pulse"
  />
);

const styles = StyleSheet.create({
  liveDot: {
    marginLeft: 4,
  },
}); 