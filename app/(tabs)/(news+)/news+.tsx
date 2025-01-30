import { Text, Image, View, Pressable, Platform } from 'react-native';
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
import { ListRenderItemInfo } from 'react-native';
import Head from 'expo-router/head';

import { news } from '@/data/news.json';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NewsLogo } from '@/components/NewsLogo';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import { SwipeableNewsItem } from '@/components/SwipeableNewsItem';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import { TabMenu } from '@/components/TabMenu';

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

const TABS = [
  { id: 'best', label: 'Best of News+', icon: 'heart' },
  { id: 'magazines', label: 'My Magazines', icon: 'book' },
  { id: 'downloaded', label: 'Downloaded', icon: 'download' },
  { id: 'newspapers', label: 'Newspapers', icon: 'newspaper' },
  { id: 'catalog', label: 'Catalog', icon: 'list' },
];

export default function NewsPlusScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const currentGroup = segments[1];
  const iconColor = '#fff';
  const insets = useSafeAreaInsets();

  const AnimatedSwipeListView = Animated.createAnimatedComponent(SwipeListView);
  const [activeTab, setActiveTab] = useState('best');

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderNewsItem = (data: { item: NewsItemType }) => (
    <NewsItem item={data.item} />
  );

  const renderHiddenItem = (data: { item: NewsItemType }, rowMap: RowMap<NewsItemType>) => (
    <SwipeableNewsItem item={data.item} />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'best':
        return (
          <AnimatedSwipeListView
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
     
                style={
               
              Platform.OS === 'web' ? {
              height: undefined,
              overflow: 'visible'
            } : undefined}
            scrollEnabled={Platform.OS !== 'web'}
            contentContainerStyle={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom + 60,
                backgroundColor: Platform.OS !== 'web' ? '#F2F2F7' : 'white',
                ...(Platform.OS === 'web' ? {
                    height: undefined
                } : {})
            }}


            ListHeaderComponent={
              <View className="space-y-4">
                <View className="flex-row items-center justify-between  px-5">
                  <NewsHeaderLeftItem size="md" secondaryTitle="Discover" />
                  <View>
                    <Image 
                      source={{uri: 'https://i.imgur.com/EfImlCx.png' }} 
                      className="w-12 h-12"
                    />
                  </View>
                </View>
                
                <TabMenu 
                  tabs={TABS}
                  activeTab={activeTab}
                  onTabPress={handleTabPress}
                />

                <View className="py-6 px-5">
                  <Text className="text-2xl font-extrabold text-black">For You</Text>
                  <Text className="text-md text-gray-500">
                    News+ recommends based on what you read.
                  </Text>
                </View>
              </View>
            }
          />
        );
      case 'magazines':
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-gray-600">My Magazines Content</Text>
          </View>
        );
      case 'downloaded':
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-gray-600">Downloaded Content</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
    { Platform.OS === 'web' && (  
      <Head>
        <title>Apple News+ - Premium News & Magazine Content</title>
        <meta name="description" content="Access premium news articles, magazines, and exclusive content with Apple News+" />
        <meta name="keywords" content="apple news plus, premium news, digital magazines, exclusive content" />
      </Head>
      )}
          {renderContent()}
  
    </>
  );
}

