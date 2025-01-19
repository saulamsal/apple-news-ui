import { View, Text, StyleSheet, Pressable } from 'react-native'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

export default function Welcome() {
  const handleContinue = () => {
    // router.push('/(tabs)')
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to News</Text>
        <Text style={styles.subtitle}>
          Your personalized news experience starts here
        </Text>
      </View>
      
      <Pressable 
        onPress={handleContinue}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666'
  },
  button: {
    backgroundColor: '#E1484C',
    padding: 16,
    borderRadius: 25,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  }
}) 