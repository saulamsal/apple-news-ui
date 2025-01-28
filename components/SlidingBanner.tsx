import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
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

 const SlidingBanner = ({ 
    onPress, 
    icon, 
    image, 
    title, 
    subtitle, 
    backgroundColor 
}: SlidingBannerProps) => {
    return (
        <View className="my">
            <Animated.View
                style={[
                    styles.container,
                {
                    animationName: {
                        from: {
                            transform: [{ translateY: 10 }],
                            opacity: 0
                        },
                        to: {
                            transform: [{ translateX: 0 }],
                            opacity: 1
                        }
                    },
                    animationDuration: '500ms',
                    animationTimingFunction: 'easeOut',
                    backgroundColor
                } as any
            ]}
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
        </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingVertical: 2,
        justifyContent: 'space-between',
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
   
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

export default SlidingBanner;