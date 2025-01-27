import { Stack, useSegments, useRouter } from "expo-router";
import { Platform, View, Pressable, useWindowDimensions, Text } from 'react-native';
import { AppleNewsLogo } from '@/components/icons/AppleNewsLogo';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Sidebar } from '@/components/Sidebar';
import { Home, NewsPlus, Sports, Search } from '@/assets/svg/tab-icons'

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
  icon: keyof typeof Ionicons.glyphMap | 'home' | 'news' | 'sports' | 'search';
  label: string;
  href: AppRoutes;
  isActive?: boolean;
  compact?: boolean;
}) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const hoverBg = colorScheme === 'dark' ? 'rgba(255, 59, 48, 0.1)' : 'rgba(255, 59, 48, 0.1)';
  const activeBg = colorScheme === 'dark' ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 59, 48, 0.15)';
  const textColor = colorScheme === 'dark' ? '#e7e9ea' : '#000000';

  const iconColor = isActive ? '#FD325A' : '#8E8E8F';
  
  const getIcon = () => {
    switch (icon) {
      case 'home':
        return <Home width={24} height={24} color={iconColor} />;
      case 'news':
        return <NewsPlus width={24} height={24} color={iconColor} />;
      case 'sports':
        return <Sports width={30} height={30} color={iconColor} />;
      case 'search':
        return <Search width={24} height={24} color={iconColor} />;
      default:
        return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={iconColor} />;
    }
  };

  return (
    <Pressable
      onPress={() => router.push(href)}
      className={`flex flex-row items-center p-1 rounded-lg gap-3 mb-0.5 cursor-pointer transition-all duration-200 mr-8 ${
        compact ? 'justify-center p-3 gap-0' : 'pl-2 pr-6'
      } ${isActive ? 'bg-[#e6e6e7]' : ''}`}
      style={({ pressed, hovered }) => [
        (pressed || hovered) && { backgroundColor: hoverBg }
      ]}
    >
      {getIcon()}
      {!compact && (
        <Text className={`text-[15px] font-semibold ${isActive ? 'font-bold' : ''}`} 
          style={{color: textColor}}>
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


  // const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
  const backgroundColor = '#f9f9f9';
  const borderColor = colorScheme === 'dark' ? '#2f3336' : '#eee';

  const isCompact = width < 1024;
  const isMobile = width < 768;
  // const showSidebar = width >= 1024 && segments[1] !== '(search)';
  const showSidebar = width >= 1024 ;


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
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
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
              style={{color: segments[1] === '(index)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'}}>
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
              style={{color: segments[1] === '(news+)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'}}>
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
              style={{color: segments[1] === '(sports)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'}}>
              Sports
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/(audio)/audio")}
            className="flex-1 items-center justify-center gap-1"
          >
            <Ionicons name="headset" size={24} color={segments[1] === '(audio)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'} />
            <Text className="text-xs font-medium"
              style={{color: segments[1] === '(audio)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'}}>
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
              style={{color: segments[1] === '(search)' ? '#FA2E47' : colorScheme === 'dark' ? '#999' : '#666'}}>
              Following
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row relative left-0 right-0 min-h-full h-screen overflow-y-auto  bg-white justify-center" 
      // style={{backgroundColor}}
      >
      <View className={`${isCompact ? 'w-[72px]' : 'w-[400px]'}  items-end sticky top-0 h-screen border-r border-gray-500`}
        style={{borderRightColor: borderColor}}>
        <View className={`sticky ${isCompact ? 'w-[72px] p-2' : 'w-[275px] p-2'} h-full` }
        //  style={{backgroundColor: backgroundColor}}
         >

          <View className="mb-8 pl-3 pt-3">

          <View className="flex-row items-center gap-[2px] mt-2">
            <Ionicons name="logo-apple" size={32} color="#000" />
            <Text className="font-extrabold text-[30px] tracking-tighter">News</Text>
          </View>
        
          </View>

          <View className="gap-2">
            <SidebarItem icon="home" label="Home" href="/(tabs)/(index)" compact={isCompact} isActive={segments[1] === '(index)'} />
            <SidebarItem icon="news" label="News+" href="/(tabs)/(news+)" compact={isCompact} isActive={segments[1] === '(news+)'} />
            <SidebarItem icon="sports" label="Sports" href="/(tabs)/(sports)" compact={isCompact} isActive={segments[1] === '(sports)'} />
            <SidebarItem icon="headset" label="Audio" href="/(tabs)/(audio)" compact={isCompact} isActive={segments[1] === '(audio)'} />
            <SidebarItem icon="search" label="Following" href="/(tabs)/(search)" compact={isCompact} isActive={segments[1] === '(search)'} />
          </View>
        </View>
      </View>

       
          <View className="flex-1 w-full max-w-[611px] bg-transparent">
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </View>
       
        {showSidebar && (
          <View className="w-[350px] border-l sticky top-0"
            style={{borderLeftColor: borderColor}}>
            <View className="p-4">
              <Sidebar />
            </View>
          </View>
        )}

      
    </View>
  );
}

