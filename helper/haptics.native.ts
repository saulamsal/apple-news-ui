import * as ExpoHaptics from 'expo-haptics';

export const haptics = {
  impact: async () => {
    try {
      await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },
  
  // Add other haptic methods as needed
  notification: async () => {
    try {
      await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },
}; 