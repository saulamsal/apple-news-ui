import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    title: string;
    logo?: string;
    icon?: string;
    onPress?: () => void;
}

export const CategoryCard = ({ title, logo, icon, onPress }: Props) => {
    const getLogoSource = (logoPath: string) => {
        return { uri: logoPath };
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {logo && (
                typeof logo === 'string' && logo.length <= 2 ? (
                    <Text style={styles.emoji}>{logo}</Text>
                ) : (
                    <Image source={getLogoSource(logo)} style={styles.logo} />
                )
            )}
            {icon && (
                <View style={styles.iconContainer}>
                    <Ionicons name={icon as any} size={24} color="#000" />
                </View>
            )}
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F2F2F7',
        borderRadius: 10,
        minWidth: '45%',
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