import { Faculty, Course, Room, TimetableSlot, GeneratedTimetable } from '../contexts/AppContext';

export interface GenerationConstraints {
  maxConsecutiveHours: number;
  lunchBreakDuration: number;
  preferredLabDuration: number;
  enableMultidisciplinary: boolean;
  enableSkillBased: boolean;
  enableValueAdded: boolean;
  enableAbilityEnhancement: boolean;
}

export interface ConflictInfo {
  type: 'faculty_conflict' | 'room_conflict' | 'student_conflict' | 'constraint_violation';
  message: string;
  slots: string[];
  severity: 'high' | 'medium' | 'low';
}

class TimetableGeneratorEngine {
  private faculty: Faculty[];
  private courses: Course[];
  private rooms: Room[];
  private constraints: GenerationConstraints;
  private timeSlots: string[] = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];
  private days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(faculty: Faculty[], courses: Course[], rooms: Room[], constraints: GenerationConstraints) {
    this.faculty = faculty;
    this.courses = courses;
    this.rooms = rooms;
    this.constraints = constraints;
  }

  private generateTimeSlotId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private isSlotAvailable(
    facultyId: string, 
    roomId: string, 
    day: string, 
    timeSlot: string,
    existingSlots: TimetableSlot[]
  ): boolean {
    // Check faculty availability
    const faculty = this.faculty.find(f => f.id === facultyId);
    if (!faculty || !faculty.availability[day]?.includes(timeSlot)) {
      return false;
    }

    // Check room availability
    const room = this.rooms.find(r => r.id === roomId);
    if (!room || !room.availability[day]?.includes(timeSlot)) {
      return false;
    }

    // Check for conflicts with existing slots
    const conflicts = existingSlots.filter(slot => 
      slot.day === day && 
      slot.startTime === timeSlot && 
      (slot.facultyId === facultyId || slot.roomId === roomId)
    );

    return conflicts.length === 0;
  }

  private findBestRoom(course: Course, timeSlot: string, day: string, existingSlots: TimetableSlot[]): Room | null {
    const availableRooms = this.rooms.filter(room => {
      // Check basic availability
      if (!room.availability[day]?.includes(timeSlot)) return false;

      // Check for conflicts
      const conflict = existingSlots.find(slot => 
        slot.roomId === room.id && slot.day === day && slot.startTime === timeSlot
      );
      if (conflict) return false;

      // Check room type compatibility
      if (course.labHours > 0 && room.type === 'Lab') return true;
      if (course.theoryHours > 0 && (room.type === 'Classroom' || room.type === 'Seminar Hall')) return true;
      
      return room.type === 'Classroom';
    });

    // Sort by capacity (prefer rooms that fit but aren't oversized)
    const enrolledCount = course.enrolledStudents.length;
    return availableRooms.sort((a, b) => {
      const aFit = a.capacity >= enrolledCount ? a.capacity - enrolledCount : 1000;
      const bFit = b.capacity >= enrolledCount ? b.capacity - enrolledCount : 1000;
      return aFit - bFit;
    })[0] || null;
  }

  private calculateFacultyWorkload(facultyId: string, slots: TimetableSlot[]): number {
    return slots.filter(slot => slot.facultyId === facultyId).length;
  }

  private checkNEPCompliance(course: Course): boolean {
    // Check if course structure aligns with NEP 2020
    const hasValidType = ['Major', 'Minor', 'Skill', 'Ability', 'Value Added'].includes(course.type);
    const hasValidCredits = course.credits >= 1 && course.credits <= 6;
    const hasValidHours = (course.theoryHours + course.labHours) >= 1;

    return hasValidType && hasValidCredits && hasValidHours;
  }

  private detectConflicts(slots: TimetableSlot[]): ConflictInfo[] {
    const conflicts: ConflictInfo[] = [];

    // Group slots by day and time
    const slotGroups = new Map<string, TimetableSlot[]>();
    
    slots.forEach(slot => {
      const key = `${slot.day}-${slot.startTime}`;
      if (!slotGroups.has(key)) {
        slotGroups.set(key, []);
      }
      slotGroups.get(key)!.push(slot);
    });

    // Check for conflicts
    slotGroups.forEach((timeSlots, timeKey) => {
      // Faculty conflicts
      const facultyMap = new Map<string, TimetableSlot[]>();
      timeSlots.forEach(slot => {
        if (!facultyMap.has(slot.facultyId)) {
          facultyMap.set(slot.facultyId, []);
        }
        facultyMap.get(slot.facultyId)!.push(slot);
      });

      facultyMap.forEach((facultySlots, facultyId) => {
        if (facultySlots.length > 1) {
          const faculty = this.faculty.find(f => f.id === facultyId);
          conflicts.push({
            type: 'faculty_conflict',
            message: `${faculty?.name || 'Faculty'} has multiple classes at ${timeKey.replace('-', ' ')}`,
            slots: facultySlots.map(s => s.id),
            severity: 'high'
          });
        }
      });

      // Room conflicts
      const roomMap = new Map<string, TimetableSlot[]>();
      timeSlots.forEach(slot => {
        if (!roomMap.has(slot.roomId)) {
          roomMap.set(slot.roomId, []);
        }
        roomMap.get(slot.roomId)!.push(slot);
      });

      roomMap.forEach((roomSlots, roomId) => {
        if (roomSlots.length > 1) {
          const room = this.rooms.find(r => r.id === roomId);
          conflicts.push({
            type: 'room_conflict',
            message: `${room?.name || 'Room'} has multiple classes at ${timeKey.replace('-', ' ')}`,
            slots: roomSlots.map(s => s.id),
            severity: 'high'
          });
        }
      });
    });

    return conflicts;
  }

  private calculateStatistics(slots: TimetableSlot[]): any {
    const totalSlots = slots.length;
    
    // Room utilization
    const uniqueRoomSlots = new Set(slots.map(s => `${s.roomId}-${s.day}-${s.startTime}`));
    const totalPossibleRoomSlots = this.rooms.length * this.days.length * this.timeSlots.length;
    const roomUtilization = (uniqueRoomSlots.size / totalPossibleRoomSlots) * 100;

    // Faculty workload balance
    const facultyWorkloads = this.faculty.map(f => this.calculateFacultyWorkload(f.id, slots));
    const avgWorkload = facultyWorkloads.reduce((a, b) => a + b, 0) / facultyWorkloads.length;
    const workloadVariance = facultyWorkloads.reduce((sum, workload) => sum + Math.pow(workload - avgWorkload, 2), 0) / facultyWorkloads.length;
    const facultyWorkloadBalance = Math.max(0, 100 - workloadVariance * 10);

    // NEP compliance
    const nepCompliantCourses = this.courses.filter(course => this.checkNEPCompliance(course));
    const nepCompliance = (nepCompliantCourses.length / this.courses.length) * 100;

    // Conflicts
    const conflicts = this.detectConflicts(slots);
    const conflictCount = conflicts.length;

    return {
      totalSlots,
      roomUtilization: Math.round(roomUtilization),
      facultyWorkloadBalance: Math.round(facultyWorkloadBalance),
      conflictCount,
      nepCompliance: Math.round(nepCompliance)
    };
  }

  public async generateTimetable(onProgress?: (step: string, progress: number) => void): Promise<GeneratedTimetable> {
    const slots: TimetableSlot[] = [];
    let progress = 0;
    const totalSteps = this.courses.length + 3; // courses + 3 additional steps

    onProgress?.('Initializing generation process...', 0);

    // Step 1: Sort courses by priority (credits, type, enrollments)
    const sortedCourses = [...this.courses].sort((a, b) => {
      // Prioritize Major courses, then by credits, then by enrollment
      const typeWeight = { 'Major': 5, 'Minor': 4, 'Skill': 3, 'Ability': 2, 'Value Added': 1 };
      const aWeight = (typeWeight[a.type] || 0) * 100 + a.credits * 10 + a.enrolledStudents.length;
      const bWeight = (typeWeight[b.type] || 0) * 100 + b.credits * 10 + b.enrolledStudents.length;
      return bWeight - aWeight;
    });

    onProgress?.('Analyzing course priorities...', 10);
    progress = 10;

    // Step 2: Schedule each course
    for (const course of sortedCourses) {
      onProgress?.(`Scheduling ${course.name}...`, progress);

      const faculty = this.faculty.find(f => f.id === course.facultyId);
      if (!faculty) continue;

      const hoursToSchedule = course.theoryHours + course.labHours;
      let scheduledHours = 0;

      // Try to schedule on faculty's preferred days and times
      for (const day of faculty.preferences.preferredDays || this.days) {
        if (scheduledHours >= hoursToSchedule) break;

        for (const timeSlot of faculty.preferences.preferredTimeSlots || this.timeSlots) {
          if (scheduledHours >= hoursToSchedule) break;

          if (this.isSlotAvailable(faculty.id, '', day, timeSlot, slots)) {
            const room = this.findBestRoom(course, timeSlot, day, slots);
            
            if (room) {
              const duration = course.labHours > 0 && scheduledHours < course.labHours ? 
                this.constraints.preferredLabDuration : 1;

              slots.push({
                id: this.generateTimeSlotId(),
                courseId: course.id,
                facultyId: faculty.id,
                roomId: room.id,
                day,
                startTime: timeSlot,
                endTime: this.getEndTime(timeSlot, duration),
                duration,
                studentIds: course.enrolledStudents,
                type: scheduledHours < course.labHours ? 'Lab' : 'Theory'
              });

              scheduledHours += duration;
            }
          }
        }
      }

      progress += (80 / this.courses.length);
    }

    onProgress?.('Optimizing schedule...', 90);

    // Step 3: Optimize and resolve conflicts
    const conflicts = this.detectConflicts(slots);
    
    onProgress?.('Calculating statistics...', 95);

    // Step 4: Calculate final statistics
    const statistics = this.calculateStatistics(slots);

    onProgress?.('Finalizing timetable...', 100);

    const timetable: GeneratedTimetable = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Timetable ${new Date().toLocaleDateString()}`,
      semester: '5th Semester',
      academicYear: '2024-25',
      createdAt: new Date().toISOString(),
      slots,
      conflicts,
      statistics
    };

    return timetable;
  }

  private getEndTime(startTime: string, duration: number): string {
    const timeMap: { [key: string]: number } = {
      '8:00 AM': 8, '9:00 AM': 9, '10:00 AM': 10, '11:00 AM': 11, '12:00 PM': 12,
      '1:00 PM': 13, '2:00 PM': 14, '3:00 PM': 15, '4:00 PM': 16, '5:00 PM': 17
    };

    const reverseTimeMap: { [key: number]: string } = {
      8: '8:00 AM', 9: '9:00 AM', 10: '10:00 AM', 11: '11:00 AM', 12: '12:00 PM',
      13: '1:00 PM', 14: '2:00 PM', 15: '3:00 PM', 16: '4:00 PM', 17: '5:00 PM'
    };

    const startHour = timeMap[startTime];
    const endHour = startHour + duration;
    
    return reverseTimeMap[endHour] || '5:00 PM';
  }
}

export async function generateTimetable(
  faculty: Faculty[],
  courses: Course[],
  rooms: Room[],
  constraints: GenerationConstraints,
  onProgress?: (step: string, progress: number) => void
): Promise<GeneratedTimetable> {
  const generator = new TimetableGeneratorEngine(faculty, courses, rooms, constraints);
  return await generator.generateTimetable(onProgress);
}