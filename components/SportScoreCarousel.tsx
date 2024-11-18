import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';

interface Team {
  id: string;
  name: string;
  current_form: string;
}

interface Competition {
  id: string;
  name: string;
}

interface Score {
  id: string;
  competition: Competition;
  team1: Team;
  team2: Team;
  startTime: string;
}

interface SportScoreCarouselProps {
  scores: Score[];
}

export const SportScoreCarousel: React.FC<SportScoreCarouselProps> = ({ scores }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const handleScorePress = (scoreId: string) => {
    router.push(`/scores/${scoreId}`);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {scores.map((score, index) => (
          <TouchableOpacity
            key={score.id}
            onPress={() => handleScorePress(score.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.scoreCard,
                index < scores.length - 1 && styles.scoreCardBorder
              ]}
            >
              <Text style={styles.competitionText}>
                {score.competition.name}
              </Text>
              
              <View style={styles.teamsContainer}>
                <View style={styles.teamRow}>
                  <Text style={[styles.teamName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {score.team1.name}
                  </Text>
                  <Text style={styles.formText}>{score.team1.current_form}</Text>
                </View>
                
                <View style={styles.teamRow}>
                  <Text style={[styles.teamName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {score.team2.name}
                  </Text>
                  <Text style={styles.formText}>{score.team2.current_form}</Text>
                </View>
              </View>

              <Text style={styles.timeText}>
                {formatTime(score.startTime)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.bottomBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
  },
  container: {
    paddingHorizontal: 16,
  },
  scoreCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: 140,
  },
  scoreCardBorder: {
    borderRightWidth: 0.5,
    borderRightColor: '#E5E5EA',
  },
  bottomBorder: {
    height: 0.5,
    backgroundColor: '#E5E5EA',
    marginTop: 12,
  },
  competitionText: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 8,
  },
  teamsContainer: {
    gap: 4,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  formText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  timeText: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 8,
  },
}); 