import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

interface CategoryCardProps {
    id: string;
    title: string;
    icon?: string;
    logo?: string;
}

export const CategoryCard = ({ id, title, icon, logo }: CategoryCardProps) => {
    const router = useRouter();

    const handlePress = () => {
        if (id === 'stocks') {
            router.push('/stocks');
        } else {
            router.push(`/(tabs)/(search)/topic/${id}`);
        } 
    }

    return (
        <TouchableOpacity 
            onPress={handlePress}
            className="flex-row items-center px-2 rounded-xl gap-2"
        >
            {icon ? (
                <Ionicons name={icon as any} size={28} color={Colors.light.tint} />
            ) : logo ? (
                <Image source={{ uri: logo }} style={styles.logo} />
            ) : null}
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
    }
}); 