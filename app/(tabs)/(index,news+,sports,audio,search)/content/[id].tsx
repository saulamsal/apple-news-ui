import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { news } from '@/data/news.json';
import { ContentView } from './_components/ContentView';
import { useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'react-native';

export default function ContentScreen() {
  const { id } = useLocalSearchParams();
  const layout = useWindowDimensions();
  
  const [currentIndex, setCurrentIndex] = useState(() => news.findIndex(item => item.id === id));
  
  useEffect(() => {
    const newIndex = news.findIndex(item => item.id === id);
    setCurrentIndex(newIndex);
    setIndex(1); // Reset to middle tab
  }, [id]);

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

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

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
    if ((newIndex === 0 && !hasPrevious) || (newIndex === 2 && !hasNext)) {
      return;
    }

    setIndex(newIndex);

    if (newIndex === 0 && prevContent) {
      router.setParams({ id: prevContent.id });
    } else if (newIndex === 2 && nextContent) {
      router.setParams({ id: nextContent.id });
    }
  }, [prevContent, nextContent, hasPrevious, hasNext]);

  if (!currentContent) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Content not found</Text>
      </View>
    );
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={() => null}
      onIndexChange={handleIndexChange}
      initialLayout={{ width: layout.width }}
      style={{ backgroundColor: 'transparent' }}
    />
  );
} 