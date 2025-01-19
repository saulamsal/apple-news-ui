import { Text, Image, View, Pressable, TouchableOpacity, ListRenderItemInfo } from 'react-native';
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
import * as WebBrowser from 'expo-web-browser';
import { SlidingBanner } from '@/components/SlidingBanner';

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

const DonateButton = () => {
  const handlePress = async () => {
    await WebBrowser.openBrowserAsync('https://www.redcross.org/donate/donation.html/?srsltid=AfmBOopZTMT9_IdjjuwecAUYsN-M3-gtet6sYrp1cwGN3jg4DTghMeXn', {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: '#E31837',
      toolbarColor: '#ffffff'
    });
  };

  return (
    <SlidingBanner
      onPress={handlePress}
      image={{
        uri: 'https://pbs.twimg.com/profile_images/1542533870008016899/HtPYMRjs_400x400.jpg',
        style: { borderRadius: 14 }
      }}
      title="Southern California wildfires"
      subtitle="Donate to the American Red Cross"
      backgroundColor="#E31837"
    />
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const currentGroup = segments[1];
  const iconColor = '#fff';
  const insets = useSafeAreaInsets();

  const lastScrollY = useSharedValue(0);
  const translationY = useSharedValue(-100);

  const AnimatedSwipeListView = Animated.createAnimatedComponent(SwipeListView);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const scrollDiff = currentScrollY - lastScrollY.value;
      
      if (currentScrollY > 100) {
        if (scrollDiff < -20) {
          translationY.value = withTiming(0, {
            duration: 300
          });
        } else if (scrollDiff > 10) {
          translationY.value = withTiming(-100, {
            duration: 300
          });
        }
      } else {
        translationY.value = withTiming(-100, {
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

  const renderNewsItem = ({ item }: { item: NewsItemType }) => (
    <NewsItem item={item} />
  );

  const renderHiddenItem = ({ item }: { item: NewsItemType }, rowMap: RowMap<NewsItemType>) => (
    <SwipeableNewsItem item={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" >
      <Animated.View 
        className="absolute -top-4 left-0 right-0 z-50 bg-gray-100 px-5"
        style={[headerAnimatedStyle, { paddingTop: insets.top, paddingBottom: 10 }]}
      >
        <NewsHeaderLeftItem size="sm" />
      </Animated.View>
      
      <View className="flex-1 bg-gray-100" >
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
          contentContainerStyle={{ 
            // padding: 16, 
            // backgroundColor: 'red',

            // marginTop: insets.top

           }}
          ListHeaderComponent={
            <>
              <View className="flex-row items-center justify-between mb-6 px-5">
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
              <View className="mb-4 px-5">
                <Text className="text-2xl font-bold text-black">Top Stories</Text>
              </View>
              <DonateButton />
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
}

