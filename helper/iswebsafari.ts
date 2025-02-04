import { Platform } from 'react-native';

export const isWebSafari = () => {
  const isBrowser = Platform.OS === 'web' && window?.navigator?.userAgent?.toLowerCase()?.includes('safari');
  return isBrowser;
}