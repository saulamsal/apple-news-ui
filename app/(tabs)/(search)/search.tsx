import React from 'react';
import { StyleSheet, View, TextInput, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import { ScrollViewWithHeaders, Header, ScrollHeaderProps } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedAccordion } from '@/components/AnimatedAccordion';
import searchEntities from '@/app/data/search_entities.json';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchData, SearchEntity } from '@/app/types/search';
import { SharedValue } from 'react-native-reanimated';
import { NewsLogo } from '@/components/NewsLogo';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';

const typedSearchEntities = searchEntities as SearchData;

export default function SearchScreen() {
    const { top, bottom } = useSafeAreaInsets();
    const scrollRef = React.useRef(null);

    const SearchComponent = () => (
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
                placeholder="Channels, Topics, & Stories"
                style={styles.searchInput}
                placeholderTextColor="#666"
            />
        </View>
    );

    const HeaderComponent = ({ showNavBar }: ScrollHeaderProps) => (
        <Header
            borderWidth={0}
            showNavBar={showNavBar}
            headerCenter={
                <View style={styles.headerCenter}>
                    <Text style={styles.followingTextCenter}>Following</Text>
                    <SearchComponent />
                </View>
            }
            headerRight={
                <View style={styles.headerRight}>
                    <TouchableOpacity>
                        <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                </View>
            }
        />
    );

    const LargeHeaderComponent = () => {
        const insets = useSafeAreaInsets();
        return (
            <View style={[styles.largeHeaderContainer, { marginTop: -insets.top }]}>
                <View style={styles.largeHeaderTopRow}>
                    <NewsHeaderLeftItem size={'md'} secondaryTitle='Following' />

                </View>
                <SearchComponent />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <ScrollViewWithHeaders
                ref={scrollRef}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: bottom }]}
                style={styles.scrollView}
                stickyHeaderIndices={[0]}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 0
                }}
                removeClippedSubviews={false}
                LargeHeaderComponent={LargeHeaderComponent}
                absoluteHeader={true}
                HeaderComponent={HeaderComponent}>
                <View style={styles.categoriesContainer}>
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
                        <View style={styles.sectionContent}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3E2EA',
        paddingHorizontal: 12,
        paddingVertical: 10,
        height: 36,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    categoriesContainer: {
        padding: 16,
        flexDirection: 'column',
        gap: 16,
    },
    sectionContent: {
        padding: 16,
        gap: 12,
    },
    largeHeaderTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    largeHeaderContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: '#fff',
        gap: 12,
    },
    headerTopRow: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // gap: 2,
    },
    followingText: {
        fontSize: 34,
        fontWeight: '700',
        color: '#6e6e6e',
        marginTop: 4,
    },
    editButton: {
        fontSize: 17,
        color: '#fe425f',
        fontWeight: '400',
        height: 40,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerCenter: {
        // flexDirection: 'row',
        // alignItems: 'center',

        // height: 50,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        position: 'absolute',
        right: 16,

    },


    followingTextCenter: {
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: -0.5,
        color: '#000',
    },
    scrollContent: {
        flexGrow: 1,
    },
}); 