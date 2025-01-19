import { View, FlatList, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { news } from '@/data/news.json';

export default function TopicScreen() {
  const { id } = useLocalSearchParams();
  
  const topicNews = news.filter(item => item.topic.id === id);
  const topic = topicNews[0]?.topic;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        {topic?.name} News
      </Text>
      <FlatList 
        data={topicNews}
        renderItem={({ item }) => (
          <Text style={{ marginBottom: 12 }}>{item.title}</Text>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
} 