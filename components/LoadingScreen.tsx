import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';

export const LoadingScreen = () => {

  return (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="small" color="#000" />
    <Text style={styles.loadingText}>LOADING</Text>
  </View>
);
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Platform.OS === 'ios' ? '#F2F2F7' : '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: '#000',
  },
}); 