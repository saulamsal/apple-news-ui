import { Text, Image, View, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

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

  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    if (item.card_type === 'full') {
      return (
        <Pressable
          onPress={() => router.push(`/news/${item.id}`)}
          style={styles.fullSizeCard}
        >
          <Image source={{ uri: item.featured_image }} style={styles.fullImage} />
          <ThemedView style={styles.newsContent}>
            <Image 
              source={{ uri: colorScheme === 'light' ? item.source.logo_transparent_light : item.source.logo_transparent_dark }}
              style={styles.sourceLogo}
            />
            <ThemedText type="title" style={styles.newsTitle}>
              {item.title}
            </ThemedText>
            {item.show_topic && (
              <Pressable 
                style={styles.topicButton}
                onPress={() => router.push(`/topic/${item.topic.id}`)}
              >
                <ThemedText type="subtitle">More {item.topic.name} coverage</ThemedText>
              </Pressable>
            )}
          </ThemedView>
        </Pressable>
      );
    }

    return (
      <Pressable
        onPress={() => router.push(`/news/${item.id}`)}
        style={styles.mediumCard}
      >
        <ThemedView style={styles.mediumContent}>
          <Image 
            source={{ uri: colorScheme === 'light' ? item.source.logo_transparent_light : item.source.logo_transparent_dark }}
            style={styles.sourceLogo}
          />
          <ThemedText type="title" style={styles.newsTitle}>
            {item.title}
          </ThemedText>
          {item.show_topic && (
            <Pressable 
              style={styles.topicButton}
              onPress={() => router.push(`/topic/${item.topic.id}`)}
            >
              <ThemedText type="subtitle">More {item.topic.name} coverage</ThemedText>
            </Pressable>
          )}
        </ThemedView>
        <Image source={{ uri: item.featured_image }} style={styles.mediumImage} />
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
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
  listContent: {
    padding: 16,
    gap: 20,
  },
  fullSizeCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  fullImage: {
    width: '100%',
    height: 200,
  },
  mediumCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mediumContent: {
    flex: 1,
    padding: 16,
  },
  mediumImage: {
    width: 120,
    height: '100%',
  },
  newsContent: {
    padding: 16,
  },
  sourceLogo: {
    height: 24,
    width: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  newsTitle: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 12,
  },
  topicButton: {
    paddingVertical: 8,
  },
});
