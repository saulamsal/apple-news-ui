import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ScrollViewWithHeaders, Header } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { SharedValue } from 'react-native-reanimated';
import { CategoryCard } from '@/components/CategoryCard';
import searchEntities from '@/app/data/search_entities.json';
import { getAllEntitiesForSection } from '@/app/utils/entityUtils';
import { Link, router } from 'expo-router';
import { NestableScrollContainer, NestableDraggableFlatList, ScaleDecorator, RenderItemParams } from "react-native-draggable-flatlist";
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

type Entity = {
    id: string;
    title: string;
    logo?: string;
    icon?: string;
    type: string;
    entity_type?: string;
    description?: string;
    theme?: {
        backgroundColor: string;
        textColor: string;
    };
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

export default function EditFollowingScreen() {
    const { top, bottom } = useSafeAreaInsets();
    const [followingItems, setFollowingItems] = useState<Entity[]>([]);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const myFollowingSection = searchEntities.sections.find(section => section.id === 'my_following');
        const items = myFollowingSection ? getAllEntitiesForSection('my_following') : [];
        setFollowingItems(items);
    }, []);

    const HeaderSurface = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
        <FadingView opacity={showNavBar} style={StyleSheet.absoluteFill}>
            <BlurView 
                style={StyleSheet.absoluteFill} 
                intensity={80} 
                tint="light"
            />
        </FadingView>
    );

    const handleDone = () => {
        if (isOrderChanged) {
            // Save the new order here
            // You might want to add a storage mechanism like MMKV or AsyncStorage
        }
        router.back();
    };

    const HeaderComponent = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
        <Header
            borderWidth={0}
            showNavBar={showNavBar}
            SurfaceComponent={HeaderSurface}
            headerCenter={
                <Text className="text-2xl font-bold">Edit Following</Text>
            }
            headerLeft={
                <View className="flex-row items-start px-4 pt-4">
                    <Text onPress={handleDone} className="text-[17px] text-[#fe425f]">
                        {isOrderChanged ? 'Save' : 'Done'}
                    </Text>
                </View>
            }
        />
    );

    const LargeHeaderComponent = () => {
        const insets = useSafeAreaInsets();
        return (
            <View className="px-4 pt-6 pb-3 bg-white" style={{ marginTop: -insets.top }}>
                <Text className="text-3xl font-bold">Edit Following</Text>
            </View>
        );
    }

    const renderItem = ({ item, drag, isActive }: RenderItemParams<Entity>) => {
        return (
            <ScaleDecorator activeScale={0.95}>
                <TouchableOpacity 
                    onLongPress={drag}
                    disabled={isActive}
                    className={`flex-row items-center bg-white mx-2 px-4 py-2 rounded-xl ${isActive ? 'bg-gray-100' : ''}`}
                    style={[
                        isActive && {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3
                        }
                    ]}
                >
                    <View className="flex-1 flex-row items-center">
                        {item.logo ? (
                            <Image 
                                source={{ uri: item.logo }} 
                                className="w-8 h-8 rounded-lg mr-3"
                            />
                        ) : item.icon ? (
                            <View className="w-8 h-8 rounded-lg bg-gray-100 mr-3 items-center justify-center">
                                <Ionicons name={item.icon as any} size={20} color="#666" />
                            </View>
                        ) : null}
                        <Text className="text-[17px] font-medium">{item.title}</Text>
                    </View>
                    <Ionicons 
                        name="menu-outline" 
                        size={24} 
                        color="gray"
                    />
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    const handleDragEnd = ({ data }: { data: Entity[] }) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setFollowingItems(data);
        setIsOrderChanged(true);
    };

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <View className="px-4 py-3 border-b border-gray-200" >
                <View className="flex-row items-center justify-between">
                    <Text onPress={handleDone} className="text-[17px] text-[#fe425f]">
                        {isOrderChanged ? 'Save' : 'Back'}
                    </Text>
                    <Text className="text-xl font-semibold">Edit Following</Text>
                    <View style={{ width: 60 }} />
                </View>
            </View>
            <NestableScrollContainer>
                <NestableDraggableFlatList
                    data={followingItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => `draggable-item-${item.id}`}
                    onDragEnd={handleDragEnd}
                    onDragBegin={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                    onPlaceholderIndexChange={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setIsOrderChanged(true);
                    }}
                    contentContainerStyle={{ paddingBottom: bottom, paddingTop: 20 }}
                    animationConfig={{
                        damping: 20,
                        mass: 0.2,
                        stiffness: 100
                    }}
                    dragHitSlop={{ top: -20, bottom: -20 }}
                />
            </NestableScrollContainer>
        </View>
    );
} 