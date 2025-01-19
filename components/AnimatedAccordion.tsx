import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface Props {
    title: string;
    children: React.ReactNode;
}

export function AnimatedAccordion({ title, children }: Props) {
    const [isOpen, setIsOpen] = useState(true);
    const height = useSharedValue(0);

    const contentStyle = useAnimatedStyle(() => ({
        height: withTiming(isOpen ? height.value : 0, {
            duration: 300,
        }),
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{
            rotate: withTiming(isOpen ? '180deg' : '0deg', {
                duration: 300,
            })
        }]
    }));

    const onLayout = (event: LayoutChangeEvent) => {
        const newHeight = event.nativeEvent.layout.height;
        height.value = newHeight;
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Animated.View style={iconStyle}>
                    <Ionicons name="chevron-down" size={24} color={Colors.light.tint} />
                </Animated.View>
            </Pressable>

            <Animated.View style={[styles.contentContainer, contentStyle]}>
                <View onLayout={onLayout} style={styles.innerContent}>
                    {children}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        // borderTopWidth: StyleSheet.hairlineWidth,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        // borderColor: '#E5E5EA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#8D8C91',
    },
    contentContainer: {
        overflow: 'hidden',
    },
    innerContent: {
        position: 'absolute',
        width: '100%',
    }
}); 