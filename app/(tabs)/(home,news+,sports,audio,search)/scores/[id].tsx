import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scores } from '@/data/scores.json';
import { format } from 'date-fns';

export default function ScoreDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const score = scores.find(s => s.id === id);
  if (!score) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[score.team1.bg_color, score.team2.bg_color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
          <Image source={score.team1.logo} style={styles.teamLogo} />
          <Text style={styles.formText}>{score.team1.current_form}, {score.team1.points} PTS</Text>
          <Text style={styles.positionText}>
            {score.team1.position}{score.team1.position_suffix} {score.competition.full_name}
          </Text>
        </View>

        <View style={styles.teamSection}>
          <Image source={score.team2.logo} style={styles.teamLogo} />
          <Text style={styles.formText}>{score.team2.current_form}, {score.team2.points} PTS</Text>
          <Text style={styles.positionText}>
            {score.team2.position}{score.team2.position_suffix} {score.competition.full_name}
          </Text>
        </View>
      </View>

      {/* Match Info */}
      <View style={styles.matchInfo}>
        <Text style={styles.timeText}>
          {format(new Date(score.startTime), 'h:mm a')}
        </Text>
        <Text style={styles.dateText}>
          {format(new Date(score.startTime), 'EEEE M/d')}
        </Text>
        <Text style={styles.competitionText}>
          {score.competition.full_name} • Matchweek {score.competition.matchweek}
        </Text>
      </View>

      {/* Stadium Info */}
      {score.team1.stadium && (
        <View style={styles.stadiumInfo}>
          <Text style={styles.stadiumName}>{score.team1.stadium.name}</Text>
          <Text style={styles.stadiumLocation}>{score.team1.stadium.location}</Text>
        </View>
      )}

      {/* TV Button */}
      <TouchableOpacity style={styles.tvButton}>
        <Text style={styles.tvButtonText}>Open in TV</Text>
      </TouchableOpacity>
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
  formText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 4,
  },
  positionText: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 14,
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
  dateText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 8,
  },
  competitionText: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 16,
  },
  stadiumInfo: {
    alignItems: 'center',
    marginTop: 30,
  },
  stadiumName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  stadiumLocation: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 16,
  },
  tvButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#000000',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tvButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
