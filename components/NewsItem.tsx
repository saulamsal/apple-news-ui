import React from 'react';
import { Pressable, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { styles } from '@/styles/screens/home';

interface Source {
  id: string;
  name: string;
  logo_transparent_light: string;
  logo_transparent_dark: string;
}

interface Topic {
  id: string;
  name: string;
}

export interface NewsItemType {
  id: string;
  title: string;
  source: Source;
  topic: Topic;
  show_topic: boolean;
  featured_image: string;
  card_type: 'full' | 'medium';
}

interface NewsItemProps {
  item: NewsItemType;
}

export const NewsItem = ({ item }: NewsItemProps) => {
  const colorScheme = useColorScheme();
  
  const href = {
    pathname: '/topic/[id]' as const,
    params: { id: item.id }
  };

  if (item.card_type === 'full') {
    return (
      <Link href={href} asChild>
        <Pressable>
          <ThemedView style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : '#000' }]}>
            <Image source={{ uri: item.featured_image }} style={styles.fullImage} />
            <View style={styles.fullCardContent}>
              <Image
                source={{ uri: colorScheme === 'light' ? item.source.logo_transparent_light : item.source.logo_transparent_dark }}
                style={styles.sourceLogo}
              />
              <ThemedText type="title" style={[styles.newsTitle, styles.newsTitleFull]}>
                {item.title}
              </ThemedText>
            </View>
            <NewsItemActions item={item} />
          </ThemedView>
        </Pressable>
      </Link>
    );
  }

  return (
    <Link href={href} asChild>
      <Pressable>
        <ThemedView style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : '#000' }]}>
          <View style={styles.mediumContent}>
            <Image
              source={{ uri: colorScheme === 'light' ? item.source.logo_transparent_light : item.source.logo_transparent_dark }}
              style={styles.sourceLogo}
            />
            <ThemedText type="title" style={styles.newsTitle}>
              {item.title}
            </ThemedText>
            <Image source={{ uri: item.featured_image }} style={styles.mediumImage} />
          </View>
          <NewsItemActions item={item} />
        </ThemedView>
      </Pressable>
    </Link>
  );
};

const NewsItemActions = ({ item }: { item: NewsItemType }) => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.moreContainer}>
      {item.show_topic && (
        <Pressable style={styles.topicButton} onPress={(e) => e.stopPropagation()}>
          <ThemedText type="subtitle" style={styles.topicText}>
            More {item.topic.name} coverage
          </ThemedText>
        </Pressable>
      )}
      <MaterialIcons
        name="more-horiz"
        size={24}
        color={colorScheme === 'light' ? '#000' : '#fff'}
        style={styles.moreIcon}
      />
    </View>
  );
}; 