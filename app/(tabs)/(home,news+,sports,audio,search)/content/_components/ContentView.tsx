import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollViewWithHeaders, Header, ScrollHeaderProps } from '@codeherence/react-native-header';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useSharedValue } from 'react-native-reanimated';

type ContentViewProps = {
  content: any; // Replace with proper type from your news data
};

export function ContentView({ content }: ContentViewProps) {
  const colorScheme = useColorScheme();

  const HeaderComponent = ({ showNavBar }: ScrollHeaderProps) => {
    const animatedValue = useSharedValue(1);

    return (
      <Header
        showNavBar={animatedValue}
        headerLeft={
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={colorScheme === 'light' ? content.source.light_text : content.source.dark_text} 
            />
          </TouchableOpacity>
        }
        headerCenter={
          <Image 
            source={{ uri: content.source.logo_transparent_dark }}
            style={styles.headerLogo}
          />
        }
        headerStyle={{
          backgroundColor: colorScheme === 'light' ? content.source.dark_bg : "#000",
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
      <ThemedView style={styles.container}>
        <Image 
          source={{ uri: content.featured_image }} 
          style={styles.featuredImage} 
        />
        
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {content.title}
          </ThemedText>

          {content.show_topic && (
            <View style={styles.topicContainer}>
              <ThemedText style={styles.topic}>
                {content.topic.name}
              </ThemedText>
            </View>
          )}

          <View style={styles.authorContainer}>
            <ThemedText style={styles.author}>
              By {content.author.name}
            </ThemedText>
            <ThemedText style={styles.date}>
              {new Date(content.created_at).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
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
    padding: 16,
  },
  headerLogo: {
    height: 24,
    width: 120,
    resizeMode: 'contain',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
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
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
}); 