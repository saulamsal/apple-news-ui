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
import * as DropdownMenu from '@/components/StyledDropdownMenu';
import Head from 'expo-router/head';

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
import { SlidingBanner } from '@/components/SlidingBanner';

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
        <SlidingBanner
            onPress={() => router.push(`/topic/nfl_playoffs`)}
            image={{
                uri: 'https://img.sofascore.com/api/v1/unique-tournament/9464/image/light'
            }}
            title="NFL Playoffs"
            subtitle="Full coverage"
            backgroundColor="#144174"
        />
    );
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function SportsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const segments = useSegments();

    // Get the current group (tab) from segments
    const currentGroup = segments[1]; // Should return 'index', 'news+', 'sports', etc.

    // const iconColor = colorScheme === 'light' ? '#000' : '#fff';
    const iconColor = '#fff';

    const backgroundColor = '#F2F2F6';
    const insets = useSafeAreaInsets();

    const lastScrollY = useSharedValue(0);
    const translationY = useSharedValue(-100);

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
                        onSelect={() => {
                            if (sport === 'Soccer') {
                                router.push(`/(tabs)/(sports)/topic/soccer`);
                            } else {
                                Alert.alert(`${sport} clicked`);
                            }
                        }}
                    >
                        <DropdownMenu.ItemTitle>{sport}</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );

    return (
        <>
        { Platform.OS === 'web' && (
            <Head>
                <title>Apple News Sports - Live Scores & Sports Updates</title>
                <meta name="description" content="Get real-time sports updates, live scores, and breaking sports news from your favorite teams and leagues." />
                <meta name="keywords" content="sports news, live scores, sports updates, apple news sports" />
            </Head>
            )}
            <View className="flex-1 bg-white">




                <AnimatedBlurView
                    intensity={70}
                    tint={colorScheme === 'dark' ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
                    style={[
                        styles.todayContainer,
                        {
                            // backgroundColor: '#F2F2F6',
                            paddingTop: insets.top
                        },
                        headerAnimatedStyle
                    ]}
                >
                    <View style={SportsStyles.headerLeft}>
                        <Text style={SportsStyles.headerLeftText}>Sports</Text>

                        <TouchableOpacity style={SportsStyles.headerIconRight}>
                            <Ionicons name="menu" size={22} color={'#1E1E1F'} />
                        </TouchableOpacity>
                    </View>
                </AnimatedBlurView>



                <View style={[styles.container, 
                    // { backgroundColor: '#F2F2F6' }
                    ]}>
                    <AnimatedSwipeListView
                          alwaysBounceHorizontal={false}
                          alwaysBounceVertical={false}
                          bounces={false}

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
                        style={{
                            flexShrink: 0  //SUPER IMPORTANT TO DISABLE CHILD SCROLL ON RNW
                          }}
                        ListHeaderComponent={
                            <View style={SportsStyles.listHeaderContainer}>
                                <Image
                                    source={require('@/assets/images/temp/sports-light-bg.png')}
                                    style={{ width: '100%', height: Platform.OS === 'ios' ? insets.top + 140 :  70, position: 'absolute', left: 0, right: 0, top: -insets.top  }}
                                />

                                <View style={{ paddingHorizontal: 16, paddingTop:insets.top+ (Platform.OS === 'web' ? 24 : 0)   }}>
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
                                            <Text style={[styles.listHeaderText, { color: '#000000', marginTop: 30 }]}>Top Stories</Text>
                                            <Text style={SportsStyles.listHeaderSubText}>Selected by the Apple News editors.</Text>
                                        </View>

                                        <Pressable style={SportsStyles.seeAll}>
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger>
                                                    <MaterialIcons
                                                        name="more-horiz"
                                                        size={24}
                                                        color='#000'
                                                    />
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content>
                                                    <DropdownMenu.Item
                                                        key="not-interested"
                                                        onSelect={() => Alert.alert('Not interested clicked')}
                                                    >
                                                        <DropdownMenu.ItemIcon ios={{ name: 'hand.thumbsdown' }} />
                                                        <DropdownMenu.ItemTitle>Not interested</DropdownMenu.ItemTitle>
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item
                                                        key="block"
                                                        onSelect={() => Alert.alert('Block Sports Top Stories clicked')}
                                                    >
                                                        <DropdownMenu.ItemIcon ios={{ 
                                                            name: 'hand.raised.slash.fill',
                                                            hierarchicalColor: '#FF3B30'
                                                        }} />
                                                        <DropdownMenu.ItemTitle destructive>Block Sports Top Stories</DropdownMenu.ItemTitle>
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
        </>
    );
}

