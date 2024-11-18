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
import { BlurView } from 'expo-blur';

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
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import { SwipeableNewsItem } from '@/components/SwipeableNewsItem';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import { SportsStyles } from '@/styles/screens/sports'
import { Platform } from 'react-native';
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

export default function SportsScreen() {
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
                translationY.value = withTiming(0, {
                    duration: 300
                });
            } else {
                translationY.value = withTiming(-100, {
                    duration: 300
                });
            }
        }
    });



    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translationY.value }],
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
        };
    });

    const renderNewsItem = ({ item }: { item: NewsItemType }) => (
        <NewsItem item={item} />
    );

    const renderHiddenItem = ({ item }: { item: NewsItemType }) => (
        <SwipeableNewsItem item={item} />
    );

    return (
        <View style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#F2F2F6' : '#0D0D09' }}>




            <Animated.View
                style={[
                    styles.todayContainer,
                    {
                        backgroundColor: colorScheme === 'dark' ? '#0D0D09' : '#F2F2F6',
                        paddingTop: insets.top
                    },
                    headerAnimatedStyle
                ]}
            >
                <View style={SportsStyles.headerLeft}>
                    <Text style={SportsStyles.headerLeftText}>Sports</Text>

                    <TouchableOpacity style={SportsStyles.headerIconRight}>
                        <Ionicons name="menu" size={18} color={'#1E1E1F'} />
                    </TouchableOpacity>
                </View>
            </Animated.View>



            <ThemedView style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#F2F2F6' : '#0D0D09' }]}>
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
                        <View style={SportsStyles.listHeaderContainer}>
                            <Image
                                source={colorScheme === 'light' ? require('@/assets/images/temp/sports-light-bg.png') : require('@/assets/images/temp/sports-dark-bg.png')}
                                style={{ width: '100%', height: Platform.OS === "ios" ? 140 : 100, position: 'absolute', left: 0, right: 0, top: 0 }}
                            />

                            <View style={{ paddingTop: insets.top, paddingHorizontal: 16 }}>
                                <View style={styles.header}>
                                    <NewsHeaderLeftItem size="md" secondaryTitle='Sports' />
                                    <View style={styles.headerRight}>
                                        <TouchableOpacity style={SportsStyles.headerIconRightWrapper}>
                                            <BlurView
                                                intensity={70}
                                                tint={colorScheme === 'dark' ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
                                                style={SportsStyles.headerIconRight}

                                            >
                                                <Ionicons name="menu" size={24} color={'#1E1E1F'} />
                                                <Text style={SportsStyles.headerIconRightText}>All Sports</Text>
                                            </BlurView>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={SportsStyles.listHeader}>
                                    <Text style={[styles.listHeaderText, { color: colorScheme === 'light' ? '#000000' : '#ffffff', marginTop: 30 }]}>Top Stories</Text>
                                    <Text style={SportsStyles.listHeaderSubText}>Selected by the Apple News editors.</Text>
                                </View>
                            </View>


                        </View>
                    }
                />
            </ThemedView>



        </View>
    );
}

