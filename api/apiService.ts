import { API_BASE_URL } from '../api/config';
import { ExerciseSetDto} from '../types/models';

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