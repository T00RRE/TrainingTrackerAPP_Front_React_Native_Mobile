export interface ExerciseSetDto {
    id: string;
    exerciseId: string;
    exerciseName: string;
    trainingId: string;
    order: number;
    repetitions: number;
    weight: number;
    comment: string;
}

export interface ExerciseDto {
    id: string;
    name: string;
    description: string;
    category: string;
    videoUrl: string | null;
}

export interface TrainingDto {
    id: string;
    name: string;
    description: string;
    date: Date;
    duration: number; // w minutach
    notes: string;
}

export interface TrainingLogDto {
    id: string;
    trainingName: string;
    date: Date;
    totalDuration: number;
    totalSets: number;
}
export interface WorkoutTemplateDto {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
}
export interface SessionExerciseRowDto {
  sessionExerciseId: number;
  cwiczenie: string;
  opis? : string;
  planowaneSerie: number;
  wykonaneSerie: number;
  ostatniCiezar: number | null;
}

export interface WorkoutSessionDetailsDto {
  nazwaSzablonu: string;
  dataTreningu: string;
  cwiczenia: SessionExerciseRowDto[];
}
export interface TrainingSessionDto {
  id: number;
  userId: number;
  templateId: number;
  templateName: string; // Nazwa szablonu (np. PUSH, PULL)
  startedAt: string;    // Daty z backendu przychodzą jako stringi ISO
  completedAt: string | null; // Może być nullem, jeśli trening trwa
  notes: string | null;
}
export interface SetDto {
  reps: number;
  weight: number;
  // Dodaj te pola, jeśli zdecydowałeś się na "Opcję A" na backendzie:
  id?: number;
  setNumber?: number;
}

export interface SessionExerciseDetailsDto {
  exerciseName: string;
  sets: SetDto[];
}

export interface TrainingSessionDetailsDto {
  id: number;
  templateName: string;
  date: string;
  duration: string;
  notes: string | null;
  exercises: SessionExerciseDetailsDto[];
}