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
    Easing,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import podcastsData from '@/data/podcasts.json';
import { haptics } from '@/helper/haptics';
import { useAudio } from '@/contexts/AudioContext';

const SCALE_FACTOR = 0.83;
const DRAG_THRESHOLD = Math.min(Dimensions.get('window').height * 0.20, 150);

export default function AudioScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { setScale } = useRootScale();
    const translateY = useSharedValue(0);
    const isClosing = useSharedValue(false);
    const statusBarStyle = useSharedValue<'light' | 'dark'>('light');
    const isIOS = Platform.OS === 'ios';
    const windowHeight = useSharedValue(Dimensions.get('window').height);
    const dragProgress = useSharedValue(0);
    const { commands, currentEpisode, sharedValues } = useAudio();
    const { loadEpisodeWithoutPlaying, playEpisode } = commands;
    const { isPlaying } = sharedValues;

    const numericId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '0';
    const episode = podcastsData?.results?.['podcast-episodes']?.[0]?.data?.find(ep => ep.id === numericId) || 
                   podcastsData?.results?.['podcast-episodes']?.[0]?.data?.[0];

    useEffect(() => {
        // Only load if this episode isn't already playing
        if (currentEpisode?.id === numericId) return;
        if (!episode || !episode.attributes.assetUrl) return;

        const loadPodcast = async () => {
            const imageUrl = episode.attributes.artwork?.url?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') || 'https://via.placeholder.com/300';

            const podcast = {
                id: episode.id,
                title: episode.attributes.name,
                streamUrl: episode.attributes.assetUrl,
                artwork: { url: imageUrl },
                showTitle: episode.relationships?.podcast?.data[0]?.attributes?.name || episode.attributes.artistName,
                duration: episode.attributes.durationInMilliseconds || 0,
                releaseDate: episode.attributes.releaseDateTime,
                summary: episode.attributes.description.standard || ''
            };

            // If we already have audio playing, use playEpisode to preserve state
            // Otherwise use loadEpisodeWithoutPlaying for initial load
            if (currentEpisode && isPlaying.value) {
                await playEpisode(podcast);
            } else {
                await loadEpisodeWithoutPlaying(podcast);
            }
        };

        loadPodcast();
    }, [numericId, currentEpisode?.id]);

    const handleHapticFeedback = useCallback(() => {
        haptics.impact();
    }, []);

    const goBack = useCallback(() => {
        requestAnimationFrame(() => {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/');
            }
        });
    }, [router]);

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

    const panGesture = Gesture.Pan()
        .onStart(() => {
            'worklet';
            translateY.value = 0;
            dragProgress.value = 0;
            isClosing.value = false;
            if (isIOS) {
                const newScale = interpolate(
                    dragProgress.value,
                    [0, 1],
                    [SCALE_FACTOR, 1],
                    'clamp'
                );
                setScale(newScale);
            }
        })
        .onUpdate((event) => {
            'worklet';
            // Always allow dragging
            const dy = Math.max(0, event.translationY);
            translateY.value = dy;
            
            dragProgress.value = Math.min(dy / 300, 1);
            if (isIOS) {
                const newScale = interpolate(
                    dragProgress.value,
                    [0, 1],
                    [SCALE_FACTOR, 1],
                    'clamp'
                );
                setScale(newScale);
            }

            statusBarStyle.value = dragProgress.value > 0.2 ? 'dark' : 'light';
        })
        .onEnd((event) => {
            'worklet';
            // Only check threshold when finger is lifted
            const shouldClose = event.translationY > DRAG_THRESHOLD;
            
            if (shouldClose) {
                isClosing.value = true;
                translateY.value = withTiming(
                    windowHeight.value,
                    { duration: 300, easing: Easing.out(Easing.cubic) },
                    (finished) => {
                        if (finished) runOnJS(goBack)();
                    }
                );
                if (isIOS) {
                    dragProgress.value = withTiming(1, { duration: 300 });
                    setScale(1);
                }
                runOnJS(handleHapticFeedback)();
            } else {
                translateY.value = withSpring(0, { damping: 20, stiffness: 100, mass: 1 });
                if (isIOS) {
                    dragProgress.value = withSpring(0, { damping: 20, stiffness: 100, mass: 1 });
                    setScale(SCALE_FACTOR);
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
                        Platform.OS === 'ios' && animatedStyle,
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
