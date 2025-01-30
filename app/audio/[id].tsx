import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Dimensions, Platform, View } from 'react-native';
import { useEffect, useCallback, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ExpandedPlayer } from '@/components/BottomSheet/ExpandedPlayer';
import { useRootScale } from '@/contexts/RootScaleContext';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import podcastsData from '@/data/podcasts.json';
import { haptics } from '@/helper/haptics';

const SCALE_FACTOR = 0.83;
const DRAG_THRESHOLD = Math.min(Dimensions.get('window').height * 0.20, 150);

export default function AudioScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { setScale } = useRootScale();
    const translateY = useSharedValue(0);
    const isClosing = useRef(false);
    const statusBarStyle = useSharedValue<'light' | 'dark'>('light');
    const isIOS = Platform.OS === 'ios';

    const numericId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '0';
    const episode = podcastsData?.results?.['podcast-episodes']?.[0]?.data?.find(ep => ep.id === numericId) || 
                   podcastsData?.results?.['podcast-episodes']?.[0]?.data?.[0];

    const handleHapticFeedback = useCallback(() => {
        haptics.impact();
    }, []);

    const goBack = useCallback(() => {
        if (!isClosing.current) {
            isClosing.current = true;
            handleHapticFeedback();
            requestAnimationFrame(() => {
                router.back();
            });
        }
    }, [router, handleHapticFeedback]);

    const handleScale = useCallback((newScale: number) => {
        if (isIOS) {
            setScale(newScale);
        }
    }, [setScale, isIOS]);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            'worklet';
            translateY.value = 0;
            if (isIOS) {
                runOnJS(handleScale)(SCALE_FACTOR);
            }
        })
        .onUpdate((event) => {
            'worklet';
            const dy = Math.max(0, event.translationY);
            translateY.value = dy;
            
            const progress = Math.min(dy / 300, 1);
            if (isIOS) {
                const newScale = interpolate(
                    progress,
                    [0, 1],
                    [SCALE_FACTOR, 1],
                    'clamp'
                );
                runOnJS(handleScale)(newScale);
            }

            statusBarStyle.value = progress > 0.2 ? 'dark' : 'light';
        })
        .onEnd((event) => {
            'worklet';
            const shouldClose = event.translationY > DRAG_THRESHOLD;

            if (shouldClose) {
                translateY.value = withTiming(event.translationY + 100, {
                    duration: 300,
                });
                if (isIOS) {
                    runOnJS(handleScale)(1);
                }
                runOnJS(handleHapticFeedback)();
                runOnJS(goBack)();
            } else {
                translateY.value = withSpring(0, {
                    damping: 15,
                    stiffness: 150,
                    mass: 0.5,
                });
                if (isIOS) {
                    runOnJS(handleScale)(SCALE_FACTOR);
                }
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        'worklet';
        return {
            transform: [
                { translateY: translateY.value }
            ],
            backgroundColor: '#fff',
        };
    }, []);

    useEffect(() => {
        if (!isIOS) return;

        const timeout = setTimeout(() => {
            setScale(SCALE_FACTOR);
        }, 50);
        return () => {
            clearTimeout(timeout);
            setScale(1);
        };
    }, [isIOS]);

    const androidBackgroundStyle = useAnimatedStyle(() => {
        if (Platform.OS !== 'android') return {};
        
        const opacity = interpolate(
            translateY.value,
            [0, DRAG_THRESHOLD],
            [0.5, 0]
        );

        return {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity,
        };
    });

    return (
        <View style={styles.container}>
            <StatusBar animated={true} style={statusBarStyle.value} />
            {Platform.OS === 'android' && (
                <Animated.View style={androidBackgroundStyle} />
            )}
            <GestureDetector gesture={panGesture}>
                <Animated.View 
                    style={[
                        styles.modalContent, 
                        animatedStyle,
                        { backgroundColor: '#fff' }
                    ]}
                >
                    <ExpandedPlayer />
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    modalContent: {
        flex: 1,
        backgroundColor: Platform.OS === 'android' ? 'transparent' : 'transparent',
    },
});
