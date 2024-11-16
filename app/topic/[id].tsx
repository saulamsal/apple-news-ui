import { View, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { news } from '@/data/news.json';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TopicScreen() {
  const { id } = useLocalSearchParams();
  
  const topicNews = news.filter(item => item.topic.id === id);
  const topic = topicNews[0]?.topic;

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title" style={{ fontSize: 24, marginBottom: 16 }}>
        {topic?.name} News
      </ThemedText>
      <FlatList 
        data={topicNews}
        renderItem={({ item }) => (
          <ThemedText style={{ marginBottom: 12 }}>{item.title}</ThemedText>
        )}
        keyExtractor={item => item.id}
      />
    </ThemedView>
  );
} 