import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { format } from 'date-fns';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';


interface Team {
  id: string;
  name: string;
  current_form: string;
  logo: string;
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
  is_live: boolean;
  status: string;
}

interface SportScoreCarouselProps {
  scores: Score[];
}

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

export const SportScoreCarousel: React.FC<SportScoreCarouselProps> = ({ scores }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const formatTime = (timestamp: string, is_live: boolean, status: string) => {
    if (is_live) {
      return 'LIVE';
    }
    if (status === 'completed') {
      return 'Final';
    }
    return format(new Date(timestamp), 'M/dd . h:mm a');
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
                    <Image source={{ uri: score.team1.logo }} style={styles.teamLogo} />
                  <Text style={[styles.teamName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {score.team1.name}
                  </Text>
                  <Text style={styles.formText}>{score.team1.current_form}</Text>
                </View>
                
                <View style={styles.teamRow}>
                <Image source={{ uri: score.team2.logo }} style={styles.teamLogo} />
                  <Text style={[styles.teamName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {score.team2.name}
                  </Text>
                  <Text style={styles.formText}>{score.team2.current_form}</Text>
                </View>
              </View>

              <View style={styles.timeContainer}>
                <Text style={[
                  styles.timeText,
                  score.is_live && styles.liveText
                ]}>
                  {formatTime(score.startTime, score.is_live, score.status)}
                </Text>
                {score.is_live && <LiveDot />}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.seeMoreCard}
          onPress={() => Alert.alert('See More clicked')}
          activeOpacity={0.7}
        >
          <Text style={[styles.seeMoreText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            See More
          </Text>
        </TouchableOpacity>
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
  seeMoreCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF2D55',
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
    alignItems: 'center',
    gap: 2,
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  timeText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  liveText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  teamLogo:{
    width: 16,
    height: 16,
  }
}); 