import React, { useState, useMemo, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Platform, Image, ScrollView } from 'react-native';
import { ScrollViewWithHeaders, Header } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedAccordion } from '@/components/AnimatedAccordion';
import searchEntities from '@/app/data/search_entities.json';
import entities from '@/app/data/entities.json';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchData } from '@/src/types/search';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import BlurView from '@/components/BlurView';
// import {BlurView} from 'expo-blur';
import Animated, { SharedValue } from 'react-native-reanimated';
import { getAllCategories, getAllEntitiesForSection, lookupEntity } from '@/src/utils/entityUtils';
import { Link } from 'expo-router';
import Head from 'expo-router/head';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Entity {
    id: string;
    title: string;
    logo?: string;
    icon?: string;
    type: string;
    entity_type?: string;
    description?: string;
}

interface HighlightedTextProps {
    text: string;
    highlight: string;
}

const HighlightedText = ({ text, highlight }: HighlightedTextProps) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    
    return parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? 
            `**${part}**` : part
    ).join('');
};

const FadingView = ({ opacity, children, style }: { 
    opacity: SharedValue<number>, 
    children?: React.ReactNode,
    style?: any 
}) => (
    <Animated.View style={[{ opacity }, style]}>
        {children}
    </Animated.View>
);

interface SearchComponentProps {
    value: string;
    onChangeText: (text: string) => void;
}

const SearchComponent = React.memo(({ value, onChangeText }: SearchComponentProps) => {
    const handleClear = useCallback(() => {
        onChangeText('');
    }, [onChangeText]);

    return (
        <View className="flex-row items-center bg-[#E3E2EA] px-3 h-[38px] rounded-[10px]">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
                placeholder="Channels, Topics, & Stories"
                className="flex-1 pl-2 text-[17px] focus:outline-none"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                
            />
            {value ? (
                <TouchableOpacity onPress={handleClear}>
                    <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
            ) : null}
        </View>
    );
});

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');


    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        const results: Entity[] = [];
        const addedIds = new Set<string>();
        
        Object.values(entities).forEach((entity: any) => {
            const matchesTitle = entity.title?.toLowerCase().includes(query);
            const matchesDescription = entity.description?.toLowerCase().includes(query);
            const matchesType = entity.type?.toLowerCase().includes(query);
            
            if ((matchesTitle || matchesDescription || matchesType) && !addedIds.has(entity.id)) {
                results.push(entity);
                addedIds.add(entity.id);
            }

            // Search in sub_topics if they exist
            if (entity.sub_topics?.items) {
                entity.sub_topics.items.forEach((subTopic: any) => {
                    if (subTopic.title?.toLowerCase().includes(query) && !addedIds.has(subTopic.id)) {
                        results.push(subTopic);
                        addedIds.add(subTopic.id);
                    }
                });
            }
        });

        return results;
    }, [searchQuery]);

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
            borderWidth={0}
            showNavBar={showNavBar}
            SurfaceComponent={HeaderSurface}
            headerCenter={
                <Text className="text-2xl font-bold">Following</Text>
            }
            headerRight={
                <View className="flex-row items-start px-4 pt-4">
                    <Link href="/edit">
                        <Text className="text-[17px] text-[#fe425f]">Edit</Text>
                    </Link>
                </View>
            }

            // headerRightFadesIn


            headerStyle={{
            }}
        
            
            headerCenterStyle={{
                width: 'auto',
                minWidth: 'auto',
                maxWidth: 'auto',
              }}
        
              headerRightStyle={{ 
                width: 'auto',
                minWidth: 'auto',
                maxWidth: 'auto',
              }}
        
              headerLeftStyle={{
                width: 'auto',
                minWidth: 'auto',
                maxWidth: 'auto',
              }}
        

              

        />
    );

    const LargeHeaderComponent = () => {
        const insets = useSafeAreaInsets();
        return (
            <View className={`px-4 pt-2 pb-3 bg-white gap-3`} style={{ marginTop: -insets.top }}>
                <View className="flex-row justify-between items-start">
                    <NewsHeaderLeftItem size={'md'} secondaryTitle='Following' />
                </View>
                <SearchComponent value={searchQuery} onChangeText={setSearchQuery} />
            </View>
        );
    }

    return (
        <>
        { Platform.OS === 'web' && (
            <Head>
                <title>Apple News Search - Find News & Topics</title>
                <meta name="description" content="Search through millions of articles, topics, and trusted sources to find the news that matters to you." />
                <meta name="keywords" content="apple news search, news search, article search, topic search" />
            </Head>
            )}

                <ScrollViewWithHeaders
                    className="flex-1 bg-white"
                    stickyHeaderIndices={[0]}
                    maintainVisibleContentPosition={{
                        minIndexForVisible: 0,
                        autoscrollToTopThreshold: 0
                    }}

                    style={
                        {
                            backgroundColor:  'white',
                            ...(Platform.OS === 'web' ? {
                                height: undefined,
                                overflow: 'visible'
                              } : {})
                        }
                    }
                      scrollEnabled={Platform.OS !== 'web'}
                      contentContainerStyle={{
                          paddingTop: insets.top,
                          paddingBottom: insets.bottom + 60,
                          backgroundColor:'white',
                          ...(Platform.OS === 'web' ? {
                              height: undefined
                          } : {})
                      }}
                      
                      removeClippedSubviews={false}
                    LargeHeaderComponent={LargeHeaderComponent}
                    absoluteHeader={true}
                    HeaderComponent={HeaderComponent}
                    headerFadeInThreshold={0.5}
                    disableLargeHeaderFadeAnim={false}
                    largeHeaderContainerStyle={{ paddingTop: insets.top + 4 }}
                >
                    
                    {searchQuery ? (
                        <View className="p-4">
                            {searchResults.length > 0 ? (
                                <View className="gap-3">
                                    {searchResults.map((entity) => (
                                        <CategoryCard
                                        id={entity.id}
                                            key={entity.id}
                                            title={<HighlightedText text={entity.title} highlight={searchQuery} />}
                                            logo={entity.logo}
                                            icon={entity.icon}
                                            entity_type={entity.entity_type}
                                            description={entity.description && (
                                                <HighlightedText text={entity.description} highlight={searchQuery} />
                                            )}
                                        />
                                    ))}
                                </View>
                            ) : (
                                <Text className="text-center text-gray-500">No results found</Text>
                            )}
                        </View>
                    ) : (
                        <>
                            <View className="p-4 flex-col gap-4">
                                {getAllCategories().map((entity: Entity) => (
                                    <CategoryCard
                                    id={entity.id}
                                        key={entity.id}
                                        title={entity.title}
                                        icon={entity.icon}
                                        entity_type={entity.entity_type}
                                    />
                                ))}
                            </View>

                            {searchEntities.sections.map((section) => (
                                <AnimatedAccordion key={section.id} title={section.title}>
                                    <View className="p-4 gap-3">
                                        {getAllEntitiesForSection(section.id).map((entity: Entity) => (
                                            <CategoryCard
                                            id={entity.id}
                                                key={entity.id}
                                                title={entity.title}
                                                logo={entity.logo}
                                                entity_type={entity.entity_type}
                                            />
                                        ))}
                                    </View>
                                </AnimatedAccordion>
                            ))}
                        </>
                    )}

                {/* <Link href="/settings" className="p-4 mb-10">
                    <Text className="text-gray-500 text-center">Settings</Text>
                </Link> */}
                </ScrollViewWithHeaders>
            </>
      
    );
} 