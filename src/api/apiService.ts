import { API_BASE_URL } from '../api/config';
import { ExerciseSetDto, TrainingSessionDetailsDto, TrainingSessionDto, WorkoutSessionDetailsDto, WorkoutTemplateDto} from '../types/models';

type ApiResponse<T> = T;

/**
 * 
 * @param endpoint 
 * @param method 
 * @param data 
 * @returns
 */
async function apiRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/${endpoint}`;
        const headers: HeadersInit_ = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        method: method,
        headers: headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Body: ${errorBody}`);
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return {} as ApiResponse<T>;
        }

        return await response.json() as ApiResponse<T>;

    } catch (error) {
        console.error(`API Request Error for ${method} ${url}:`, error);
        throw error;
    }
}

export const ExerciseSetService = {
    getSetsForSessionExercise: (sessionExerciseId: number): Promise<ExerciseSetDto[]> => 
        apiRequest<ExerciseSetDto[]>(`ExerciseSets/sessionExercise/${sessionExerciseId}`, 'GET'),

    getSetById: (setId: string): Promise<ExerciseSetDto> => 
        apiRequest<ExerciseSetDto>(`ExerciseSets/${setId}`, 'GET'),
    
};
export const WorkoutService = {
  getWorkoutTemplates: (_userId: number): Promise<WorkoutTemplateDto[]> => {
    return apiRequest<WorkoutTemplateDto[]>(`WorkoutTemplates`, 'GET');
  },
};

export const SessionService = {
  startSession: async (userId: number, templateId: number): Promise<number> => {
    return apiRequest<number>('TrainingSessions', 'POST', { 
      UserId: userId, 
      TemplateId: templateId 
    });
  },
  getWorkoutSessionDetails: (sessionId: number, templateId: number): Promise<WorkoutSessionDetailsDto> => {
    return apiRequest<WorkoutSessionDetailsDto>(`TrainingSessions/${sessionId}/details/${templateId}`, 'GET');
    
  },
  finishSession: async (sessionId: number): Promise<void> => {
    return apiRequest<void>(`TrainingSessions/${sessionId}`, 'PUT', { 
      EndSession: true 
    });
    
},
getTrainingSessions: async (userId: number): Promise<TrainingSessionDto[]> => {
    return apiRequest<TrainingSessionDto[]>(`TrainingSessions/user/${userId}`, 'GET');
  },
  getSessionDetails: async (sessionId: number): Promise<TrainingSessionDetailsDto> => {
  return apiRequest<TrainingSessionDetailsDto>(`TrainingSessions/${sessionId}/details`, 'GET');
}
};
export const SetService = {
  addSet: (data: { sessionExerciseId: number; setNumber: number; weight: number; reps: number }): Promise<number> => {
    return apiRequest<number>('ExerciseSets', 'POST', data);
  }
};
export const ExerciseService = {
  createAndAddToSession: async (data: { 
    sessionId: number; 
    name: string; 
    description: string; 
    plannedSets: number 
  }): Promise<number> => {
    return apiRequest<number>('SessionExercises/create-new', 'POST', data);
  },
  removeExerciseFromSession: async (sessionExerciseId: number): Promise<void> => {
    return apiRequest<void>(`SessionExercises/${sessionExerciseId}`, 'DELETE');
  }
};
