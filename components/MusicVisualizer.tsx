import { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface Props {
    isPlaying: boolean;
}

const BAR_COUNT = 5;
const ANIMATION_DURATION = 300;

export function MusicVisualizer({ isPlaying }: Props) {
    const animatedValues = useRef(
        Array(BAR_COUNT).fill(0).map(() => new Animated.Value(0))
    ).current;
    const [prominentBar, setProminentBar] = useState(0);
    const randomScales = useRef(Array(BAR_COUNT).fill(0).map(() => 0.3 + Math.random() * 0.4)).current;

    useEffect(() => {
        let prominentInterval: NodeJS.Timeout;

        if (isPlaying) {
            prominentInterval = setInterval(() => {
                setProminentBar(prev => (prev + 1) % BAR_COUNT);
                randomScales.forEach((_, i) => {
                    randomScales[i] = 0.3 + Math.random() * 0.4;
                });
            }, 250);

            const animations = animatedValues.map((value, index) => {
                return Animated.sequence([
                    Animated.timing(value, {
                        toValue: 1,
                        duration: ANIMATION_DURATION * (0.2 + Math.random() * 0.3),
                        useNativeDriver: true,
                    }),
                    Animated.timing(value, {
                        toValue: 0,
                        duration: ANIMATION_DURATION * (0.2 + Math.random() * 0.3),
                        useNativeDriver: true,
                    }),
                ]);
            });

            const loop = Animated.loop(Animated.parallel(animations));
            loop.start();

            return () => {
                loop.stop();
                clearInterval(prominentInterval);
            };
        } else {
            animatedValues.forEach(value => value.setValue(0));
        }
    }, [isPlaying]);

    if (!isPlaying) return null;

    return (
        <View style={styles.container}>
            {animatedValues.map((value, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.bar,
                        {
                            transform: [
                                {
                                    scaleY: value.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.2, index === prominentBar ? 1.4 : randomScales[index]],
                                    }),
                                },
                            ],
                        },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    bar: {
        width: 2.5,
        height: 16,
        backgroundColor: '#fff',
        borderRadius: 1,
    },
}); 