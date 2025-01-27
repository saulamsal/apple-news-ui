import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CategoryCard } from './CategoryCard';
import entities from '@/app/data/entities.json';
import { getAllCategories, getAllEntitiesForSection } from '@/app/utils/entityUtils';
import searchEntities from '@/app/data/search_entities.json';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity } from 'react-native';

interface Entity {
  id: string;
  title: string;
  logo?: string;
  icon?: string;
  type: string;
  description?: string;
  entity_type?: string;
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

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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
          style={styles.input}
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.content}>
        {searchQuery ? (
          searchResults.length > 0 ? (
            <View style={styles.resultsList}>
              {searchResults.map((entity) => (
                <CategoryCard
                  key={entity.id}
                  id={entity.id}
                  title={<HighlightedText text={entity.title} highlight={searchQuery} />}
                  logo={entity.logo}
                  icon={entity.icon}
                  entity_type={entity.entity_type}
                  description={entity.description && (
                    <HighlightedText text={entity.description} highlight={searchQuery} />
                  )}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.noResults}>No results found</Text>
          )
        ) : (
          <View style={styles.defaultContent}>
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

            {searchEntities.sections.map((section) => (
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
            ))}
          </View>
        )}
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
    // fontWeight: '500',
    height: '100%',
    letterSpacing: -0.4,
    outlineStyle: 'none', // Removes default focus outline on web
    
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
    // fontWeight: '600',
    color: '#666',
  },
  sectionContent: {
    gap: 12,
  },
  highlight: {
    fontWeight: 'bold',
  },
}); 