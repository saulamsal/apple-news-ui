import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
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
      {/* Diagonal split background */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.backgroundHalf, { backgroundColor: score.team1.bg_color }]} />
        <View style={[styles.backgroundHalf, { backgroundColor: score.team2.bg_color }]} />
        <View style={styles.diagonalLine} />
      </View>

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
          <Image source={getImageSource(score.team1.logo)} style={styles.teamLogo} />
          {isCompleted && (
            <Text style={styles.scoreText}>{score.team1.score}</Text>
          )}
        </View>

        <View style={styles.teamSection}>
          <Image source={getImageSource(score.team2.logo)} style={styles.teamLogo} />
          {isCompleted && (
            <Text style={styles.scoreText}>{score.team2.score}</Text>
          )}
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
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  backgroundHalf: {
    flex: 1,
  },
  diagonalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ rotate: '15deg' }, { translateX: -1 }],
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
    fontSize: 48,
    fontWeight: '700',
    marginTop: 8,
  },
  matchInfo: {
    alignItems: 'center',
    marginTop: 40,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  finalText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 2,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 8,
  },
  competitionText: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 16,
  }
});
