import React, { useState, useMemo } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryCard } from './CategoryCard';
import entities from '@/app/data/entities.json';
import { getAllCategories, getAllEntitiesForSection } from '@/app/utils/entityUtils';
import searchEntities from '@/app/data/search_entities.json';

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

interface Styles {
  container: ViewStyle;
  searchContainer: ViewStyle;
  input: TextStyle;
  dropdown: ViewStyle;
  resultsList: ViewStyle;
  noResults: TextStyle;
  defaultContent: ViewStyle;
  categories: ViewStyle;
  sectionTitle: TextStyle;
  sectionContent: ViewStyle;
  highlight: TextStyle;
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

export function SearchableDropdown() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const searchResults = useMemo(() => {
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
          onChangeText={(text) => {
            setSearchQuery(text);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setIsOpen(false);
          }}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {isOpen && (
        <View style={styles.dropdown}>
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
                <View key={section.id}>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3E2EA',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 17,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 4,
    maxHeight: 400,
    overflow: 'scroll',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultsList: {
    padding: 16,
    gap: 12,
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    padding: 16,
  },
  defaultContent: {
    padding: 16,
    gap: 16,
  },
  categories: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionContent: {
    gap: 12,
  },
  highlight: {
    fontWeight: 'bold',
  },
}); 