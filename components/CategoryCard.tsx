import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface CategoryCardProps {
  title: string;
  logo?: string;
  icon?: string;
  entity_type?: string;
  description?: string;
  minimal?: boolean;
  disable_name?: boolean;
}

export const CategoryCard = ({ 
  title, 
  logo, 
  icon,
  entity_type,
  description, 
  minimal = false,
  disable_name = false
}: CategoryCardProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = () => {
    if (entity_type === 'topic' && typeof title === 'string') {
      router.push(`/topic/${title.toLowerCase()}`);
    }
  };

  return (
    <TouchableOpacity 
      className="flex-row items-center gap-2 px-2"
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center gap-3">
        {logo ? (
          <Image source={{ uri: logo }} className={minimal ? "w-5 h-5 rounded-[16px]" : "w-7 h-7 rounded-[20px]"} />
        ) : icon ? (
          <Ionicons name={icon as any} size={minimal ? 20 : 24} color="#666" />
        ) : null}
        {!disable_name && (
          <View>
            <Text 
              className={minimal ? "text-sm font-medium" : "text-base font-medium"}
              style={{ color: isDark ? '#FFFFFF' : '#000000' }}
              numberOfLines={1}
            >
              {title}
            </Text>
            {description && (
              <Text className="text-sm text-[#666666] mt-1" numberOfLines={2}>
                {description}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};