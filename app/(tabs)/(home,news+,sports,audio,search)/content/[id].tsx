import { useLocalSearchParams, router } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { news } from '@/data/news.json';
import { ContentView } from './_components/ContentView';
import { useState, useCallback } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function ContentScreen() {
  const { id } = useLocalSearchParams();
  const layout = useWindowDimensions();
  
  const currentIndex = news.findIndex(item => item.id === id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < news.length - 1;
  
  const prevContent = hasPrevious ? news[currentIndex - 1] : null;
  const nextContent = hasNext ? news[currentIndex + 1] : null;
  const currentContent = news[currentIndex];

  const [routes] = useState([
    { key: 'prev', title: 'Previous' },
    { key: 'current', title: 'Current' },
    { key: 'next', title: 'Next' },
  ]);

  const [index, setIndex] = useState(1);

  const renderScene = useCallback(({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'prev':
        return prevContent ? <ContentView content={prevContent} /> : <View />;
      case 'current':
        return <ContentView content={currentContent} />;
      case 'next':
        return nextContent ? <ContentView content={nextContent} /> : <View />;
      default:
        return null;
    }
  }, [prevContent, currentContent, nextContent]);

  const handleIndexChange = useCallback((newIndex: number) => {
    // Only allow navigation if content exists
    if ((newIndex === 0 && !hasPrevious) || (newIndex === 2 && !hasNext)) {
      setIndex(1);
      return;
    }

    setIndex(newIndex);

    // Update URL after a short delay to allow animation to complete
    if (newIndex !== 1) {
      setTimeout(() => {
        if (newIndex === 0 && prevContent) {
          router.setParams({ id: prevContent.id });
        } else if (newIndex === 2 && nextContent) {
          router.setParams({ id: nextContent.id });
        }
        setIndex(1);
      }, 150); // Adjust timing as needed
    }
  }, [prevContent, nextContent, hasPrevious, hasNext]);

  if (!currentContent) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <ThemedText>Content not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={() => null}
      onIndexChange={handleIndexChange}
      initialLayout={{ width: layout.width }}
      swipeEnabled={true}
      style={{ backgroundColor: 'transparent' }}
    />
  );
} 