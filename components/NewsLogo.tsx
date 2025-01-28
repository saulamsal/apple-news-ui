import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';

interface NewsLogoProps {
    size?: number;
    color?: string;
    forceShow?: boolean;
}

export const NewsLogo = ({ size = 24, color = '#000', forceShow = false }: NewsLogoProps) => {
    const { width } = useWindowDimensions();
    const showSidebar = width >= 1024;
    const isMobile = width < 768;

    if(!showSidebar && !forceShow && !isMobile) {
        return null;
    }

    if(showSidebar && !forceShow && !isMobile) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Ionicons name="logo-apple" size={size * 0.8} color={color} />
            {(showSidebar || isMobile) && <Text style={[styles.text, { fontSize: size * 0.8, color }]}>News</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    text: {
        fontWeight: '800',
    },
}); 