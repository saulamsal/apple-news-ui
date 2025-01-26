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
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          placeholder="Channels, Topics, & Stories"
          style={styles.input}
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
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
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3E2EA',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 17,
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
    gap: 24,
  },
  categories: {
    gap: 12,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionContent: {
    gap: 12,
  },
  highlight: {
    fontWeight: 'bold',
  },
}); 