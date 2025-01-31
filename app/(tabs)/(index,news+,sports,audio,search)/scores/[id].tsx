import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert, ScrollView, Switch, ViewStyle } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BlurView from '@/components/BlurView';
// import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scores } from '@/data/scores.json';
import { format } from 'date-fns';
import { news } from '@/data/news.json';
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import SlidingBanner from '@/components/SlidingBanner';
import { ScrollViewWithHeaders, Header } from '@codeherence/react-native-header';
import Animated, { 
  SharedValue,
  withSpring,
  withRepeat,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
  useSharedValue,
  AnimateStyle,
} from 'react-native-reanimated';
import { useFonts, Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';
import {DropdownMenu} from '@/components/DropdownMenu';
import * as Sharing from 'expo-sharing';
import React, { useReducer, useEffect } from 'react';
// import * as Clipboard from 'expo-clipboard';


import LiveActivities from "@/modules/expo-live-activity";

type GameEvent = {
  time: string;
  event: string;
  situation: string;
};

type Team = {
  id: string;
  name: string;
  full_name: string;
  nickname: string;
  current_form: string;
  bg_color: string;
  logo: string;
  score?: number;
  events: GameEvent[];
  points?: number;
  position?: number;
  position_suffix?: string;
};

type Score = {
  id: string;
  competition: {
    id: string;
    name: string;
    full_name: string;
    matchweek: string | number;
  };
  sports_type: string;
  team1: Team;
  team2: Team;
  startTime: string;
  status: string;
  is_finished: boolean;
  is_live: boolean;
  current_clock?: {
    time: string;
    period: string;
  };
  period_scores: {
    team1: number[];
    team2: number[];
  };
  venue: {
    name: string;
    location: string;
  };
};

const getImageSource = (path: string) => {
  return { uri: path };
};

const pulseKeyframes = {
  0: {
    opacity: 0.4,
    transform: [{ scale: 0.8 }]
  },
  1: {
    opacity: 1,
    transform: [{ scale: 1 }]
  }
} as const;

const LiveDot = () => (
  <Animated.View
    style={[
      styles.liveDot,
      {
        animationName: {
          from: {
            opacity: 0.4,
            transform: [{ scale: 0.8 }]
          },
          to: {
            opacity: 1,
            transform: [{ scale: 1 }]
          }
        },
        animationDuration: '2000ms',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
        animationTimingFunction: 'easeInOut',
      } as any
    ]}
  />
);

const FadingView = ({ opacity, children, style }: { 
  opacity: SharedValue<number>, 
  children?: React.ReactNode,
  style?: any 
}) => (
  <Animated.View style={[{ opacity }, style]}>
      {children}
  </Animated.View>
);

export default function ScoreDetailsScreen() {
  const [fontsLoaded] = useFonts({
    Orbitron_700Bold,
    Orbitron_900Black,
  });

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const score = scores.find(s => s.id === id) as Score;
  if (!score) return null;

  const isCompleted = score.status === 'completed';

  const HeaderSurface = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
    <FadingView opacity={showNavBar} style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[score.team1.bg_color, score.team2.bg_color]}
        start={{ x: -0.5, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0.65, 0.65]}
        style={StyleSheet.absoluteFill}
      />
    </FadingView>
  );

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(`https://news.expo.app/scores/${id}`);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };


  const handleCopyLink = async () => {
    try {
      
      // TODO
      // await Clipboard.setStringAsync(`https://example.com/scores/${id}`);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleReportIssue = (issue: string) => {
    Alert.alert(
      'Report Issue',
      `Thank you for reporting ${issue}. We'll look into it.`,
      [{ text: 'OK' }]
    );
  };

  const handleTeamAction = (team: typeof score.team1 | typeof score.team2, action: string) => {
    Alert.alert(
      'Team Action',
      `${action} ${team.full_name}`,
      [{ text: 'OK' }]
    );
  };



  const HeaderComponent = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
    <Header
      borderWidth={0}
      showNavBar={showNavBar}
      SurfaceComponent={HeaderSurface}
      headerLeft={
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BlurView intensity={40} style={styles.blurButton} tint="dark">
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </BlurView>
        </TouchableOpacity>
      }
      headerCenter={
        <View>
          <BlurView intensity={70} style={[styles.blurButton, { overflow: 'hidden', borderRadius: 100, paddingHorizontal: 8 }]} tint="dark">
            <View style={styles.headerTeamsContainer}>
              <Image source={getImageSource(score.team1.logo)} style={styles.headerTeamLogo} />
              <Text style={[styles.headerVsText, { color: '#fff' }]}>VS</Text>
              <Image source={getImageSource(score.team2.logo)} style={styles.headerTeamLogo} />
            </View>
          </BlurView>
        </View>
      }
      headerRight={
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <BlurView intensity={40} style={[styles.blurButton, styles.menuButton]} tint="dark">
              <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
            </BlurView>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item key="share" onSelect={handleShare}>
              <DropdownMenu.ItemIcon ios={{ name: "square.and.arrow.up" }} />
              <DropdownMenu.ItemTitle>Share Game</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item key="copy" onSelect={handleCopyLink}>
              <DropdownMenu.ItemIcon ios={{ name: "link" }} />
              <DropdownMenu.ItemTitle>Copy Link</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            {Platform.OS === 'ios' && score.is_live && (
              <DropdownMenu.Item key="liveactivity" onSelect={async ()=> {
                try {
                  // Check if Live Activities are available
                  const activitiesEnabled = LiveActivities.areActivitiesEnabled();
                  if (!activitiesEnabled) {
                    Alert.alert('Error', 'Live Activities are not available on this device');
                    return;
                  }

                  // Check if there's already an activity in progress
                  const activityInProgress = LiveActivities.isActivityInProgress();
                  if (activityInProgress) {
                    Alert.alert(
                      'Live Activity In Progress',
                      'Would you like to end the current Live Activity and start a new one?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel'
                        },
                        {
                          text: 'End & Start New',
                          style: 'destructive',
                          onPress: async () => {
                            // End the current activity
                            LiveActivities.endActivity({
                              homeScore: 0,
                              awayScore: 0,
                              timeOrPeriod: "ENDED",
                              currentEvent: "Activity ended",
                              situation: "ENDED",
                              homeColor: "#000000",
                              awayColor: "#000000"
                            });

                            // Wait a bit for the activity to end
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            // Start the new activity
                            const initialState = {
                              homeScore: score.team1.score || 0,
                              awayScore: score.team2.score || 0,
                              timeOrPeriod: score.team1.events?.[0]?.time || "Q1 0:00",
                              currentEvent: score.team1.events?.[0]?.event || "Game started!",
                              situation: score.team1.events?.[0]?.situation || "KICKOFF",
                              homeColor: score.team1.bg_color,
                              awayColor: score.team2.bg_color
                            };

                            const success = await LiveActivities.startActivity(
                              score.competition.full_name,
                              score.team1.name,
                              score.team1.nickname,
                              score.team2.name,
                              score.team2.nickname,
                              initialState
                            );

                            if (success) {
                              Alert.alert('Success', 'New Live Activity started!');
                            }
                          }
                        }
                      ]
                    );
                    return;
                  }

                  const initialState = {
                    homeScore: score.team1.score || 0,
                    awayScore: score.team2.score || 0,
                    timeOrPeriod: score.team1.events?.[0]?.time || "Q1 0:00",
                    currentEvent: score.team1.events?.[0]?.event || "Game started!",
                    situation: score.team1.events?.[0]?.situation || "KICKOFF",
                    homeColor: score.team1.bg_color,
                    awayColor: score.team2.bg_color
                  };

                  // Debug logging
                  console.log('Starting Live Activity with:', {
                    competition: score.competition.full_name,
                    homeTeam: score.team1.name,
                    homeTeamNickname: score.team1.nickname,
                    awayTeam: score.team2.name,
                    awayTeamNickname: score.team2.nickname,
                    initialState
                  });

                  // Start the Live Activity
                  const success = await LiveActivities.startActivity(
                    score.competition.full_name,
                    score.team1.name,
                    score.team1.nickname,
                    score.team2.name,
                    score.team2.nickname,
                    initialState
                  );

                  
                  
                  if (success) {
                    Alert.alert('Success', 'Live Activity started!');
                    
                    let eventIndex = 0;
                    const allEvents = [...(score.team1.events || []), ...(score.team2.events || [])].sort((a: GameEvent, b: GameEvent) => {
                      const timeA = parseInt(a.time.split(' ')[0].replace('Q', ''));
                      const timeB = parseInt(b.time.split(' ')[0].replace('Q', ''));
                      return timeA - timeB;
                    });

                    // Set up an interval to update with real events
                    const interval = setInterval(() => {
                      if (eventIndex < allEvents.length) {
                        const event = allEvents[eventIndex];
                        const isTeam1Event = score.team1.events?.includes(event);
                        
                        LiveActivities.updateActivity({
                          homeScore: isTeam1Event ? (score.team1.score || 0) : (score.team1.score || 0),
                          awayScore: !isTeam1Event ? (score.team2.score || 0) : (score.team2.score || 0),
                          timeOrPeriod: event.time,
                          currentEvent: event.event,
                          situation: event.situation,
                          homeColor: score.team1.bg_color,
                          awayColor: score.team2.bg_color
                        });
                        
                        eventIndex++;
                      } else {
                        clearInterval(interval);
                        LiveActivities.endActivity({
                          homeScore: score.team1.score || 0,
                          awayScore: score.team2.score || 0,
                          timeOrPeriod: "FINAL",
                          currentEvent: "Game Over!",
                          situation: "FINAL",
                          homeColor: score.team1.bg_color,
                          awayColor: score.team2.bg_color
                        });
                        // Alert.alert('Info', 'Live Activity ended');
                      }
                    }, 5000);
                  } else {
                    Alert.alert('Error', 'Failed to start Live Activity');
                  }
                } catch (error) {
                  console.error('Live Activity error:', error);
                  // Alert.alert('Error', 'Failed to start Live Activity');
                }
              }}>
                <DropdownMenu.ItemIcon 
                  ios={{
                    name: "inset.filled.topthird.square",
                    paletteColors: ['#007AFF']
                  }}
                />
                <DropdownMenu.ItemTitle>Enable Live Activity</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger key="team1">
                  <DropdownMenu.ItemIcon />
                  <DropdownMenu.ItemTitle>{score.team1.nickname}</DropdownMenu.ItemTitle>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item key="follow1" onSelect={() => handleTeamAction(score.team1, 'Follow')}>
                    <DropdownMenu.ItemIcon ios={{ name: "minus.circle" }} />
                    <DropdownMenu.ItemTitle>Unfollow Team</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item key="block1" onSelect={() => handleTeamAction(score.team1, 'Block')}>
                    <DropdownMenu.ItemIcon ios={{ name: "hand.raised" }} />
                    <DropdownMenu.ItemTitle>Block Team</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item key="goto1" onSelect={() => handleTeamAction(score.team1, 'Go to')}>
                    <DropdownMenu.ItemIcon ios={{ name: "arrow.forward" }} />
                    <DropdownMenu.ItemTitle>Go to Team</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger key="team2">
                  <DropdownMenu.ItemIcon  />
                  <DropdownMenu.ItemTitle>{score.team2.nickname}</DropdownMenu.ItemTitle>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item key="follow2" onSelect={() => handleTeamAction(score.team2, 'Follow')}>
                    <DropdownMenu.ItemIcon ios={{ name: "minus.circle" }} />
                    <DropdownMenu.ItemTitle>Unfollow Team</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item key="block2" onSelect={() => handleTeamAction(score.team2, 'Block')}>
                    <DropdownMenu.ItemIcon ios={{ name: "hand.raised" }} />
                    <DropdownMenu.ItemTitle>Block Team</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item key="goto2" onSelect={() => handleTeamAction(score.team2, 'Go to')}>
                    <DropdownMenu.ItemIcon ios={{ name: "arrow.forward" }} />
                    <DropdownMenu.ItemTitle>Go to Team</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger key="report">
                  <DropdownMenu.ItemIcon ios={{ name: "exclamationmark.triangle" }} />
                  <DropdownMenu.ItemTitle>Report an Issue</DropdownMenu.ItemTitle>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item key="report1" onSelect={() => handleReportIssue('Score Not Updating')}>
                    <DropdownMenu.ItemIcon ios={{ name: "clock" }} />
                    <DropdownMenu.ItemTitle>Score Not Updating</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item key="report2" onSelect={() => handleReportIssue('Inaccurate Score')}>
                    <DropdownMenu.ItemIcon ios={{ name: "xmark.circle" }} />
                    <DropdownMenu.ItemTitle>Inaccurate Score</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item key="report3" onSelect={() => handleReportIssue('Other Info Incorrect')}>
                    <DropdownMenu.ItemIcon ios={{ name: "info.circle" }} />
                    <DropdownMenu.ItemTitle>Other Info Incorrect</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      }
      headerStyle={{
        backgroundColor: 'transparent',
        zIndex: 100,
       
        top: 0,
        left: 0,
        right: 0,

        ...(Platform.OS !== 'web' ? {
          position: 'absolute',
          
         
        } : {
          backgroundColor: '#fff',
          height: 55,
          
        }),


        // paddingHorizontal: 10,
      }}

      headerCenterStyle={{
        ...(Platform.OS === 'web' ? {
            width: 'auto',
            minWidth: 'auto', 
            maxWidth: 'auto',
        } : {})
    }}

    headerRightStyle={{
        ...(Platform.OS === 'web' ? {
            width: 'auto',
            minWidth: 'auto',
            maxWidth: 'auto',
        } : {})
    }}

    headerLeftStyle={{
        ...(Platform.OS === 'web' ? {
            width: 'auto',
            minWidth: 'auto',
            maxWidth: 'auto',
        } : {})
    }}





    />
  );

  return (
      <ScrollViewWithHeaders
        HeaderComponent={HeaderComponent}
        // contentContainerStyle={styles.container}
        bounces={false}
     
        
  
        contentContainerStyle={
          Platform.OS === 'web' ? {
            height: undefined
        } : {
            paddingBottom: insets.bottom + 20
        }}
  
        style={{
          backgroundColor: '#fff',
          ...(Platform.OS === 'web' ? {
            height: undefined,
            overflow: 'visible' as const
          } : {})
        }}
        scrollEnabled={Platform.OS !== 'web'} //this makes sure no inner scroll for web
  

     
      >
         <LinearGradient
        colors={[score.team1.bg_color, score.team2.bg_color]}
        start={Platform.OS === 'web' ? { x: -0.3, y: 0.3 } : { x: -0.3, y: 0.3 }}
        end={Platform.OS === 'web' ? { x: 1, y: 0.7 } : { x: 1, y: 0.7 }}
        locations={Platform.OS === 'web' ? [0.5, 0.5] : [0.65, 0.65]}
        style={Platform.OS === 'web' ? {
          position: 'absolute',
          width: '90%',
          borderRadius: 20,
          top: 10,
          height: 240,
          marginHorizontal: 20,
        } : {
          position: 'absolute',
          top: -100,
          left: 0,
          right: 0,
          height: 350 + insets.top,
        }}
      />

        <View>
          {/* Team Logos */}
          <View style={[styles.teamsContainer, { marginTop: insets.top + 20 }]}>
            <View style={styles.teamSection}>
              {/* <BlurView intensity={40} tint="light" style={styles.scoreGradient}> */}
                <Text style={[styles.scoreText, (score.team1.score || 0) <=  (score.team2.score || 0) && { opacity: 0.5 }]}>{score.team1.score || ' '}</Text>
              {/* </BlurView> */}
              <Image source={getImageSource(score.team1.logo)} style={styles.teamLogo} />
            </View>

            <View style={styles.teamSection}>
              {/* <BlurView intensity={40} tint="light" style={styles.scoreGradient}> */}
                <Text style={[styles.scoreText, (score.team2.score || 0) <=  (score.team1.score || 0) && { opacity: 0.5 }]}>{score.team2.score || ' '}</Text>
              {/* </BlurView> */}
              <Image source={getImageSource(score.team2.logo)} style={styles.teamLogo} />
            </View>
          </View>
        </View>

        {/* Match Info */}
        <View style={styles.matchInfo}>
          {isCompleted ? (
            <Text style={styles.finalText}>FINAL</Text>
          ) : score.is_live ? (
            <>
              <View style={styles.liveContainer}>
                <Text style={styles.liveText}>LIVE</Text>
                <LiveDot />
              </View>
              <Text className="mb-4 text-sm text-gray-500" >
                {score.current_clock?.time} • {score.current_clock?.period}
              </Text>
            </>
          ) : (
            <Text style={styles.timeText}>
              {format(new Date(score.startTime), 'h:mm a')}
            </Text>
          )}
          
          {!score.is_live && (
            <Text style={styles.dateText}>
              {format(new Date(score.startTime), 'EEEE M/d')}
            </Text>
          )}

          <Text style={styles.teamsText}>
            {score.team1.nickname} vs {score.team2.nickname}
          </Text>

          <Text style={styles.competitionText} className="mb-4">
            {score.competition.full_name} • {score.competition.matchweek}
          </Text>

 
          {/* Period Scores */}
          <View style={styles.periodScoresContainer}>
            {score.sports_type === 'american_football' && (
              <View style={styles.periodScoresTable}>
                <View style={styles.periodScoresHeader}>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Team</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Q1</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Q2</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Q3</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Q4</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>T</Text>
                </View>
                <View style={styles.periodScoresRow}>
                  <Text style={[styles.periodScoreCell, styles.teamCell]}>{score.team1.name}</Text>
                  {score.period_scores.team1.map((periodScore, index) => (
                    <Text key={index} style={styles.periodScoreCell}>{periodScore}</Text>
                  ))}
                  <Text style={styles.periodScoreCell}>{score.team1.score}</Text>
                </View>
                <View style={styles.periodScoresRow}>
                  <Text style={[styles.periodScoreCell, styles.teamCell]}>{score.team2.name}</Text>
                  {score.period_scores.team2.map((periodScore, index) => (
                    <Text key={index} style={styles.periodScoreCell}>{periodScore}</Text>
                  ))}
                  <Text style={styles.periodScoreCell}>{score.team2.score}</Text>
                </View>
              </View>
            )}

            {score.sports_type === 'soccer' && (
              <View style={styles.periodScoresTable}>
                <View style={styles.periodScoresHeader}>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Team</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>1st</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>2nd</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Total</Text>
                </View>
                <View style={styles.periodScoresRow}>
                  <Text style={[styles.periodScoreCell, styles.teamCell]}>{score.team1.name}</Text>
                  {score.period_scores.team1.map((periodScore, index) => (
                    <Text key={index} style={styles.periodScoreCell}>{periodScore}</Text>
                  ))}
                  <Text style={styles.periodScoreCell}>{score.team1.score}</Text>
                </View>
                <View style={styles.periodScoresRow}>
                  <Text style={[styles.periodScoreCell, styles.teamCell]}>{score.team2.name}</Text>
                  {score.period_scores.team2.map((periodScore, index) => (
                    <Text key={index} style={styles.periodScoreCell}>{periodScore}</Text>
                  ))}
                  <Text style={styles.periodScoreCell}>{score.team2.score}</Text>
                </View>
              </View>
            )}

            {score.sports_type === 'basketball' && (
              <View style={styles.periodScoresTable}>
                <View style={styles.periodScoresHeader}>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Team</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Q1</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Q2</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Q3</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>Q4</Text>
                  <Text style={[styles.periodScoreCell, styles.headerCell]}>T</Text>
                </View>
                <View style={styles.periodScoresRow}>
                  <Text style={[styles.periodScoreCell, styles.teamCell]}>{score.team1.name}</Text>
                  {score.period_scores.team1.map((periodScore, index) => (
                    <Text key={index} style={styles.periodScoreCell}>{periodScore}</Text>
                  ))}
                  <Text style={styles.periodScoreCell}>{score.team1.score}</Text>
                </View>
                <View style={styles.periodScoresRow}>
                  <Text style={[styles.periodScoreCell, styles.teamCell]}>{score.team2.name}</Text>
                  {score.period_scores.team2.map((periodScore, index) => (
                    <Text key={index} style={styles.periodScoreCell}>{periodScore}</Text>
                  ))}
                  <Text style={styles.periodScoreCell}>{score.team2.score}</Text>
                </View>
              </View>
            )}

            {/* Venue Information */}
            <View style={styles.venueContainer}>
              <Text style={styles.venueName}>{score.venue.name}</Text>
              <Text style={styles.venueLocation}>{score.venue.location}</Text>
            </View>
          </View>


          {score.is_live && (
            <View className="px-4 w-full">
              <SlidingBanner
                onPress={() => {}}
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



          <View style={styles.viewMoreContainer}>
            <Text style={styles.viewMoreTitle}>View more from</Text>
            <TouchableOpacity style={styles.topicItem}>
              <Image 
                source={getImageSource(score.team1.logo)} 
                style={styles.topicLogo} 
              />
              <Text style={styles.topicName}>{score.team1.nickname}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.topicItem}>
              <Image 
                source={getImageSource(score.team2.logo)} 
                style={styles.topicLogo} 
              />
              <Text style={styles.topicName}>{score.team2.nickname}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollViewWithHeaders>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTeamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,

    
  },
  headerTeamLogo: {
    width: 28,
    height: 28,
  },
  headerVsText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 12,
  },
  menuButton: {
    width: 28,
    height: 28,
    marginRight: 12,
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
  },
  teamSection: {
    alignItems: 'center',
  },
  teamLogo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  teamsText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 0,
  },
  scoreGradient: {
    borderRadius: 15,
    padding: 10,
    overflow: 'hidden',
  },
  scoreText: {
    // fontFamily: 'Orbitron_700Bold',
    fontFamily: 'Orbitron_900Black',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 60,
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 10,
  },
  matchInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: 'gray',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    color: '#fff',
    marginBottom: 6,
  },
  finalText: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
   
  },
  liveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 15,
  },
  competitionText: {
    opacity: 0.8,
    fontSize: 14,
  },
  adContainer: {
    marginTop: 20,
    overflow: 'hidden',
    width: '100%',
    height: 250,
  },
  appleTVad: {
    width: '100%',
    height: '100%',
  },

  viewMoreContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  viewMoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: -1,
    color: 'gray',
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
  periodScoresContainer: {
    width: '100%',
    padding: 20,
  },
  periodScoresTable: {
    width: '100%',
    marginBottom: 20,
  },
  periodScoresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E5E5EA',
  },
  periodScoreCell: {
    flex: 1,
    padding: 10,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  teamCell: {
    fontWeight: 'bold',
  },
  periodScoresRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  venueLocation: {
    fontSize: 14,
    color: 'gray',
  },
});