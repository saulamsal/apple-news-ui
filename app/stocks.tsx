import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CartesianChart, Line } from 'victory-native';
import { NewsItem } from '@/components/NewsItem';
import stocksData from '@/app/data/stocks.json';
import { news } from '@/data/news.json';
import { Ionicons } from '@expo/vector-icons';
import * as DropdownMenu from 'zeego/dropdown-menu';

interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    percentChange: number;
    marketCap: string;
    pe: number | null;
    volume: string;
    high52: number;
    low52: number;
    historicalData: Array<{
        date: string;
        price: number;
    }>;
}

interface IndexData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    percentChange: number;
}

const { width } = Dimensions.get('window');

const StockItem = ({ stock, onPress }: { stock: StockData; onPress: (stock: StockData) => void }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
        <TouchableOpacity 
            onPress={() => onPress(stock)}
            className="flex-row items-center justify-between p-4 border-b border-gray-800"
        >
            <View className="flex-1">
                <Text className="text-2xl font-bold text-white">{stock.symbol}</Text>
                <Text className="text-base text-gray-400">{stock.name}</Text>
            </View>
            <View className="w-16 h-8 mb-1 mr-4">
                <CartesianChart
                    data={stock.historicalData.map(d => ({ x: new Date(d.date).getTime(), y: d.price }))}
                    xKey="x"
                    yKeys={["y"]}
                    domainPadding={{ left: 0, right: 0 }}
                    axisOptions={{
                        formatXLabel: () => "",
                        formatYLabel: () => "",
                    }}
                >
                    {({ points }) => (
                        <>
                            <Line 
                                points={points.y}
                                color={stock.change >= 0 ? "#32D74B" : "#FF453A"}
                                strokeWidth={2.5}
                            />
                        </>
                    )}
                </CartesianChart>
            </View>
            <View className="items-end">
                <Text className="text-lg text-white">${stock.price}</Text>
                <View className={`px-2 py-0.5 rounded ${stock.change >= 0 ? 'bg-[#32D74B]' : 'bg-[#FF453A]'}`}>
                    <Text className="text-sm text-white">
                        {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.percentChange}%)
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const IndexItem = ({ index }: { index: IndexData }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
        <View className="flex-1 rounded-lg p-4 bg-gray-800">
            <Text className="text-sm text-gray-400">{index.name}</Text>
            <Text className="text-lg font-semibold text-white">{index.price.toLocaleString()}</Text>
            <Text className={`text-sm ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {index.change >= 0 ? '+' : ''}{index.change} ({index.percentChange}%)
            </Text>
        </View>
    );
};

const SearchComponent = () => (
    <View className="flex-row items-center bg-[#1C1C1E] px-3 h-[38px] rounded-[10px]">
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
            placeholder="Search"
            className="flex-1 pl-2 text-[17px] text-white"
            placeholderTextColor="#666"
        />
    </View>
);

const StockMenu = () => (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <View className="p-1 bg-[#57aefb0c] rounded-full">
                <Ionicons name="ellipsis-horizontal" size={24} color="#57AEFB" />
            </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Item key="edit" onSelect={() => {}} textValue="Edit Watchlist">
                <DropdownMenu.ItemTitle>Edit Watchlist</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item key="show" onSelect={() => {}} textValue="Show Currency">
                <DropdownMenu.ItemTitle>Show Currency</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>
                    <DropdownMenu.ItemTitle>Sort Watchlist By</DropdownMenu.ItemTitle>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                    <DropdownMenu.Item key="manual" onSelect={() => {}} textValue="Manual">
                        <DropdownMenu.ItemTitle>Manual</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item key="name" onSelect={() => {}} textValue="Name">
                        <DropdownMenu.ItemTitle>Name</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item key="price" onSelect={() => {}} textValue="Price">
                        <DropdownMenu.ItemTitle>Price</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>
                    <DropdownMenu.ItemTitle>Watchlist Shows</DropdownMenu.ItemTitle>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                    <DropdownMenu.Item key="price-change" onSelect={() => {}} textValue="Price Change">
                        <DropdownMenu.ItemTitle>Price Change</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item key="percent-change" onSelect={() => {}} textValue="Percent Change">
                        <DropdownMenu.ItemTitle>Percent Change</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item key="market-cap" onSelect={() => {}} textValue="Market Cap">
                        <DropdownMenu.ItemTitle>Market Cap</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Item key="feedback" onSelect={() => {}} textValue="Provide Feedback">
                <DropdownMenu.ItemTitle>Provide Feedback</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
);

export default function StocksScreen() {
    const { top, bottom } = useSafeAreaInsets();
    const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
    const [showIndexInSheet, setShowIndexInSheet] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const newsBottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '90%'], []);
    const newsSnapPoints = useMemo(() => [`25%`, `${Math.min(top + 100, 50)}%`], [top]);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleSheetChange = useCallback((index: number) => {
        setShowIndexInSheet(index === 1);
    }, []);

    const handleStockPress = useCallback((stock: StockData) => {
        setSelectedStock(stock);
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const Header = () => (
        <View 
            className="bg-black px-4 pt-2 pb-3" 
            style={{ paddingTop: top }}
        >
            <View className="flex-row justify-between items-start">
                <NewsHeaderLeftItem size="md" secondaryTitle="Stocks" theme="dark" />
                <StockMenu />
            </View>
            <SearchComponent />
            {/* <View className="flex-row gap-2 mt-4">
                {stocksData.indices.map((index) => (
                    <IndexItem key={index.symbol} index={index} />
                ))}
            </View> */}
        </View>
    );

    const renderStockDetails = () => {
        if (!selectedStock) return null;

        const chartData = selectedStock.historicalData.map((data) => ({
            x: new Date(data.date).getTime(),
            y: data.price
        }));

        return (
            <BottomSheetScrollView className="flex-1 px-4 bg-[#1C1C1C]">
                <View className="py-4">
                    <Text className="text-2xl font-bold text-white">{selectedStock.name}</Text>
                    <Text className="text-3xl font-semibold mt-2 text-white">${selectedStock.price}</Text>
                    <Text className={`text-lg ${selectedStock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.percentChange}%)
                    </Text>

                    <View className="h-[200] mt-4">
                        <CartesianChart
                            data={chartData}
                            xKey="x"
                            yKeys={["y"]}
                            domainPadding={{ left: 20, right: 20 }}
                            axisOptions={{
                                formatXLabel: (value) => {
                                    const date = new Date(value);
                                    return `${date.getMonth() + 1}/${date.getDate()}`;
                                },
                                formatYLabel: (value) => `$${value}`
                            }}
                        >
                            {({ points }) => (
                                <Line
                                    points={points.y}
                                    color={selectedStock.change >= 0 ? "#32D74B" : "#FF453A"}
                                    animate={{ type: "timing", duration: 300 }}
                                />
                            )}
                        </CartesianChart>
                    </View>

                    <View className="mt-4 flex-row flex-wrap">
                        <View className="w-1/2 mb-4">
                            <Text className="text-gray-400">Market Cap</Text>
                            <Text className="text-lg text-white">{selectedStock.marketCap}</Text>
                        </View>
                        <View className="w-1/2 mb-4">
                            <Text className="text-gray-400">P/E Ratio</Text>
                            <Text className="text-lg text-white">{selectedStock.pe || '-'}</Text>
                        </View>
                        <View className="w-1/2 mb-4">
                            <Text className="text-gray-400">Volume</Text>
                            <Text className="text-lg text-white">{selectedStock.volume}</Text>
                        </View>
                        <View className="w-1/2 mb-4">
                            <Text className="text-gray-400">52W Range</Text>
                            <Text className="text-lg text-white">{selectedStock.low52} - {selectedStock.high52}</Text>
                        </View>
                    </View>

                    <View className="mt-4">
                        <Text className="text-xl font-bold mb-4 text-white">Business News</Text>
                        {news.slice(0, 5).map((item: any) => (
                            <NewsItem key={item.id} item={item} />
                        ))}
                    </View>
                </View>
            </BottomSheetScrollView>
        );
    };

    const WatchlistButton = () => (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <View className="flex-row items-center px-4 py-3">
                    <Text className="text-xl font-bold text-[#57AEFB]">My Symbols</Text>
                    <View className=" items-center">
                        <Ionicons name="chevron-up" size={12} color="#57AEFB" className="ml-2" />
                        <Ionicons name="chevron-down" size={12} color="#57AEFB" className="ml-2 " />
                    </View>
                   
                </View>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {stocksData.stocks.slice(0, 3).map((stock) => (
                    <DropdownMenu.Item 
                        key={stock.symbol} 
                        onSelect={() => handleStockPress(stock)}
                        textValue={stock.symbol}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="checkmark-circle" size={24} color="#32D74B" />
                            <View className="ml-3">
                                <DropdownMenu.ItemTitle>{stock.symbol}</DropdownMenu.ItemTitle>
                                <Text className="text-sm text-gray-400">{stock.name}</Text>
                            </View>
                        </View>
                    </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator />
                <DropdownMenu.Item key="new" onSelect={() => {}} textValue="New Watchlist">
                    <View className="flex-row items-center">
                        <View className="w-6 h-6 rounded-full bg-[#32D74B] items-center justify-center">
                            <Ionicons name="add" size={20} color="white" />
                        </View>
                        <DropdownMenu.ItemTitle className="ml-3">New Watchlist</DropdownMenu.ItemTitle>
                    </View>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );

    const renderBusinessNews = () => (
        <BottomSheetScrollView className="flex-1 px-4 bg-[#1C1C1C]">
            {showIndexInSheet && (
                <View className="flex-row gap-2 py-4">
                    {stocksData.indices.map((index) => (
                        <IndexItem key={index.symbol} index={index} />
                    ))}
                </View>
            )}
            <View className="py-4">
                <Text className="text-xl font-bold mb-4 text-white">Business News</Text>
                {news.map((item: any) => (
                    <NewsItem key={item.id} item={item} />
                ))}
            </View>
        </BottomSheetScrollView>
    );

    return (
        <View className="flex-1 bg-black">
            <Header />
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: bottom }}
                // stickyHeaderIndices={[0]}
            >
                <WatchlistButton />
                <View>
                    {stocksData.stocks.map((stock) => (
                        <StockItem 
                            key={stock.symbol} 
                            stock={stock} 
                            onPress={handleStockPress}
                        />
                    ))}
                </View>
            </ScrollView>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backgroundStyle={{ backgroundColor: '#1C1C1C' }}
                handleIndicatorStyle={{ backgroundColor: '#666' }}
            >
                {renderStockDetails()}
            </BottomSheet>

            <BottomSheet
                ref={newsBottomSheetRef}
                index={0}
                snapPoints={newsSnapPoints}
                enablePanDownToClose={false}
                backgroundStyle={{ backgroundColor: '#1C1C1C' }}
                handleIndicatorStyle={{ backgroundColor: '#666' }}
                onChange={handleSheetChange}
            >
                {renderBusinessNews()}
            </BottomSheet>
        </View>
    );
} 