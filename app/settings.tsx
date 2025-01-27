import { View, Text, Switch, StyleSheet, Alert, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Clipboard from 'expo-clipboard';
import { Header, LargeHeader, ScalingView, ScrollViewWithHeaders, ScrollHeaderProps } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';

const storage = new MMKV();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Settings() {
  const { bottom } = useSafeAreaInsets();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  async function registerForPushNotificationsAsync() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found in app.json');
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      setExpoPushToken(token.data);
      storage.set('pushToken', token.data);
      storage.set('notificationsEnabled', true);
      setNotificationsEnabled(true);
    } catch (error) {
      console.error('Error getting push token:', error);
      Alert.alert('Error', 'Failed to get push notification token. Please try again.');
    }
  }

  useEffect(() => {
    const savedToken = storage.getString('pushToken');
    const enabled = storage.getBoolean('notificationsEnabled') || false;
    
    if (savedToken) {
      setExpoPushToken(savedToken);
      setNotificationsEnabled(enabled);
    }
  }, []);

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      await registerForPushNotificationsAsync();
    } else {
      storage.set('notificationsEnabled', false);
      setNotificationsEnabled(false);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(expoPushToken);
    Alert.alert('Copied', 'Token copied to clipboard');
  };

  const sendLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hey 𝕏, How is the demo so far? 👋",
        body: "Go start the repo now!",
        data: { data: "Local notification test" },
      },
      trigger: null,
    });
  };

  const HeaderComponent = (props: ScrollHeaderProps) => (
    <Header
      showNavBar={props.showNavBar}
      headerCenter={<Text style={{ fontSize: 16, fontWeight: 'bold' }}>Settings</Text>}
    />
  );

  const LargeHeaderComponent = (props: ScrollHeaderProps) => (
    <LargeHeader>
      <ScalingView scrollY={props.scrollY}>
        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Settings</Text>
      </ScalingView>
    </LargeHeader>
  );

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.setting}>
            <Text style={styles.settingText}>Enable Push Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
            />
          </View>
          {notificationsEnabled && expoPushToken && (
            <Pressable 
              onPress={copyToClipboard} 
              style={({ pressed }) => [
                styles.tokenContainer,
                { opacity: pressed ? 1 : 0.8 }
              ]}
            >
              <Text style={styles.tokenLabel}>Your Expo Push Token:</Text>
              <Text style={styles.token}>{expoPushToken}</Text>
            </Pressable>
          )}

          <Pressable 
            onPress={sendLocalNotification}
            style={({ pressed }) => [
              styles.notificationButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Text style={styles.buttonText}>Send Test Notification</Text>
          </Pressable>
        </View>
      </View>
    </ScrollViewWithHeaders>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingText: {
    fontSize: 16,
  },
  tokenContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  tokenLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  token: {
    fontSize: 12,
    color: '#333',
  },
  notificationButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
}); 