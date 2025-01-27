import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, useWindowDimensions } from 'react-native';
import { TabView, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import { news } from '@/data/news.json';
import { ContentView } from './_components/ContentView';
import { useState, useCallback, useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';

type Route = {
  key: string;
  title: string;
};

export default function ContentScreen() {
  const { id } = useLocalSearchParams();
  const layout = useWindowDimensions();
  
  const [currentIndex, setCurrentIndex] = useState(() => news.findIndex(item => item.id === id));
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeout = useRef<NodeJS.Timeout>();
  
  const [routes] = useState<Route[]>([
    { key: 'prev', title: 'Previous' },
    { key: 'current', title: 'Current' },
    { key: 'next', title: 'Next' },
  ]);

  const [index, setIndex] = useState(1);

  useEffect(() => {
    const newIndex = news.findIndex(item => item.id === id);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      if (!isNavigating) {
        setIndex(1);
      }
    }
  }, [id]);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
  }, []);

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < news.length - 1;
  
  const prevContent = hasPrevious ? news[currentIndex - 1] : null;
  const currentContent = news[currentIndex];
  const nextContent = hasNext ? news[currentIndex + 1] : null;

  const renderScene = useCallback(({ route }: { route: Route }) => {
    switch (route.key) {
      case 'prev':
        return prevContent ? <ContentView content={prevContent} /> : <View style={{ flex: 1 }} />;
      case 'current':
        return currentContent ? <ContentView content={currentContent} /> : <View style={{ flex: 1 }} />;
      case 'next':
        return nextContent ? <ContentView content={nextContent} /> : <View style={{ flex: 1 }} />;
      default:
        return <View style={{ flex: 1 }} />;
    }
  }, [prevContent, currentContent, nextContent]);



    const handleIndexChange = useCallback((newIndex: number) => {
    if ((newIndex === 0 && !prevContent) || (newIndex === 2 && !nextContent)) {
      setIndex(1);
      return;
    }

    setIndex(newIndex);
    if ((newIndex === 0 && prevContent) || (newIndex === 2 && nextContent)) {
      setIsNavigating(true);
      if (navigationTimeout.current) {
        // clearTimeout(navigationTimeout.current);
      }
      
      const targetId = newIndex === 0 && prevContent ? prevContent.id : nextContent?.id;
      if (targetId) {
        navigationTimeout.current = setTimeout(() => {
          //Hack for Web
          window?.history?.pushState({}, '', `/content/${targetId}`);
          setIsNavigating(false);
        }, 250);
      }
    }
  }, [prevContent, nextContent]);

  

  if (!currentContent) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Content not found</Text>
      </View>
    );
  }

  const canSwipe = !isNavigating && (
    (index === 0 && Boolean(prevContent)) || 
    index === 1 || 
    (index === 2 && Boolean(nextContent))
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={() => null}
      onIndexChange={handleIndexChange}

      style={{ backgroundColor: 'transparent' }}
      swipeEnabled={canSwipe}
    />
  );
} 