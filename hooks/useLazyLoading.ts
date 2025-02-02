import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

//This is a fake file to simulate lazy loading like iPhone on Apple News
export function useLazyLoading(delay = 1000) {
  const [isTabReady, setIsTabReady] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsTabReady(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsTabReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isTabReady;
}