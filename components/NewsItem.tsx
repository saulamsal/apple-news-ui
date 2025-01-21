import React from 'react';
import { Pressable, View, Image, Text, ColorSchemeName, Button } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { NewsLogo } from '@/components/NewsLogo';
import * as DropdownMenu from 'zeego/dropdown-menu';
import * as ContextMenu from 'zeego/context-menu';
import { verifyInstallation } from 'nativewind';

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
  related_news?: {
    id: string;
    title: string;
    description: string;
    source: Source;
    time_ago: string;
    is_live: boolean;
  }[];
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
        <ContextMenu.ItemTitle>{item.source.name}</ContextMenu.ItemTitle>
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
            className="flex-row py-1  absolute top-0 left-0 w-full "
          >
            <View className="pl-3 py-1 flex-row items-center gap-1">
              <NewsLogo size={16} color="#F92B53" /><Text className="text-sm font-bold text-apple-news">+</Text>
            </View>
          </LinearGradient>
        )}
        
        <View className="px-4 py-3">
          <View className="h-[20px] w-[150px] -ml-2.5 mb-2">
            <Image
              source={{ uri: item.source.logo_transparent_light }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          <Text className="text-2xl leading-8 font-bold -tracking-[1px]">
            {item.title}
          </Text>

          {item.description && <Text className="text-xl text-gray-500 mt-2 tracking-tighter ">{item.description}</Text>}

          {item.related_news && item.related_news.length > 0 && (
            <View className="mt-4">
              <Text className="text-sm font-extrabold mb-3">MORE COVERAGE</Text>
              {item.related_news.map((news) => (
                <Pressable key={news.id} className="mb-4">
                  <View className="flex-row items-center mb-1">
                    <View className="h-[20px] w-[100px]">
                      <Image
                        source={{ uri: news.source.logo_transparent_light  }}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    </View>
                    {/* {news.is_live && (
                      <View className="ml-2 px-2 py-0.5 bg-red-500 rounded">
                        <Text className="text-xs text-white font-medium">LIVE</Text>
                      </View>
                    )} */}
                  </View>
                  <Text className="text-xl font-semibold mb-1 -tracking-[0.5px]">{news.title}</Text>
                </Pressable>
              ))}
            </View>
          )}
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
            className="flex-row py-1  absolute top-0 left-0 w-full "
          >
            <View className="pl-3 py-1 flex-row items-center gap-1">
              <NewsLogo size={16} color="#F92B53" /><Text className="text-sm font-bold text-apple-news">+</Text>
            </View>
          </LinearGradient>
        )}

      <View className="flex-1 p-4 pr-[120px] mt-2.5">
        <View className="h-[30px] w-[120px] -ml-2.5 mb-2">
          <Image
            source={{ uri: item.source.logo_transparent_light }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <Text className="text-lg leading-[22px] font-bold -tracking-[0.8px]">
          {item.title}
        </Text>
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
  
  verifyInstallation();
  
  const href = {
    pathname: '/content/[id]' as const,
    params: { id: item.id }
  };

  const StoryPreview = () => (
    <View className="bg-white">
      <Image 
        source={{ uri: item.featured_image }} 
        className="w-full h-[200]"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="h-[20px] w-[150px] -ml-2.5 mb-2">
          <Image
            source={{ uri: item.source.logo_transparent_light }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <Text className="text-xl font-bold text-black">{item.title}</Text>
      </View>
    </View>
  );

  return (
    <View className="mb-2 rounded-xl overflow-hidden shadow-sm bg-white mx-5 relative">
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Link href={href} asChild>
            <Pressable className="flex-1">
              {renderNewsContent({ item, colorScheme })}
            </Pressable>
          </Link>
          <NewsItemActions item={item} />
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Preview
            backgroundColor="white"
            borderRadius={12}
          >
            {() => <StoryPreview />}
          </ContextMenu.Preview>
          <ContextMenu.Item key="share" onSelect={() => {}} textValue="Share Story">
            <ContextMenu.ItemIcon ios={{ name: "square.and.arrow.up" }}>
              <MaterialIcons name="share" size={18} />
            </ContextMenu.ItemIcon>
            <ContextMenu.ItemTitle>Share Story</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Item key="save" onSelect={() => {}} textValue="Save Story">
            <ContextMenu.ItemIcon ios={{ name: "bookmark" }}>
              <MaterialIcons name="bookmark" size={18} />
            </ContextMenu.ItemIcon>
            <ContextMenu.ItemTitle>Save Story</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Item key="copy" onSelect={() => {}} textValue="Copy Link">
            <ContextMenu.ItemIcon ios={{ name: "link" }}>
              <MaterialIcons name="link" size={18} />
            </ContextMenu.ItemIcon>
            <ContextMenu.ItemTitle>Copy Link</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item key="more" onSelect={() => {}} textValue="Suggest More">
            <ContextMenu.ItemIcon ios={{ name: "hand.thumbsup" }}>
              <MaterialIcons name="add-circle-outline" size={18} />
            </ContextMenu.ItemIcon>
            <ContextMenu.ItemTitle>Suggest More</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Item key="less" onSelect={() => {}} textValue="Suggest Less">
            <ContextMenu.ItemIcon ios={{ name: "hand.thumbsdown" }}>
              <MaterialIcons name="remove-circle-outline" size={18} />
            </ContextMenu.ItemIcon>
            <ContextMenu.ItemTitle>Suggest Less</ContextMenu.ItemTitle>
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger key="source" textValue={` ${item.source.name}`}>
              <ContextMenu.ItemIcon >
                <MaterialIcons name="open-in-new" size={18} />
              </ContextMenu.ItemIcon>
              <ContextMenu.ItemTitle>Go to {item.source.name}</ContextMenu.ItemTitle>
            </ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item key="channel" onSelect={() => {}} textValue="Go to Channel">
                <ContextMenu.ItemIcon ios={{ name: "arrow.up.right" }}>
                  <MaterialIcons name="open-in-new" size={18} />
                </ContextMenu.ItemIcon>
                <ContextMenu.ItemTitle>Go to Channel</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="follow" onSelect={() => {}} textValue="Follow Channel">
                <ContextMenu.ItemIcon ios={{ name: "plus" }}>
                  <MaterialIcons name="add" size={18} />
                </ContextMenu.ItemIcon>
                <ContextMenu.ItemTitle>Follow Channel</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="block" onSelect={() => {}} textValue="Block Channel">
                <ContextMenu.ItemIcon ios={{ name: "xmark.circle" }}>
                  <MaterialIcons name="block" size={18} />
                </ContextMenu.ItemIcon>
                <ContextMenu.ItemTitle>Block Channel</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="notifications" onSelect={() => {}} textValue="Turn on Notifications">
                <ContextMenu.ItemIcon ios={{ name: "bell" }}>
                  <MaterialIcons name="notifications" size={18} />
                </ContextMenu.ItemIcon>
                <ContextMenu.ItemTitle>Turn on Notifications</ContextMenu.ItemTitle>
              </ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
          
        </ContextMenu.Content>
        
      </ContextMenu.Root>

    </View>
  );
};

const NewsItemActions = ({ item }: { item: NewsItemType }) => {
  const colorScheme = useColorScheme();
  
  const DropdownMenuComponent = () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View className="p-1  rounded-full">
          <MaterialIcons
            name="more-horiz"
            size={20}
            color={colorScheme === 'dark' ? '#fff' : '#000'}
            style={{ opacity: 0.4 }}
          />
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item key="share" onSelect={() => {}} textValue="Share Story">
          <DropdownMenu.ItemIcon ios={{ name: "square.and.arrow.up" }}>
            <MaterialIcons name="share" size={18} />
          </DropdownMenu.ItemIcon>
          <DropdownMenu.ItemTitle>Share Story</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Item key="save" onSelect={() => {}} textValue="Save Story">
          <DropdownMenu.ItemIcon ios={{ name: "bookmark" }}>
            <MaterialIcons name="bookmark" size={18} />
          </DropdownMenu.ItemIcon>
          <DropdownMenu.ItemTitle>Save Story</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Item key="copy" onSelect={() => {}} textValue="Copy Link">
          <DropdownMenu.ItemIcon ios={{ name: "link" }}>
            <MaterialIcons name="link" size={18} />
          </DropdownMenu.ItemIcon>
          <DropdownMenu.ItemTitle>Copy Link</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item key="more" onSelect={() => {}} textValue="Suggest More">
          <DropdownMenu.ItemIcon ios={{ name: "plus.circle" }}>
            <MaterialIcons name="add-circle-outline" size={18} />
          </DropdownMenu.ItemIcon>
          <DropdownMenu.ItemTitle>Suggest More</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Item key="less" onSelect={() => {}} textValue="Suggest Less">
          <DropdownMenu.ItemIcon ios={{ name: "minus.circle" }}>
            <MaterialIcons name="remove-circle-outline" size={18} />
          </DropdownMenu.ItemIcon>
          <DropdownMenu.ItemTitle>Suggest Less</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger key="source" textValue={`Go to ${item.source.name}`}>
            <DropdownMenu.ItemIcon>
              <MaterialIcons name="open-in-new" size={18} />
            </DropdownMenu.ItemIcon>
            <DropdownMenu.ItemTitle>{item.source.name}</DropdownMenu.ItemTitle>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item key="channel" onSelect={() => {}} textValue="Go to Channel">
              <DropdownMenu.ItemIcon ios={{ name: "arrow.up.right" }}>
                <MaterialIcons name="open-in-new" size={18} />
              </DropdownMenu.ItemIcon>
              <DropdownMenu.ItemTitle>Go to Channel</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item key="follow" onSelect={() => {}} textValue="Follow Channel">
              <DropdownMenu.ItemIcon ios={{ name: "plus" }}>
                <MaterialIcons name="add" size={18} />
              </DropdownMenu.ItemIcon>
              <DropdownMenu.ItemTitle>Follow Channel</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item key="block" onSelect={() => {}} textValue="Block Channel">
              <DropdownMenu.ItemIcon ios={{ name: "xmark.circle" }}>
                <MaterialIcons name="block" size={18} />
              </DropdownMenu.ItemIcon>
              <DropdownMenu.ItemTitle>Block Channel</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item key="notifications" onSelect={() => {}} textValue="Turn on Notifications">
              <DropdownMenu.ItemIcon ios={{ name: "bell" }}>
                <MaterialIcons name="notifications" size={18} />
              </DropdownMenu.ItemIcon>
              <DropdownMenu.ItemTitle>Turn on Notifications</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
  
  return (
    <View className="px-2">
      {item.card_type === 'full' ? (
        item.show_topic && (
          <Pressable 
            className="bg-[#F2F2F6] px-4 py-1 rounded-2xl self-start mt-2 mb-4 ml-2" 
            onPress={(e) => {
              e.stopPropagation();
            }}
          >
            <Text className="text-xs text-black -tracking-[0.3px] font-bold">
              More {item.topic.name} coverage
            </Text>
          </Pressable>
        )
      ) : (
        <View className="flex-row items-center mt-2 mb-4 ml-2">
          <Text className="text-xs text-gray-500">23m ago · Author Name</Text>
        </View>
      )}
      <View className="absolute right-2 top-2">
        <DropdownMenuComponent />
      </View>
    </View>
  );
}; 