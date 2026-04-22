// Main Supabase integration exports
export { supabase, checkConnection } from './client';
export type { Database, Tables, InsertTables, UpdateTables } from './client';

// Configuration
export { supabaseConfig, getSupabaseConfig } from './config';

// Authentication
export { AuthService } from './auth';
export type { AuthUser, SignUpData, SignInData, AuthResponse } from './auth';

// API Services
export {
  ApiService,
  InstitutionService,
  UserService,
  CourseService,
  FacultyService,
  StudentService,
  RoomService,
  TimetableService
} from './api';
export type { ApiResponse } from './api';

// Storage
export { StorageService, STORAGE_BUCKETS } from './storage';
export type { UploadOptions, DownloadOptions, StorageResponse } from './storage';
export {
  uploadTimetableExport,
  uploadDataImport,
  uploadInstitutionLogo,
  uploadUserAvatar
} from './storage';

// Real-time
export { RealtimeService } from './realtime';
export type { RealtimeEvent, SubscriptionCallback, SubscriptionOptions } from './realtime';
export { useRealtimeSubscription, useRealtimeRecord } from './realtime';

// Utility functions for common operations
export const initializeSupabase = async () => {
  try {
    // Check connection
    const isConnected = await checkConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to Supabase');
    }

    // Initialize storage buckets
    await StorageService.initializeBuckets();

    console.log('Supabase initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return false;
  }
};