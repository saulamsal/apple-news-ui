import { Text, Image, View, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { news } from '@/data/news.json';
import { useColorScheme } from '@/hooks/useColorScheme';

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
    // Create the href that maintains the current group context
    const href = {
      pathname: `/${currentGroup}/content/[id]`,
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
        <ThemedText style={styles.headerTitle}>Sports</ThemedText>
        <MaterialIcons 
          name="menu" 
          size={24} 
          color={colorScheme === 'light' ? '#000' : '#fff'} 
        />
      </View>
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
  },
  fullImage: {
    width: '100%',
    height: 240,
  },
  mediumContent: {
    flex: 1,
    padding: 16,
    paddingRight: 120,
  },
  mediumImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    position: 'absolute',
    right: 16,
    top: 16,
  },
  sourceLogo: {
    height: 24,
    width: 120,
    resizeMode: 'contain',
    marginBottom: 8,
    marginTop: 8,
    marginLeft:-10
  },
  newsTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    marginVertical: 8,
    letterSpacing: -0.8,
  },
  newsTitleFull: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -1,
  },
  topicButton: {
    backgroundColor: '#f2f2f2',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,

  },
  topicText: {
    fontSize: 15,
    color: '#666',
  },
  moreIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 8,
  },
  moreContainer: {
    paddingHorizontal: 8,
    // backgroundColor: 'blue',
  },
  fullCardContent: {
    paddingHorizontal: 16,
    // backgroundColor: 'red',
  },
});
