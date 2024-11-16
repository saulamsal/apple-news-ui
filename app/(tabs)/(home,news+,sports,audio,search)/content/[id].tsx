import { useLocalSearchParams } from 'expo-router';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { news } from '@/data/news.json';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function ContentScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  
  // Find the news item from data.json
  const content = news.find(item => item.id === id);

  if (!content) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Content not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <Image 
          source={{ uri: content.featured_image }} 
          style={styles.featuredImage} 
        />
        
        <View style={styles.content}>
          <Image 
            source={{ 
              uri: colorScheme === 'light' 
                ? content.source.logo_transparent_light 
                : content.source.logo_transparent_dark 
            }}
            style={styles.sourceLogo}
          />
          
          <ThemedText type="title" style={styles.title}>
            {content.title}
          </ThemedText>

          {content.show_topic && (
            <View style={styles.topicContainer}>
              <ThemedText style={styles.topic}>
                {content.topic.name}
              </ThemedText>
            </View>
          )}

          <View style={styles.authorContainer}>
            <ThemedText style={styles.author}>
              By {content.author.name}
            </ThemedText>
            <ThemedText style={styles.date}>
              {new Date(content.created_at).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  featuredImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  sourceLogo: {
    height: 24,
    width: 120,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  topicContainer: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  topic: {
    fontSize: 14,
    color: '#666',
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
}); 