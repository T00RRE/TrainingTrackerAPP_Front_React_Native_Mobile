import React from 'react';
import { View, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/TrainingTrackerApp-Logo.webp')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <ActivityIndicator size="large" color="#FF5A5F" style={{ marginTop: 20 }} />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2F33', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6, 
    height: width * 0.6,
  },
});

export default SplashScreen;