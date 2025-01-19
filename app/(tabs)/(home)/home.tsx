import { Text, Image, View, Pressable } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SwipeListView, RowMap } from 'react-native-swipe-list-view';
import { useState, useRef } from 'react';
import Animated, { 
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ListRenderItemInfo } from '@shopify/flash-list';

import { news } from '@/data/news.json';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NewsLogo } from '@/components/NewsLogo';
import { formatSimpleDate } from '@/utils/dateFormatters';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import { SwipeableNewsItem } from '@/components/SwipeableNewsItem';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';

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
  const currentGroup = segments[1];
  const iconColor = '#fff';
  const insets = useSafeAreaInsets();

  const lastScrollY = useSharedValue(0);
  const translationY = useSharedValue(-40);

  const AnimatedSwipeListView = Animated.createAnimatedComponent(SwipeListView);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      
      if (currentScrollY > 90) {
        if (currentScrollY > lastScrollY.value) {
          translationY.value = withTiming(0, {
            duration: 300
          });
        } else {
          translationY.value = withTiming(insets.top, {
            duration: 300
          });
        }
      } else {
        translationY.value = withTiming(0, {
          duration: 300
        });
      }
      
      lastScrollY.value = currentScrollY;
    }
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translationY.value }],
    };
  });

  const renderNewsItem = (data: { item: NewsItemType }) => (
    <NewsItem item={data.item} />
  );

  const renderHiddenItem = (data: { item: NewsItemType }, rowMap: RowMap<NewsItemType>) => (
    <SwipeableNewsItem item={data.item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-[#0D0D09]">
      <Animated.View 
        className="absolute top-0 left-0 right-0 z-50 bg-gray-100 dark:bg-[#0D0D09]"
        style={headerAnimatedStyle}
      >
        <NewsHeaderLeftItem size="sm" />
      </Animated.View>
      
      <View className="flex-1 bg-gray-100 dark:bg-[#0D0D09]">
        <AnimatedSwipeListView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          data={news as NewsItemType[]}
          renderItem={renderNewsItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={120}
          rightOpenValue={-120}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={
            <>
              <View className="flex-row items-center justify-between mb-6">
                <NewsHeaderLeftItem size="md" />
                <View>
                  <Image 
                    source={{ 
                      uri: colorScheme === 'light' 
                        ? 'https://i.imgur.com/EfImlCx.png' 
                        : 'https://i.imgur.com/bMJtV6x.png' 
                    }} 
                    className="w-8 h-8"
                  />
                </View>
              </View>
              <View className="mb-4">
                <Text className="text-2xl font-bold text-black dark:text-white">Top Stories</Text>
              </View>
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
}

