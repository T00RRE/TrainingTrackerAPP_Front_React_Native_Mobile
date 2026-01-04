import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
// Jeśli masz zainstalowane lucide-react-native lub expo-vector-icons, możesz dodać ikony
// import { Settings, User } from 'lucide-react-native'; 

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Nagłówek z ikonami */}
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconPlaceholder}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconPlaceholder}>👤</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.mainTitle}>OSTATNIE{"\n"}TRENINGI</Text>

      {/* Karta z listą ostatnich treningów */}
      <View style={styles.historyCard}>
        <View style={styles.historyRow}>
          <Text style={styles.workoutName}>PUSH</Text>
          <Text style={styles.workoutDate}>2 DNI TEMU</Text>
        </View>
        <View style={styles.separator} />
        
        <View style={styles.historyRow}>
          <Text style={styles.workoutName}>PULL</Text>
          <Text style={styles.workoutDate}>5 DNI TEMU</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.historyRow}>
          <Text style={styles.workoutName}>NOGI</Text>
          <Text style={styles.workoutDate}>7 DNI TEMU</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.historyRow}>
          <Text style={styles.workoutName}>PUSH</Text>
          <Text style={styles.workoutDate}>10 DNI TEMU</Text>
        </View>
      </View>

      {/* Przyciski akcji na dole */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('WorkoutSelection')} 
        >
          <Text style={styles.primaryButtonText}>ROZPOCZNIJ TRENING</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => {/* Tutaj będzie nawigacja do historii */}} 
        >
          <Text style={styles.secondaryButtonText}>HISTORIA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#2D2F33', 
    paddingHorizontal: 30
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 15
  },
  iconButton: {
    padding: 5
  },
  iconPlaceholder: {
    fontSize: 24,
    color: '#FFF'
  },
  mainTitle: { 
    color: '#FFF', 
    fontSize: 32, 
    fontWeight: '900', 
    textAlign: 'center', 
    marginTop: 40,
    letterSpacing: 2,
    lineHeight: 40
  },
  historyCard: {
    marginTop: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15
  },
  workoutName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1
  },
  workoutDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    opacity: 0.9
  },
  separator: {
    height: 1,
    backgroundColor: '#FFF',
    opacity: 0.5,
    marginHorizontal: 0
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 50,
    gap: 15
  },
  primaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFF',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1
  },
  secondaryButton: {
    backgroundColor: '#444', // Ciemniejsze wypełnienie dla odróżnienia
    borderWidth: 2,
    borderColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center'
  },
  secondaryButtonText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1
  }
});

export default HomeScreen;