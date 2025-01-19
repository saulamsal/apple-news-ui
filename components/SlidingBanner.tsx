import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

interface SlidingBannerProps {
    onPress: () => void;
    icon?: {
        name: string;
        size?: number;
        color?: string;
    };
    image?: {
        uri: string;
        style?: object;
    };
    title: string;
    subtitle: string;
    backgroundColor: string;
}

export const SlidingBanner = ({ 
    onPress, 
    icon, 
    image, 
    title, 
    subtitle, 
    backgroundColor 
}: SlidingBannerProps) => {
    return (
        <MotiView
            from={{
                opacity: 0,
                height: 0,
                marginTop: 0,
                marginBottom: 0,
            }}
            animate={{
                opacity: 1,
                height: 56,
                marginTop: 16,
                marginBottom: 16,
            }}
            transition={{
                type: 'spring',
                delay: 500,
                damping: 20,
                mass: 0.8,
            }}
            style={{
                overflow: 'hidden',
                paddingHorizontal: 4,
            }}
        >
            <TouchableOpacity 
                onPress={onPress}
                style={[
                    styles.container,
                    { backgroundColor }
                ]}
            >
                <View style={styles.contentContainer}>
                    {icon && (
                        <Ionicons 
                            name={icon.name as any} 
                            size={icon.size || 24} 
                            color={icon.color || '#fff'} 
                        />
                    )}
                    {image && (
                        <Image 
                            source={{ uri: image.uri }}
                            style={[styles.leadingImage, image.style]}
                        />
                    )}
                    <View>
                        <Text style={styles.title}>
                            {title}
                        </Text>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subtitle}>
                                {subtitle}
                            </Text>
                            <Ionicons name="chevron-forward" size={14} color="#fff" />
                        </View>
                    </View>
                </View>
                {image && (
                    <Image 
                        source={{ uri: image.uri }}
                        style={styles.backgroundImage}
                    />
                )}
                {icon && (
                    <Ionicons 
                        name={icon.name as any}
                        size={80}
                        color="#fff"
                        style={styles.backgroundIcon}
                    />
                )}
            </TouchableOpacity>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        borderRadius: 12,
        overflow: 'hidden',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    leadingImage: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 2,
        fontWeight: 'bold',
    },
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    subtitle: {
        color: '#fff',
        fontSize: 13,
        opacity: 0.8,
        marginTop: -2,
    },
    backgroundImage: {
        width: 80,
        height: 80,
        position: 'absolute',
        right: -10,
        opacity: 0.1,
    },
    backgroundIcon: {
        position: 'absolute',
        right: -10,
        opacity: 0.1,
    },
}); 