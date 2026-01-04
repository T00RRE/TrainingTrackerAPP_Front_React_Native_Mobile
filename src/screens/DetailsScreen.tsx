import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ExerciseSetService } from '../api/apiService';
import { ExerciseSetDto } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const DetailsScreen = ({ route }: Props) => {
  const { sessionExerciseId } = route.params;
  const [sets, setSets] = useState<ExerciseSetDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSets = async () => {
      try {
        setLoading(true);
        // Pobieramy dane z Twojego działającego API
        const data = await ExerciseSetService.getSetsForSessionExercise(sessionExerciseId);
        setSets(data);
      } catch (error) {
        Alert.alert("Błąd", "Nie udało się pobrać danych z API.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSets();
  }, [sessionExerciseId]);

  // Komponent pojedynczego wiersza (serii)
  const renderSetItem = ({ item, index }: { item: ExerciseSetDto, index: number }) => (
    <View style={styles.setCard}>
      <View style={styles.setNumberBadge}>
        <Text style={styles.setNumberText}>{index + 1}</Text>
      </View>
      <View style={styles.setData}>
        <Text style={styles.label}>Ciężar: <Text style={styles.value}>{item.weight} kg</Text></Text>
        <Text style={styles.label}>Powtórzenia: <Text style={styles.value}>{item.repetitions}</Text></Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Ładowanie serii...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podsumowanie Ćwiczenia</Text>
      <FlatList
        data={sets}
        renderItem={renderSetItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Brak zarejestrowanych serii dla tego ćwiczenia.</Text>}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', padding: 20, color: '#1A1C1E' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  setCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    // Cień dla iOS i Androida
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  setNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  setNumberText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  setData: { flex: 1 },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  loadingText: { marginTop: 10, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});

export default DetailsScreen;