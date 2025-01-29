import { Stack, useSegments, useRouter, Link } from "expo-router";
import { Platform, View, Pressable, useWindowDimensions, Text } from 'react-native';
import { AppleNewsLogo } from '@/components/icons/AppleNewsLogo';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Sidebar } from '@/components/Sidebar';
import { Home, NewsPlus, Sports, Search } from '@/assets/svg/tab-icons'
import { CategoryCard } from "@/components/CategoryCard";
import { styles } from "@/styles/components/newsItem";
import { getAllEntitiesForSection } from "@/src/utils/entityUtils";
import searchEntities from "@/app/data/search_entities.json";
import entities from '@/app/data/entities.json';
import { NewsLogo } from "@/components/NewsLogo";
import SocialButtons from '@/components/SocialButtons';
import { Image } from 'expo-image';

type Entity = typeof entities[keyof typeof entities];

type AppRoutes =
  | "/(tabs)/(index)"
  | "/(tabs)/(news+)"
  | "/(tabs)/(sports)"
  | "/(tabs)/(audio)"
  | "/(tabs)/(search)"
  | { pathname: string; params?: Record<string, string> };

// Helper component for sidebar items
function SidebarItem({
  icon,
  label,
  href,
  isActive,
  compact = false
}: {
  icon: keyof typeof Ionicons.glyphMap | 'home' | 'news' | 'sports' | 'search';
  label: string;
  href: string;
  isActive?: boolean;
  compact?: boolean;
}) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const hoverBg = colorScheme === 'dark' ? 'rgba(255, 59, 48, 0.1)' : 'rgba(255, 59, 48, 0.1)';
  const activeBg = colorScheme === 'dark' ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 59, 48, 0.15)';
  const textColor = colorScheme === 'dark' ? '#e7e9ea' : '#000000';

  const iconColor = isActive ? '#FD325A' : '#8E8E8F';

  const size = compact ? 28 : 24;

  const getIcon = () => {
    switch (icon) {
      case 'home':
        return <Home width={size} height={size} color={iconColor} />;
      case 'news':
        return <NewsPlus width={size} height={size} color={iconColor} />;
      case 'sports':
        return <Sports width={size} height={size} color={iconColor} />;
      case 'search':
        return <Search width={size} height={size} color={iconColor} />;
      case 'headset':
        return <Ionicons name="headset" size={size} color={iconColor} />;
      default:
        return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={size} color={iconColor} />;
    }
  };

  return (
    <Pressable
      onPress={() => router.push(href as any)}
      className={`flex flex-row items-center p-2 rounded-lg gap-3 mb-0.5 
        hover:bg-gray-200 transition-all duration-200  ${compact ? 'justify-center' : 'pl-2 pr-6 mr-8'
        } ${isActive ? 'bg-[#e6e6e7]' : ''}`}
      style={({ pressed, hovered }) => [
        (pressed || hovered) && { backgroundColor: hoverBg }
      ]}
    >
      {getIcon()}
      {!compact && (
        <Text className={`text-[15px] font-semibold ${isActive ? 'font-bold' : ''}`}
          style={{ color: textColor }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export default function WebLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const segments = useSegments();

  const backgroundColor = '#f9f9f9';
  const borderColor = colorScheme === 'dark' ? '#2f3336' : '#eee';

  const isCompact = width < 1024;
  const isMobile = width < 768;
  const showSidebar = width >= 1024;


  if (isMobile) {
    return (
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <View className={`fixed bottom-0 left-0 right-0 h-16 flex-row border-t ${Platform.OS === 'ios' ? 'pb-5' : ''}`}
          style={{
            borderTopColor: borderColor,
            backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: Platform.OS === 'web' ? 'blur(12px)' : undefined,
          }}>
          <Pressable
            onPress={() => router.push("/(tabs)/(index)")}
            className="flex-1 items-center justify-center gap-1"
          >
            <Home
              width={24}
              height={24}
              color={segments[1] === '(index)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'}
            />
            <Text className="text-xs font-medium"
              style={{ color: segments[1] === '(index)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666' }}>
              Home
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/(news+)/news+")}
            className="flex-1 items-center justify-center gap-1"
          >
            <NewsPlus
              width={24}
              height={24}
              color={segments[1] === '(news+)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'}
            />
            <Text className="text-xs font-medium"
              style={{ color: segments[1] === '(news+)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666' }}>
              News+
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/(sports)/sports")}
            className="flex-1 items-center justify-center gap-1"
          >
            <Sports
              width={30}
              height={30}
              color={segments[1] === '(sports)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'}
            />
            <Text className="text-xs font-medium"
              style={{ color: segments[1] === '(sports)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666' }}>
              Sports
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/(audio)/audio")}
            className="flex-1 items-center justify-center gap-1"
          >
            <Ionicons name="headset" size={24} color={segments[1] === '(audio)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'} />
            <Text className="text-xs font-medium"
              style={{ color: segments[1] === '(audio)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666' }}>
              Audio
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/(search)/search")}
            className="flex-1 items-center justify-center gap-1"
          >
            <Search
              width={24}
              height={24}
              color={segments[1] === '(search)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'}
            />
            <Text className="text-xs font-medium"
              style={{ color: segments[1] === '(search)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666' }}>
              Following
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row relative left-0 right-0 min-h-full h-screen overflow-y-auto bg-white justify-center">
      <View className={`${isCompact ? 'w-[72px]' : ''} items-end sticky top-0 h-screen border-r border-gray-500`}
        style={{ borderRightColor: borderColor }}>
        <View className={`sticky ${isCompact ? 'w-[72px] p-2' : 'w-[275px] p-2'} h-full`}>
          <View className="mb-8 pl-3 pt-3">
            <View className="flex-row items-center gap-[2px] mt-2">
              <NewsLogo size={isCompact ? 32 : 40} forceShow={true} />
            </View>
          </View>

          <View className="">
            <SidebarItem icon="home" label="Home" href="/(tabs)/(index)" compact={isCompact} isActive={segments[1] === '(index)'} />
            <SidebarItem icon="sports" label="Sports" href="/(tabs)/(sports)" compact={isCompact} isActive={segments[1] === '(sports)'} />
            <SidebarItem icon="news" label="News+" href="/(tabs)/(news+)" compact={isCompact} isActive={segments[1] === '(news+)'} />
            <SidebarItem icon="headset" label="Audio" href="/(tabs)/(audio)" compact={isCompact} isActive={segments[1] === '(audio)'} />
          </View>





          {!isCompact &&

            <Link href="https://twitter.com/intent/follow?screen_name=saul_sharma" className="flex-row items-center gap-2" target="_blank">
              <View className="flex-row items-center gap-3 pl-2 relative">
                <View className="relative">
                  <Image source={{ uri: 'https://i.imgur.com/6wdPxeP.jpeg' }} alt="Twitter" className="w-6 h-6 rounded-full" />
                  <View className="w-2 h-2 bg-red-500 rounded-full absolute -top-0.5 -right-0.5" />

                </View>
                <Text className="text-sm text-gray-800 font-semibold">Follow Saúl on 𝕏</Text>
              </View>
            </Link>
          }

          <View className="mt-8 gap-2">
            {!isCompact && <Text className="text-sm font-medium text-gray-500 px-3">Discover</Text>}
            <SidebarItem icon="search" label="Following" href="/(tabs)/(search)" compact={isCompact} isActive={segments[1] === '(search)'} />
          </View>

          {searchEntities.sections.map((section) => {
            if (section.id !== 'my_following') return null;
            return (
              <View key={section.id} className="gap-3 rounded-2xl p-3 mt-4" style={{ backgroundColor: '#00000008' }}>
                {!isCompact && <Text className="text-sm text-gray-500">{section.title}</Text>}
                <View className="gap-3">
                  {getAllEntitiesForSection(section.id).map((entity: Entity) => (
                    <CategoryCard
                      key={entity.id}
                      title={entity.title}
                      logo={entity.logo}
                      icon={entity.icon}
                      id={entity.id}
                      entity_type={entity.type}
                      minimal={true}
                      disable_name={isCompact}
                    />
                  ))}
                </View>
              </View>
            );
          })}

          {/* {!isCompact && <SocialButtons showTwitter />} */}

        </View>
      </View>

      <View className="flex-1 w-full max-w-[611px] bg-transparent">
        <Stack
          screenOptions={{
            headerShown: false,
            scrollBehavior: 'smooth-scroll',
            initialRouteName: '/(tabs)/(index)',
          }}
        />
      </View>

      {showSidebar && (
        <View className="w-[350px] border-l sticky top-0"
          style={{ borderLeftColor: borderColor }}>
          <View className="p-4">
            <Sidebar />
          </View>
        </View>
      )}
    </View>
  );
}

