import { View, ViewProps } from 'react-native';
import React, { forwardRef } from 'react';

interface BlurViewProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default' | 'prominent' | 'extraLight' | 'ultraLight' | 'regular' | 'systemUltraThinMaterial' | 'systemThinMaterial' | 'systemMaterial' | 'systemThickMaterial' | 'systemChromeMaterial' | 'systemUltraThinMaterialLight' | 'systemThinMaterialLight' | 'systemMaterialLight' | 'systemThickMaterialLight' | 'systemChromeMaterialLight' | 'systemUltraThinMaterialDark' | 'systemThinMaterialDark' | 'systemMaterialDark' | 'systemThickMaterialDark' | 'systemChromeMaterialDark';
}

export default forwardRef<View, BlurViewProps>(({ style, children, ...props }, ref) => {
  return (
    <View ref={ref} style={[{ backgroundColor: 'rgba(255,255,255,1)' }, style]} {...props}>
      {children}
    </View>
  );
}); 