import React from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { ScrollViewWithHeaders, Header, ScrollHeaderProps } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedAccordion } from '@/components/AnimatedAccordion';
import searchEntities from '@/app/data/search_entities.json';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchData } from '@/app/types/search';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';

const typedSearchEntities = searchEntities as SearchData;

export default function SearchScreen() {
    const { top, bottom } = useSafeAreaInsets();
    const scrollRef = React.useRef(null);

    const SearchComponent = () => (
        <View className="flex-row items-center bg-[#E3E2EA] px-3 h-9 rounded-[10px] flex-1">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
                placeholder="Channels, Topics, & Stories"
                className="flex-1 ml-2 text-base"
                placeholderTextColor="#666"
            />
        </View>
    );

    const HeaderComponent = ({ showNavBar }: ScrollHeaderProps) => (
        <Header
            borderWidth={0}
            showNavBar={showNavBar}
            headerCenter={
                <View>
                    <Text className="text-[22px] font-bold tracking-[-0.5px] text-black">Following</Text>
                    <SearchComponent />
                </View>
            }
            headerRight={
                <View className="flex-row items-center gap-2 absolute right-4">
                    <TouchableOpacity>
                        <Text className="text-[17px] text-[#fe425f] font-normal h-10">Edit</Text>
                    </TouchableOpacity>
                </View>
            }
        />
    );

    const LargeHeaderComponent = () => {
        const insets = useSafeAreaInsets();
        return (
            <View className={`px-4 pt-2 pb-3 bg-white gap-3`} style={{ marginTop: -insets.top }}>
                <View className="flex-row justify-between items-start">
                    <NewsHeaderLeftItem size={'md'} secondaryTitle='Following' />
                </View>
                <SearchComponent />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <ScrollViewWithHeaders
                ref={scrollRef}
                contentContainerStyle={[{ paddingBottom: bottom }]}
                className="flex-1 bg-white"
                stickyHeaderIndices={[0]}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 0
                }}
                removeClippedSubviews={false}
                LargeHeaderComponent={LargeHeaderComponent}
                absoluteHeader={true}
                HeaderComponent={HeaderComponent}>
                <View className="p-4 flex-col gap-4">
                    {typedSearchEntities.categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            title={category.title}
                            icon={category.icon}
                        />
                    ))}
                </View>

                {typedSearchEntities.sections.map((section) => (
                    <AnimatedAccordion key={section.id} title={section.title}>
                        <View className="p-4 gap-3">
                            {section.items.map((item) => (
                                <CategoryCard
                                    key={item.id}
                                    title={item.title}
                                    logo={item.logo}
                                />
                            ))}
                        </View>
                    </AnimatedAccordion>
                ))}
            </ScrollViewWithHeaders>
        </View>
    );
} 