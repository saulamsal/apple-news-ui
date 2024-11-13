import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { OverlayContext, OverlayView } from './OverlayContext';

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [views, setViews] = useState<OverlayView[]>([]);

    const addOverlay = useCallback((view: Omit<OverlayView, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setViews(prev => [...prev, { ...view, id }]);
        return id;
    }, []);

    const removeOverlay = useCallback((id: string) => {
        setViews(prev => prev.filter(view => view.id !== id));
    }, []);

    return (
        <OverlayContext.Provider value={{ views, addOverlay, removeOverlay }}>
            <View style={styles.container}>
                {children}
                {views.map(view => (
                    <View key={view.id} style={[styles.overlay, view.style]}>
                        {view.component}
                    </View>
                ))}
            </View>
        </OverlayContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
});
