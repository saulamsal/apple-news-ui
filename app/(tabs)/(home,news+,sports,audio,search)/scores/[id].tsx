import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scores } from '@/data/scores.json';
import { format } from 'date-fns';

const getImageSource = (path: string) => {
  return { uri: path };
};

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
        locations={[0.5, 0.5]}
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
        ) : (
          <Text style={styles.timeText}>
            {format(new Date(score.startTime), 'h:mm a')}
          </Text>
        )}
        <Text style={styles.dateText}>
          {format(new Date(score.startTime), 'EEEE M/d')}
        </Text>
        <Text style={styles.competitionText}>
          {score.competition.full_name} • {score.competition.matchweek}
        </Text>
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  teamSection: {
    alignItems: 'center',
  },
  teamLogo: {
    width: 120,
    height: 120,
    marginBottom: 16,
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
  dateText: {
    // color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 8,
  },
  competitionText: {
    // color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 16,
  }
});
