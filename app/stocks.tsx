import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme, TextInput, ScrollView, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { LineChart } from 'react-native-gifted-charts';
import { NewsItem } from '@/components/NewsItem';
import stocksData from '@/app/data/stocks.json';
import { news } from '@/data/news.json';
import { Ionicons } from '@expo/vector-icons';
import {DropdownMenu} from '@/components/DropdownMenu';
import {ContextMenu} from '@/components/ContextMenu'
// import {Appearance} from 'react-native';
import { MMKV } from 'react-native-mmkv';

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

interface WatchlistData {
    id: string;
    name: string;
    symbols: string[];
}

interface DisplaySettings {
    showCurrency: boolean;
    sortBy: 'manual' | 'name' | 'price';
    displayMode: 'price-change' | 'percent-change' | 'market-cap';
}

const { width } = Dimensions.get('window');

const storage = new MMKV();

const StockItem = ({ 
    stock, 
    onPress,
    isInWatchlist,
    onToggleWatchlist,
    showWatchlistButton = false,
    displayMode,
    showCurrency
}: { 
    stock: StockData; 
    onPress: (stock: StockData) => void;
    isInWatchlist?: boolean;
    onToggleWatchlist?: (symbol: string) => void;
    showWatchlistButton?: boolean;
    displayMode: 'price-change' | 'percent-change' | 'market-cap';
    showCurrency: boolean;
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    const chartData = stock.historicalData.map(d => ({
        value: d.price,
        date: new Date(d.date).getTime()
    }));
    
    const StockPreview = () => (
        <View className="p-4 bg-[#1C1C1C] rounded-lg">
            <Text className="text-2xl font-bold text-white">{stock.name}</Text>
            <Text className="text-3xl font-semibold mt-2 text-white">${stock.price}</Text>
            <Text className={`text-lg ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.percentChange}%)
            </Text>

            <View className="h-[200] mt-4">
                <LineChart
                    areaChart
                    data={chartData}
                    height={200}
                    width={width - 48}
                    rotateLabel
                    labelsExtraHeight={20}
                    hideDataPoints
                    spacing={width / chartData.length - 2}
                    color={stock.change >= 0 ? "#32D74B" : "#FF453A"}
                    thickness={1}
                    startFillColor={stock.change >= 0 ? "#32D74B" : "#FF453A"}
                    endFillColor={stock.change >= 0 ? "#32D74B" : "#FF453A"}
                    startOpacity={0.15}
                    endOpacity={0.05}
                    initialSpacing={0}
                    yAxisTextStyle={{color: '#666', fontSize: 12}}
                    yAxisLabelWidth={60}
                    xAxisLabelTextStyle={{color: '#666', fontSize: 12}}
                    rulesColor="#333"
                    xAxisColor="#333"
                    pointerConfig={{
                        pointerStripHeight: 140,
                        pointerStripColor: "#333",
                        pointerStripWidth: 1,
                        pointerColor: "#666",
                        radius: 4,
                        pointerLabelWidth: 100,
                        pointerLabelHeight: 90,
                        activatePointersOnLongPress: true,
                        autoAdjustPointerLabelPosition: false,
                        pointerLabelComponent: (items: any) => {
                            return (
                                <View
                                    style={{
                                        height: 90,
                                        width: 100,
                                        justifyContent: "center",
                                        marginTop: -30,
                                        marginLeft: -40,
                                        borderRadius: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 12,
                                            marginBottom: 6,
                                            textAlign: "center",
                                        }}
                                    >
                                        {new Date(items[0].date).toLocaleTimeString([], {
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                    </Text>

                                    <View
                                        style={{
                                            paddingHorizontal: 14,
                                            paddingVertical: 6,
                                            borderRadius: 16,
                                            backgroundColor: "white",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                color: "black",
                                            }}
                                        >
                                            {"$" + items[0].value.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            );
                        },
                    }}
                />
            </View>

            <View className="mt-4 flex-row flex-wrap">
                <View className="w-1/2 mb-4">
                    <Text className="text-gray-400">Market Cap</Text>
                    <Text className="text-lg text-white">{stock.marketCap}</Text>
                </View>
                <View className="w-1/2 mb-4">
                    <Text className="text-gray-400">P/E Ratio</Text>
                    <Text className="text-lg text-white">{stock.pe || '-'}</Text>
                </View>
                <View className="w-1/2 mb-4">
                    <Text className="text-gray-400">Volume</Text>
                    <Text className="text-lg text-white">{stock.volume}</Text>
                </View>
                <View className="w-1/2 mb-4">
                    <Text className="text-gray-400">52W Range</Text>
                    <Text className="text-lg text-white">{stock.low52} - {stock.high52}</Text>
                </View>
            </View>
        </View>
    );
    
    const renderValue = () => {
        switch (displayMode) {
            case 'price-change':
                return (
                    <View className={`px-2 py-0.5 rounded ${stock.change >= 0 ? 'bg-[#32D74B]' : 'bg-[#FF453A]'}`}>
                        <Text className="text-sm text-white">
                            {stock.change >= 0 ? '+' : ''}{showCurrency ? '$' : ''}{stock.change}
                        </Text>
                    </View>
                );
            case 'percent-change':
                return (
                    <View className={`px-2 py-0.5 rounded ${stock.change >= 0 ? 'bg-[#32D74B]' : 'bg-[#FF453A]'}`}>
                        <Text className="text-sm text-white">
                            {stock.change >= 0 ? '+' : ''}{stock.percentChange}%
                        </Text>
                    </View>
                );
            case 'market-cap':
                return (
                    <Text className="text-sm text-gray-400">
                        {stock.marketCap}
                    </Text>
                );
            default:
                return null;
        }
    };
    
    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger>
                <TouchableOpacity 
                    onPress={() => onPress(stock)}
                    className="flex-row items-center justify-between p-4 border-b border-gray-800"
                >
                    {showWatchlistButton && onToggleWatchlist && (
                        <TouchableOpacity 
                            onPress={() => onToggleWatchlist(stock.symbol)}
                            className="mr-3"
                        >
                            <Ionicons 
                                name={isInWatchlist ? "checkmark-circle" : "add-circle-outline"} 
                                size={24} 
                                color={isInWatchlist ? "#32D74B" : "#666"} 
                            />
                        </TouchableOpacity>
                    )}
                    <View className={`flex-1 ${!showWatchlistButton ? 'ml-0' : ''}`}>
                        <Text className="text-2xl font-bold text-white">{stock.symbol}</Text>
                        <Text className="text-base text-gray-400">{stock.name}</Text>
                    </View>
                    <View className="w-16 h-8 mb-1 mr-4">
                        <LineChart
                            data={chartData}
                            height={32}
                            width={64}
                            hideDataPoints
                            color={stock.change >= 0 ? "#32D74B" : "#FF453A"}
                            thickness={1.5}
                            hideYAxisText
                            hideAxesAndRules
                            initialSpacing={0}
                            endSpacing={0}
                            curved
                        />
                    </View>
                    <View className="items-end">
                        <Text className="text-lg text-white">{showCurrency ? '$' : ''}{stock.price}</Text>
                        {renderValue()}
                    </View>
                </TouchableOpacity>
            </ContextMenu.Trigger>
            <ContextMenu.Content>
                <ContextMenu.Preview>
                    {() => <StockPreview />}
                </ContextMenu.Preview>
                <ContextMenu.Item key="share" onSelect={() => {}} textValue="Share Symbol">
                    <ContextMenu.ItemIcon ios={{ name: "square.and.arrow.up" }} />
                    <ContextMenu.ItemTitle>Share Symbol</ContextMenu.ItemTitle>
                </ContextMenu.Item>
                <ContextMenu.Item key="copy" onSelect={() => {}} textValue="Copy Link">
                    <ContextMenu.ItemIcon ios={{ name: "link" }} />
                    <ContextMenu.ItemTitle>Copy Link</ContextMenu.ItemTitle>
                </ContextMenu.Item>
                {isInWatchlist && (
                    <ContextMenu.Item 
                        key="remove" 
                        onSelect={() => onToggleWatchlist?.(stock.symbol)} 
                        textValue="Remove from Watchlist" 
                        destructive
                    >
                        <ContextMenu.ItemIcon ios={{ name: "minus.circle.fill" }} />
                        <ContextMenu.ItemTitle>Remove from Watchlist</ContextMenu.ItemTitle>
                    </ContextMenu.Item>
                )}
            </ContextMenu.Content>
        </ContextMenu.Root>
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

const SearchComponent = ({ 
    value, 
    onChangeText, 
    onFocus, 
    onBlur,
    inputRef 
}: { 
    value: string;
    onChangeText: (text: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    inputRef: React.RefObject<TextInput>;
}) => (
    <View className="flex-row items-center bg-[#1C1C1E] px-3 h-[38px] rounded-[10px] mx-6">
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
            ref={inputRef}
            placeholder="Search Stocks"
            className="flex-1 pl-2 text-[17px] text-white"
            placeholderTextColor="#666"
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
        />
        {value ? (
            <TouchableOpacity onPress={() => onChangeText('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
        ) : null}
    </View>
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
    const [searchQuery, setSearchQuery] = useState('');
    const [activeWatchlist, setActiveWatchlist] = useState<WatchlistData>({
        id: 'default',
        name: 'My Symbols',
        symbols: []
    });
    const [watchlists, setWatchlists] = useState<WatchlistData[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef<TextInput>(null);
    const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
        showCurrency: true,
        sortBy: 'manual',
        displayMode: 'price-change'
    });

    // Appearance.setColorScheme('dark');

    // Load settings from storage
    useEffect(() => {
        const storedSettings = storage.getString('displaySettings');
        if (storedSettings) {
            setDisplaySettings(JSON.parse(storedSettings));
        }
    }, []);

    // Save settings to storage
    useEffect(() => {
        storage.set('displaySettings', JSON.stringify(displaySettings));
    }, [displaySettings]);

    // Initialize with My Symbols as default
    useEffect(() => {
        const storedWatchlists = storage.getString('watchlists');
        const storedActive = storage.getString('activeWatchlist');
        const defaultWatchlist = {
            id: 'default',
            name: 'My Symbols',
            symbols: []
        };

        if (storedWatchlists) {
            const parsed = JSON.parse(storedWatchlists);
            // Ensure My Symbols is always first
            const mySymbolsIndex = parsed.findIndex((w: WatchlistData) => w.id === 'default');
            if (mySymbolsIndex === -1) {
                setWatchlists([defaultWatchlist, ...parsed]);
            } else {
                setWatchlists(parsed);
            }
        } else {
            setWatchlists([defaultWatchlist]);
        }

        if (storedActive) {
            setActiveWatchlist(JSON.parse(storedActive));
        } else {
            setActiveWatchlist(defaultWatchlist);
        }
    }, []);

    const filteredStocks = useMemo(() => {
        if (!searchQuery) {
            if (isSearchFocused) {
                return stocksData.stocks;
            }
            return stocksData.stocks.filter(stock => 
                activeWatchlist.symbols.includes(stock.symbol)
            );
        }
        
        const query = searchQuery.toLowerCase().trim();
        const results = stocksData.stocks.filter(stock => 
            stock.symbol.toLowerCase().includes(query) || 
            stock.name.toLowerCase().includes(query)
        );

        // If searching, show all results regardless of watchlist
        if (isSearchFocused) {
            return results;
        }
        
        // If not searching, only show results from active watchlist
        return results.filter(stock => activeWatchlist.symbols.includes(stock.symbol));
    }, [searchQuery, activeWatchlist.symbols, isSearchFocused]);

    const handleAddToWatchlist = useCallback((symbol: string) => {
        setActiveWatchlist(prev => ({
            ...prev,
            symbols: [...prev.symbols, symbol]
        }));
    }, []);

    const handleRemoveFromWatchlist = useCallback((symbol: string) => {
        setActiveWatchlist(prev => ({
            ...prev,
            symbols: prev.symbols.filter(s => s !== symbol)
        }));
    }, []);

    const handleCreateWatchlist = useCallback((name: string) => {
        const newWatchlist: WatchlistData = {
            id: Date.now().toString(),
            name,
            symbols: []
        };
        setWatchlists(prev => [...prev, newWatchlist]);
        setActiveWatchlist(newWatchlist);
    }, []);

    const handleSheetChange = useCallback((index: number) => {
        setShowIndexInSheet(index === 1);
    }, []);

    const handleStockPress = useCallback((stock: StockData) => {
        setSelectedStock(stock);
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const handleSearchBlur = useCallback(() => {
        if (!searchQuery) {
            setIsSearchFocused(false);
        }
    }, [searchQuery]);

    const sortedStocks = useMemo(() => {
        return [...filteredStocks].sort((a, b) => {
            switch (displaySettings.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return b.price - a.price;
                default:
                    return 0;
            }
        });
    }, [filteredStocks, displaySettings.sortBy]);

    const Header = () => (
        <View 
            className="bg-black px-4 pt-2 pb-3" 
            style={{ paddingTop: top }}
        >
            <View className="flex-row justify-between items-start">
                <NewsHeaderLeftItem size="md" secondaryTitle="Stocks" theme="dark" />
                <StockMenu />
            </View>
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
            value: data.price,
            date: new Date(data.date).getTime()
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
                        <LineChart
                            areaChart
                            data={chartData}
                            height={200}
                            width={width - 48}
                            rotateLabel
                            labelsExtraHeight={20}
                            hideDataPoints
                            spacing={width / chartData.length - 2}
                            color={selectedStock.change >= 0 ? "#32D74B" : "#FF453A"}
                            thickness={1}
                            startFillColor={selectedStock.change >= 0 ? "#32D74B" : "#FF453A"}
                            endFillColor={selectedStock.change >= 0 ? "#32D74B" : "#FF453A"}
                            startOpacity={0.15}
                            endOpacity={0.05}
                            initialSpacing={0}
                            yAxisTextStyle={{color: '#666', fontSize: 12}}
                            yAxisLabelWidth={60}
                            xAxisLabelTextStyle={{color: '#666', fontSize: 12}}
                            rulesColor="#333"
                            xAxisColor="#333"
                            pointerConfig={{
                                pointerStripHeight: 140,
                                pointerStripColor: "#333",
                                pointerStripWidth: 1,
                                pointerColor: "#666",
                                radius: 4,
                                pointerLabelWidth: 100,
                                pointerLabelHeight: 90,
                                activatePointersOnLongPress: true,
                                autoAdjustPointerLabelPosition: false,
                                pointerLabelComponent: (items: any) => {
                                    return (
                                        <View
                                            style={{
                                                height: 90,
                                                width: 100,
                                                justifyContent: "center",
                                                marginTop: -30,
                                                marginLeft: -40,
                                                borderRadius: 5,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "white",
                                                    fontSize: 12,
                                                    marginBottom: 6,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {new Date(items[0].date).toLocaleTimeString([], {
                                                    hour: 'numeric',
                                                    minute: '2-digit'
                                                })}
                                            </Text>

                                            <View
                                                style={{
                                                    paddingHorizontal: 14,
                                                    paddingVertical: 6,
                                                    borderRadius: 16,
                                                    backgroundColor: "white",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        color: "black",
                                                    }}
                                                >
                                                    {"$" + items[0].value.toFixed(2)}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                },
                            }}
                        />
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
                    <Text className="text-xl font-bold text-[#57AEFB]">{activeWatchlist.name}</Text>
                    <View className="items-center">
                        <Ionicons name="chevron-up" size={12} color="#57AEFB" className="ml-2" />
                        <Ionicons name="chevron-down" size={12} color="#57AEFB" className="ml-2" />
                    </View>
                </View>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {watchlists.map((watchlist) => (
                    <DropdownMenu.Item 
                        key={watchlist.id}
                        onSelect={() => setActiveWatchlist(watchlist)}
                        textValue={watchlist.name}
                    >
                        <View className="flex-row items-center">
                            {watchlist.id === activeWatchlist.id && (
                                <Ionicons name="checkmark" size={20} color="#32D74B" />
                            )}
                            <DropdownMenu.ItemTitle className="ml-2">{watchlist.name}</DropdownMenu.ItemTitle>
                        </View>
                    </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator />
                <DropdownMenu.Item 
                    key="new" 
                    onSelect={() => {
                        Alert.prompt(
                            'New Watchlist',
                            'Enter a name for this watchlist',
                            [
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Save',
                                    onPress: (name?: string) => {
                                        if (name?.trim()) {
                                            handleCreateWatchlist(name.trim());
                                        }
                                    }
                                }
                            ],
                            'plain-text'
                        );
                    }} 
                    textValue="New Watchlist"
                >
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

    const EmptyWatchlist = () => (
        <View className="flex-1 items-center justify-center py-16">
            <Text className="text-xl font-semibold text-white mb-2">No Symbols</Text>
            <Text className="text-base text-gray-400 mb-6">Add symbols to see prices</Text>
            <TouchableOpacity 
                onPress={() => {
                    setIsSearchFocused(true);
                    searchRef.current?.focus();
                }}
                className="bg-[#32D74B] px-6 py-3 rounded-lg"
            >
                <Text className="text-white font-semibold text-lg">Add Symbols</Text>
            </TouchableOpacity>
        </View>
    );

    const StockMenu = useCallback(() => (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <View className="p-1 bg-[#57aefb0c] rounded-full">
                    <Ionicons name="ellipsis-horizontal" size={24} color="#57AEFB" />
                </View>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item key="edit" onSelect={() => {}} textValue="Edit Watchlist">
                    <DropdownMenu.ItemIcon ios={{ name: "pencil" }} />
                    <DropdownMenu.ItemTitle>Edit Watchlist</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                    key="show" 
                    onSelect={() => {
                        setDisplaySettings(prev => ({
                            ...prev,
                            showCurrency: !prev.showCurrency
                        }));
                    }} 
                    textValue="Show Currency"
                >
                    <DropdownMenu.ItemIcon ios={{ name: "dollarsign.circle" }} />
                    <DropdownMenu.ItemTitle>Show Currency</DropdownMenu.ItemTitle>
                    {displaySettings.showCurrency && (
                        <Ionicons name="checkmark" size={20} color="#32D74B" className="ml-2" />
                    )}
                </DropdownMenu.Item>
                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger key="sort-trigger">
                        <DropdownMenu.ItemIcon ios={{ name: "arrow.up.arrow.down" }} />
                        <DropdownMenu.ItemTitle>Sort Watchlist By</DropdownMenu.ItemTitle>
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                        <DropdownMenu.Item 
                            key="manual" 
                            onSelect={() => setDisplaySettings(prev => ({ ...prev, sortBy: 'manual' }))} 
                            textValue="Manual"
                        >
                            <DropdownMenu.ItemIcon ios={{ name: "hand.draw" }} />
                            <DropdownMenu.ItemTitle>Manual</DropdownMenu.ItemTitle>
                            {displaySettings.sortBy === 'manual' && (
                                <Ionicons name="checkmark" size={20} color="#32D74B" className="ml-2" />
                            )}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                            key="name" 
                            onSelect={() => setDisplaySettings(prev => ({ ...prev, sortBy: 'name' }))} 
                            textValue="Name"
                        >
                            <DropdownMenu.ItemIcon ios={{ name: "textformat" }} />
                            <DropdownMenu.ItemTitle>Name</DropdownMenu.ItemTitle>
                            {displaySettings.sortBy === 'name' && (
                                <Ionicons name="checkmark" size={20} color="#32D74B" className="ml-2" />
                            )}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                            key="price" 
                            onSelect={() => setDisplaySettings(prev => ({ ...prev, sortBy: 'price' }))} 
                            textValue="Price"
                        >
                            <DropdownMenu.ItemIcon ios={{ name: "dollarsign" }} />
                            <DropdownMenu.ItemTitle>Price</DropdownMenu.ItemTitle>
                            {displaySettings.sortBy === 'price' && (
                                <Ionicons name="checkmark" size={20} color="#32D74B" className="ml-2" />
                            )}
                        </DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger key="watchlist-shows-trigger">
                        <DropdownMenu.ItemIcon ios={{ name: "eye" }} />
                        <DropdownMenu.ItemTitle>Watchlist Shows</DropdownMenu.ItemTitle>
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                        <DropdownMenu.Item 
                            key="price-change" 
                            onSelect={() => setDisplaySettings(prev => ({ ...prev, displayMode: 'price-change' }))} 
                            textValue="Price Change"
                        >
                            <DropdownMenu.ItemIcon ios={{ name: "chart.line.uptrend.xyaxis" }} />
                            <DropdownMenu.ItemTitle>Price Change</DropdownMenu.ItemTitle>
                            {displaySettings.displayMode === 'price-change' && (
                                <Ionicons name="checkmark" size={20} color="#32D74B" className="ml-2" />
                            )}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                            key="percent-change" 
                            onSelect={() => setDisplaySettings(prev => ({ ...prev, displayMode: 'percent-change' }))} 
                            textValue="Percent Change"
                        >
                            <DropdownMenu.ItemIcon ios={{ name: "percent" }} />
                            <DropdownMenu.ItemTitle>Percent Change</DropdownMenu.ItemTitle>
                            {displaySettings.displayMode === 'percent-change' && (
                                <Ionicons name="checkmark" size={20} color="#32D74B" className="ml-2" />
                            )}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                            key="market-cap" 
                            onSelect={() => setDisplaySettings(prev => ({ ...prev, displayMode: 'market-cap' }))} 
                            textValue="Market Cap"
                        >
                            <DropdownMenu.ItemIcon ios={{ name: "chart.pie" }} />
                            <DropdownMenu.ItemTitle>Market Cap</DropdownMenu.ItemTitle>
                            {displaySettings.displayMode === 'market-cap' && (
                                <Ionicons name="checkmark" size={20} color="#32D74B" className="ml-2" />
                            )}
                        </DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Item 
                    key="feedback" 
                    onSelect={() => {
                        Linking.openURL('https://www.apple.com/feedback/stocks/').catch(err => 
                            console.error('Error opening feedback link:', err)
                        );
                    }} 
                    textValue="Provide Feedback"
                >
                    <DropdownMenu.ItemIcon ios={{ name: "envelope" }} />
                    <DropdownMenu.ItemTitle>Provide Feedback</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    ), [displaySettings, setDisplaySettings]);

    return (
        <View className="flex-1 bg-black">
            <Header />
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: bottom }}
                keyboardShouldPersistTaps="handled"
            >
                <SearchComponent 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={handleSearchBlur}
                    inputRef={searchRef}
                />
                <WatchlistButton />
                {!isSearchFocused && activeWatchlist.symbols.length === 0 ? (
                    <EmptyWatchlist />
                ) : (
                    <View>
                        {sortedStocks.map((stock) => (
                            <StockItem 
                                key={stock.symbol} 
                                stock={stock} 
                                onPress={handleStockPress}
                                isInWatchlist={activeWatchlist.symbols.includes(stock.symbol)}
                                onToggleWatchlist={isInWatchlist => 
                                    isInWatchlist ? 
                                        handleRemoveFromWatchlist(stock.symbol) : 
                                        handleAddToWatchlist(stock.symbol)
                                }
                                showWatchlistButton={isSearchFocused || !activeWatchlist.symbols.includes(stock.symbol)}
                                displayMode={displaySettings.displayMode}
                                showCurrency={displaySettings.showCurrency}
                            />
                        ))}
                        {sortedStocks.length === 0 && searchQuery && (
                            <View className="flex-1 items-center justify-center py-16">
                                <Text className="text-lg text-gray-400">No results found</Text>
                                <Text className="text-base text-gray-500 mt-1">Try searching for a different symbol or company</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>


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

        </View>
    );
} 