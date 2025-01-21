import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert, ScrollView, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scores } from '@/data/scores.json';
import { format } from 'date-fns';
import { MotiView } from 'moti';
import { news } from '@/data/news.json';
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import { SlidingBanner } from '@/components/SlidingBanner';

const getImageSource = (path: string) => {
  return { uri: path };
};

const LiveDot = () => (
  <MotiView
    from={{
      opacity: 0.4,
      scale: 0.8,
    }}
    animate={{
      opacity: 1,
      scale: 1,
    }}
    transition={{
      type: 'timing',
      duration: 1000,
      loop: true,
    }}
    style={styles.liveDot}
  />
);

export default function ScoreDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const score = scores.find(s => s.id === id);
  if (!score) return null;

  const isCompleted = score.status === 'completed';

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <View>
        <LinearGradient
          colors={[score.team1.bg_color, score.team2.bg_color]}
          start={{ x: -0.5, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0.65, 0.65]}
          style={StyleSheet.absoluteFill}
        />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BlurView intensity={70} style={styles.blurButton}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <BlurView intensity={70} style={styles.blurButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Team Logos */}
        <View style={styles.teamsContainer}>
          <View style={styles.teamSection}>
        
              <Text style={styles.scoreText}>{score.team1.score}</Text>
        
            <Image source={getImageSource(score.team1.logo)} style={styles.teamLogo} />

          </View>

          <View style={styles.teamSection}>
            
              <Text style={styles.scoreText}>{score.team2.score}</Text>
       
            <Image source={getImageSource(score.team2.logo)} style={styles.teamLogo} />

          </View>
        </View>

      </View>




      {/* Match Info */}
      <View style={styles.matchInfo}>
        {isCompleted ? (
          <Text style={styles.finalText}>FINAL</Text>
        ) : score.is_live ? (
          <View style={styles.liveContainer}>
            <Text style={styles.liveText}>LIVE</Text>
            <LiveDot />
          </View>
        ) : (
          <Text style={styles.timeText}>
            {format(new Date(score.startTime), 'h:mm a')}
          </Text>
        )}
        <Text style={styles.dateText}>
          {format(new Date(score.startTime), 'EEEE M/d')}
        </Text>

        <Text style={styles.teamsText}>
          {score.team1.full_name} vs {score.team2.full_name}
        </Text>

        <Text style={styles.competitionText}>
          {score.competition.full_name} • {score.competition.matchweek}
        </Text>

        {score.is_live && (

          <View className="px-4 w-full">
            <SlidingBanner
              // onPress={handlePress}
              image={{
                uri: 'https://img.icons8.com/m_sharp/512/FFFFFF/mac-os.png',
                style: { borderRadius: 14 }
              }}
              title="Watch on Apple TV"
              subtitle="Get 3 months free"
              backgroundColor="#000"
            />
          </View>
        )}

        <View style={styles.adContainer}>
          <Image
            source={{ uri: 'https://photos5.appleinsider.com/gallery/36562-68112-Screen-Shot-2020-07-06-at-82042-PM-xl.jpg' }}
            style={styles.appleTVad}
            resizeMode="cover"
          />
        </View>

        {score.is_live && (
          <View style={styles.liveActivityContainer}>
            <Text style={styles.liveActivityText}>Enable Live Activity</Text>
            <Switch 
              value={false}
              onValueChange={(value) => Alert.alert('Live Activity', value ? 'Enabled' : 'Disabled')}
              trackColor={{ false: '#767577', true: '#34C759' }}
              thumbColor="#fff"
            />
          </View>
        )}

        <View style={styles.viewMoreContainer}>
          <Text style={styles.viewMoreTitle}>View more from</Text>
          <TouchableOpacity style={styles.topicItem}>
            <Image 
              source={getImageSource(score.team1.logo)} 
              style={styles.topicLogo} 
            />
            <Text style={styles.topicName}>{score.team1.full_name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topicItem}>
            <Image 
              source={getImageSource(score.team2.logo)} 
              style={styles.topicLogo} 
            />
            <Text style={styles.topicName}>{score.team2.full_name}</Text>
          </TouchableOpacity>
        </View>

      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    marginTop: 20,
    // borderRadius: 14,
    overflow: 'hidden',
    // paddingHorizontal: 20,
    width: '100%',
    height: 250,

  },
  appleTVad: {
    width: '100%',
    height: '100%',
    // borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // paddingHorizontal: 20,
    // paddingTop: 40,
  },
  teamSection: {
    alignItems: 'center',
  },
  teamLogo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  teamsText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 0,
    // marginBottom: 10,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 80,
    fontWeight: 'bold',
    // marginTop: 8,
  },
  matchInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  timeText: {
    // color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    // marginBottom: 4,
  },
  finalText: {
    // color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    // marginBottom: 4,
    letterSpacing: 2,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  liveText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FF3B30',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  dateText: {
    // color: '#FFFFFF',
    fontSize: 18,
    // marginBottom: 8,
  },
  competitionText: {
    // color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 16,
  },

  appleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  relatedStoriesContainer: {
    marginTop: 30,
    paddingHorizontal: 0,
  },
  relatedStoriesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
    letterSpacing: -1,
  },
  liveActivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  liveActivityText: {
    fontSize: 17,
    fontWeight: '600',
  },
  viewMoreContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  viewMoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: -1,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  topicLogo: {
    width: 32,
    height: 32,
  },
  topicName: {
    fontSize: 17,
    fontWeight: '500',
  },
});
