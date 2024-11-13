import { createContext, useContext } from 'react';
import { ViewStyle } from 'react-native';

export interface OverlayView {
    id: string;
    component: React.ReactNode;
    style?: ViewStyle;
}

interface OverlayContextType {
    views: OverlayView[];
    addOverlay: (view: Omit<OverlayView, 'id'>) => string;
    removeOverlay: (id: string) => void;
}

export const OverlayContext = createContext<OverlayContextType>({
    views: [],
    addOverlay: () => '',
    removeOverlay: () => { },
});

export const useOverlay = () => useContext(OverlayContext);
