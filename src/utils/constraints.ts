// Comprehensive Constraints and Logic System for Timetable Generation
// Built for NEP 2020 compliance and intelligent scheduling

export interface TimeSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  duration: number;  // minutes
}

export interface Room {
  id: string;
  name: string;
  type: 'lecture_hall' | 'laboratory' | 'seminar_room' | 'auditorium' | 'computer_lab' | 'library';
  capacity: number;
  facilities: string[]; // ['projector', 'whiteboard', 'computers', 'lab_equipment']
  building: string;
  floor: number;
  isAvailable: boolean;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  email: string;
  expertise: string[]; // subjects they can teach
  maxHoursPerWeek: number;
  currentHours: number;
  preferences: {
    preferredDays: string[];
    preferredTimeSlots: string[];
    unavailableSlots: string[];
    maxConsecutiveHours: number;
    minBreakBetweenClasses: number; // minutes
  };
  workloadBalance: 'light' | 'moderate' | 'heavy';
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  department: string;
  type: 'core' | 'elective' | 'major' | 'minor' | 'interdisciplinary';
  semester: number;
  program: 'B.Ed' | 'M.Ed' | 'FYUP' | 'ITEP';
  requiredRoomType: Room['type'];
  requiredFacilities: string[];
  hoursPerWeek: number;
  maxStudents: number;
  prerequisites: string[]; // subject IDs
  isNEPCompliant: boolean;
}

export interface Student {
  id: string;
  name: string;
  program: Subject['program'];
  semester: number;
  major: string;
  minor?: string;
  enrolledSubjects: string[]; // subject IDs
  preferences: {
    avoidEarlyMorning: boolean;
    avoidLateFriday: boolean;
    maxGapBetweenClasses: number; // minutes
  };
}

export interface ScheduleSlot {
  id: string;
  timeSlot: TimeSlot;
  subject: Subject;
  faculty: Faculty;
  room: Room;
  students: Student[];
  status: 'scheduled' | 'conflict' | 'pending' | 'cancelled';
  conflictReasons?: string[];
  priority: 'high' | 'medium' | 'low';
}

// HARD CONSTRAINTS - Must be satisfied
export class HardConstraints {
  // 1. Faculty Availability Constraint
  static checkFacultyAvailability(
    faculty: Faculty, 
    timeSlot: TimeSlot, 
    existingSchedule: ScheduleSlot[]
  ): { valid: boolean; reason?: string } {
    // Check if faculty is unavailable at this time
    const slotKey = `${timeSlot.day}-${timeSlot.startTime}`;
    if (faculty.preferences.unavailableSlots.includes(slotKey)) {
      return { valid: false, reason: `${faculty.name} is unavailable at ${timeSlot.day} ${timeSlot.startTime}` };
    }

    // Check for double booking
    const conflictingSlot = existingSchedule.find(slot => 
      slot.faculty.id === faculty.id &&
      slot.timeSlot.day === timeSlot.day &&
      this.timeOverlaps(slot.timeSlot, timeSlot)
    );

    if (conflictingSlot) {
      return { valid: false, reason: `${faculty.name} already has ${conflictingSlot.subject.name} at this time` };
    }

    return { valid: true };
  }

  // 2. Room Availability Constraint
  static checkRoomAvailability(
    room: Room, 
    timeSlot: TimeSlot, 
    existingSchedule: ScheduleSlot[]
  ): { valid: boolean; reason?: string } {
    if (!room.isAvailable) {
      return { valid: false, reason: `${room.name} is not available` };
    }

    const conflictingSlot = existingSchedule.find(slot => 
      slot.room.id === room.id &&
      slot.timeSlot.day === timeSlot.day &&
      this.timeOverlaps(slot.timeSlot, timeSlot)
    );

    if (conflictingSlot) {
      return { valid: false, reason: `${room.name} is already booked for ${conflictingSlot.subject.name}` };
    }

    return { valid: true };
  }

  // 3. Room-Subject Compatibility
  static checkRoomSubjectCompatibility(
    room: Room, 
    subject: Subject
  ): { valid: boolean; reason?: string } {
    if (subject.requiredRoomType !== room.type) {
      return { valid: false, reason: `${subject.name} requires ${subject.requiredRoomType} but ${room.name} is ${room.type}` };
    }

    const missingFacilities = subject.requiredFacilities.filter(
      facility => !room.facilities.includes(facility)
    );

    if (missingFacilities.length > 0) {
      return { valid: false, reason: `${room.name} missing required facilities: ${missingFacilities.join(', ')}` };
    }

    if (room.capacity < subject.maxStudents) {
      return { valid: false, reason: `${room.name} capacity (${room.capacity}) insufficient for ${subject.name} (${subject.maxStudents} students)` };
    }

    return { valid: true };
  }

  // 4. Faculty Subject Expertise
  static checkFacultyExpertise(
    faculty: Faculty, 
    subject: Subject
  ): { valid: boolean; reason?: string } {
    if (!faculty.expertise.includes(subject.code) && !faculty.expertise.includes(subject.name)) {
      return { valid: false, reason: `${faculty.name} is not qualified to teach ${subject.name}` };
    }

    return { valid: true };
  }

  // 5. Faculty Workload Limit
  static checkFacultyWorkload(
    faculty: Faculty, 
    subject: Subject, 
    existingSchedule: ScheduleSlot[]
  ): { valid: boolean; reason?: string } {
    const currentHours = existingSchedule
      .filter(slot => slot.faculty.id === faculty.id)
      .reduce((total, slot) => total + (slot.timeSlot.duration / 60), 0);

    const newTotalHours = currentHours + subject.hoursPerWeek;

    if (newTotalHours > faculty.maxHoursPerWeek) {
      return { 
        valid: false, 
        reason: `Adding ${subject.name} would exceed ${faculty.name}'s weekly limit (${newTotalHours}/${faculty.maxHoursPerWeek} hours)` 
      };
    }

    return { valid: true };
  }

  // 6. NEP 2020 Multidisciplinary Requirements
  static checkNEPCompliance(
    subject: Subject, 
    student: Student, 
    existingEnrollments: Subject[]
  ): { valid: boolean; reason?: string } {
    if (!subject.isNEPCompliant) {
      return { valid: false, reason: `${subject.name} is not NEP 2020 compliant` };
    }

    // Check major-minor combination validity
    if (subject.type === 'minor' && student.minor && subject.department !== student.minor) {
      return { valid: false, reason: `${subject.name} does not match student's minor (${student.minor})` };
    }

    // Check interdisciplinary requirements
    if (subject.type === 'interdisciplinary') {
      const hasPrerequisites = subject.prerequisites.every(prereqId =>
        existingEnrollments.some(enrolled => enrolled.id === prereqId)
      );

      if (!hasPrerequisites) {
        return { valid: false, reason: `${subject.name} prerequisites not met` };
      }
    }

    return { valid: true };
  }

  // Helper method to check time overlap
  private static timeOverlaps(slot1: TimeSlot, slot2: TimeSlot): boolean {
    if (slot1.day !== slot2.day) return false;

    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);

    return start1 < end2 && start2 < end1;
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

// SOFT CONSTRAINTS - For optimization
export class SoftConstraints {
  // 1. Faculty Preference Score (0-100)
  static calculateFacultyPreferenceScore(
    faculty: Faculty, 
    timeSlot: TimeSlot
  ): number {
    let score = 50; // neutral score

    // Preferred days boost
    if (faculty.preferences.preferredDays.includes(timeSlot.day)) {
      score += 25;
    }

    // Preferred time slots boost
    const slotKey = `${timeSlot.day}-${timeSlot.startTime}`;
    if (faculty.preferences.preferredTimeSlots.includes(slotKey)) {
      score += 25;
    }

    return Math.min(100, score);
  }

  // 2. Workload Balance Score
  static calculateWorkloadBalanceScore(
    faculty: Faculty, 
    existingSchedule: ScheduleSlot[]
  ): number {
    const currentHours = existingSchedule
      .filter(slot => slot.faculty.id === faculty.id)
      .reduce((total, slot) => total + (slot.timeSlot.duration / 60), 0);

    const utilizationRatio = currentHours / faculty.maxHoursPerWeek;

    // Optimal utilization is around 70-80%
    if (utilizationRatio >= 0.7 && utilizationRatio <= 0.8) {
      return 100;
    } else if (utilizationRatio < 0.5) {
      return 50; // under-utilized
    } else if (utilizationRatio > 0.9) {
      return 30; // over-utilized
    }

    return 70;
  }

  // 3. Student Convenience Score
  static calculateStudentConvenienceScore(
    students: Student[], 
    timeSlot: TimeSlot, 
    existingSchedule: ScheduleSlot[]
  ): number {
    let totalScore = 0;

    students.forEach(student => {
      let studentScore = 50;

      // Check for excessive gaps
      const studentSlots = existingSchedule.filter(slot =>
        slot.students.some(s => s.id === student.id) &&
        slot.timeSlot.day === timeSlot.day
      );

      if (studentSlots.length > 0) {
        const gaps = this.calculateGaps(studentSlots.map(s => s.timeSlot), timeSlot);
        const maxGap = Math.max(...gaps);

        if (maxGap <= student.preferences.maxGapBetweenClasses) {
          studentScore += 25;
        } else {
          studentScore -= 15;
        }
      }

      // Early morning penalty
      if (student.preferences.avoidEarlyMorning && 
          HardConstraints.timeToMinutes(timeSlot.startTime) < 540) { // before 9 AM
        studentScore -= 20;
      }

      // Late Friday penalty
      if (student.preferences.avoidLateFriday && 
          timeSlot.day === 'Friday' && 
          HardConstraints.timeToMinutes(timeSlot.startTime) > 900) { // after 3 PM
        studentScore -= 15;
      }

      totalScore += studentScore;
    });

    return students.length > 0 ? totalScore / students.length : 50;
  }

  // 4. Room Proximity Score
  static calculateRoomProximityScore(
    room: Room, 
    previousRoom?: Room
  ): number {
    if (!previousRoom) return 50;

    // Same building bonus
    if (room.building === previousRoom.building) {
      // Same floor is best
      if (room.floor === previousRoom.floor) {
        return 100;
      }
      // Adjacent floors are good
      if (Math.abs(room.floor - previousRoom.floor) === 1) {
        return 80;
      }
      // Same building but different floors
      return 60;
    }

    // Different buildings
    return 20;
  }

  private static calculateGaps(existingSlots: TimeSlot[], newSlot: TimeSlot): number[] {
    const allSlots = [...existingSlots, newSlot].sort((a, b) => 
      HardConstraints.timeToMinutes(a.startTime) - HardConstraints.timeToMinutes(b.startTime)
    );

    const gaps: number[] = [];
    for (let i = 1; i < allSlots.length; i++) {
      const prevEnd = HardConstraints.timeToMinutes(allSlots[i-1].endTime);
      const currentStart = HardConstraints.timeToMinutes(allSlots[i].startTime);
      gaps.push(currentStart - prevEnd);
    }

    return gaps;
  }

  private static timeToMinutes = HardConstraints.timeToMinutes;
}

// CONSTRAINT VALIDATOR - Main validation engine
export class ConstraintValidator {
  static validateScheduleSlot(
    slot: ScheduleSlot, 
    existingSchedule: ScheduleSlot[]
  ): { valid: boolean; score: number; conflicts: string[] } {
    const conflicts: string[] = [];
    let valid = true;

    // Check all hard constraints
    const facultyAvailability = HardConstraints.checkFacultyAvailability(
      slot.faculty, slot.timeSlot, existingSchedule
    );
    if (!facultyAvailability.valid) {
      valid = false;
      conflicts.push(facultyAvailability.reason!);
    }

    const roomAvailability = HardConstraints.checkRoomAvailability(
      slot.room, slot.timeSlot, existingSchedule
    );
    if (!roomAvailability.valid) {
      valid = false;
      conflicts.push(roomAvailability.reason!);
    }

    const roomCompatibility = HardConstraints.checkRoomSubjectCompatibility(
      slot.room, slot.subject
    );
    if (!roomCompatibility.valid) {
      valid = false;
      conflicts.push(roomCompatibility.reason!);
    }

    const facultyExpertise = HardConstraints.checkFacultyExpertise(
      slot.faculty, slot.subject
    );
    if (!facultyExpertise.valid) {
      valid = false;
      conflicts.push(facultyExpertise.reason!);
    }

    const workloadCheck = HardConstraints.checkFacultyWorkload(
      slot.faculty, slot.subject, existingSchedule
    );
    if (!workloadCheck.valid) {
      valid = false;
      conflicts.push(workloadCheck.reason!);
    }

    // Calculate optimization score from soft constraints
    let score = 0;
    if (valid) {
      const facultyPrefScore = SoftConstraints.calculateFacultyPreferenceScore(
        slot.faculty, slot.timeSlot
      );
      const workloadBalanceScore = SoftConstraints.calculateWorkloadBalanceScore(
        slot.faculty, existingSchedule
      );
      const studentConvenienceScore = SoftConstraints.calculateStudentConvenienceScore(
        slot.students, slot.timeSlot, existingSchedule
      );

      // Weighted average of soft constraint scores
      score = (facultyPrefScore * 0.3) + 
              (workloadBalanceScore * 0.3) + 
              (studentConvenienceScore * 0.4);
    }

    return { valid, score, conflicts };
  }

  // Generate optimization suggestions
  static generateOptimizationSuggestions(
    schedule: ScheduleSlot[]
  ): { type: string; description: string; impact: 'high' | 'medium' | 'low' }[] {
    const suggestions: { type: string; description: string; impact: 'high' | 'medium' | 'low' }[] = [];

    // Analyze faculty workload distribution
    const facultyWorkloads = new Map<string, number>();
    schedule.forEach(slot => {
      const current = facultyWorkloads.get(slot.faculty.id) || 0;
      facultyWorkloads.set(slot.faculty.id, current + (slot.timeSlot.duration / 60));
    });

    facultyWorkloads.forEach((hours, facultyId) => {
      const faculty = schedule.find(s => s.faculty.id === facultyId)?.faculty;
      if (faculty) {
        const utilization = hours / faculty.maxHoursPerWeek;
        if (utilization > 0.9) {
          suggestions.push({
            type: 'workload',
            description: `${faculty.name} is overloaded (${Math.round(utilization * 100)}% utilization). Consider redistributing classes.`,
            impact: 'high'
          });
        } else if (utilization < 0.4) {
          suggestions.push({
            type: 'workload',
            description: `${faculty.name} is underutilized (${Math.round(utilization * 100)}% utilization). Consider assigning more classes.`,
            impact: 'medium'
          });
        }
      }
    });

    // Analyze room utilization
    const roomUsage = new Map<string, number>();
    schedule.forEach(slot => {
      const current = roomUsage.get(slot.room.id) || 0;
      roomUsage.set(slot.room.id, current + 1);
    });

    const totalSlots = schedule.length;
    const avgRoomUsage = totalSlots / roomUsage.size;

    roomUsage.forEach((usage, roomId) => {
      if (usage > avgRoomUsage * 1.5) {
        const room = schedule.find(s => s.room.id === roomId)?.room;
        suggestions.push({
          type: 'room_utilization',
          description: `${room?.name} is heavily used (${usage} classes). Consider using alternative rooms to balance load.`,
          impact: 'medium'
        });
      }
    });

    return suggestions;
  }
}

// NEP 2020 SPECIFIC CONSTRAINTS
export class NEPConstraints {
  // Validate multidisciplinary course combinations
  static validateMultidisciplinaryCombination(
    majorSubjects: Subject[],
    minorSubjects: Subject[],
    electiveSubjects: Subject[]
  ): { valid: boolean; recommendations: string[] } {
    const recommendations: string[] = [];
    let valid = true;

    // Check credit distribution (NEP 2020 guidelines)
    const totalMajorCredits = majorSubjects.reduce((sum, s) => sum + s.credits, 0);
    const totalMinorCredits = minorSubjects.reduce((sum, s) => sum + s.credits, 0);
    const totalElectiveCredits = electiveSubjects.reduce((sum, s) => sum + s.credits, 0);

    if (totalMajorCredits < 80) {
      valid = false;
      recommendations.push(`Major subjects need at least 80 credits (currently ${totalMajorCredits})`);
    }

    if (totalMinorCredits < 40) {
      recommendations.push(`Consider adding more minor credits (currently ${totalMinorCredits}, recommended 40+)`);
    }

    if (totalElectiveCredits < 20) {
      recommendations.push(`Add more elective courses for flexibility (currently ${totalElectiveCredits}, recommended 20+)`);
    }

    // Check interdisciplinary requirements
    const interdisciplinaryCount = [...majorSubjects, ...minorSubjects, ...electiveSubjects]
      .filter(s => s.type === 'interdisciplinary').length;

    if (interdisciplinaryCount < 2) {
      recommendations.push('Include at least 2 interdisciplinary courses as per NEP 2020 guidelines');
    }

    return { valid, recommendations };
  }

  // Validate Choice-Based Credit System (CBCS) requirements
  static validateCBCSRequirements(
    studentEnrollments: { student: Student; subjects: Subject[] }[]
  ): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    let valid = true;

    studentEnrollments.forEach(({ student, subjects }) => {
      const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
      
      // Typical semester credit range: 18-24 credits
      if (totalCredits < 18) {
        issues.push(`${student.name} has insufficient credits (${totalCredits}, minimum 18)`);
        valid = false;
      } else if (totalCredits > 24) {
        issues.push(`${student.name} has excessive credits (${totalCredits}, maximum 24)`);
        valid = false;
      }

      // Check major-minor balance
      const majorCredits = subjects.filter(s => s.type === 'major').reduce((sum, s) => sum + s.credits, 0);
      const minorCredits = subjects.filter(s => s.type === 'minor').reduce((sum, s) => sum + s.credits, 0);

      if (majorCredits === 0) {
        issues.push(`${student.name} must have at least one major subject`);
        valid = false;
      }

      if (student.minor && minorCredits === 0) {
        issues.push(`${student.name} declared ${student.minor} minor but has no minor subjects`);
        valid = false;
      }
    });

    return { valid, issues };
  }
}