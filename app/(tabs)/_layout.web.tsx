import { Stack } from "expo-router";
import { Platform, StyleSheet, View, Pressable, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { AppleNewsLogo } from '@/components/icons/AppleNewsLogo';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import type { ViewStyle, TextStyle } from 'react-native';

type Styles = {
  container: ViewStyle;
  sidebar: ViewStyle;
  sidebarCompact: ViewStyle;
  sidebarContent: ViewStyle;
  sidebarContentCompact: ViewStyle;
  logoContainer: ViewStyle;
  nav: ViewStyle;
  sidebarItem: ViewStyle;
  sidebarItemCompact: ViewStyle;
  sidebarLabel: TextStyle;
  sidebarLabelActive: TextStyle;
  content: ViewStyle;
  contentInner: ViewStyle;
};

// Helper component for sidebar items
function SidebarItem({ 
  icon, 
  label, 
  href, 
  isActive,
  compact = false
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  href: `/(tabs)/${string}`;
  isActive?: boolean;
  compact?: boolean;
}) {
  const colorScheme = useColorScheme();
  const hoverBg = colorScheme === 'dark' ? 'rgba(239, 243, 244, 0.1)' : 'rgba(15, 20, 25, 0.1)';
  
  return (
    <Link href={href} asChild>
      <Pressable 
        style={({ pressed, hovered }) => [
          styles.sidebarItem,
          compact && styles.sidebarItemCompact,
          (pressed || hovered) && { backgroundColor: hoverBg }
        ]}
      >
        <Ionicons 
          name={icon} 
          size={28}
          color={isActive ? '#FA2D48' : colorScheme === 'dark' ? '#e7e9ea' : '#0f1419'} 
        />
        {!compact && (
          <ThemedText style={[
            styles.sidebarLabel,
            isActive && styles.sidebarLabelActive
          ]}>
            {label}
          </ThemedText>
        )}
      </Pressable>
    </Link>
  );
}

export default function WebLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
  const borderColor = colorScheme === 'dark' ? '#2f3336' : '#eee';
  
  const isCompact = width < 1024;
  const isMobile = width < 768;

  if (isMobile) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[
        styles.sidebar, 
        { borderRightColor: borderColor },
        isCompact && styles.sidebarCompact
      ]}>
        <View style={[
          styles.sidebarContent,
          isCompact && styles.sidebarContentCompact
        ]}>
          <View style={styles.logoContainer}>
            <AppleNewsLogo
              color="#FA2D48"
              width={isCompact ? 32 : 40}
              height={isCompact ? 32 : 40}
            />
          </View>

          <View style={styles.nav}>
            <SidebarItem icon="home" label="Home" href="/(tabs)/(home)" compact={isCompact} />
            <SidebarItem icon="newspaper" label="News+" href="/(tabs)/(news+)" compact={isCompact} />
            <SidebarItem icon="football" label="Sports" href="/(tabs)/(sports)" compact={isCompact} />
            <SidebarItem icon="headset" label="Audio" href="/(tabs)/(audio)" compact={isCompact} />
            <SidebarItem icon="heart" label="Following" href="/(tabs)/(search)" compact={isCompact} />
          </View>
        </View>
      </View>

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

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  sidebar: {
    width: 275,
    borderRightWidth: 1,
    height: '100%',
  },
  sidebarCompact: {
    width: 72,
  },
  sidebarContent: {
    position: 'fixed',
    width: 275,
    height: '100%',
    padding: 8,
  },
  sidebarContentCompact: {
    width: 72,
    padding: 8,
  },
  logoContainer: {
    marginBottom: 32,
    paddingLeft: 12,
    paddingTop: 12,
  },
  nav: {
    gap: 4,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 16,
    paddingRight: 24,
    borderRadius: 9999,
    gap: 16,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  sidebarItemCompact: {
    justifyContent: 'center',
    padding: 12,
    gap: 0,
  },
  sidebarLabel: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: Platform.select({
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      default: undefined,
    }),
  },
  sidebarLabelActive: {
    color: '#FA2D48',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  contentInner: {
    flex: 1,
    width: '100%',
    maxWidth: 611,
    backgroundColor: 'transparent',
  },
});

