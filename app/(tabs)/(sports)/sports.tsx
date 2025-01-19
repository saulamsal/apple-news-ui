import { Text, Image, View, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native';
import { router, useRouter, useSegments } from 'expo-router';
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
import { ListRenderItemInfo } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

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
import { SportScoreCarousel } from '@/components/SportScoreCarousel';
import { scores } from '@/data/scores.json';

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

const NFLPortalButton = () => {

    return (
        <View className="px-1">
        <TouchableOpacity 
        onPress={() => router.push(`/topic/nfl_playoffs`)}
        style={{
            // marginTop: 20,
            marginHorizontal: 0,
            height: 56,
            backgroundColor: '#144174',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            justifyContent: 'space-between',
            borderRadius: 12,
            overflow: 'hidden'
        }}
    >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image 
                source={{ uri: 'https://img.sofascore.com/api/v1/unique-tournament/9464/image/light' }}
                style={{ width: 28, height: 28 }}
            />
            <View>
                <Text style={{ color: '#fff', fontSize: 20, marginBottom: 2 }} className="font-bold">
                    NFL Playoffs
                </Text>
              <View className="flex-row items-center gap-1">
              <Text style={{ color: '#fff', fontSize: 13, opacity: 0.8, marginTop: -2 }}>
                    Full coverage
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#fff" />
              </View>
            </View>
        </View>
        <Image 
            source={{ uri: 'https://img.sofascore.com/api/v1/unique-tournament/9464/image/light' }}
            style={{ 
                width: 80, 
                height: 80,
                position: 'absolute',
                right: -10,
                opacity: 0.1
            }}
        />
    </TouchableOpacity>
    </View>
    );
};

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

    const renderNewsItem = ({ item }: ListRenderItemInfo<NewsItem>) => (
        <NewsItem item={item} />
    );

    const renderHiddenItem = ({ item }: ListRenderItemInfo<NewsItem>) => (
        <SwipeableNewsItem item={item} />
    );

    const sportsList = [
        'NFL', 'MLB', 'NBA', 'WNBA', 'College Football', 
        'Men\'s College Basketball', 'Women\'s College Basketball',
        'NHL', 'PWHL', 'MLS', 'Soccer', 'Golf', 'Tennis',
        'Mixed Martial Arts', 'Motorsports', 'Boxing',
        'Pro Wrestling', 'Cycling', 'Fantasy Sports'
    ];

    const renderSportsMenu = () => (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <BlurView
                    intensity={70}
                    tint={colorScheme === 'dark' ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
                    style={SportsStyles.headerIconRight}
                >
                    <Ionicons name="menu" size={24} color={'#1E1E1F'} />
                    <Text style={SportsStyles.headerIconRightText}>All Sports</Text>
                </BlurView>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                {sportsList.map((sport) => (
                    <DropdownMenu.Item 
                        key={sport}
                        onSelect={() => Alert.alert(`${sport} clicked`)}
                    >
                        <DropdownMenu.ItemTitle>{sport}</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
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



            <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#F2F2F6' : '#0D0D09' }]}>
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
                                style={{ width: '100%', height: Platform.OS === "ios" ? 140 : 120, position: 'absolute', left: 0, right: 0, top: -insets.top+50 }}
                            />

                            <View style={{ paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 50 : 35 }}>
                                <View style={styles.header}>
                                    <NewsHeaderLeftItem size="md" secondaryTitle='Sports' />
                                    <View style={styles.headerRight}>
                                        {renderSportsMenu()}
                                    </View>
                                </View>
                                <SportScoreCarousel scores={scores} />

                        <NFLPortalButton />

                                <View style={SportsStyles.listHeader}>
                                   
                                   <View>
                                   <Text style={[styles.listHeaderText, { color: colorScheme === 'light' ? '#000000' : '#ffffff', marginTop: 30 }]}>Top Stories</Text>
                                   <Text style={SportsStyles.listHeaderSubText}>Selected by the Apple News editors.</Text>
                                   </View>

                                    <Pressable style={SportsStyles.seeAll}>
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger>
                                                <MaterialIcons
                                                    name="more-horiz"
                                                    size={24}
                                                    color={colorScheme === 'light' ? '#000' : '#fff'}
                                                />
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Content>
                                                <DropdownMenu.Item 
                                                    key="block"
                                                    onSelect={() => Alert.alert('Block Sports Top Stories clicked')}
                                                >
                                                    <DropdownMenu.ItemIcon ios={{ name: 'xmark.circle.fill' }} />
                                                    <DropdownMenu.ItemTitle>Block Sports Top Stories</DropdownMenu.ItemTitle>
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Root>
                                    </Pressable>
                                </View>
                            </View>


                        </View>
                    }
                />
            </View>



        </View>
    );
}

