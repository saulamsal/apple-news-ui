import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CategoryCard } from './CategoryCard';
import entities from '@/app/data/entities.json';
import { scores } from '@/data/scores.json';
import { getAllCategories, getAllEntitiesForSection } from '@/src/utils/entityUtils';
import searchEntities from '@/app/data/search_entities.json';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { useSegments, useRouter } from 'expo-router';
import { Animated } from 'react-native';
import { useFonts, Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';
import SocialButtons from './SocialButtons';

interface Entity {
  id: string;
  title: string;
  logo?: string;
  icon?: string;
  type: string;
  description?: string;
  entity_type?: string;
}

interface Game {
  id: string;
  competition: {
    name: string;
  };
  team1: {
    name: string;
    nickname: string;
    score?: number;
    logo?: string;
  };
  team2: {
    name: string;
    nickname: string;
    score?: number;
    logo?: string;
  };
  is_live: boolean;
}

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

const HighlightedText = ({ text, highlight }: HighlightedTextProps) => {
  if (!highlight.trim()) return <Text>{text}</Text>;
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  
  return (
    <Text>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text key={i} style={styles.highlight}>{part}</Text>
        ) : (
          <Text key={i}>{part}</Text>
        )
      )}
    </Text>
  );
};

interface CategoryCardProps {
  title: string;
  logo?: string;
  icon?: string;
  entity_type?: string;
}

export const LiveDot = ({color = '#ffffff', children}: {color?: string, children?: React.ReactNode}) => {
  const pulseAnim = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,  
        })
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.liveDot,
        {
          opacity: pulseAnim,
          backgroundColor: color,
        }
      ]}
    >
      {children}
    </Animated.View>
  );
};

const useWindowSize = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

export function Sidebar() {
  const windowWidth = useWindowSize();
  const shouldUseCustomFont = windowWidth > 768; // Only use custom font on larger screens
  
  const [fontsLoaded] = shouldUseCustomFont ? useFonts({
    Orbitron_700Bold,
    Orbitron_900Black,
  }) : [true];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (segments[1] === '(search)') {
    return null;
  }

  const liveGames = scores.filter((game: Game) => game.is_live);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: Entity[] = [];
    const addedIds = new Set<string>();
    
    Object.values(entities).forEach((entity: any) => {
      const matchesTitle = entity.title?.toLowerCase().includes(query);
      const matchesDescription = entity.description?.toLowerCase().includes(query);
      const matchesType = entity.type?.toLowerCase().includes(query);
      
      if ((matchesTitle || matchesDescription || matchesType) && !addedIds.has(entity.id)) {
        results.push(entity);
        addedIds.add(entity.id);
      }

      if (entity.sub_topics?.items) {
        entity.sub_topics.items.forEach((subTopic: any) => {
          if (subTopic.title?.toLowerCase().includes(query) && !addedIds.has(subTopic.id)) {
            results.push(subTopic);
            addedIds.add(subTopic.id);
          }
        });
      }
    });

    return results;
  }, [searchQuery]);

  // Update the score style to use conditional font
  const scoreStyle = {
    ...styles.score,
    fontFamily: shouldUseCustomFont && fontsLoaded ? 'Orbitron_900Black' : undefined
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.searchContainer, 
        isFocused && { 
          backgroundColor: '#fff',
          borderColor: '#FA2E46',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }
      ]}>
        <Ionicons name="search" size={20} color={isFocused ? "#FA2E46" : "#666"} />
        <TextInput
          placeholder="Search Apple News"
          style={[styles.input, { WebkitAppearance: 'none' }] as any}
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="outline-none active:outline-none focus:outline-none"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {!isFocused && !searchQuery && liveGames.slice(0, 2).map((game: Game) => (
        <TouchableOpacity 
          key={game.id}
          style={styles.scoreCard}
          onPress={() => router.push(`/scores/${game.id}`)}
          className="hover:bg-gray-200 transition-all duration-500"
        >
          <View style={styles.scoreHeader}>
            <Text style={[styles.leagueText, { color:'black' }]}>
              {game.competition.name}
            </Text>
            <View style={styles.liveIndicator}>
              <LiveDot />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <View style={styles.scoreRow}>
            <View style={styles.teamInfo}>
              <Image 
                source={{ uri: game.team1.logo }} 
                style={[styles.teamLogo, { opacity: 0.7 }]} 
              />
              <Text style={[styles.teamName, { color: (game.team1.score ?? 0) > (game.team2.score ?? 0) ? '#000000' : '#6B7280'  }]}>
                {game.team1.nickname}
              </Text>
            </View>
            <Text style={[scoreStyle, { color: (game.team1.score ?? 0) > (game.team2.score ?? 0) ? '#000000' : '#6B7280' }]}>
              {game.team1.score ?? '-'}
            </Text>
          </View>
          <View style={styles.scoreRow}>
            <View style={styles.teamInfo}>
              <Image 
                source={{ uri: game.team2.logo }} 
                style={[styles.teamLogo, { opacity: 0.7 }]} 
              />
              <Text style={[styles.teamName, { color: (game.team1.score ?? 0) < (game.team2.score ?? 0) ? '#000000' : '#6B7280' }]}>
                {game.team2.nickname}
              </Text>
            </View>
            <Text style={[scoreStyle, { color: (game.team1.score ?? 0) < (game.team2.score ?? 0) ? '#000000' : '#6B7280' }]}>
              {game.team2.score ?? '-'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}


    
      <View style={styles.content}>
        {searchQuery ? (
          searchResults.length > 0 ? (
            <View style={styles.resultsList}>
              {searchResults.map((entity) => (
                <CategoryCard
                  key={entity.id}
                  id={entity.id}
                  title={entity.title}
                  logo={entity.logo}
                  icon={entity.icon}
                  entity_type={entity.entity_type}
                  description={entity.description}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.noResults}>No results found</Text>
          )
        ) : (
          <View style={styles.defaultContent}>

               {searchEntities.sections.map((section) => {
              if (section.id === 'my_following' || section.id === 'special_coverage') return null;
              return (
                <View key={section.id} style={styles.section}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <View style={styles.sectionContent}>
                    {getAllEntitiesForSection(section.id).map((entity: Entity) => (
                      <CategoryCard
                        key={entity.id}
                        id={entity.id}
                        title={entity.title}
                        logo={entity.logo}
                        entity_type={entity.entity_type}
                      />
                    ))}
                  </View>
                </View>
              );
            })}


            <View style={styles.categories}>
              {getAllCategories().map((entity: Entity) => (
                <CategoryCard
                  key={entity.id}
                  id={entity.id}
                  title={entity.title}
                  icon={entity.icon}
                  entity_type={entity.entity_type}
                />
              ))}
            </View>

         
          </View>
        )}

          {(!isFocused && !searchQuery)  && <SocialButtons  showGithub/>}


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Remove flex: 1 to prevent internal scrolling
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000008',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 17,
    height: '100%',
    letterSpacing: -0.4,
    outline: 'none',
  },
  content: {
    flex: 1,
  },
  resultsList: {
    gap: 12,
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
  },
  defaultContent: {
    gap: 12,
  },
  categories: {
    gap: 12,
    marginVertical:16
  },
  section: {
    gap: 12,
    borderRadius: 20,
    padding: 12,
    backgroundColor: '#00000008',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionContent: {
    gap: 12,
  },
  highlight: {
    fontWeight: 'bold',
  },
  scoreCard: {
    backgroundColor: '#00000008',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leagueText: {
    fontSize: 12,
    fontWeight: '600',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FA2E46',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  liveText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamLogo: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 