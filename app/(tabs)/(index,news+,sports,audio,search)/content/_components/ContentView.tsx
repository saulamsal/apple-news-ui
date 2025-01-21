import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ScrollViewWithHeaders, Header, ScrollHeaderProps } from '@codeherence/react-native-header';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { router } from 'expo-router';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

type ContentViewProps = {
  content: any; // Replace with proper type from your news data
};

export function ContentView({ content }: ContentViewProps) {
  const colorScheme = useColorScheme();
  const router = useRouter()

  // useEffect(() => {
  //   const checkFirstTime = async () => {
  //     try {
  //       const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome')
  //       if (!hasSeenWelcome) {
  //         router.push('/welcome')
  //       }
  //     } catch (error) {
  //       console.error('Error checking welcome state:', error)
  //     }
  //   }

  //   checkFirstTime()
  // }, [])

  const HeaderComponent = ({ showNavBar }: ScrollHeaderProps) => {
    const animatedValue = useSharedValue(1);

    return (
      <Header
        showNavBar={animatedValue}
        headerLeft={
          <View style={{ flexDirection: 'row', alignItems: 'center' }} className="gap-4">
            <TouchableOpacity onPress={() => router.back()} className="p-1 rounded-full bg-[#eaeaea2d]">
              <Ionicons
                name="chevron-back"
                size={22}
                color={content.source.light_text}
              />
            </TouchableOpacity>

            <TouchableOpacity className="bg-[#eaeaea2d] rounded-full p-1.5">
              <MaterialCommunityIcons name="thumbs-up-down-outline" size={20} color={content.source.light_text} />
            </TouchableOpacity>
          </View>

        }
        headerCenter={
          <Image
            source={{ uri: content.source.logo_transparent_dark }}
            style={styles.headerLogo}
          />
        }

        headerRight={
          <View style={{ flexDirection: 'row', alignItems: 'center' }} className="gap-4">

          <TouchableOpacity className="bg-[#eaeaea2d] rounded-full p-1.5">
            <Ionicons name="share-outline" size={20} color={content.source.light_text} />
            </TouchableOpacity>

            <TouchableOpacity className="bg-[#eaeaea2d] rounded-full p-1.5">
              <Ionicons name="ellipsis-horizontal" size={20} color={content.source.light_text} />
            </TouchableOpacity>
          </View>
        }


        headerStyle={{
          backgroundColor: content.source.dark_bg,
          paddingBottom: 10,
        }}
        borderWidth={0}
      />
    );
  };

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
    
        <View style={styles.content}>
       


       <View className="gap-2 px-7 py-8">
       <Text style={[styles.title, { fontWeight: 'bold' }]}>
            {content.title}
          </Text>
{/* 
          {content.show_topic && (
            <View style={styles.topicContainer}>
              <Text style={styles.topic}>
                {content.topic.name}
              </Text>
            </View>
          )} */}

          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-gray-500 -tracking-[0.3px]">{content.description}</Text>
          </View>

          <View style={styles.authorContainer}>
            <Text style={styles.author}>
              By {content.author.name}
            </Text>
            {/* <Text style={styles.date}>
              {new Date(content.created_at).toLocaleDateString()}
            </Text> */}
          </View>

       </View>

          <Image
          source={{ uri: content.featured_image }}
          style={styles.featuredImage}
        />



          <Text className="px-10 text-xl tracking-tight mt-8">
            {content.content}
          </Text>
        </View>
      </View>
    </ScrollViewWithHeaders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  featuredImage: {
    width: '100%',
    height: 300,
  },
  content: {
    // padding: 16,
  },
  headerLogo: {
    height: 24,
    width: 120,
    resizeMode: 'contain',
  },
  backButton: {
    // padding: 8,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  topicContainer: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  topic: {
    fontSize: 14,
    color: '#666',
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  author: {
    fontSize: 14,
    color: '#666',
    opacity: 0.5,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
}); 