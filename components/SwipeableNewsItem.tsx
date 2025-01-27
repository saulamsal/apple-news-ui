import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { styles } from '@/styles/screens/home';
import type { NewsItemType } from './NewsItem';

interface SwipeableNewsItemProps {
  item: NewsItemType;
  swipeableRef?: any;
}

export const SwipeableNewsItem = ({ item, swipeableRef }: SwipeableNewsItemProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const iconColor = '#fff';

  const handleSave = () => {
    setIsSaved(!isSaved);
    swipeableRef?.current?.close();
    console.log('Save:', item.id);
  };

  return (
    <View style={styles.rowBack}>
      {/* Left swipe actions */}
      <View style={styles.leftActions}>
        <Pressable
          onPress={() => console.log('Thumbs down:', item.id)}
          style={[styles.actionButton, styles.leftActionButton, { backgroundColor: '#FF3A31' }]}
        >
          <Entypo name="thumbs-down" size={24} color={iconColor} />
        </Pressable>
        <Pressable
          onPress={() => console.log('Thumbs up:', item.id)}
          style={[styles.actionButton, styles.leftActionButton, { backgroundColor: '#54B583' }]}
        >
          <Entypo name="thumbs-up" size={24} color={iconColor} />
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
          onPress={handleSave}
          style={[styles.actionButton, styles.rightActionButton, { backgroundColor: '#FF9502' }]}
        >
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
}; 