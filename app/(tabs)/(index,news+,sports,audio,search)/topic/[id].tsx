import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
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
import { scores } from '@/data/scores.json';
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import { SwipeableNewsItem } from '@/components/SwipeableNewsItem';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { MaterialIcons } from '@expo/vector-icons';
import { SegmentedControl } from '@/components/SegmentedControl';
import { SportScoreCarousel } from '@/components/SportScoreCarousel';
import { StatusBar } from 'expo-status-bar';
import Entypo from '@expo/vector-icons/Entypo';

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
    tabs?: string[];
    filter?: string;
    sub_topics?: {
        title: string;
        items: { id: string; title: string; logo: string }[];
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

const TopicMenu = ({ textColor }: { textColor: string }) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <TouchableOpacity className="w-9 h-9 bg-[#0000002d] rounded-full items-center justify-center">
                    <Ionicons name="ellipsis-horizontal" size={20} color={textColor} />
                </TouchableOpacity>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item key="share">
                    <DropdownMenu.ItemIcon ios={{ name: 'square.and.arrow.up' }}>
                        <Ionicons name="share-outline" size={18} color="black" />
                    </DropdownMenu.ItemIcon>
                    <DropdownMenu.ItemTitle>Share Topic</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>

                <DropdownMenu.Item key="copy">
                    <DropdownMenu.ItemIcon ios={{ name: 'link' }}>
                        <Ionicons name="link-outline" size={18} color="black" />
                    </DropdownMenu.ItemIcon>
                    <DropdownMenu.ItemTitle>Copy Link</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item key="follow" destructive>
                    <DropdownMenu.ItemIcon ios={{ name: 'minus.circle.fill' }}>
                        <Ionicons name="remove-circle-outline" size={18} color="red" />
                    </DropdownMenu.ItemIcon>
                    <DropdownMenu.ItemTitle>Unfollow Topic</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>

                <DropdownMenu.Item key="block" destructive>
                    <DropdownMenu.ItemIcon ios={{ name: 'hand.raised.fill' }}>
                        <Ionicons name="hand-left-outline" size={18} color="red" />
                    </DropdownMenu.ItemIcon>
                    <DropdownMenu.ItemTitle>Block Topic</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default function TopicScreen() {
    const { id } = useLocalSearchParams();
    const { top, bottom } = useSafeAreaInsets();
    const router = useRouter();
    const scrollRef = React.useRef(null);
    const [selectedTab, setSelectedTab] = useState('news');
    const [showSubTopicsModal, setShowSubTopicsModal] = useState(false);

    const entity = entities[id as keyof typeof entities] as Entity;

    // Get theme colors with fallback
    const backgroundColor = entity?.theme?.backgroundColor || '#000000';
    const textColor = entity?.theme?.textColor || '#FFFFFF';

    // Filter scores based on sports_type if entity has filter
    const filteredScores = entity?.filter ? scores.filter(score => score.sports_type === entity.filter) : [];

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
                style={[StyleSheet.absoluteFill, { backgroundColor }]}
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
                    <Ionicons name="chevron-back" size={24} color={textColor} />
                </TouchableOpacity>
            }
            headerCenter={
                <Text style={{ color: textColor }} className="text-xl font-bold">
                    {entity.title}
                </Text>
            }
            headerRight={
                <View className="flex-row gap-4 mr-4">
                    <TouchableOpacity className="w-9 h-9 bg-[#0000002d] rounded-full items-center justify-center">
                        <Ionicons name="add" size={24} color={textColor} />
                    </TouchableOpacity>
                    <TopicMenu textColor={textColor} />
                </View>
            }
            headerStyle={{
                // backgroundColor,
                paddingBottom: 10
            }}
        >
        </Header>
    );

    const LargeHeaderComponent = () => (
        <View
            style={[
                styles.largeHeader,
                {
                    // backgroundColor,
                    borderBottomWidth: 0,
                    borderTopWidth: 0
                }
            ]}
        >
                
            <Image 
                source={{ uri: "https://i.imgur.com/TX8gHyb.png" }}
                className="absolute -top-[120] -left-0  right-0 h-[200]"
             
            />

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
                            { color: textColor }
                        ]}
                    >
                        {entity.title}
                    </Text>
                    <Text style={[styles.subtitle, { color: textColor + '99' }]}>
                        {entity.description || entity.entity_type || entity.type}
                    </Text>
                </View>
            </View>
        </View>
    );

    const ModalData = () => {
        return (
                <View className=" border-b border-gray-200">
                    <View className="flex-row justify-between items-center p-4 gap-4">
                        <Text className="text-2xl font-bold">{entity.title}</Text>
                        <TouchableOpacity
                            onPress={() => setShowSubTopicsModal(false)}
                            className="p-2"
                        >
                            <Text className="font-semibold color-apple-news text-lg">Done</Text>
                        </TouchableOpacity>
                    </View>
          
                <Text className="text-xl font-bold px-4 pb-2">{entity.sub_topics?.title}</Text>

                {entity.sub_topics?.items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                            setShowSubTopicsModal(false);
                            router.push(`/topic/${item.id}`);
                        }}
                        className=" flex-row items-center px-4 py-3 border-b border-gray-200 border-hairline" 
                    >

                        <Image
                            source={{ uri: item.logo }}
                            className="w-8 h-8 rounded-full mr-4"
                        />

                        <Text className="text-xl font-semibold tracking-tight flex-1">{item.title}</Text>
                        <Entypo name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>
                ))}
              </View>
        )
    }

    const SubTopicsModal = () => (


        //todo remove bottom view
        <Modal
            animationType="slide"
            presentationStyle="formSheet"
            visible={showSubTopicsModal}
            onRequestClose={() => setShowSubTopicsModal(false)}
        >

            <ModalData />


        </Modal>
    );

    const renderContent = () => {
        switch (selectedTab) {
            case 'scores':
                return (
                    <View className="p-4">
                        <Text>Scores Content</Text>
                    </View>
                );
            case 'videos':
                return (
                    <View className="p-4">
                        <Text>Videos Content</Text>
                    </View>
                );
            case 'stats':
                return (
                    <View className="p-4">
                        <Text>Stats Content</Text>
                    </View>
                );
            case 'news':
            default:
                return (
                    <>
                        {/* Show scores if they exist for this sport */}
                        {filteredScores.length > 0 && (
                            <View className="mt-4">
                                <SportScoreCarousel scores={filteredScores} />
                            </View>
                        )}

                        {/* Show subtopics if they exist */}
                        {entity.sub_topics && (
                            <View className="mt-4 mb-10">
                                <View className="px-4 flex-row justify-between items-center">
                                    <Text className="text-2xl font-semibold">{entity.sub_topics.title}</Text>
                                    <TouchableOpacity onPress={() => setShowSubTopicsModal(true)}>
                                        <Entypo name="chevron-thin-right" size={18} color="black" />
                                    </TouchableOpacity>

                                </View>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    className="mt-4"
                                    contentContainerStyle={{ paddingHorizontal: 16 }}
                                >
                                    {entity.sub_topics.items.map((item, index) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => router.push(`/topic/${item.id}`)}
                                            className="mr-2 items-center"
                                            style={{ width: 100 }}
                                        >
                                            <Image
                                                source={{ uri: item.logo }}
                                                className="rounded-lg mb-2 bg-gray-200"
                                                style={{ width: 80, height: 80, borderRadius: 80 }}
                                            />
                                            <Text className="text-center font-semibold text-md tracking-tighter" numberOfLines={1}>
                                                {item.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

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
                        />
                    </>
                );
        }
    };

    return (
        <View className="flex-1 bg-gray-100">
            
        


            <ScrollViewWithHeaders
                alwaysBounceHorizontal={false}
                alwaysBounceVertical={false}
                bounces={false}
                ref={scrollRef}
                contentContainerStyle={[{ paddingBottom: bottom }]}
                className="flex-1"
                HeaderComponent={HeaderComponent}
                LargeHeaderComponent={LargeHeaderComponent}
                absoluteHeader={true}
                headerFadeInThreshold={0.5}
                initialAbsoluteHeaderHeight={110}
            
            >
                <StatusBar style={showSubTopicsModal ? 'light' : 'dark'} />

              
                


                {entity.tabs && (
                    <View className="px-4 pt-4">
                        <SegmentedControl
                            values={entity.tabs}
                            selectedIndex={entity.tabs.indexOf(selectedTab)}
                            onChange={(index) => setSelectedTab(entity.tabs![index])}
                        />
                    </View>
                )}
                        {/* <ModalData /> */}
                {renderContent()}
        
                <SubTopicsModal />
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