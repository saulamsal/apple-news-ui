import React, { createContext, useContext } from 'react';
import { SharedValue, useSharedValue, withSpring } from 'react-native-reanimated';

interface RootScaleContextType {
    scale: SharedValue<number>;
    setScale: (value: number) => void;
}

const RootScaleContext = createContext<RootScaleContextType | null>(null);

export function RootScaleProvider({ children }: { children: React.ReactNode }) {
    const scale = useSharedValue(1);

    const setScale = (value: number) => {
        'worklet';
        try {
            scale.value = withSpring(value, {
                damping: 15,
                stiffness: 150,
                mass: 0.5, // Added for smoother animation
            });
        } catch (error) {
            console.warn('Scale animation error:', error);
            scale.value = value;
        }
    };

    return (
        <RootScaleContext.Provider value={{ scale, setScale }}>
            {children}
        </RootScaleContext.Provider>
    );
}

export const useRootScale = () => {
    const context = useContext(RootScaleContext);
    if (!context) {
        throw new Error('useRootScale must be used within a RootScaleProvider');
    }
    return context;
};
