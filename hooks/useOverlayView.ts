import { useCallback, useEffect, useRef } from 'react';
import { useOverlay } from '@/components/Overlay/OverlayContext';

export const useOverlayView = () => {
    const { addOverlay, removeOverlay } = useOverlay();
    const overlayIdRef = useRef<string | null>(null);

    const show = useCallback((component: React.ReactNode) => {
        if (overlayIdRef.current) {
            removeOverlay(overlayIdRef.current);
        }
        overlayIdRef.current = addOverlay({ component });
    }, [addOverlay, removeOverlay]);

    const hide = useCallback(() => {
        if (overlayIdRef.current) {
            removeOverlay(overlayIdRef.current);
            overlayIdRef.current = null;
        }
    }, [removeOverlay]);

    useEffect(() => {
        return () => {
            if (overlayIdRef.current) {
                removeOverlay(overlayIdRef.current);
            }
        };
    }, [removeOverlay]);

    return { show, hide };
};
