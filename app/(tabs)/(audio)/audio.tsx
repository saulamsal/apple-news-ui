import { Text, Image, View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
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

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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
import { MusicVisualizer } from '@/components/MusicVisualizer';

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

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  const { currentEpisode, playEpisode, isPlaying, togglePlayPause } = useAudio();
  
  const handlePlayAll = () => {
    const firstEpisode = podcasts[0]?.data?.shelves[0]?.items[0];
    
    if (firstEpisode) {
      const imageUrl = firstEpisode.episodeArtwork?.template 
        ? firstEpisode.episodeArtwork.template
            .replace('{w}', '300')
            .replace('{h}', '300')
            .replace('{f}', 'jpg')
        : firstEpisode.icon?.template
            ? firstEpisode.icon.template
                .replace('{w}', '300')
                .replace('{h}', '300')
                .replace('{f}', 'jpg')
            : 'https://via.placeholder.com/300';

      // Convert to PodcastEpisode type
      const podcast: PodcastEpisode = {
        id: firstEpisode.id,
        title: firstEpisode.title,
        streamUrl: firstEpisode.playAction?.episodeOffer?.streamUrl,
        artwork: { url: imageUrl },
        showTitle: firstEpisode.showTitle,
        duration: firstEpisode.duration,
        releaseDate: firstEpisode.releaseDate,
        summary: firstEpisode.summary
      };

      playEpisode(podcast);
      router.push(`/audio/${firstEpisode.id}`);
    }
  };




  const renderPodcastItem = ({ item, index }: ListRenderItemInfo<PodcastEpisode>) => (
    <PodcastItem 
      episode={item} 
      index={index}
    //   totalItems={episodes.length}
    />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'best':
        const episodes = podcasts[0]?.data?.shelves[0]?.items || [];
        
        return (
          <FlashList
            data={episodes}
            renderItem={renderPodcastItem}
            estimatedItemSize={84}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <View style={styles.header}>
                  <NewsHeaderLeftItem size="md" secondaryTitle="Audio" />
                  <View style={styles.headerRight}>
                    <TouchableOpacity 
                      style={[styles.headerRightButton, { backgroundColor: currentEpisode ? '#86858D' : Colors.light.tint }]}
                      onPress={currentEpisode  ? togglePlayPause : handlePlayAll}
                    >
                      {isPlaying ? (
                        <MusicVisualizer isPlaying={true} />
                      ) : (
                     
                          <Ionicons name="headset" size={14} color={'#fff'} />
                       
                      )}
                         <Text style={styles.headerRightText}>{currentEpisode ? (isPlaying ? 'Playing' : 'Paused') : 'Play'}</Text>
                    </TouchableOpacity>
                  </View>

         
                </View>
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
      <ThemedView style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#F2F2F6' : '#0D0D09' }]}>
        {renderContent()}
      </ThemedView>
    </SafeAreaView>
  );
}

