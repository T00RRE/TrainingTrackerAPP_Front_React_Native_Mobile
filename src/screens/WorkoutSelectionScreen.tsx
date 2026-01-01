import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { WorkoutService } from '../api/apiService';
import { WorkoutTemplateDto } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSelection'>;

const WorkoutSelectionScreen = ({ navigation }: Props) => {
  const [templates, setTemplates] = useState<WorkoutTemplateDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        // Pobieramy dane dla UserID = 1 zgodnie z Twoją bazą
        const data = await WorkoutService.getWorkoutTemplates(1);
        setTemplates(data);
      } catch (error) {
        Alert.alert("Błąd", "Nie udało się pobrać rodzajów treningu.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Funkcja renderująca pojedynczy przycisk treningu (np. PUSH, PULL)
  const renderItem = ({ item, index }: { item: WorkoutTemplateDto, index: number }) => (
    <View>
      <TouchableOpacity 
        style={styles.templateButton}
        onPress={() => {
          console.log("Wybrano:", item.name);
          navigation.navigate('WorkoutSession', { 
          sessionId: 2,        // Testowe ID sesji z Twojego Swaggera
          templateId: item.id  // Dynamiczne ID szablonu z bazy (np. 1 dla Push)
        });
        }}
      >
        <Text style={styles.templateText}>{item.name.toUpperCase()}</Text>
      </TouchableOpacity>
      {/* Rysujemy linię oddzielającą, o ile nie jest to ostatni element listy */}
      {index < templates.length - 1 && <View style={styles.separator} />}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* DODAJEMY TO: Przycisk powrotu, który używa zmiennej navigation */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"< POWRÓT"}</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>RODZAJ{"\n"}TRENINGU</Text>
      
      <View style={styles.selectionCard}>
        <FlatList
          data={templates}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
        />
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ DODAJ NOWY RODZAJ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#2D2F33', // Ciemne tło z Twojego projektu
    alignItems: 'center', 
    paddingTop: 60 
  },
  center: { justifyContent: 'center' },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 40,
    letterSpacing: 2
  },
  selectionCard: {
    width: '85%',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 10,
    maxHeight: '60%' // Ograniczamy wysokość, by przycisk "Dodaj" był widoczny
  },
  templateButton: {
    paddingVertical: 25,
    alignItems: 'center',
  },
  templateText: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: '900', 
    letterSpacing: 1 
  },
  separator: { 
    height: 2, 
    backgroundColor: '#FFF', 
    marginHorizontal: 30, 
    opacity: 0.5 
  },
  addButton: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: { 
    color: '#FFF', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    opacity: 0.8
  },
});

export default WorkoutSelectionScreen;