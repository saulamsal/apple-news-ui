import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scores } from '@/data/scores.json';
import { format } from 'date-fns';
import { MotiView } from 'moti';

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
    <View style={styles.container}>
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
        {isCompleted && (
            <Text style={styles.scoreText}>{score.team1.score}</Text>
          )}
          <Image source={getImageSource(score.team1.logo)} style={styles.teamLogo} />
       
        </View>

        <View style={styles.teamSection}>
        {isCompleted && (
            <Text style={styles.scoreText}>{score.team2.score}</Text>
          )}
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
          <TouchableOpacity 
            style={styles.watchButton}
            onPress={() => Alert.alert('Opening Apple TV...')}
            activeOpacity={0.8}
          >
            <View style={styles.watchButtonContent}>
              <Text style={styles.watchButtonText}>Watch on</Text>
              <View style={styles.appleContainer}>
                <Ionicons name="logo-apple" size={20} color="#fff" />
                <Text style={styles.watchButtonText}>tv</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 10,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 80,
    fontWeight: 'bold',
    marginTop: 8,
  },
  matchInfo: {
    alignItems: 'center',
    marginTop: 40,
  },
  timeText: {
    // color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  finalText: {
    // color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
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
    marginBottom: 8,
  },
  competitionText: {
    // color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 16,
  },
  watchButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 20,
    paddingHorizontal: 80,
    // minWidth: 200,
  },
  watchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '500',
  },
  appleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
});
