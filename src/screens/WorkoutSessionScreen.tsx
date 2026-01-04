import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SessionService, SetService, ExerciseService } from '../api/apiService';
import { WorkoutSessionDetailsDto, SessionExerciseRowDto } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSession'>;

const WorkoutSessionScreen = ({ route, navigation }: Props) => {
  const { sessionId, templateId } = route.params;
  
  const [data, setData] = useState<WorkoutSessionDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Stany dla Modala
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<SessionExerciseRowDto | null>(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState(''); // To pole będzie teraz odpowiadać za "Serie" na ekranie głównym

// Stany dla modalu "Nowe ćwiczenie"
const [createModalVisible, setCreateModalVisible] = useState(false);
const [newName, setNewName] = useState('');
const [newDescription, setNewDescription] = useState('');
const [newPlannedSets, setNewPlannedSets] = useState('3');
const handleFinishWorkout = () => {
  Alert.alert(
    "Zakończ trening",
    "Czy na pewno chcesz zakończyć ten trening?",
    [
      { text: "Anuluj", style: "cancel" },
      { 
        text: "Zakończ", 
        style: "destructive",
        onPress: async () => {
          try {
            // 1. Wywołujemy API, aby ustawić datę zakończenia w bazie
            await SessionService.finishSession(sessionId);
            
            // 2. Po sukcesie wracamy do ekranu głównego (listy treningów)
            navigation.popToTop(); 
            // lub navigation.goBack() jeśli chcesz wrócić tylko o jeden ekran
          } catch (error) {
            console.error(error);
            Alert.alert("Błąd", "Nie udało się zakończyć sesji w bazie.");
          }
        }
      }
    ]
  );
};
  const handleSaveSet = async () => {
    if (!selectedExercise || !weight || !reps) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola");
      return;
    }

    try {
      // Wysyłamy pojedynczy wpis. Wartość 'reps' zostanie zsumowana w C# i wyświetlona jako Serie.
      await SetService.addSet({
        sessionExerciseId: selectedExercise.sessionExerciseId,
        setNumber: (selectedExercise.wykonaneSerie || 0) + 1,
        weight: parseFloat(weight),
        reps: parseInt(reps)
      });

      setModalVisible(false);
      setWeight('');
      setReps('');
      
      // Odświeżamy dane widoku
      const updatedData = await SessionService.getWorkoutSessionDetails(sessionId, templateId);
      setData(updatedData);
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się zapisać danych.");
    }
  };
const handleCreateAndAddExercise = async () => {
  if (!newName || !newPlannedSets) {
    Alert.alert("Błąd", "Nazwa i planowane serie są wymagane.");
    return;
  }

  try {
    // Wywołujemy nowy endpoint przez ExerciseService
    await ExerciseService.createAndAddToSession({
      sessionId: sessionId,
      name: newName,
      description: newDescription,
      plannedSets: parseInt(newPlannedSets)
    });

    // Czyścimy pola i zamykamy modal
    setCreateModalVisible(false);
    setNewName('');
    setNewDescription('');
    setNewPlannedSets('3');

    // Odświeżamy listę ćwiczeń w aktualnej sesji
    const updatedData = await SessionService.getWorkoutSessionDetails(sessionId, templateId);
    setData(updatedData);

    Alert.alert("Sukces", "Dodano nowe ćwiczenie do treningu.");
  } catch (error) {
    console.error(error);
    Alert.alert("Błąd", "Nie udało się utworzyć i dodać ćwiczenia.");
  }
};

  useEffect(() => {
    const loadSessionDetails = async () => {
      try {
        setLoading(true);
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
              setSelectedExercise(item);
              setModalVisible(true);
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>TRENING:</Text>
        <Text style={styles.subtitle}>{data?.nazwaSzablonu.toUpperCase()}</Text>
        <Text style={styles.date}>
          {data ? new Date(data.dataTreningu).toLocaleDateString() : ""}
        </Text>
      </View>

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

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ DODAJ NOWE ĆWICZENIE</Text>
      </TouchableOpacity>
       <TouchableOpacity 
  style={styles.finishBtn}
  onPress={handleFinishWorkout} // Zmieniono z Alert.alert na naszą funkcję
>
  <Text style={styles.finishBtnText}>ZAKOŃCZ TRENING</Text>
</TouchableOpacity>
      </View>

      {/* MODAL DOPASOWANY DO TWOICH WYMAGAŃ */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedExercise?.cwiczenie.toUpperCase()}</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CIĘŻAR (KG)</Text>
                <TextInput 
                  style={styles.input} 
                  keyboardType="numeric" 
                  value={weight} 
                  onChangeText={setWeight}
                  placeholder="0"
                  placeholderTextColor="#666"
                />
              </View>
              <View style={styles.inputGroup}>   
                <Text style={styles.label}>ILE SERII?</Text>
                <TextInput 
                  style={styles.input} 
                  keyboardType="numeric" 
                  value={reps} 
                  onChangeText={setReps}
                  placeholder="0"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>ANULUJ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSet}>
                <Text style={styles.btnText}>ZAPISZ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* MODAL: UTWÓRZ I DODAJ NOWE ĆWICZENIE */}
<Modal visible={createModalVisible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>NOWE ĆWICZENIE</Text>
      
      <Text style={styles.label}>NAZWA ĆWICZENIA</Text>
      <TextInput 
        style={styles.inputFull} 
        value={newName} 
        onChangeText={setNewName}
        placeholder="np. Wyciskanie hantli skos"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>OPIS / NOTATKI (OPCJONALNIE)</Text>
      <TextInput 
        style={[styles.inputFull, { height: 80, textAlignVertical: 'top' }]} 
        value={newDescription} 
        onChangeText={setNewDescription}
        multiline
        placeholder="np. Kąt 30 stopni, wolna faza negatywna"
        placeholderTextColor="#666"
      />

      <View style={{ marginBottom: 25 }}>
        <Text style={styles.label}>PLANOWANE SERIE</Text>
        <TextInput 
          style={styles.inputFull} 
          keyboardType="numeric" 
          value={newPlannedSets} 
          onChangeText={setNewPlannedSets}
        />
      </View>

      <View style={styles.modalButtons}>
        <TouchableOpacity 
          style={styles.cancelBtn} 
          onPress={() => setCreateModalVisible(false)}
        >
          <Text style={styles.btnText}>ANULUJ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={handleCreateAndAddExercise}
        >
          <Text style={styles.btnText}>UTWÓRZ</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2D2F33', paddingHorizontal: 20 },
  center: { justifyContent: 'center', alignItems: 'center' },
  backBtn: { marginTop: 20, width: 40 },
  backText: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  header: { alignItems: 'center', marginVertical: 15 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', letterSpacing: 1 },
  subtitle: { color: '#FFF', fontSize: 22, fontWeight: '600', marginTop: 5 },
  date: { color: '#FFF', fontSize: 14, opacity: 0.6, marginTop: 5 },
  table: { flex: 1, borderWidth: 1, borderColor: '#FFF', borderRadius: 15, overflow: 'hidden', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#FFF' },
  headerCell: { flex: 1, color: '#FFF', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  listContent: { paddingBottom: 10 },
  row: { flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 10, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.2)' },
  cell: { flex: 1, color: '#FFF', fontSize: 12, textAlign: 'center' },
  exerciseName: { flex: 1.5, fontWeight: 'bold', textAlign: 'left' },
  checkCell: { flex: 1, alignItems: 'center' },
  checkbox: { width: 22, height: 22, backgroundColor: '#444', borderRadius: 4, borderWidth: 1, borderColor: '#666' },
  checkboxDone: { backgroundColor: '#2ECC71', borderColor: '#27AE60' },
  footer: { paddingBottom: 30 },
  addBtn: { borderWidth: 1, borderColor: '#FFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'center', marginBottom: 20 },
  addBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  finishBtn: { backgroundColor: '#FF5A5F', paddingVertical: 15, borderRadius: 10, alignItems: 'center', elevation: 5 },
  finishBtnText: { color: '#FFF', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  emptyText: { color: '#AAA', textAlign: 'center', marginTop: 30, fontStyle: 'italic' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#3D3F43', borderRadius: 20, padding: 25, borderWidth: 1, borderColor: '#FFF' },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  inputGroup: { width: '45%' },
  label: { color: '#AAA', fontSize: 10, marginBottom: 5, fontWeight: 'bold' },
  input: { backgroundColor: '#2D2F33', color: '#FFF', padding: 12, borderRadius: 8, fontSize: 18, textAlign: 'center', borderWidth: 1, borderColor: '#555' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { padding: 15, width: '45%', alignItems: 'center' },
  saveBtn: { backgroundColor: '#2ECC71', padding: 15, borderRadius: 10, width: '45%', alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  inputFull: {
  backgroundColor: '#2D2F33',
  color: '#FFF',
  padding: 12,
  borderRadius: 8,
  fontSize: 16,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: '#555'
},
});

export default WorkoutSessionScreen;