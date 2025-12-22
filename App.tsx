import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { ExerciseSetService } from './api/apiService';
import { ExerciseSetDto } from './types/models';
const CustomColors = {
  darker: '#121212', // Ciemny szary dla tła w trybie ciemnym
  lighter: '#FFFFFF', // Biały dla tła w trybie jasnym
  dark: '#000000', // Czarny dla tekstu
};
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [sets, setSets] = useState<ExerciseSetDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? CustomColors.darker : CustomColors.lighter,
  };

  useEffect(() => {
    // UWAGA: Musisz znać ID istniejącego Trainingu w Twojej bazie danych, aby to zadziałało.
    // Proszę, użyj tutaj ID treningu, który na pewno istnieje w Twojej bazie danych!
    // Jeśli nie masz ID, użyj jakiegoś losowego, aby sprawdzić, czy dostaniesz 404/400 (co też jest sukcesem połączenia).

    const randomSetId = 6;

const fetchSets = async () => {
  try {
    setLoading(true);
        // WYKONANIE ZAPYTANIA
       const data = await ExerciseSetService.getSetsForSessionExercise(randomSetId);
       setSets(data); // Oczekujemy tablicy
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
            // Skracamy błąd, aby był czytelny na ekranie
            setError(err.message.substring(0, 100)); 
        } else {
            setError("Wystąpił nieznany błąd podczas ładowania danych.");
        }
        setSets(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Text style={styles.statusText}>Ładowanie danych...</Text>;
    }
    if (error) {
      return <Text style={[styles.statusText, styles.errorText]}>❌ BŁĄD POŁĄCZENIA: {error}</Text>;
    }
    if (sets && sets.length > 0) {
      return (
        <>
          <Text style={styles.statusText}>✅ Sukces! Pobrano {sets.length} zestawów ćwiczeń.</Text>
          {sets.map((set) => (
            <Text key={set.id} style={styles.dataText}>
              - {set.exerciseName}: {set.repetitions} x {set.weight} kg
            </Text>
          ))}
        </>
      );
    }
    return <Text style={styles.statusText}>Brak danych do wyświetlenia (lub TrainingId jest niepoprawne).</Text>;
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Test Połączenia API</Text>
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '400',
    color: CustomColors.dark,
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
  dataText: {
    fontSize: 14,
    marginLeft: 10,
    color: CustomColors.dark,
  }
});

export default App;