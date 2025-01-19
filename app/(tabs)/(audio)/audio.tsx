import { Text, Image, View, StyleSheet, Pressable, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useState, useRef } from 'react';
import Animated, { 
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SlidingBanner } from '@/components/SlidingBanner';
import { MotiView } from 'moti';

import { news } from '@/data/news.json';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NewsLogo } from '@/components/NewsLogo';
import { styles } from '@/styles/screens/audio';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import { SwipeableNewsItem } from '@/components/SwipeableNewsItem';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import { TabMenu } from '@/components/TabMenu';
import { Colors } from '@/constants/Colors';
import { PodcastItem } from '@/components/PodcastItem';
import { PodcastEpisode } from '@/types/podcast';
import podcasts from '@/data/podcasts.json';
import type { ListRenderItemInfo } from '@shopify/flash-list';
import { useAudio } from '@/contexts/AudioContext';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { PodcastEditorsPickItem } from '@/components/PodcastEditorsPickItem';

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

interface PodcastEpisodeData {
  id: string;
  type: string;
  attributes: {
    name: string;
    itunesTitle: string;
    kind: string;
    description: {
      standard: string;
      short: string;
    };
    artwork: {
      url: string;
      width: number;
      height: number;
    };
    durationInMilliseconds: number;
    releaseDateTime: string;
    assetUrl: string;
    artistName: string;
  };
}

const TABS = [
  { id: 'best', label: 'Best of News+', icon: 'heart' },
  { id: 'magazines', label: 'My Magazines', icon: 'book' },
  { id: 'downloaded', label: 'Downloaded', icon: 'download' },
  { id: 'newspapers', label: 'Newspapers', icon: 'newspaper' },
  { id: 'catalog', label: 'Catalog', icon: 'list' },
];

const DiscoverNewsButton = () => {
  return (
    <SlidingBanner
      onPress={() => Alert.alert('Take to Apple Podcasts')}
      icon={{
        name: 'headset',
        size: 24,
      }}
      title="Discover News+ Narrated"
      subtitle="More audio stories in Apple Podcasts"
      backgroundColor="#2196A5"
    />
  );
};

export default function AudioScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const segments = useSegments();

  // Get the current group (tab) from segments
  const currentGroup = segments[1]; // Should return 'index', 'news+', 'sports', etc.

  // const iconColor = colorScheme === 'light' ? '#000' : '#fff';
  const iconColor = '#fff';

  const backgroundColor = colorScheme === 'light' ? '#F2F2F6' : '#1C1C1E';
  const insets = useSafeAreaInsets();

  const AnimatedSwipeListView = Animated.createAnimatedComponent(SwipeListView);

  const [activeTab, setActiveTab] = useState('best');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  const { currentEpisode, playEpisode, isPlaying, togglePlayPause } = useAudio();
  
  const handlePlayAll = () => {
    const firstEpisode = podcasts.results['podcast-episodes'][0].data[0] as PodcastEpisodeData;
    
    if (firstEpisode) {
      const imageUrl = firstEpisode.attributes.artwork?.url?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') || 'https://via.placeholder.com/300';

      const podcast: PodcastEpisode = {
        id: firstEpisode.id,
        title: firstEpisode.attributes.name,
        streamUrl: firstEpisode.attributes.assetUrl,
        artwork: { url: imageUrl },
        showTitle: firstEpisode.attributes.artistName,
        duration: firstEpisode.attributes.durationInMilliseconds,
        releaseDate: firstEpisode.attributes.releaseDateTime,
        summary: firstEpisode.attributes.description.standard
      };

      playEpisode(podcast);
      router.push(`/audio/${firstEpisode.id}`);
    }
  };

  const renderPodcastItem = ({ item, index }: ListRenderItemInfo<PodcastEpisodeData>) => (
    <PodcastItem 
      episode={item} 
      index={index}
    />
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'best':
        const episodes = (podcasts.results['podcast-episodes'][0].data || []) as PodcastEpisodeData[];
        const remainingEpisodes = episodes.slice(5);
        return (
          <FlashList
            data={remainingEpisodes}
            renderItem={renderPodcastItem}
            estimatedItemSize={84}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={colorScheme === 'light' ? '#000' : '#fff'}
              />
            }
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <View style={styles.header}>
                  <NewsHeaderLeftItem size="md" secondaryTitle="Audio" />
                  <View style={styles.headerRight}>
                    <TouchableOpacity 
                      style={[styles.headerRightButton, { backgroundColor: currentEpisode ? '#86858D' : Colors.light.tint }]}
                      onPress={currentEpisode ? togglePlayPause : handlePlayAll}
                    >
                      {isPlaying ? (
                        <AudioVisualizer isPlaying={true} />
                      ) : (
                        <Ionicons name="headset" size={14} color={'#fff'} />
                      )}
                      <Text style={styles.headerRightText}>
                        {currentEpisode ? (isPlaying ? 'Playing' : 'Paused') : 'Play'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {isRefreshing && (
                  <MotiView
                    from={{ translateY: -20, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={{ marginBottom: 0 , marginTop: 10}}
                  >
                    <Text style={{ fontSize: 24, color: colorScheme === 'light' ? '#000' : '#fff' }}>
                      Checking new podcasts...
                    </Text>
                  </MotiView>
                )}

                <PodcastEditorsPickItem episodes={episodes} />
                <DiscoverNewsButton />
                <Text style={styles.sectionTitle}>For You</Text>
              </View>
            }
          />
        );
      case 'magazines':
        return (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>My Magazines Content</Text>
          </View>
        );
      case 'downloaded':
        return (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>Downloaded Content</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#F2F2F6' : '#0D0D09' }}>
      <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#F2F2F6' : '#0D0D09' }]}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

