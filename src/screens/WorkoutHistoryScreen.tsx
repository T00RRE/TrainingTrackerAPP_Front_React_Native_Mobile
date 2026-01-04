import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
// POPRAWIONE IMPORTY (zgodnie z Twoim projektem)
import { SessionService } from '../api/apiService'; 
import { TrainingSessionDto } from '../types/models'; 

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutHistory'>;

const WorkoutHistoryScreen = ({ navigation }: Props) => {
  const [history, setHistory] = useState<TrainingSessionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        // Zakładam, że używamy UserId: 1 na sztywno, tak jak w poprzednich ekranach
        const data = await SessionService.getTrainingSessions(1); 
        
        // Rozwiązanie błędów 'any' przez jawne typowanie parametrów
        const completedSessions = data
          .filter((s: TrainingSessionDto) => s.completedAt !== null)
          .sort((a: TrainingSessionDto, b: TrainingSessionDto) => 
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
          );
          
        setHistory(completedSessions);
      } catch (error) {
        console.error("Błąd ładowania historii:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

 const renderItem = ({ item }: { item: TrainingSessionDto }) => (
  <TouchableOpacity 
    style={styles.historyRow} 
    onPress={() => navigation.navigate('WorkoutDetails', { sessionId: item.id })}
  >
    <Text style={styles.workoutName}>
      {item.templateName?.toUpperCase() || "TRENING"}
    </Text>
    <Text style={styles.workoutDate}>{formatDate(item.startedAt)}</Text>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.container}>
      {/* Przycisk powrotu i ikony zgodne z Twoją Figmą */}
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <Text style={styles.iconPlaceholder}>⚙️</Text>
          <Text style={styles.iconPlaceholder}>👤</Text>
        </View>
      </View>

      <Text style={styles.mainTitle}>HISTORIA{"\n"}TRENINGÓW</Text>
      
      <View style={styles.historyCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={<Text style={styles.emptyText}>Brak ukończonych treningów</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2D2F33', paddingHorizontal: 30 },
  headerIcons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'center' },
  backBtn: { padding: 5 },
  backText: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  rightIcons: { flexDirection: 'row', gap: 15 },
  iconPlaceholder: { fontSize: 24, color: '#FFF' },
  mainTitle: { 
    color: '#FFF', fontSize: 32, fontWeight: '900', 
    textAlign: 'center', marginTop: 30, letterSpacing: 2, lineHeight: 40 
  },
  historyCard: {
    flex: 1, marginTop: 40, marginBottom: 40, borderWidth: 2, 
    borderColor: '#FFF', borderRadius: 25, padding: 10
  },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, paddingHorizontal: 10 },
  workoutName: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  workoutDate: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  separator: { height: 1, backgroundColor: '#FFF', opacity: 0.5 },
  emptyText: { color: '#AAA', textAlign: 'center', marginTop: 40 },
});

export default WorkoutHistoryScreen;