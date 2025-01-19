import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ScrollViewWithHeaders, Header } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';
import searchEntities from '@/app/data/search_entities.json';
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import * as DropdownMenu from 'zeego/dropdown-menu';

const FadingView = ({ opacity, children, style }: { 
    opacity: SharedValue<number>, 
    children?: React.ReactNode,
    style?: any 
}) => (
    <Animated.View style={[{ opacity }, style]}>
        {children}
    </Animated.View>
);

export default function TopicScreen() {
    const { id } = useLocalSearchParams();
    const { top, bottom } = useSafeAreaInsets();
    const router = useRouter();
    const scrollRef = React.useRef(null);

    const topic = [...searchEntities.categories, 
        ...searchEntities.sections.flatMap(section => section.items)]
        .find(item => item.id === id);

    // Dummy news items data
    const dummyNews: NewsItemType[] = Array(5).fill(null).map((_, i) => ({
        id: `dummy-${i}`,
        title: i === 0 
            ? "WATCH: Nepal spinner sustains injury while mimicking Tabraiz Shamsi's celebration in U19 Asia Cup 2024"
            : `${topic?.title} News Item ${i + 1}`,
        source: {
            id: 'cricket-times',
            name: 'CricketTimes.com',
            logo_transparent_light: 'https://example.com/logo.png',
            logo_transparent_dark: 'https://example.com/logo-dark.png'
        },
        topic: {
            id: topic?.id || '',
            name: topic?.title || ''
        },
        show_topic: false,
        featured_image: 'https://picsum.photos/400/300',
        card_type: i === 0 ? 'full' : 'medium',
        is_news_plus: false
    }));

    const HeaderSurface = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
        <FadingView opacity={showNavBar} style={StyleSheet.absoluteFill}>
            <BlurView 
                style={StyleSheet.absoluteFill} 
                intensity={80} 
                tint="light"
            />
        </FadingView>
    );

    const HeaderComponent = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
        <Header
            showNavBar={showNavBar}
            SurfaceComponent={HeaderSurface}
            headerLeft={
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="p-2"
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
            }
            headerRight={
                <View className="flex-row">
                    <TouchableOpacity className="p-2">
                        <Ionicons name="add" size={24} color="#000" />
                    </TouchableOpacity>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <TouchableOpacity className="p-2">
                                <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                            </TouchableOpacity>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <DropdownMenu.Item key="share">
                                <DropdownMenu.ItemTitle>Share Team</DropdownMenu.ItemTitle>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item key="copy">
                                <DropdownMenu.ItemTitle>Copy Link</DropdownMenu.ItemTitle>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item key="follow">
                                <DropdownMenu.ItemTitle>Follow Team</DropdownMenu.ItemTitle>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item key="block">
                                <DropdownMenu.ItemTitle>Block Team</DropdownMenu.ItemTitle>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </View>
            }
        />
    );

    const LargeHeaderComponent = () => (
        <View className="px-4 pt-16 pb-4 bg-white">
            <View className="flex-row items-center gap-4">
                {topic?.logo && (
                    <Image 
                        source={{ uri: topic.logo }} 
                        className="w-16 h-16 rounded-full"
                    />
                )}
                <View>
                    <Text className="text-2xl font-bold">{topic?.title}</Text>
                    <Text className="text-gray-500 text-base">
                        {topic?.entity_type === 'sport_team' ? "Men's Cricket" : topic?.description}
                    </Text>
                </View>
            </View>
            <Text className="text-xl font-bold mt-6 mb-2">Recent Stories</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <ScrollViewWithHeaders
                ref={scrollRef}
                contentContainerStyle={[{ paddingBottom: bottom }]}
                className="flex-1"
                HeaderComponent={HeaderComponent}
                LargeHeaderComponent={LargeHeaderComponent}
                absoluteHeader={true}
                headerFadeInThreshold={0.5}
                initialAbsoluteHeaderHeight={110}
            >
                <View>
                    {dummyNews.map((item) => (
                        <NewsItem key={item.id} item={item} />
                    ))}
                </View>
            </ScrollViewWithHeaders>
        </View>
    );
} 