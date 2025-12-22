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