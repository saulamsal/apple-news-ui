import { Modal, View, Text, Pressable, StatusBarStyle } from 'react-native'
import { MMKV } from 'react-native-mmkv'
import { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import {AppleNewsLogo} from '@/components/icons/AppleNewsLogo'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

const storage = new MMKV()

export const WelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [statusBarStyle, setStatusBarStyle] = useState('dark')

  useEffect(() => {
    const isWelcomed = storage.getBoolean('is_welcomed')
    if (isWelcomed) {
      setIsVisible(false)
    }

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
     
    > <StatusBar style={ statusBarStyle === 'dark' ? 'light' : 'dark' } />
      <View className="flex-1 bg-white"
      
      style={{
        maxWidth: 767,
        width: '100%',
        marginHorizontal: 'auto'
      }}
      
      >
        <View className="flex-1  justify-center px-8">
       <AppleNewsLogo width={100} height={100}  color="#FF2D55"/>

          <Text className="text-6xl font-extrabold mt-4">Welcome to</Text>
          <Text className="text-6xl font-extrabold text-[#FF2D55] mb-4">Apple News</Text>
          
          <Text className="text-xl  text-gray-600 mb-20 font-semibold">
            The best stories from the sources you love, selected just for you.
          </Text>

          <View className="items-center mb-8">
            <View className="flex-row mb-4">
            <FontAwesome6 name="users" size={20} color="#FF2D55" />
            </View>
            <Text className="text-sm text-gray-500  px-8">
              Apple collects your activity in News, which is not associated with your Apple Account, in order to improve and personalize Apple News. When you turn on notifications for a channel, the channel can be associated with your Apple Account. Your device serial number may be used to check eligibility for service offers.
            </Text>
            <View className="flex-row justify-start  w-full">
            <Text className="text-sm text-apple-news  px-8 font-semibold mt-1">
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
        </View>
      </View>
    </Modal>
  )
} 