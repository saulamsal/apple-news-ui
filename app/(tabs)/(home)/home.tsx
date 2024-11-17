import { Text, Image, View, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { news } from '@/data/news.json';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NewsLogo } from '@/components/NewsLogo';
import { formatSimpleDate } from '@/utils/dateFormatters';
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

interface Author {
  name: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: Source;
  created_at: string;
  topic: Topic;
  show_topic: boolean;
  author: Author;
  featured_image: string;
  card_type: 'full' | 'medium';
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const segments = useSegments();
  
  // Get the current group (tab) from segments
  const currentGroup = segments[1]; // Should return 'index', 'news+', 'sports', etc.

  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    // Fix the href typing by making it more specific
    const href = {
      pathname: '/topic/[id]' as const,
      params: { id: item.id }
    };

    if (item.card_type === 'full') {
      return (
        <Link href={href} asChild>
          <Pressable>
            <ThemedView style={styles.card}>
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
            </ThemedView>
          </Pressable>
        </Link>
      );
    }

    return (
      <Link href={href} asChild>
        <Pressable>
          <ThemedView style={styles.card}>
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
          </ThemedView>
        </Pressable>
      </Link>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#F2F2F6' : '#0D0D09' }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <NewsLogo
            color={colorScheme === 'light' ? '#000' : '#fff'}
            size={36}
          />
          <ThemedText style={styles.headerDate}>
            {formatSimpleDate()}
          </ThemedText>
        </View>
      </View>
      
      <FlatList<NewsItem>
        data={news as NewsItem[]}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<View style={styles.listHeader}><Text style={styles.listHeaderText}>Top Stories</Text></View>}
      />
    </ThemedView>
  );
}

