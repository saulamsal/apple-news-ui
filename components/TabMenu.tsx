import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Tab {
  id: string;
  label: string;
}

interface TabMenuProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

export function TabMenu({ tabs, activeTab, onTabPress }: TabMenuProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (

    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            style={[
              styles.tab,
              isActive && styles.activeTab,
              isDark && styles.darkTab,
              isActive && isDark && styles.activeDarkTab
            ]}
          >
            <Text 
              style={[
                styles.tabText,
                isActive && styles.activeTabText,
                isDark && styles.darkTabText,
                isActive && isDark && styles.activeDarkTabText
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  newsplusHorizontalContainer: {
    // width: '100%',
    // gap: 12,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#000',
  },
  darkTab: {
    backgroundColor: '#FFFFFF',
  },
  activeDarkTab: {
    backgroundColor: '#FFF',
  },
  tabText: {
    fontSize: 13.5,
    fontWeight: '600',
    // color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  darkTabText: {
    color: '#999',
  },
  activeDarkTabText: {
    color: '#000',
  },
}); 