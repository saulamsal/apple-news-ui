import { Text, Image, View, Pressable, TouchableOpacity, ListRenderItemInfo, RefreshControl, Platform } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SwipeListView, RowMap } from 'react-native-swipe-list-view';
import { useState, useRef, useEffect } from 'react';
import { MotiView } from 'moti';
import Animated, { 
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';
import SlidingBanner from '@/components/SlidingBanner';
import { ExtensionStorage } from "@bacons/apple-targets";
import DefaultPreference from '@/helper/defaultpreferences';
import Head from 'expo-router/head';

import { news } from '@/data/news.json';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NewsLogo } from '@/components/NewsLogo';
import { formatSimpleDate } from '@/src/utils/dateFormatters';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import { SwipeableNewsItem } from '@/components/SwipeableNewsItem';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import { WelcomeModal } from '@/components/WelcomeModal';
// import Constants from 'expo-constants';

// import {  StatusBar } from 'react-native';

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

// Initialize DefaultPreference with app group
DefaultPreference.setName("group.com.sportapp.anews-ui");

const storage = new ExtensionStorage("group.com.sportapp.anews-ui");

const updateWidget = (newsItem: NewsItemType) => {
  if (process.env.EXPO_PUBLIC_OS === "ios") {
    try {
      const widgetData = {
        title: newsItem.title,
        source: newsItem.source.name,
        sourceLogo: newsItem.source.logo_transparent_light,
        imageUrl: newsItem.featured_image,
        isNewsPlus: newsItem.is_news_plus ? 1 : 0
      };
      
      console.log('🔄 Updating widget with data:', widgetData);
      
      // Convert to JSON string before storing
      const jsonString = JSON.stringify(widgetData);
      storage.set("latestNews", jsonString);
      console.log('✅ Successfully stored widget data:', jsonString);
      
      // Reload widget
      ExtensionStorage.reloadWidget("NewsWidget");
      console.log('🔄 Widget reload requested');
    } catch (error) {
      console.error('❌ Widget update failed:', error);
    }
  }
};

const DonateButton = () => {
  const handlePress = async () => {
    await WebBrowser.openBrowserAsync('https://www.redcross.org/donate/donation.html/?srsltid=AfmBOopZTMT9_IdjjuwecAUYsN-M3-gtet6sYrp1cwGN3jg4DTghMeXn', {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: '#E31837',
      toolbarColor: '#ffffff'
    });
  };

  return (
    <View className="px-4">
      <SlidingBanner
        onPress={handlePress}
        image={{
        uri: 'https://pbs.twimg.com/profile_images/1542533870008016899/HtPYMRjs_400x400.jpg',
        style: { borderRadius: 14 }
        }}
        title="Southern California wildfires"
        subtitle="Donate to the American Red Cross"
        backgroundColor="#F58A1F"
      />
    </View>
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

  const renderNewsItem = (rowData: ListRenderItemInfo<NewsItemType>) => {
    if (rowData.index === 0) {
      // console.log('Updating widget with first news item:', rowData.item);
      void updateWidget(rowData.item);
    }
    return <NewsItem item={rowData.item} />;
  };

  const renderHiddenItem = (rowData: ListRenderItemInfo<NewsItemType>, rowMap: RowMap<NewsItemType>) => (
    <SwipeableNewsItem item={rowData.item} />
  );

  return (
    <>
      {Platform.OS !== 'android' && <WelcomeModal />}
      { Platform.OS === 'web' && (
        <Head>
          <title>Apple News UI - Latest News & Updates</title>
          <meta name="description" content="Stay updated with the latest news, trending stories, and personalized content from trusted sources." />
          <meta name="keywords" content="apple news, news app, latest news, trending stories" />

          <meta property="og:title" content="Apple News UI - Find News & Topics" />
          <meta property="og:description" content="Search through millions of articles, topics, and trusted sources to find the news that matters to you." />
          <meta property="og:image" content="../assets/images/featured.png" />
          <meta property="og:url" content="https://apple-news.expo.app/audio" />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Apple News UI - Find News & Topics" />
          <meta name="twitter:description" content="Search through millions of articles, topics, and trusted sources to find the news that matters to you." />
          <meta name="twitter:image" content="../assets/images/featured.png" />


        </Head>
      )}
        <Animated.View 
          className="absolute -top-8 left-0 right-0 z-50 bg-gray-100 px-5"
          style={[headerAnimatedStyle, { paddingTop: insets.top + 10, paddingBottom: 14 }]}
        >
          <NewsHeaderLeftItem size="sm" />
        </Animated.View>
        
        <View className="flex-1 " >
          <AnimatedSwipeListView
            onScroll={Platform.OS === 'web' ? undefined : scrollHandler}
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
            bounces={false}
            style={
            
               
              Platform.OS === 'web' ? {
              height: undefined,
              overflow: 'visible'
            } :  {}}
            scrollEnabled={Platform.OS !== 'web'}
            contentContainerStyle={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom + 60,
                backgroundColor: Platform.OS !== 'web' ? '#F2F2F7' : 'white',
                ...(Platform.OS === 'web' ? {
                    height: undefined,
                    flex: 'unset!important',
                    overflow: 'unset!important',
                } : {})
            }}
            ListHeaderComponent={
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-6 px-5">
                  <NewsHeaderLeftItem size="md" 
                  // secondaryTitle
                   />
                  <View>
                    <Image 
                      source={{ uri: 'https://i.imgur.com/EfImlCx.png' }} 
                      className="w-16 h-16 mt-2"
                    />
                  </View>
                </View>
                <DonateButton />
                <View className="mb-4 px-5">
                  <Text className="text-3xl font-extrabold text-apple-news tracking-tighter  mt-4">Top Stories</Text>
                </View>
              </View>
            }
          />
        </View>

    </>
  );
}

