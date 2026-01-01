import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Witaj w Training Tracker!</Text>
      <Text style={styles.subtitle}>Wybierz akcję, aby rozpocząć:</Text>
      
      <TouchableOpacity 
        style={styles.mainButton}
        onPress={() => navigation.navigate('WorkoutSelection')} 
      >
        <Text style={styles.buttonText}>ROZPOCZNIJ TRENING</Text>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA', // Jasne, profesjonalne tło zamiast czerwonego
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 4
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default HomeScreen;