import { Stack } from "expo-router";
import { Platform, StyleSheet, View, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AppleNewsLogo } from '@/components/icons/AppleNewsLogo';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme as useSystemColorScheme } from 'react-native';

// Helper component for sidebar items
function SidebarItem({ 
  icon, 
  label, 
  href, 
  isActive 
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  href: string;
  isActive?: boolean;
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.sidebarItem}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={isActive ? '#FA2D48' : '#666'} 
        />
        <ThemedText style={[
          styles.sidebarLabel,
          isActive && styles.sidebarLabelActive
        ]}>
          {label}
        </ThemedText>
      </Pressable>
    </Link>
  );
}

// Add this new helper component for the theme switcher
function ThemeSwitcher() {
  const colorScheme = useColorScheme();
  const systemColorScheme = useSystemColorScheme();
  
  return (
    <Pressable 
      style={styles.sidebarItem}
      onPress={() => {
        // Toggle between light and dark
        colorScheme.setColorScheme(
          colorScheme.colorScheme === 'dark' ? 'light' : 'dark'
        );
      }}
    >
      <Ionicons 
        name={colorScheme.colorScheme === 'dark' ? 'moon' : 'sunny'} 
        size={24} 
        color="#666"
      />
      <ThemedText style={styles.sidebarLabel}>
        {colorScheme.colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </ThemedText>
    </Pressable>
  );
}

export default function WebLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
  const borderColor = colorScheme === 'dark' ? '#2f3336' : '#eee';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Sidebar */}
      <View style={[styles.sidebar, { borderRightColor: borderColor }]}>
        <View style={styles.sidebarContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <AppleNewsLogo
              color="#FA2D48"
              width={40}
              height={40}
            />
          </View>

          {/* Navigation Items */}
          <View style={styles.nav}>
            <SidebarItem icon="home" label="Home" href="/(tabs)/(home)" />
            <SidebarItem icon="newspaper" label="News+" href="/(tabs)/(news+)" />
            <SidebarItem icon="football" label="Sports" href="/(tabs)/(sports)" />
            <SidebarItem icon="headset" label="Audio" href="/(tabs)/(audio)" />
            <SidebarItem icon="heart" label="Following" href="/(tabs)/(search)" />
          </View>

          {/* Add Theme Switcher */}
          <View style={styles.themeSwitcherContainer}>
            <ThemeSwitcher />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.contentInner}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100vh',
  },
  sidebar: {
    width: 275,
    borderRightWidth: 1,
    height: '100%',
  },
  sidebarContent: {
    position: 'fixed',
    width: 275,
    height: '100%',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 32,
    paddingLeft: 10,
  },
  nav: {
    gap: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 9999,
    gap: 16,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(15, 20, 25, 0.1)',
    },
  },
  sidebarLabel: {
    fontSize: 20,
    fontWeight: '500',
  },
  sidebarLabelActive: {
    color: '#FA2D48',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  contentInner: {
    flex: 1,
    width: '100%',
    maxWidth: 767,
    backgroundColor: 'transparent',
  },
  themeSwitcherContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
}); 