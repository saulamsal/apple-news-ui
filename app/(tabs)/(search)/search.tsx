import React from 'react';
import { StyleSheet, View, TextInput, Text, Button, TouchableOpacity } from 'react-native';
import { ScrollViewWithHeaders, Header, ScrollHeaderProps } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedAccordion } from '@/components/AnimatedAccordion';
import searchEntities from '@/app/data/search_entities.json';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchData, SearchEntity } from '@/app/types/search';
import { SharedValue } from 'react-native-reanimated';
import { NewsLogo } from '@/components/NewsLogo';

const typedSearchEntities = searchEntities as SearchData;

export default function SearchScreen() {
    const { top, bottom } = useSafeAreaInsets();


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

    const LargeHeaderComponent = () => (
        <View style={styles.largeHeaderContainer}>
            <View style={styles.largeHeaderTopRow}>
                <View style={styles.headerTopRow}>
                    <NewsLogo size={28} />
                    <Text style={styles.followingText}>Following</Text>

                </View>

            </View>
            <SearchComponent />
        </View>
    );

    return (
        <ScrollViewWithHeaders
            LargeHeaderComponent={LargeHeaderComponent}
            HeaderComponent={HeaderComponent}
            contentContainerStyle={[styles.container, { paddingBottom: bottom }]}
            style={styles.scrollView}
        >
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
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 12,
        // paddingVertical: 8,
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
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
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#fff',
    },
    headerTopRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    followingText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#a8a8a8',
    },
    editButton: {
        fontSize: 17,
        color: '#fe425f',
        fontWeight: '400',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',

        height: 50,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        position: 'absolute',
        right: 16,

    },


    followingTextCenter: {
        fontSize: 16,
        fontWeight: '500',
        color: '#a8a8a8',
    },
}); 