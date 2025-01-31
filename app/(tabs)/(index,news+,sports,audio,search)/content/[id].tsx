import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, useWindowDimensions, Platform } from 'react-native';
import { TabView, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import { news } from '@/data/news.json';
import { ContentView } from './_components/ContentView';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { StatusBar } from 'react-native';

type Route = {
  key: string;
  title: string;
  index: number;
};

export default function ContentScreen() {
  const { id } = useLocalSearchParams();
  const layout = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(() => news.findIndex(item => item.id === id));
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeout = useRef<NodeJS.Timeout>();

  const routes = useMemo(() => {
    const currentNewsIndex = news.findIndex(item => item.id === id);
    const maxTabs = 5;
    let tabsToShow: Route[] = [];

    // Calculate how many items we can show before and after
    const totalItems = news.length;
    const itemsBeforeCurrent = currentNewsIndex;
    const itemsAfterCurrent = totalItems - currentNewsIndex - 1;

    // First determine how many items we can show on each side
    let itemsBefore = Math.min(2, itemsBeforeCurrent);
    let itemsAfter = Math.min(2, itemsAfterCurrent);

    // If we're at the start, show more items after
    if (currentNewsIndex === 0) {
      itemsAfter = Math.min(4, itemsAfterCurrent);
    } 
    // If we're at the end, show more items before
    else if (currentNewsIndex === totalItems - 1) {
      itemsBefore = Math.min(4, itemsBeforeCurrent);
    }
    // Otherwise balance if one side has less than 2 items
    else {
      const remainingSlots = maxTabs - itemsBefore - itemsAfter - 1; // -1 for current
      if (itemsBefore < 2 && itemsAfter > 2) {
        itemsAfter = Math.min(itemsAfter + remainingSlots, itemsAfterCurrent);
      } else if (itemsAfter < 2 && itemsBefore > 2) {
        itemsBefore = Math.min(itemsBefore + remainingSlots, itemsBeforeCurrent);
      }
    }

    // Add previous items
    for (let i = itemsBefore; i > 0; i--) {
      tabsToShow.push({
        key: `prev${i}`,
        title: `Previous ${i}`,
        index: currentNewsIndex - i
      });
    }

    // Add current item
    tabsToShow.push({
      key: 'current',
      title: 'Current',
      index: currentNewsIndex
    });

    // Add next items
    for (let i = 1; i <= itemsAfter; i++) {
      tabsToShow.push({
        key: `next${i}`,
        title: `Next ${i}`,
        index: currentNewsIndex + i
      });
    }

    return tabsToShow;
  }, [id]);

  const [index, setIndex] = useState(() => {
    // Find the index of the 'current' route
    return routes.findIndex(route => route.key === 'current');
  });

  useEffect(() => {
    const newIndex = news.findIndex(item => item.id === id);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      if (!isNavigating) {
        setIndex(routes.findIndex(route => route.key === 'current'));
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

  const renderScene = useCallback(({ route }: { route: Route }) => {
    const content = news[route.index];
    return content ? <ContentView content={content} /> : <View style={{ flex: 1 }} />;
  }, []);

  const handleIndexChange = useCallback((newIndex: number) => {
    const targetRoute = routes[newIndex];
    if (!targetRoute) {
      setIndex(routes.findIndex(route => route.key === 'current'));
      return;
    }

    setIndex(newIndex);
    const targetContent = news[targetRoute.index];
    
    if (targetContent && targetRoute.key !== 'current') {
      setIsNavigating(true);
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
      
      navigationTimeout.current = setTimeout(() => {
        window?.history?.pushState({}, '', `/content/${targetContent.id}`);
        setIsNavigating(false);
      }, 250);
    }
  }, [routes]);

  if (!news[currentIndex]) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Content not found</Text>
      </View>
    );
  }

  const canSwipe = !isNavigating;

  if(Platform.OS === 'web') {
    window?.scrollTo({ top: 0, behavior: 'smooth' });
    return <ContentView content={news[currentIndex]} />;
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={() => null}
      onIndexChange={handleIndexChange}
      style={{ backgroundColor: 'transparent', position: 'relative' }}
      swipeEnabled={canSwipe}
    />
  );
} 