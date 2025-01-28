import { Modal, View, Text, Pressable, StatusBarStyle, Animated } from 'react-native'
import { MMKV } from 'react-native-mmkv'
import { useState, useEffect, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import {AppleNewsLogo} from '@/components/icons/AppleNewsLogo'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

const storage = new MMKV()

export const WelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [statusBarStyle, setStatusBarStyle] = useState('dark')
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const fadeAnimText = useRef(new Animated.Value(0)).current
  const slideAnimText = useRef(new Animated.Value(40)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const scaleAnimText = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    const isWelcomed = storage.getBoolean('is_welcomed')
    if (isWelcomed) {
      setIsVisible(false)
    }

    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 6,
        velocity: 3
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 6,
        velocity: 2
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 5,
      }),
      Animated.sequence([
        Animated.delay(100),
        Animated.parallel([
          Animated.spring(fadeAnimText, {
            toValue: 1,
            useNativeDriver: true,
            tension: 65,
            friction: 6,
            velocity: 3
          }),
          Animated.spring(slideAnimText, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 6,
            velocity: 2
          }),
          Animated.spring(scaleAnimText, {
            toValue: 1,
            useNativeDriver: true,
            tension: 60,
            friction: 5,
          }),
        ]),
      ]),
    ]).start()

    return () => {
      setStatusBarStyle('light')
    }
  }, [])

  const handleContinue = () => {
    storage.set('is_welcomed', true)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={isVisible}
      presentationStyle="formSheet"
    > 
      <StatusBar style={statusBarStyle === 'dark' ? 'light' : 'dark'} />
      <View className="flex-1 bg-white" style={{
        maxWidth: 767,
        width: '100%',
        marginHorizontal: 'auto'
      }}>
        <View className="flex-1 justify-center px-8">
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ] 
          }}>
            <AppleNewsLogo width={100} height={100} color="#FF2D55"/>
          </Animated.View>

          <Animated.View style={{ 
            opacity: fadeAnimText, 
            transform: [
              { translateY: slideAnimText },
              { scale: scaleAnimText }
            ] 
          }}>
            <Text className="text-6xl font-extrabold mt-4">Welcome to</Text>
            <Text className="text-6xl font-extrabold text-[#FF2D55] mb-4">Apple News</Text>
            
            <Text className="text-xl text-gray-600 mb-20 font-semibold">
              The best stories from the sources you love, selected just for you.
            </Text>

            <View className="items-center mb-8">
              <View className="flex-row mb-4">
                <FontAwesome6 name="users" size={20} color="#FF2D55" />
              </View>
              <Text className="text-sm text-gray-500 px-8">
                Apple collects your activity in News, which is not associated with your Apple Account, in order to improve and personalize Apple News. When you turn on notifications for a channel, the channel can be associated with your Apple Account. Your device serial number may be used to check eligibility for service offers.
              </Text>
              <View className="flex-row justify-start w-full">
                <Text className="text-sm text-apple-news px-8 font-semibold mt-1">
                  See how your data is managed...
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleContinue}
              className="w-full bg-[#FF2D55] py-4 rounded-xl"
            >
              <Text className="text-white text-center text-xl font-bold">
                Continue
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </Modal>
  )
} 