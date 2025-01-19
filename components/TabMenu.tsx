import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

interface Tab {
  id: string;
  label: string;
  icon?: string;
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
                {tab.icon && <Ionicons name={tab.icon} size={22} color={isActive ? '#FFF' : '#666'}  style={styles.tabIcon}/>}

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
    // paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    paddingLeft: 16
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
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
  },
  tabIcon: {
    marginRight: 4,
    marginTop: 2,
    
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