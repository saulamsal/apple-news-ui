import { Stack, useSegments, useRouter } from "expo-router";
import { Platform, StyleSheet, View, Pressable, useWindowDimensions, Text } from 'react-native';
import { AppleNewsLogo } from '@/components/icons/AppleNewsLogo';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ViewStyle, TextStyle } from 'react-native';
type Styles = {
  container: ViewStyle;
  leftNav: ViewStyle;
  leftNavCompact: ViewStyle;
  leftNavContent: ViewStyle;
  leftNavContentCompact: ViewStyle;
  logoContainer: ViewStyle;
  nav: ViewStyle;
  navItem: ViewStyle;
  navItemCompact: ViewStyle;
  navLabel: TextStyle;
  navLabelActive: TextStyle;
  content: ViewStyle;
  contentInner: ViewStyle;
  sidebar: ViewStyle;
  sidebarContent: ViewStyle;
};

type AppRoutes = 
  | "/(tabs)/(home)/home"
  | "/(tabs)/(news+)/news+"
  | "/(tabs)/(sports)/sports"
  | "/(tabs)/(audio)/audio"
  | "/(tabs)/(search)/search";

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
  href: AppRoutes;
  isActive?: boolean;
  compact?: boolean;
}) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const hoverBg = colorScheme === 'dark' ? 'rgba(239, 243, 244, 0.1)' : 'rgba(15, 20, 25, 0.1)';
  const activeBg = colorScheme === 'dark' ? 'rgba(250, 45, 72, 0.1)' : 'rgba(250, 45, 72, 0.1)';
  
  return (
    <Pressable 
      onPress={() => router.push(href)}
      style={({ pressed, hovered }) => [
        styles.navItem,
        compact && styles.navItemCompact,
        isActive && { backgroundColor: activeBg },
        (pressed || hovered) && { backgroundColor: hoverBg }
      ]}
    >
      <Ionicons 
        name={icon} 
        size={28}
        color={isActive ? '#FA2D48' : colorScheme === 'dark' ? '#e7e9ea' : '#0f1419'} 
      />
      {!compact && (
        <Text style={[
          styles.navLabel,
          isActive && styles.navLabelActive,
          { color: colorScheme === 'dark' ? '#e7e9ea' : '#0f1419' }
        ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export default function WebLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
  const borderColor = colorScheme === 'dark' ? '#2f3336' : '#eee';
  
  const isCompact = width < 1024;
  const isMobile = width < 768;
  const showSidebar = width >= 1024;
  
  const segments = useSegments();

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
        styles.leftNav, 
        { borderRightColor: borderColor },
        isCompact && styles.leftNavCompact
      ]}>
        <View style={[
          styles.leftNavContent,
          isCompact && styles.leftNavContentCompact
        ]}>
          <View style={styles.logoContainer}>
            <AppleNewsLogo
              color="#FA2D48"
              width={isCompact ? 32 : 40}
              height={isCompact ? 32 : 40}
            />
          </View>

          <View style={styles.nav}>
            <SidebarItem icon="home" label="Home" href="/(tabs)/(home)/home" compact={isCompact} isActive={segments[2] === 'home'} />
            <SidebarItem icon="newspaper" label="News+" href="/(tabs)/(news+)/news+" compact={isCompact} isActive={segments[2] == 'news+'} />
            <SidebarItem icon="football" label="Sports" href="/(tabs)/(sports)/sports" compact={isCompact} isActive={segments[2] == 'sports'} />
            <SidebarItem icon="headset" label="Audio" href="/(tabs)/(audio)/audio" compact={isCompact} isActive={segments[2] == 'audio'} />
            <SidebarItem icon="heart" label="Following" href="/(tabs)/(search)/search" compact={isCompact} isActive={segments[2] == 'search'} />
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

      {showSidebar && (
        <View style={[styles.sidebar, { borderLeftColor: borderColor }]}>
          <View style={styles.sidebarContent}>
            <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>
              Download the App Now
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  leftNav: {
    width: 275,
    borderRightWidth: 1,
    height: '100%',
  },
  leftNavCompact: {
    width: 72,
  },
  leftNavContent: {
    position: 'fixed',
    width: 275,
    height: '100%',
    padding: 8,
  },
  leftNavContentCompact: {
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
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 16,
    paddingRight: 24,
    borderRadius: 9999,
    gap: 16,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer' as any,
    } : {}),
  },
  navItemCompact: {
    justifyContent: 'center',
    padding: 12,
    gap: 0,
  },
  navLabel: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: Platform.select({
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      default: undefined,
    }),
  },
  navLabelActive: {
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
  sidebar: {
    width: 320,
    borderLeftWidth: 1,
    height: '100%',
  },
  sidebarContent: {
    position: 'fixed',
    width: 320,
    height: '100%',
    padding: 16,
  },
});

