import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollViewWithHeaders, Header } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedAccordion } from '@/components/AnimatedAccordion';
import searchEntities from '@/app/data/search_entities.json';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchData } from '@/app/types/search';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import { BlurView } from 'expo-blur';
import Animated, { SharedValue } from 'react-native-reanimated';
import { getAllCategories, getAllEntitiesForSection, lookupEntity } from '@/app/utils/entityUtils';
import { Link } from 'expo-router';

interface Entity {
    id: string;
    title: string;
    logo?: string;
    icon?: string;
    type: string;
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

export default function SearchScreen() {
    const { top, bottom } = useSafeAreaInsets();

    const SearchComponent = () => (
        <View className="flex-row items-center bg-[#E3E2EA] px-3 h-[38px] rounded-[10px]">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
                placeholder="Channels, Topics, & Stories"
                className="flex-1 pl-2 text-[17px]"
                placeholderTextColor="#666"
            />
        </View>
    );

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
                    <Link href="/following/edit">
                        <Text className="text-[17px] text-[#fe425f]">Edit</Text>
                    </Link>
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
                HeaderComponent={HeaderComponent}
                headerFadeInThreshold={0.5}
                disableLargeHeaderFadeAnim={false}
                largeHeaderContainerStyle={{ paddingTop: top + 4 }}
            >
                <View className="p-4 flex-col gap-4">
                    {getAllCategories().map((entity: Entity) => (
                        <CategoryCard
                            key={entity.id}
                            id={entity.id}
                            title={entity.title}
                            icon={entity.icon}
                        />
                    ))}
                </View>

                {searchEntities.sections.map((section) => (
                    <AnimatedAccordion key={section.id} title={section.title}>
                        <View className="p-4 gap-3">
                            {getAllEntitiesForSection(section.id).map((entity: Entity) => (
                                <CategoryCard
                                    key={entity.id}
                                    id={entity.id}
                                    title={entity.title}
                                    logo={entity.logo}
                                />
                            ))}
                        </View>
                    </AnimatedAccordion>
                ))}
            </ScrollViewWithHeaders>
        </View>
    );
} 