import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

interface CategoryCardProps {
    id: string;
    title: string | React.ReactElement;
    icon?: string;
    logo?: string;
    description?: string | React.ReactElement;
    entity_type?: string;
}

export const CategoryCard = ({ id, title, icon, logo, description, entity_type }: CategoryCardProps) => {
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
                <Image source={{ uri: logo }} className={`w-8 h-8 mr-2 ${entity_type === 'person' ? 'rounded-lg' : 'rounded-full'}`} />
            ) : null}
            <View className="flex-1">
                <Text style={styles.title}>{title}</Text>
                {description && (
                    <Text className="text-gray-500 text-sm mt-1">{description}</Text>
                )}  
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
 
    title: {
        fontSize: 18,
        fontWeight: '500',
    }
}); 