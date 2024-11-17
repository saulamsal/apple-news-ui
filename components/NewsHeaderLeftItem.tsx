import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NewsLogo } from '@/components/NewsLogo';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatSimpleDate } from '@/utils/dateFormatters';

interface NewsHeaderLeftItemProps {
  size: 'sm' | 'md';
}

export const NewsHeaderLeftItem = ({ size }: NewsHeaderLeftItemProps) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.headerLeft}>
      <NewsLogo
        color={colorScheme === 'light' ? '#000' : '#fff'}
        size={size === 'sm' ? 24 : 36}
      />
      <ThemedText 
        style={[
          styles.headerDate, 
          { 
            fontSize: size === 'sm' ? 16 : 28, 
            paddingTop: size === 'sm' ? 0 : 4 
          }
        ]}
      >
        {formatSimpleDate()}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'column',
      // alignItems: 'center',
      gap: 0,
  },
  headerDate: {
    fontWeight: '800',
    opacity: 0.5,
    letterSpacing: -1,
  },
}); 