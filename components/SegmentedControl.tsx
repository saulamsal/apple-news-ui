import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    values: string[];
    selectedIndex: number;
    onChange: (index: number) => void;
}

export const SegmentedControl = ({ values, selectedIndex, onChange }: Props) => {
    return (
        <View className="h-8 bg-[#E3E2EA] rounded-lg p-1 flex-row">
            {values.map((value, index) => (
                <TouchableOpacity
                    key={value}
                    onPress={() => onChange(index)}
                    className={`flex-1 items-center justify-center rounded-md ${
                        selectedIndex === index ? 'bg-white' : ''
                    }`}
                >
                    <Text className={`text-sm font-medium capitalize ${
                        selectedIndex === index ? 'text-black' : 'text-gray-600'
                    }`}>
                        {value}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}; 