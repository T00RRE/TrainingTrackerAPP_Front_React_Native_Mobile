import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SessionService } from '../api/apiService';
import { TrainingSessionDetailsDto } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDetails'>;

const WorkoutDetailsScreen = ({ route, navigation }: Props) => {
  const { sessionId } = route.params;
  const [details, setDetails] = useState<TrainingSessionDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await SessionService.getSessionDetails(sessionId);
        setDetails(data);
      } catch (error) {
        console.error("Błąd pobierania szczegółów:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Nie znaleziono szczegółów treningu.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{details.templateName.toUpperCase()}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>DATA: <Text style={styles.infoValue}>{new Date(details.date).toLocaleDateString()}</Text></Text>
          <Text style={styles.infoLabel}>CZAS: <Text style={styles.infoValue}>{details.duration}</Text></Text>
        </View>

        {details.exercises.map((exercise, exIndex) => (
          <View key={exIndex} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.exerciseName.toUpperCase()}</Text>
            
            <View style={styles.setsHeader}>
              <Text style={styles.setsHeaderText}>SERIA</Text>
              <Text style={styles.setsHeaderText}>CIĘŻAR</Text>
              <Text style={styles.setsHeaderText}>POWT.</Text>
            </View>

            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={styles.setText}>{setIndex + 1}</Text>
                <Text style={styles.setText}>{set.weight} KG</Text>
                <Text style={styles.setText}>{set.reps}</Text>
              </View>
            ))}
          </View>
        ))}

        {details.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>NOTATKI:</Text>
            <Text style={styles.notesText}>{details.notes}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2D2F33' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  backBtn: { padding: 5 },
  backText: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  infoSection: { marginBottom: 25, marginTop: 10 },
  infoLabel: { color: '#AAA', fontSize: 14, fontWeight: '700', marginBottom: 5 },
  infoValue: { color: '#FFF' },
  exerciseCard: {
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20
  },
  exerciseName: { color: '#FFF', fontSize: 18, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
  setsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, opacity: 0.6 },
  setsHeaderText: { color: '#FFF', fontSize: 12, fontWeight: '700', width: '30%', textAlign: 'center' },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  setText: { color: '#FFF', fontSize: 16, fontWeight: '700', width: '30%', textAlign: 'center' },
  notesSection: { marginTop: 10, padding: 15, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 15 },
  notesTitle: { color: '#AAA', fontSize: 12, fontWeight: '900', marginBottom: 5 },
  notesText: { color: '#FFF', fontSize: 14 },
  errorText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});

export default WorkoutDetailsScreen;