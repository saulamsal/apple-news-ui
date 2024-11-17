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

  const [isAnimating, setIsAnimating] = useState(false);

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
      return;
    }

    if (isAnimating) return;
    setIsAnimating(true);

    // Wait for animation to complete before updating URL
    setTimeout(() => {
      if (newIndex === 0 && prevContent) {
        router.setParams({ id: prevContent.id });
      } else if (newIndex === 2 && nextContent) {
        router.setParams({ id: nextContent.id });
      }
      setIsAnimating(false);
    }, 300); // Adjust timing to match swipe animation duration
  }, [prevContent, nextContent, hasPrevious, hasNext, isAnimating]);

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
      swipeEnabled={!isAnimating}  // Disable swipe while animating
      style={{ backgroundColor: 'transparent' }}
    />
  );
} 