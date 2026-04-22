import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  program: string;
  semester: string;
  enrolledCourses: string[];
  preferences: {
    preferredTimeSlots: string[];
    avoidTimeSlots: string[];
  };
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  maxWeeklyHours: number;
  currentWeeklyHours: number;
  availability: {
    [key: string]: string[]; // day: available time slots
  };
  preferences: {
    preferredDays: string[];
    preferredTimeSlots: string[];
    avoidTimeSlots: string[];
    noBackToBack: boolean;
    maxConsecutiveHours: number;
  };
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  type: 'Major' | 'Minor' | 'Skill' | 'Ability' | 'Value Added';
  department: string;
  semester: string;
  theoryHours: number;
  labHours: number;
  facultyId?: string;
  enrolledStudents: string[];
  prerequisites: string[];
}

export interface Room {
  id: string;
  name: string;
  type: 'Classroom' | 'Lab' | 'Auditorium' | 'Seminar Hall';
  capacity: number;
  features: string[];
  availability: {
    [key: string]: string[]; // day: available time slots
  };
}

export interface TimetableSlot {
  id: string;
  courseId: string;
  facultyId: string;
  roomId: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
  studentIds: string[];
  type: 'Theory' | 'Lab' | 'Tutorial';
}

export interface GeneratedTimetable {
  id: string;
  name: string;
  semester: string;
  academicYear: string;
  createdAt: string;
  slots: TimetableSlot[];
  conflicts: any[];
  statistics: {
    totalSlots: number;
    roomUtilization: number;
    facultyWorkloadBalance: number;
    conflictCount: number;
    nepCompliance: number;
  };
}

// State interface
export interface User {
  role: 'admin' | 'faculty' | 'student' | null;
  id?: string;
  name?: string;
  email?: string;
  institution?: string;
}

interface AppState {
  currentUser: User;
  currentView: 'landing' | 'dashboard' | 'generate' | 'analytics' | 'collaboration' | 'benefits';
  darkMode: boolean;
  students: Student[];
  faculty: Faculty[];
  courses: Course[];
  rooms: Room[];
  timetables: GeneratedTimetable[];
  currentTimetable: GeneratedTimetable | null;
  loading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_VIEW'; payload: 'landing' | 'dashboard' | 'generate' | 'analytics' | 'collaboration' | 'benefits' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: string }
  | { type: 'ADD_FACULTY'; payload: Faculty }
  | { type: 'UPDATE_FACULTY'; payload: Faculty }
  | { type: 'DELETE_FACULTY'; payload: string }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: Room }
  | { type: 'DELETE_ROOM'; payload: string }
  | { type: 'SET_TIMETABLES'; payload: GeneratedTimetable[] }
  | { type: 'ADD_TIMETABLE'; payload: GeneratedTimetable }
  | { type: 'SET_CURRENT_TIMETABLE'; payload: GeneratedTimetable | null }
  | { type: 'LOAD_SAMPLE_DATA' };

// Initial state
const initialState: AppState = {
  currentUser: { role: null },
  currentView: 'landing',
  darkMode: false,
  students: [],
  faculty: [],
  courses: [],
  rooms: [],
  timetables: [],
  currentTimetable: null,
  loading: false,
  error: null,
};

// Sample data
const sampleStudents: Student[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    rollNumber: 'CS2021001',
    email: 'arjun.sharma@student.edu',
    program: 'B.Tech Computer Science',
    semester: '5th Semester',
    enrolledCourses: ['CS301', 'CS302', 'CS303L', 'EVS201', 'DM101', 'PSY101'],
    preferences: {
      preferredTimeSlots: ['10:00 AM', '11:00 AM', '2:00 PM'],
      avoidTimeSlots: ['8:00 AM', '5:00 PM']
    }
  },
  // Add more sample students...
];

const sampleFaculty: Faculty[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    department: 'Computer Science',
    subjects: ['Data Structures', 'Algorithms', 'Programming'],
    maxWeeklyHours: 20,
    currentWeeklyHours: 18,
    availability: {
      'Monday': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'],
      'Tuesday': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'],
      'Wednesday': ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      'Thursday': ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      'Friday': ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'],
      'Saturday': ['10:00 AM', '11:00 AM']
    },
    preferences: {
      preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      preferredTimeSlots: ['10:00 AM', '11:00 AM', '2:00 PM'],
      avoidTimeSlots: ['8:00 AM', '5:00 PM'],
      noBackToBack: false,
      maxConsecutiveHours: 3
    }
  },
  // Add more sample faculty...
];

const sampleCourses: Course[] = [
  {
    id: '1',
    code: 'CS301',
    name: 'Data Structures and Algorithms',
    credits: 4,
    type: 'Major',
    department: 'Computer Science',
    semester: '5th Semester',
    theoryHours: 3,
    labHours: 1,
    facultyId: '1',
    enrolledStudents: ['1'],
    prerequisites: ['CS201', 'CS202']
  },
  // Add more sample courses...
];

const sampleRooms: Room[] = [
  {
    id: '1',
    name: 'CS-101',
    type: 'Classroom',
    capacity: 60,
    features: ['Projector', 'Whiteboard', 'AC'],
    availability: {
      'Monday': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      'Tuesday': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      'Wednesday': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      'Thursday': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      'Friday': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      'Saturday': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM']
    }
  },
  // Add more sample rooms...
];

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_STUDENT':
      return { ...state, students: state.students.filter(s => s.id !== action.payload) };
    case 'ADD_FACULTY':
      return { ...state, faculty: [...state.faculty, action.payload] };
    case 'UPDATE_FACULTY':
      return {
        ...state,
        faculty: state.faculty.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case 'DELETE_FACULTY':
      return { ...state, faculty: state.faculty.filter(f => f.id !== action.payload) };
    case 'ADD_COURSE':
      return { ...state, courses: [...state.courses, action.payload] };
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_COURSE':
      return { ...state, courses: state.courses.filter(c => c.id !== action.payload) };
    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.payload] };
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map(r => r.id === action.payload.id ? action.payload : r)
      };
    case 'DELETE_ROOM':
      return { ...state, rooms: state.rooms.filter(r => r.id !== action.payload) };
    case 'SET_TIMETABLES':
      return { ...state, timetables: action.payload };
    case 'ADD_TIMETABLE':
      return { ...state, timetables: [...state.timetables, action.payload] };
    case 'SET_CURRENT_TIMETABLE':
      return { ...state, currentTimetable: action.payload };
    case 'LOAD_SAMPLE_DATA':
      return {
        ...state,
        students: sampleStudents,
        faculty: sampleFaculty,
        courses: sampleCourses,
        rooms: sampleRooms
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}