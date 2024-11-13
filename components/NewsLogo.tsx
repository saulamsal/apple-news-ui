import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NewsLogoProps {
    size?: number;
    color?: string;
}

export const NewsLogo = ({ size = 24, color = '#000' }: NewsLogoProps) => {
    return (
        <View style={styles.container}>
            <Ionicons name="logo-apple" size={size} color={color} />
            <Text style={[styles.text, { fontSize: size * 0.8, color }]}>News</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    text: {
        fontWeight: '600',
    },
}); 