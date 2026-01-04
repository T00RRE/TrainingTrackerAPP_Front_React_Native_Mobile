import { API_BASE_URL } from '../api/config';
import { ExerciseSetDto, WorkoutSessionDetailsDto, WorkoutTemplateDto} from '../types/models';

// Typ generyczny dla odpowiedzi, jeśli API zwraca standardowy JSON
type ApiResponse<T> = T;

/**
 * Generyczna funkcja do wykonywania zapytań HTTP
 * @param endpoint - Część URL po API_BASE_URL (np. 'ExerciseSets/1')
 * @param method - Metoda HTTP (GET, POST, PUT, DELETE)
 * @param data - Dane do wysłania (dla POST/PUT)
 * @returns Obiekt typu T
 */
async function apiRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/${endpoint}`;
    
    // Przygotowanie nagłówków
    const headers: HeadersInit_ = {
        'Content-Type': 'application/json',
    };

    // Konfiguracja zapytania
    const config: RequestInit = {
        method: method,
        headers: headers,
    };

    // Dodanie danych do ciała zapytania dla POST/PUT
    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Wyrzucenie błędu z informacją o statusie i treści odpowiedzi
            const errorBody = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Body: ${errorBody}`);
        }

        // Jeśli odpowiedź jest pusta (np. dla DELETE lub POST/PUT bez treści), zwracamy pusty obiekt
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return {} as ApiResponse<T>;
        }

        // Parsowanie JSON
        return await response.json() as ApiResponse<T>;

    } catch (error) {
        console.error(`API Request Error for ${method} ${url}:`, error);
        // Przekazanie błędu dalej
        throw error;
    }
}

// Przykładowa usługa (GET)
export const ExerciseSetService = {
    /** Pobiera wszystkie ExerciseSets dla danego TrainingId */
    /** NOWA METODA: Pobiera wszystkie ExerciseSets dla danego SessionExerciseId */
    getSetsForSessionExercise: (sessionExerciseId: number): Promise<ExerciseSetDto[]> => 
        // Zakładam, że Twoja metoda GetSetsForSessionExercise zwraca ExerciseSetDto[], 
        // lub musisz użyć SetDto, jeśli używasz go w DTO C#
        apiRequest<ExerciseSetDto[]>(`ExerciseSets/sessionExercise/${sessionExerciseId}`, 'GET'),

    /** Pobiera pojedynczy ExerciseSet */
    getSetById: (setId: string): Promise<ExerciseSetDto> => 
        apiRequest<ExerciseSetDto>(`ExerciseSets/${setId}`, 'GET'),
    
    // ... tutaj dodamy później inne metody (POST, PUT, DELETE)
};
export const WorkoutService = {
  getWorkoutTemplates: (_userId: number): Promise<WorkoutTemplateDto[]> => {
    // Używamy Twojej funkcji apiRequest, aby zachować spójność
    // Zakładam endpoint: WorkoutTemplates/user/{userId} na podstawie bazy
    return apiRequest<WorkoutTemplateDto[]>(`WorkoutTemplates`, 'GET');
  },
};

export const SessionService = {
  startSession: async (userId: number, templateId: number): Promise<number> => {
    // Wysyłamy UserId oraz TemplateId do StartTrainingSessionHandler
    return apiRequest<number>('TrainingSessions', 'POST', { 
      UserId: userId, 
      TemplateId: templateId 
    });
  },
  // sessionId: np. 2, templateId: np. 1
  getWorkoutSessionDetails: (sessionId: number, templateId: number): Promise<WorkoutSessionDetailsDto> => {
    return apiRequest<WorkoutSessionDetailsDto>(`TrainingSessions/${sessionId}/details/${templateId}`, 'GET');
    
  },
  finishSession: async (sessionId: number): Promise<void> => {
    // Wysyłamy żądanie do Twojego endpointu Sessions/{id}
    // Flagę 'endSession' Handler zamieni na datę w polu CompletedAt
    return apiRequest<void>(`TrainingSessions/${sessionId}`, 'PUT', { 
      EndSession: true 
    });
}
};
export const SetService = {
  addSet: (data: { sessionExerciseId: number; setNumber: number; weight: number; reps: number }): Promise<number> => {
    // Używamy apiRequest, usuwając "api/", jeśli Twój base URL już go ma
    return apiRequest<number>('ExerciseSets', 'POST', data);
  }
};
export const ExerciseService = {
  // Nowa metoda do tworzenia i dodawania ćwiczenia naraz
  createAndAddToSession: async (data: { 
    sessionId: number; 
    name: string; 
    description: string; 
    plannedSets: number 
  }): Promise<number> => {
    // Używamy ścieżki z Twojego kontrolera [HttpPost("create-new")]
    // Pamiętaj o usunięciu "api/", jeśli Twój base URL już go zawiera
    return apiRequest<number>('SessionExercises/create-new', 'POST', data);
  },
  removeExerciseFromSession: async (sessionExerciseId: number): Promise<void> => {
    // Ważne: Sprawdź czy ścieżka to 'SessionExercises' czy 'api/SessionExercises'
    return apiRequest<void>(`SessionExercises/${sessionExerciseId}`, 'DELETE');
  }
};
