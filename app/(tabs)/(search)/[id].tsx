import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ScrollViewWithHeaders, Header } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';
import { SwipeListView, RowMap } from 'react-native-swipe-list-view';
import { ListRenderItemInfo } from '@shopify/flash-list';
import searchEntities from '@/app/data/search_entities.json';
import entities from '@/app/data/entities.json';
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import { SwipeableNewsItem } from '@/components/SwipeableNewsItem';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { MaterialIcons } from '@expo/vector-icons';

interface Entity {
    id: string;
    title: string;
    icon?: string;
    logo?: string;
    description?: string;
    entity_type?: string;
    type: string;
    theme?: {
        backgroundColor: string;
        textColor: string;
    };
}

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

    const entity = entities[id as keyof typeof entities] as Entity;

    // Handle case when entity is not found
    if (!entity) {
        return (
            <View className="flex-1 bg-white items-center justify-center p-4">
                <Text className="text-xl font-semibold text-center">
                    Topic not found
                </Text>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="mt-4 bg-gray-100 px-6 py-3 rounded-full"
                >
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Dummy news items data
    const dummyNews: NewsItemType[] = Array(5).fill(null).map((_, i) => ({
        id: `dummy-${i}`,
        title: i === 0 
            ? `WATCH: ${entity.title} latest news headline`
            : `${entity.title} News Item ${i + 1}`,
        source: {
            id: 'news-source',
            name: 'NewsSource.com',
            logo_transparent_light: 'https://example.com/logo.png',
            logo_transparent_dark: 'https://example.com/logo-dark.png'
        },
        topic: {
            id: entity.id,
            name: entity.title
        },
        show_topic: false,
        featured_image: 'https://picsum.photos/400/300',
        card_type: i === 0 ? 'full' : 'medium',
        is_news_plus: false
    }));

    const renderNewsItem = ({ item }: { item: NewsItemType }) => (
        <NewsItem item={item} />
    );

    const renderHiddenItem = ({ item }: { item: NewsItemType }) => (
        <SwipeableNewsItem item={item} />
    );

    const HeaderSurface = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
        <FadingView opacity={showNavBar} style={StyleSheet.absoluteFill}>
            <BlurView 
                style={[StyleSheet.absoluteFill, { backgroundColor: 'red' }]}
                intensity={80} 
                tint="light"
            />
        </FadingView>
    );

    const HeaderComponent = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
        <Header
            showNavBar={showNavBar}
            SurfaceComponent={HeaderSurface}
            noBottomBorder
            headerLeft={
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="w-9 h-9 bg-[#0000002d] rounded-full items-center justify-center ml-4"
                >
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
            }
            headerCenter={
                <Text style={{ color: 'white' }} className="text-xl font-bold">
                    {entity.title}
                </Text>
            }
            headerRight={
                <View className="flex-row gap-4 mr-4">
                    <TouchableOpacity  className="w-9 h-9 bg-[#0000002d] rounded-full items-center justify-center">
                        <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-9 h-9 bg-[#0000002d] rounded-full items-center justify-center">
                        <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            }
            headerStyle={{ 
                backgroundColor: 'red',
                paddingBottom: 10
             }}
        />
    );

    const LargeHeaderComponent = () => (
        <View 
            style={[
                styles.largeHeader,
                {
                    backgroundColor: 'red',
                    borderBottomWidth:0,
                    borderTopWidth: 0
                }
            ]}
        >
            <View className="flex-row items-center gap-4">
                {entity.logo && (
                    <Image 
                        source={{ uri: entity.logo }} 
                        className="w-16 h-16 rounded-lg"
                    />
                )}
                <View>
                    <Text 
                        style={[
                            styles.title,
                            { color: '#fff' }
                        ]}
                    >
                        {entity.title}
                    </Text>
                    <Text style={styles.subtitle}>
                        {entity.description || entity.entity_type || entity.type}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 ">
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
                <SwipeListView
                    data={dummyNews}
                    renderItem={renderNewsItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={120}
                    rightOpenValue={-120}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    keyExtractor={item => item.id}
                    useNativeDriver={false}
                    disableRightSwipe={false}
                    disableLeftSwipe={false}
                    style={{marginTop: 20}}
                />
            </ScrollViewWithHeaders>
        </View>
    );
}

const styles = StyleSheet.create({
    largeHeader: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        letterSpacing: -0.3,
    }
}); 