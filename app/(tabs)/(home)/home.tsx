import { Text, Image, View, StyleSheet, Pressable } from 'react-native';
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
import { formatSimpleDate } from '@/utils/dateFormatters';
import { styles } from '@/styles/screens/home';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  // Get the current group (tab) from segments
  const currentGroup = segments[1]; // Should return 'index', 'news+', 'sports', etc.

  // const iconColor = colorScheme === 'light' ? '#000' : '#fff';
  const iconColor = '#fff';

  const backgroundColor = colorScheme === 'light' ? '#F2F2F6' : '#1C1C1E';
  const insets = useSafeAreaInsets();

  const lastScrollY = useSharedValue(0);
  const translationY = useSharedValue(-40);

  const AnimatedSwipeListView = Animated.createAnimatedComponent(SwipeListView);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      
      // Only show header when scrolled past 90px
      if (currentScrollY > 90) {
        if (currentScrollY > lastScrollY.value) {
          // Scrolling down - hide header
          translationY.value = withTiming(-insets.top*3, {
            duration: 300
          });
        } else {
          // Scrolling up - show header
          translationY.value = withTiming(0, {
            duration: 300
          });
        }
      } else {
        // Always hide header when scroll position is less than 90px
        translationY.value = withTiming(-insets.top*3, {
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

  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    // Fix the href typing by making it more specific
    const href = {
      pathname: '/topic/[id]' as const,
      params: { id: item.id }
    };

    if (item.card_type === 'full') {
      return (
        <Link href={href} asChild>
          <Pressable>
            <ThemedView style={styles.card}>
              <Image source={{ uri: item.featured_image }} style={styles.fullImage} />
              <View style={styles.fullCardContent}>
                <Image
                  source={{ uri: colorScheme === 'light' ? item.source.logo_transparent_light : item.source.logo_transparent_dark }}
                  style={styles.sourceLogo}
                />
                <ThemedText type="title" style={[styles.newsTitle, styles.newsTitleFull]}>
                  {item.title}
                </ThemedText>
              </View>

              <View style={styles.moreContainer}>
                {item.show_topic && (
                  <Pressable style={styles.topicButton} onPress={(e) => e.stopPropagation()}>
                    <ThemedText type="subtitle" style={styles.topicText}>
                      More {item.topic.name} coverage
                    </ThemedText>
                  </Pressable>
                )}
                <MaterialIcons
                  name="more-horiz"
                  size={24}
                  color={colorScheme === 'light' ? '#000' : '#fff'}
                  style={styles.moreIcon}
                />
              </View>
            </ThemedView>
          </Pressable>
        </Link>
      );
    }

    return (
      <Link href={href} asChild>
        <Pressable>
          <ThemedView style={styles.card}>
            <View style={styles.mediumContent}>
              <Image
                source={{ uri: colorScheme === 'light' ? item.source.logo_transparent_light : item.source.logo_transparent_dark }}
                style={styles.sourceLogo}
              />
              <ThemedText type="title" style={styles.newsTitle}>
                {item.title}
              </ThemedText>
              <Image source={{ uri: item.featured_image }} style={styles.mediumImage} />
            </View>

            <View style={styles.moreContainer}>
              {item.show_topic && (
                <Pressable style={styles.topicButton} onPress={(e) => e.stopPropagation()}>
                  <ThemedText type="subtitle" style={styles.topicText}>
                    More {item.topic.name} coverage
                  </ThemedText>
                </Pressable>
              )}
              <MaterialIcons
                name="more-horiz"
                size={24}
                color={colorScheme === 'light' ? '#000' : '#fff'}
                style={styles.moreIcon}
              />
            </View>
          </ThemedView>
        </Pressable>
      </Link>
    );
  };

  const NewsHeaderLeftItem = ({ size }: { size: 'sm' | 'md' }) => {
    return (
      <View style={styles.headerLeft}>
      <NewsLogo
        color={colorScheme === 'light' ? '#000' : '#fff'}
        size={size === 'sm' ? 24 : 36}
      />
        <ThemedText style={[styles.headerDate, { fontSize: size === 'sm' ? 16 : 28, paddingTop: size === 'sm' ? 0 : 4 }]}>
          {formatSimpleDate()}
        </ThemedText>
      </View>
    );
  };

  const renderHiddenItem = ({ item }: { item: NewsItem }) => (
    <View style={styles.rowBack}>
      {/* Left swipe actions */}
      <View style={styles.leftActions}>
        <Pressable
          onPress={() => console.log('Thumbs down:', item.id)}
          style={[styles.actionButton, styles.leftActionButton, { backgroundColor: '#FF3A31' }]}
        >
          <Ionicons name="thumbs-down" size={24} color={iconColor} />
        </Pressable>
        <Pressable
          onPress={() => console.log('Thumbs up:', item.id)}
          style={[styles.actionButton, styles.leftActionButton, { backgroundColor: '#54B583' }]}
        >
          <Ionicons name="thumbs-up" size={24} color={iconColor} />
        </Pressable>
      </View>

      {/* Right swipe actions */}
      <View style={styles.rightActions}>
        <Pressable
          onPress={() => console.log('Share:', item.id)}
          style={[styles.actionButton, styles.rightActionButton, { backgroundColor: '#027BFF' }]}
        >
          <Ionicons name="share-outline" size={24} color={iconColor} />
        </Pressable>
        <Pressable
          onPress={() => console.log('Save:', item.id)}
          style={[styles.actionButton, styles.rightActionButton, { backgroundColor: '#FF9502' }]}
        >
          <Ionicons name="bookmark-outline" size={24} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#F2F2F6' : '#0D0D09' }]}>
       
        <Animated.View 
          style={[
            styles.todayContainer, 
            {
              backgroundColor: colorScheme === 'light' 
                ? '#F2F2F2' 
                : '#000'
            },
            // {
            //   backgroundColor: 'red',
            //   // paddingTop: insets.top,
            // },
            headerAnimatedStyle
          ]}
        >
          <NewsHeaderLeftItem size={'sm'} />
        </Animated.View>

        <AnimatedSwipeListView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          data={news as NewsItem[]}
          renderItem={renderNewsItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={120}
          rightOpenValue={-120}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
             <NewsHeaderLeftItem />

                <View style={styles.headerRight}>
                  <Image source={{ uri: colorScheme === 'light' ? 'https://i.imgur.com/EfImlCx.png' : 'https://i.imgur.com/bMJtV6x.png' }} style={styles.headerIcon} />
                </View>
              </View>
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>Top Stories</Text>
              </View>
            </>
          }
        />
      </ThemedView>
    </SafeAreaView>
  );
}

