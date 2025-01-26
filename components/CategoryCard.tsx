import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface CategoryCardProps {
  id: string;
  title: React.ReactNode;
  logo?: string;
  icon?: string;
  entity_type?: string;
  description?: React.ReactNode;
}

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  logo: ImageStyle;
  title: TextStyle;
  description: TextStyle;
}

export function CategoryCard({ id, title, logo, icon, description }: CategoryCardProps) {
  return (
    <Link href={`/content/${id}`} asChild>
      <TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.content}>
            {logo ? (
              <Image source={{ uri: logo }} style={styles.logo} />
            ) : icon ? (
              <Ionicons name={icon as any} size={24} color="#666" />
            ) : null}
            <View>
              <Text style={styles.title}>{title}</Text>
              {description && (
                <Text style={styles.description} numberOfLines={2}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 