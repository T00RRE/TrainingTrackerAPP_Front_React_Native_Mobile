import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SessionService } from '../api/apiService';
import { WorkoutSessionDetailsDto, SessionExerciseRowDto } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSession'>;

const WorkoutSessionScreen = ({ route, navigation }: Props) => {
  // Pobieramy parametry z nawigacji (zakładając, że przekazujesz sessionId i templateId)
  const { sessionId, templateId } = route.params;
  
  const [data, setData] = useState<WorkoutSessionDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessionDetails = async () => {
      try {
        setLoading(true);
        // Wywołanie Twojego nowego endpointu
        const result = await SessionService.getWorkoutSessionDetails(sessionId, templateId);
        setData(result);
      } catch (error) {
        console.error("Błąd podczas ładowania szczegółów sesji:", error);
        Alert.alert("Błąd", "Nie udało się pobrać danych treningu.");
      } finally {
        setLoading(false);
      }
    };

    loadSessionDetails();
  }, [sessionId, templateId]);

  const renderExercise = ({ item }: { item: SessionExerciseRowDto }) => {
    // Sprawdzamy status serii na podstawie danych z API
    const isCompleted = item.wykonaneSerie >= item.planowaneSerie && item.planowaneSerie > 0;

    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.exerciseName]}>
          {item.cwiczenie.toUpperCase()}
        </Text>
        <Text style={styles.cell}>
          {item.ostatniCiezar !== null ? `${item.ostatniCiezar} KG` : '---'}
        </Text>
        <Text style={styles.cell}>
          {item.planowaneSerie}
        </Text>
        <View style={styles.checkCell}>
          <TouchableOpacity 
            style={[styles.checkbox, isCompleted && styles.checkboxDone]}
            onPress={() => {
              // Tutaj później dodamy nawigację do szczegółów serii (DetailsScreen)
              // aby móc dodawać nowe serie i aktualizować stan
              navigation.navigate('Details', { sessionExerciseId: item.sessionExerciseId });
            }}
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Przycisk powrotu */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      {/* Nagłówek sesji */}
      <View style={styles.header}>
        <Text style={styles.title}>TRENING:</Text>
        <Text style={styles.subtitle}>{data?.nazwaSzablonu.toUpperCase()}</Text>
        <Text style={styles.date}>
          {data ? new Date(data.dataTreningu).toLocaleDateString() : ""}
        </Text>
      </View>

      {/* Tabela ćwiczeń */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { textAlign: 'left', flex: 1.5 }]}>ĆWICZENIE</Text>
          <Text style={styles.headerCell}>OSTATNI CIĘŻAR</Text>
          <Text style={styles.headerCell}>SERIE</Text>
          <View style={styles.headerCell} />
        </View>

        <FlatList
          data={data?.cwiczenia}
          renderItem={renderExercise}
          keyExtractor={(item) => item.sessionExerciseId.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Brak ćwiczeń w tej sesji.</Text>
          }
        />
      </View>

      {/* Przyciski akcji */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ DODAJ NOWE ĆWICZENIE</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.finishBtn}
          onPress={() => Alert.alert("Trening", "Czy chcesz zakończyć trening?")}
        >
          <Text style={styles.finishBtnText}>ZAKOŃCZ TRENING</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#2D2F33', 
    paddingHorizontal: 20 
  },
  center: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  backBtn: { 
    marginTop: 20, 
    width: 40 
  },
  backText: { 
    color: '#FFF', 
    fontSize: 28, 
    fontWeight: 'bold' 
  },
  header: { 
    alignItems: 'center', 
    marginVertical: 15 
  },
  title: { 
    color: '#FFF', 
    fontSize: 28, 
    fontWeight: 'bold',
    letterSpacing: 1
  },
  subtitle: { 
    color: '#FFF', 
    fontSize: 22, 
    fontWeight: '600',
    marginTop: 5
  },
  date: { 
    color: '#FFF', 
    fontSize: 14, 
    opacity: 0.6,
    marginTop: 5 
  },
  table: { 
    flex: 1,
    borderWidth: 1, 
    borderColor: '#FFF', 
    borderRadius: 15, 
    overflow: 'hidden',
    marginBottom: 20 
  },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1, 
    borderBottomColor: '#FFF' 
  },
  headerCell: { 
    flex: 1, 
    color: '#FFF', 
    fontSize: 10, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  listContent: {
    paddingBottom: 10
  },
  row: { 
    flexDirection: 'row', 
    paddingVertical: 20, 
    paddingHorizontal: 10,
    alignItems: 'center', 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'rgba(255,255,255,0.2)' 
  },
  cell: { 
    flex: 1, 
    color: '#FFF', 
    fontSize: 12, 
    textAlign: 'center' 
  },
  exerciseName: { 
    flex: 1.5,
    fontWeight: 'bold', 
    textAlign: 'left' 
  },
  checkCell: { 
    flex: 1, 
    alignItems: 'center' 
  },
  checkbox: { 
    width: 22, 
    height: 22, 
    backgroundColor: '#444', 
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#666'
  },
  checkboxDone: { 
    backgroundColor: '#2ECC71',
    borderColor: '#27AE60'
  },
  footer: {
    paddingBottom: 30
  },
  addBtn: { 
    borderWidth: 1, 
    borderColor: '#FFF', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    alignSelf: 'center',
    marginBottom: 20
  },
  addBtnText: { 
    color: '#FFF', 
    fontWeight: 'bold',
    fontSize: 12
  },
  finishBtn: { 
    backgroundColor: '#FF5A5F', 
    paddingVertical: 15, 
    borderRadius: 10, 
    alignItems: 'center',
    elevation: 5
  },
  finishBtnText: { 
    color: '#FFF', 
    fontWeight: '900', 
    fontSize: 18,
    letterSpacing: 1
  },
  emptyText: {
    color: '#AAA',
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic'
  }
});

export default WorkoutSessionScreen;