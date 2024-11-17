import React from 'react';
import { Pressable, View, Image, Text } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { styles } from '@/styles/components/newsItem';
import { LinearGradient } from 'expo-linear-gradient';
import { NewsLogo } from '@/components/NewsLogo';

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
  is_news_plus: boolean;
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

            {item.is_news_plus && (
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'transparent']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.5, y: 0 }}
                style={[styles.newsPlusOverlay, { flexDirection: 'row' }]}
              >
                <NewsLogo size={16} color="#F92B53" />
              </LinearGradient>
            )}

            
            
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
      {item.is_news_plus && (
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'transparent']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.5, y: 0 }}
                style={[styles.newsPlusOverlay, { flexDirection: 'row' , position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1 }]}
              >
                <NewsLogo size={16} color="#F92B53" />
              </LinearGradient>
            )}

        <ThemedView style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : '#000' }]}>
          <View style={[styles.mediumContent, { marginTop: 10}]}>
            <Image
              source={{ uri: colorScheme === 'light' ? item.source.logo_transparent_light : item.source.logo_transparent_dark }}
              style={[styles.sourceLogo, { width: 70, height: 14 }]}
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