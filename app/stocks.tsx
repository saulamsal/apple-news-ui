import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ScrollViewWithHeaders, Header } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { SharedValue } from 'react-native-reanimated';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CartesianChart, Line } from 'victory-native';
import stocksData from '@/app/data/stocks.json';

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

const FadingView = ({ opacity, children, style }: { 
    opacity: SharedValue<number>, 
    children?: React.ReactNode,
    style?: any 
}) => (
    <Animated.View style={[{ opacity }, style]}>
        {children}
    </Animated.View>
);

const StockItem = ({ stock, onPress }: { stock: StockData; onPress: (stock: StockData) => void }) => (
    <TouchableOpacity 
        onPress={() => onPress(stock)}
        className="flex-row items-center justify-between p-4 border-b border-gray-100"
    >
        <View className="flex-1">
            <Text className="text-lg font-semibold">{stock.symbol}</Text>
            <Text className="text-sm text-gray-600">{stock.name}</Text>
        </View>
        <View className="items-end">
            <Text className="text-lg">${stock.price}</Text>
            <Text className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.percentChange}%)
            </Text>
        </View>
    </TouchableOpacity>
);

const IndexItem = ({ index }: { index: IndexData }) => (
    <View className="flex-1 bg-white rounded-lg p-4 shadow-sm">
        <Text className="text-sm text-gray-600">{index.name}</Text>
        <Text className="text-lg font-semibold">{index.price.toLocaleString()}</Text>
        <Text className={`text-sm ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {index.change >= 0 ? '+' : ''}{index.change} ({index.percentChange}%)
        </Text>
    </View>
);

export default function StocksScreen() {
    const { top, bottom } = useSafeAreaInsets();
    const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    const handleStockPress = useCallback((stock: StockData) => {
        setSelectedStock(stock);
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const HeaderSurface = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
        <FadingView opacity={showNavBar} style={StyleSheet.absoluteFill}>
            <BlurView style={StyleSheet.absoluteFill} intensity={80} tint="light" />
        </FadingView>
    );

    const HeaderComponent = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
        <Header
            borderWidth={0}
            showNavBar={showNavBar}
            SurfaceComponent={HeaderSurface}
            headerCenter={
                <Text className="text-2xl font-bold">Stocks</Text>
            }
        />
    );

    const LargeHeaderComponent = () => {
        const insets = useSafeAreaInsets();
        return (
            <View className="px-4 pt-2 pb-3 bg-white" style={{ marginTop: -insets.top }}>
                <View className="flex-row justify-between items-start">
                    <NewsHeaderLeftItem size="md" secondaryTitle="Stocks" />
                </View>
                <View className="flex-row gap-2 mt-4">
                    {stocksData.indices.map((index) => (
                        <IndexItem key={index.symbol} index={index} />
                    ))}
                </View>
            </View>
        );
    };

    const renderStockDetails = () => {
        if (!selectedStock) return null;

        const chartData = selectedStock.historicalData.map((data) => ({
            x: new Date(data.date).getTime(),
            y: data.price
        }));

        return (
            <BottomSheetScrollView className="flex-1 px-4">
                <View className="py-4">
                    <Text className="text-2xl font-bold">{selectedStock.name}</Text>
                    <Text className="text-3xl font-semibold mt-2">${selectedStock.price}</Text>
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
                                    color="#22c55e"
                                    animate={{ type: "timing", duration: 300 }}
                                />
                            )}
                        </CartesianChart>
                    </View>

                    <View className="mt-4 flex-row flex-wrap">
                        <View className="w-1/2 mb-4">
                            <Text className="text-gray-600">Market Cap</Text>
                            <Text className="text-lg">{selectedStock.marketCap}</Text>
                        </View>
                        <View className="w-1/2 mb-4">
                            <Text className="text-gray-600">P/E Ratio</Text>
                            <Text className="text-lg">{selectedStock.pe || '-'}</Text>
                        </View>
                        <View className="w-1/2 mb-4">
                            <Text className="text-gray-600">Volume</Text>
                            <Text className="text-lg">{selectedStock.volume}</Text>
                        </View>
                        <View className="w-1/2 mb-4">
                            <Text className="text-gray-600">52W Range</Text>
                            <Text className="text-lg">{selectedStock.low52} - {selectedStock.high52}</Text>
                        </View>
                    </View>
                </View>
            </BottomSheetScrollView>
        );
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollViewWithHeaders
                contentContainerStyle={[{ paddingBottom: bottom }]}
                className="flex-1 bg-white"
                stickyHeaderIndices={[0]}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 0
                }}
                removeClippedSubviews={false}
                LargeHeaderComponent={LargeHeaderComponent}
                absoluteHeader={true}
                HeaderComponent={HeaderComponent}
                headerFadeInThreshold={0.5}
                disableLargeHeaderFadeAnim={false}
                largeHeaderContainerStyle={{ paddingTop: top + 4 }}
            >
                <View>
                    {stocksData.stocks.map((stock) => (
                        <StockItem 
                            key={stock.symbol} 
                            stock={stock} 
                            onPress={handleStockPress}
                        />
                    ))}
                </View>
            </ScrollViewWithHeaders>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backgroundStyle={{ backgroundColor: 'white' }}
            >
                {renderStockDetails()}
            </BottomSheet>
        </View>
    );
} 