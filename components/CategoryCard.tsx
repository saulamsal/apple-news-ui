import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryCardProps {
    title: string;
    icon?: string;
    logo?: string;
}

export function CategoryCard({ title, icon, logo }: CategoryCardProps) {
    return (
        <TouchableOpacity style={styles.container}>
            {icon ? (
                <Ionicons name={icon as any} size={24} color="#FF3B30" />
            ) : logo ? (
                <Image source={{ uri: logo }} style={styles.logo} />
            ) : null}
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        // backgroundColor: '#F2F2F7',
        borderRadius: 10,
        minWidth: '45%',
        gap: 6,
    },
    logo: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    emoji: {
        fontSize: 20,
        marginRight: 8,
    },
    iconContainer: {
        width: 24,
        height: 24,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
    },
}); 