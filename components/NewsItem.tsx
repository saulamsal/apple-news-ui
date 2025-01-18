import React from 'react';
import { Pressable, View, Image, Text, ColorSchemeName } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { NewsLogo } from '@/components/NewsLogo';
import * as DropdownMenu from 'zeego/dropdown-menu';
import * as ContextMenu from 'zeego/context-menu';

interface Source {
  id: string;
  name: string;
  logo_transparent_light: string;
  logo_transparent_dark: string;
}

interface Topic {
  id: string;
  name: string;
}

export interface NewsItemType {
  id: string;
  title: string;
  source: Source;
  topic: Topic;
  show_topic: boolean;
  featured_image: string;
  card_type: 'full' | 'medium';
  is_news_plus: boolean;
}

interface NewsItemProps {
  item: NewsItemType;
}

const MenuItems = ({ item }: { item: NewsItemType }) => {
  return (
    <>
      <ContextMenu.Item textValue="Share Story" onSelect={() => {}} key="share">
        <ContextMenu.ItemIcon ios={{ name: 'square.and.arrow.up' }}>
          <MaterialIcons name="share" size={18} />
        </ContextMenu.ItemIcon>
        <ContextMenu.ItemTitle>Share Story</ContextMenu.ItemTitle>
      </ContextMenu.Item>
      <ContextMenu.Item textValue="Save Story" onSelect={() => {}} key="save">
        <ContextMenu.ItemIcon ios={{ name: 'bookmark' }}>
          <MaterialIcons name="bookmark" size={18} />
        </ContextMenu.ItemIcon>
        <ContextMenu.ItemTitle>Save Story</ContextMenu.ItemTitle>
      </ContextMenu.Item>
      <ContextMenu.Item textValue="Copy Link" onSelect={() => {}} key="copy">
        <ContextMenu.ItemIcon ios={{ name: 'link' }}>
          <MaterialIcons name="link" size={18} />
        </ContextMenu.ItemIcon>
        <ContextMenu.ItemTitle>Copy Link</ContextMenu.ItemTitle>
      </ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item textValue="Suggest More" onSelect={() => {}} key="more">
        <ContextMenu.ItemIcon ios={{ name: 'plus.circle' }}>
          <MaterialIcons name="add-circle-outline" size={18} />
        </ContextMenu.ItemIcon>
        <ContextMenu.ItemTitle>Suggest More</ContextMenu.ItemTitle>
      </ContextMenu.Item>
      <ContextMenu.Item textValue="Suggest Less" onSelect={() => {}} key="less">
        <ContextMenu.ItemIcon ios={{ name: 'minus.circle' }}>
          <MaterialIcons name="remove-circle-outline" size={18} />
        </ContextMenu.ItemIcon>
        <ContextMenu.ItemTitle>Suggest Less</ContextMenu.ItemTitle>
      </ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item textValue={`Go to ${item.source.name}`} onSelect={() => {}} key="source">
        <ContextMenu.ItemIcon ios={{ name: 'arrow.up.right' }}>
          <MaterialIcons name="open-in-new" size={18} />
        </ContextMenu.ItemIcon>
        <ContextMenu.ItemTitle>Go to {item.source.name}</ContextMenu.ItemTitle>
      </ContextMenu.Item>
    </>
  );
};

const renderNewsContent = ({ item, colorScheme }: { item: NewsItemType; colorScheme: ColorSchemeName }) => {
  if (item.card_type === 'full') {
    return (
      <>
        <Image 
          source={{ uri: item.featured_image }} 
          className="w-full h-[240px]" 
          resizeMode="cover"
        />

        {item.is_news_plus && (
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'transparent']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.5, y: 0 }}
            className="flex-row py-1 pl-3 absolute top-0 left-0 w-full"
          >
            <NewsLogo size={16} color="#F92B53" />
          </LinearGradient>
        )}
        
        <View className="px-4 py-3">
          <Image
            source={{ uri: colorScheme === 'light' ? item.source.logo_transparent_light : item.source.logo_transparent_dark }}
            className="h-6 w-[120px] -ml-2.5 mb-2 resize-contain"
          />
          <ThemedText type="title" className="text-2xl leading-8 font-bold -tracking-[1px]">
            {item.title}
          </ThemedText>
        </View>
      </>
    );
  }

  return (
    <>
      {item.is_news_plus && (
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'transparent']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.5, y: 0 }}
          className="flex-row py-1 pl-3 absolute top-0 left-0 w-full z-10 rounded-t-xl"
        >
          <NewsLogo size={16} color="#F92B53" />
        </LinearGradient>
      )}

      <View className="flex-1 p-4 pr-[120px] mt-2.5">
        <Image
          source={{ uri: colorScheme === 'light' ? item.source.logo_transparent_light : item.source.logo_transparent_dark }}
          className="h-3.5 w-[70px] -ml-2.5 mb-2 resize-contain"
        />
        <ThemedText type="title" className="text-lg leading-[22px] font-bold -tracking-[0.8px]">
          {item.title}
        </ThemedText>
        <Image 
          source={{ uri: item.featured_image }} 
          className="w-[100px] h-[100px] rounded-lg absolute right-4 top-4"
          resizeMode="cover"
        />
      </View>
    </>
  );
};

export const NewsItem = ({ item }: NewsItemProps) => {
  const colorScheme = useColorScheme();
  
  const href = {
    pathname: '/content/[id]' as const,
    params: { id: item.id }
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <ThemedView className="mb-2 rounded-xl overflow-hidden shadow-sm dark:bg-black bg-white mx-4 relative">
          <Link href={href} asChild>
            <Pressable className="flex-1">
              {renderNewsContent({ item, colorScheme })}
            </Pressable>
          </Link>
          <NewsItemActions item={item} />
        </ThemedView>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Preview>
          {() => (
            <Image 
              source={{ uri: item.featured_image }} 
              className="w-full h-[200px]"
              resizeMode="cover"
            />
          )}
        </ContextMenu.Preview>
        <MenuItems item={item} />
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

const NewsItemActions = ({ item }: { item: NewsItemType }) => {
  const colorScheme = useColorScheme();
  
  return (
    <View className="px-2">
      {item.show_topic && (
        <Pressable 
          className="bg-[#f2f2f2] px-4 py-2 rounded-2xl self-start mt-2 mb-4 ml-2" 
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <ThemedText type="subtitle" className="text-sm text-black -tracking-[0.3px]">
            More {item.topic.name} coverage
          </ThemedText>
        </Pressable>
      )}
      <View className="absolute right-2 top-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Pressable 
              className="p-2 rounded-full active:bg-black/5"
              onPress={(e) => {
                e.stopPropagation();
              }}
            >
              <MaterialIcons
                name="more-horiz"
                size={24}
                color={colorScheme === 'light' ? '#000' : '#fff'}
                style={{ opacity: 0.4 }}
              />
            </Pressable>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <MenuItems item={item} />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>
    </View>
  );
}; 