import { View, ViewProps } from 'react-native';
import React from 'react';

interface BlurViewProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default' | 'prominent' | 'extraLight' | 'ultraLight' | 'regular' | 'systemUltraThinMaterial' | 'systemThinMaterial' | 'systemMaterial' | 'systemThickMaterial' | 'systemChromeMaterial' | 'systemUltraThinMaterialLight' | 'systemThinMaterialLight' | 'systemMaterialLight' | 'systemThickMaterialLight' | 'systemChromeMaterialLight' | 'systemUltraThinMaterialDark' | 'systemThinMaterialDark' | 'systemMaterialDark' | 'systemThickMaterialDark' | 'systemChromeMaterialDark';
}

export default function BlurView({ style, children, ...props }: BlurViewProps) {
  return (
    <View style={[{ backgroundColor: 'rgba(0,0,0,0.1)' }, style]} {...props}>
      {children}
    </View>
  );
} 