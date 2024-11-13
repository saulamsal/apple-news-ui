import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    title: string;
    children: React.ReactNode;
    initiallyExpanded?: boolean;
}

export const AnimatedAccordion = ({ title, children, initiallyExpanded = false }: Props) => {
    const [isExpanded, setIsExpanded] = React.useState(initiallyExpanded);
    const rotation = useSharedValue(initiallyExpanded ? 180 : 0);
    const height = useSharedValue(initiallyExpanded ? 1 : 0);

    const toggleAccordion = useCallback(() => {
        const newValue = !isExpanded;
        rotation.value = withTiming(newValue ? 180 : 0, { duration: 300 });
        height.value = withTiming(newValue ? 1 : 0, { duration: 300 });
        setIsExpanded(newValue);
    }, [isExpanded]);

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const contentStyle = useAnimatedStyle(() => ({
        height: interpolate(height.value, [0, 1], [0, 'auto']),
        opacity: height.value,
    }));

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleAccordion} style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Animated.View style={[styles.icon, iconStyle]}>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                </Animated.View>
            </TouchableOpacity>
            <Animated.View style={[styles.content, contentStyle]}>
                {children}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5E5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
    },
    icon: {
        width: 20,
        height: 20,
    },
    content: {
        overflow: 'hidden',
    },
}); 