export type RootStackParamList = {
  Home: undefined;
  WorkoutSelection: undefined;
  Details: { sessionExerciseId: number };
  WorkoutSession: { sessionId: number; templateId: number };
  WorkoutHistory: undefined;
};