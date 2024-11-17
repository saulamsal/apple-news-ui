import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/screens/home';
import type { NewsItemType } from './NewsItem';

interface SwipeableNewsItemProps {
  item: NewsItemType;
}

export const SwipeableNewsItem = ({ item }: SwipeableNewsItemProps) => {
  const iconColor = '#fff';

  return (
    <View style={styles.rowBack}>
      {/* Left swipe actions */}
      <View style={styles.leftActions}>
        <Pressable
          onPress={() => console.log('Thumbs down:', item.id)}
          style={[styles.actionButton, styles.leftActionButton, { backgroundColor: '#FF3A31' }]}
        >
          <Ionicons name="thumbs-down" size={24} color={iconColor} />
        </Pressable>
        <Pressable
          onPress={() => console.log('Thumbs up:', item.id)}
          style={[styles.actionButton, styles.leftActionButton, { backgroundColor: '#54B583' }]}
        >
          <Ionicons name="thumbs-up" size={24} color={iconColor} />
        </Pressable>
      </View>

      {/* Right swipe actions */}
      <View style={styles.rightActions}>
        <Pressable
          onPress={() => console.log('Share:', item.id)}
          style={[styles.actionButton, styles.rightActionButton, { backgroundColor: '#027BFF' }]}
        >
          <Ionicons name="share-outline" size={24} color={iconColor} />
        </Pressable>
        <Pressable
          onPress={() => console.log('Save:', item.id)}
          style={[styles.actionButton, styles.rightActionButton, { backgroundColor: '#FF9502' }]}
        >
          <Ionicons name="bookmark-outline" size={24} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
}; 