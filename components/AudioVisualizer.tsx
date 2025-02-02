import { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { type AnimateStyle } from 'react-native-reanimated';

interface Props {
    isPlaying: boolean;
}

const BAR_COUNT = 4;

export function AudioVisualizer({ isPlaying }: Props) {
    const randomScales = useRef(
        Array(BAR_COUNT).fill(0).map(() => 0.4 + Math.random() * 0.3)
    ).current;

    if (!isPlaying) return null;

    return (
        <View style={styles.container}>
            {Array(BAR_COUNT).fill(0).map((_, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.bar,
                        {
                            animationName: {
                                '0%': {
                                    transform: [{ scaleY: 0.3 }],
                                },
                                '50%': {
                                    transform: [{ scaleY: randomScales[index] * 1.2 }],
                                },
                                '100%': {
                                    transform: [{ scaleY: 0.3 }],
                                },
                            },
                            animationDuration: 800,
                            animationIterationCount: 'infinite',
                            animationDelay: index * 100,
                            animationTimingFunction: 'ease-in-out',
                        } as AnimateStyle<any>,
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    bar: {
        width: 2.5,
        height: 16,
        backgroundColor: '#fff',
        borderRadius: 1,
    },
}); 