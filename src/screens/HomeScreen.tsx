import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SessionService } from '../api/apiService'; // Pamiętaj o imporcie serwisu
import { TrainingSessionDto } from '../types/models'; // Pamiętaj o imporcie DTO

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  // 1. STANY MUSZĄ BYĆ TUTAJ
  const [lastWorkouts, setLastWorkouts] = useState<TrainingSessionDto[]>([]);

  // 2. FUNKCJA POMOCNICZA WEWNĄTRZ LUB NAD KOMPONENTEM
  const getDaysAgo = (dateString: string) => {
    const start = new Date(dateString);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "DZISIAJ";
    if (diffDays === 1) return "WCZORAJ";
    return `${diffDays} DNI TEMU`;
  };

  // 3. EFEKT POBIERANIA DANYCH WEWNĄTRZ
  useEffect(() => {
    const fetchLastWorkouts = async () => {
      try {
        const data = await SessionService.getTrainingSessions(1);
        const lastFour = data
          .filter((s: TrainingSessionDto) => s.completedAt !== null)
          .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
          .slice(0, 4);
        
        setLastWorkouts(lastFour);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLastWorkouts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconPlaceholder}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconPlaceholder}>👤</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.mainTitle}>OSTATNIE{"\n"}TRENINGI</Text>

      <View style={styles.historyCard}>
        {lastWorkouts.map((workout, index) => (
          <React.Fragment key={workout.id}>
            <View style={styles.historyRow}>
              <Text style={styles.workoutName}>
  {workout.templateName ? workout.templateName.toUpperCase() : "TRENING WŁASNY"}
</Text>
              <Text style={styles.workoutDate}>
                {getDaysAgo(workout.startedAt)}
              </Text>
            </View>
            {index < lastWorkouts.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
        
        {lastWorkouts.length === 0 && (
          <Text style={{ color: '#AAA', textAlign: 'center' }}>BRAK OSTATNICH TRENINGÓW</Text>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('WorkoutSelection')} 
        >
          <Text style={styles.primaryButtonText}>ROZPOCZNIJ TRENING</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('WorkoutHistory')} 
        >
          <Text style={styles.secondaryButtonText}>HISTORIA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ... style pozostają bez zmian ...

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