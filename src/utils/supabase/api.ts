import { supabase } from './client';
import type { Database, Tables, InsertTables, UpdateTables } from './client';

// Generic API response type
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}

// Generic CRUD operations class
export class ApiService {
  // Generic get all records
  static async getAll<T extends keyof Database['public']['Tables']>(
    table: T,
    options?: {
      select?: string;
      filters?: Record<string, any>;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
      offset?: number;
    }
  ): Promise<ApiResponse<Tables<T>[]>> {
    try {
      let query = supabase.from(table).select(options?.select || '*', { count: 'exact' });

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true });
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options?.limit || 10)) - 1);
      }

      const { data, error, count } = await query;

      return {
        data: data as Tables<T>[],
        error: error?.message || null,
        count: count || 0
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        count: 0
      };
    }
  }

  // Generic get single record
  static async getById<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string,
    select?: string
  ): Promise<ApiResponse<Tables<T>>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(select || '*')
        .eq('id', id)
        .single();

      return {
        data: data as Tables<T>,
        error: error?.message || null
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message
      };
    }
  }

  // Generic create record
  static async create<T extends keyof Database['public']['Tables']>(
    table: T,
    data: InsertTables<T>
  ): Promise<ApiResponse<Tables<T>>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      return {
        data: result as Tables<T>,
        error: error?.message || null
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message
      };
    }
  }

  // Generic update record
  static async update<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string,
    data: UpdateTables<T>
  ): Promise<ApiResponse<Tables<T>>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      return {
        data: result as Tables<T>,
        error: error?.message || null
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message
      };
    }
  }

  // Generic delete record
  static async delete<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      return {
        data: !error,
        error: error?.message || null
      };
    } catch (error) {
      return {
        data: false,
        error: (error as Error).message
      };
    }
  }

  // Bulk operations
  static async bulkCreate<T extends keyof Database['public']['Tables']>(
    table: T,
    data: InsertTables<T>[]
  ): Promise<ApiResponse<Tables<T>[]>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();

      return {
        data: result as Tables<T>[],
        error: error?.message || null
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message
      };
    }
  }

  static async bulkUpdate<T extends keyof Database['public']['Tables']>(
    table: T,
    updates: { id: string; data: UpdateTables<T> }[]
  ): Promise<ApiResponse<Tables<T>[]>> {
    try {
      const results = await Promise.all(
        updates.map(({ id, data }) => this.update(table, id, data))
      );

      const errors = results.filter(r => r.error).map(r => r.error);
      const data = results.filter(r => r.data).map(r => r.data!);

      return {
        data: data as Tables<T>[],
        error: errors.length > 0 ? errors.join(', ') : null
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message
      };
    }
  }

  static async bulkDelete<T extends keyof Database['public']['Tables']>(
    table: T,
    ids: string[]
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .in('id', ids);

      return {
        data: !error,
        error: error?.message || null
      };
    } catch (error) {
      return {
        data: false,
        error: (error as Error).message
      };
    }
  }
}

// Specific API services for each entity
export class InstitutionService extends ApiService {
  static async getInstitutions() {
    return this.getAll('institutions', {
      orderBy: { column: 'name', ascending: true }
    });
  }

  static async getInstitutionByCode(code: string) {
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('code', code)
        .single();

      return { data, error: error?.message || null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }
}

export class UserService extends ApiService {
  static async getUsersByInstitution(institutionId: string) {
    return this.getAll('users', {
      filters: { institution_id: institutionId },
      orderBy: { column: 'name', ascending: true }
    });
  }

  static async getUsersByRole(role: 'admin' | 'faculty' | 'student') {
    return this.getAll('users', {
      filters: { role },
      orderBy: { column: 'name', ascending: true }
    });
  }
}

export class CourseService extends ApiService {
  static async getCoursesByInstitution(institutionId: string) {
    return this.getAll('courses', {
      filters: { institution_id: institutionId },
      orderBy: { column: 'name', ascending: true }
    });
  }

  static async getCoursesBySemester(institutionId: string, semester: number) {
    return this.getAll('courses', {
      filters: { institution_id: institutionId, semester },
      orderBy: { column: 'name', ascending: true }
    });
  }

  static async getCoursesByDepartment(institutionId: string, department: string) {
    return this.getAll('courses', {
      filters: { institution_id: institutionId, department },
      orderBy: { column: 'name', ascending: true }
    });
  }
}

export class FacultyService extends ApiService {
  static async getFacultyByInstitution(institutionId: string) {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select(`
          *,
          users!inner(*)
        `)
        .eq('users.institution_id', institutionId);

      return { data, error: error?.message || null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  static async getFacultyByDepartment(department: string) {
    return this.getAll('faculty', {
      filters: { department },
      orderBy: { column: 'employee_id', ascending: true }
    });
  }
}

export class StudentService extends ApiService {
  static async getStudentsByInstitution(institutionId: string) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          users!inner(*)
        `)
        .eq('users.institution_id', institutionId);

      return { data, error: error?.message || null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  static async getStudentsByProgram(program: string, semester: number) {
    return this.getAll('students', {
      filters: { program, semester },
      orderBy: { column: 'roll_number', ascending: true }
    });
  }
}

export class RoomService extends ApiService {
  static async getRoomsByInstitution(institutionId: string) {
    return this.getAll('rooms', {
      filters: { institution_id: institutionId },
      orderBy: { column: 'name', ascending: true }
    });
  }

  static async getRoomsByBuilding(institutionId: string, building: string) {
    return this.getAll('rooms', {
      filters: { institution_id: institutionId, building },
      orderBy: { column: 'name', ascending: true }
    });
  }

  static async getRoomsByCapacity(institutionId: string, minCapacity: number) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('institution_id', institutionId)
        .gte('capacity', minCapacity)
        .order('capacity', { ascending: true });

      return { data, error: error?.message || null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }
}

export class TimetableService extends ApiService {
  static async getTimetablesByInstitution(institutionId: string) {
    return this.getAll('timetables', {
      filters: { institution_id: institutionId },
      orderBy: { column: 'created_at', ascending: false }
    });
  }

  static async getTimetablesBySemester(institutionId: string, semester: number, academicYear: string) {
    return this.getAll('timetables', {
      filters: { institution_id: institutionId, semester, academic_year: academicYear },
      orderBy: { column: 'created_at', ascending: false }
    });
  }

  static async publishTimetable(id: string) {
    return this.update('timetables', id, { status: 'published' });
  }

  static async archiveTimetable(id: string) {
    return this.update('timetables', id, { status: 'archived' });
  }
}

// Export all services
export {
  ApiService as default,
  InstitutionService,
  UserService,
  CourseService,
  FacultyService,
  StudentService,
  RoomService,
  TimetableService
};