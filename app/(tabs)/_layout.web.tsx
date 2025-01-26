import { Stack, useSegments, useRouter } from "expo-router";
import { Platform, StyleSheet, View, Pressable, useWindowDimensions, Text } from 'react-native';
import { AppleNewsLogo } from '@/components/icons/AppleNewsLogo';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ViewStyle, TextStyle } from 'react-native';

// Add WebKit types for web
type WebkitStyles = {
  WebkitBackdropFilter?: string;
};

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
  mobileTabBar: ViewStyle & WebkitStyles;
  mobileTabItem: ViewStyle;
  mobileTabLabel: TextStyle;
};

type AppRoutes =
  | "/(tabs)/(index)"
  | "/(tabs)/(news+)"
  | "/(tabs)/(sports)"
  | "/(tabs)/(audio)"
  | "/(tabs)/(search)";

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

  const router = useRouter();
  const segments = useSegments();

  if (isMobile) {
    return (
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <View style={[
          styles.mobileTabBar,
          {
            borderTopColor: borderColor,
            backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }
        ]}>
          <Pressable
            onPress={() => router.push("/(tabs)/(index)")}
            style={styles.mobileTabItem}
          >
            <Ionicons
              name="home"
              size={24}
              color={segments[1] === '(index)' ? '#FA2D48' : colorScheme === 'dark' ? '#999' : '#666'}
            />
            <Text style={[
              styles.mobileTabLabel,
              { color: segments[1] === '(index)' ? '#FA2D48' : colorScheme === 'dark' ? '#999' : '#666' }
            ]}>Home</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/(news+)/news+")}
            style={styles.mobileTabItem}
          >
            <Ionicons
              name="newspaper"
              size={24}
              color={segments[2] === 'news+' ? '#FA2D48' : colorScheme === 'dark' ? '#999' : '#666'}
            />
            <Text style={[
              styles.mobileTabLabel,
              { color: segments[2] === 'news+' ? '#FA2D48' : colorScheme === 'dark' ? '#999' : '#666' }
            ]}>News+</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/(sports)/sports")}
            style={styles.mobileTabItem}
          >
            <Ionicons
              name="football"
              size={24}
              color={segments[2] === 'sports' ? '#FA2D48' : colorScheme === 'dark' ? '#999' : '#666'}
            />
            <Text style={[
              styles.mobileTabLabel,
              { color: segments[2] === 'sports' ? '#FA2D48' : colorScheme === 'dark' ? '#999' : '#666' }
            ]}>Sports</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/(audio)/audio")}
            style={styles.mobileTabItem}
          >
            <Ionicons
              name="headset"
              size={24}
              color={segments[2] === 'audio' ? '#FA2D48' : colorScheme === 'dark' ? '#999' : '#666'}
            />
            <Text style={[
              styles.mobileTabLabel,
              { color: segments[2] === 'audio' ? '#FA2D48' : colorScheme === 'dark' ? '#999' : '#666' }
            ]}>Audio</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/(search)/search")}
            style={styles.mobileTabItem}
          >
            <Ionicons
              name="heart"
              size={24}
              color={segments[2] === 'search' ? '#FA2D48' : colorScheme === 'dark' ? '#999' : '#666'}
            />
            <Text style={[
              styles.mobileTabLabel,
              { color: segments[2] === 'search' ? '#FA2D48' : colorScheme === 'dark' ? '#999' : '#666' }
            ]}>Following</Text>
          </Pressable>
        </View>
      </View>
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
            <SidebarItem icon="home" label="Home" href="/(tabs)/(index)" compact={isCompact} isActive={segments[1] === '(index)'} />
            <SidebarItem icon="newspaper" label="News+" href="/(tabs)/(news+)" compact={isCompact} isActive={segments[1] === '(news+)'} />
            <SidebarItem icon="football" label="Sports" href="/(tabs)/(sports)" compact={isCompact} isActive={segments[1] === '(sports)'} />
            <SidebarItem icon="headset" label="Audio" href="/(tabs)/(audio)" compact={isCompact} isActive={segments[1] === '(audio)'} />
            <SidebarItem icon="heart" label="Following" href="/(tabs)/(search)" compact={isCompact} isActive={segments[1] === '(search)'} />
          </View>
        </View>
      </View>

      <View className="flex-1 flex-row" style={styles.mainContentWrapper}>

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
    </View>
  );
}

const styles = StyleSheet.create<Styles>({

  mainContentWrapper: {
    maxWidth: 1000,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  leftNav: {
    width: 400,
    borderRightWidth: 1,
    height: '100%',
    alignItems: 'flex-end',
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
    // alignItems: 'center',
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
    position: 'sticky',
    top:0,
    // right: 0,
  },
  sidebarContent: {
    // position: 'fixed',
    // width: 320,
    height: '100%',
    padding: 16,
  },
  mobileTabBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    } : {}),
  },
  mobileTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  mobileTabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

