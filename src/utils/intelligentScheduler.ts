// Intelligent AI-Powered Scheduling Engine
// Advanced algorithms for optimal timetable generation

import {
  TimeSlot,
  Room,
  Faculty,
  Subject,
  Student,
  ScheduleSlot,
  ConstraintValidator,
  HardConstraints,
  SoftConstraints,
  NEPConstraints
} from './constraints';

export interface SchedulingConfig {
  workingDays: string[];
  startTime: string;      // "08:00"
  endTime: string;        // "17:00"
  slotDuration: number;   // minutes
  breakTime: number;      // minutes between slots
  lunchBreak: {
    start: string;        // "12:00"
    duration: number;     // minutes
  };
  maxConsecutiveHours: number;
  prioritizeNEPCompliance: boolean;
  optimizationWeights: {
    facultyPreference: number;
    workloadBalance: number;
    studentConvenience: number;
    roomUtilization: number;
  };
}

export interface SchedulingResult {
  schedule: ScheduleSlot[];
  conflicts: {
    slot: ScheduleSlot;
    issues: string[];
  }[];
  optimizationScore: number;
  suggestions: string[];
  statistics: {
    facultyUtilization: { [facultyId: string]: number };
    roomUtilization: { [roomId: string]: number };
    conflictCount: number;
    satisfactionScore: number;
  };
}

export class IntelligentScheduler {
  private config: SchedulingConfig;
  private timeSlots: TimeSlot[];

  constructor(config: SchedulingConfig) {
    this.config = config;
    this.timeSlots = this.generateTimeSlots();
  }

  // Main scheduling algorithm
  async generateOptimalSchedule(
    subjects: Subject[],
    faculty: Faculty[],
    rooms: Room[],
    students: Student[]
  ): Promise<SchedulingResult> {
    console.log('🚀 Starting intelligent schedule generation...');

    // Step 1: Pre-process and validate data
    const validationResult = this.validateInputData(subjects, faculty, rooms, students);
    if (!validationResult.valid) {
      throw new Error(`Input validation failed: ${validationResult.errors.join(', ')}`);
    }

    // Step 2: Create initial schedule using greedy algorithm
    let schedule = await this.createInitialSchedule(subjects, faculty, rooms, students);
    console.log(`📋 Initial schedule created with ${schedule.length} slots`);

    // Step 3: Apply genetic algorithm for optimization
    schedule = await this.optimizeWithGeneticAlgorithm(schedule, subjects, faculty, rooms, students);
    console.log('🧬 Genetic algorithm optimization completed');

    // Step 4: Apply local search improvements
    schedule = await this.applyLocalSearchOptimization(schedule);
    console.log('🔍 Local search optimization completed');

    // Step 5: Resolve remaining conflicts
    schedule = await this.resolveConflicts(schedule, faculty, rooms);
    console.log('⚡ Conflict resolution completed');

    // Step 6: Generate final result with statistics
    return this.generateSchedulingResult(schedule, subjects, faculty, rooms, students);
  }

  // Validate input data integrity
  private validateInputData(
    subjects: Subject[],
    faculty: Faculty[],
    rooms: Room[],
    students: Student[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if we have enough faculty for subjects
    subjects.forEach(subject => {
      const qualifiedFaculty = faculty.filter(f => 
        f.expertise.includes(subject.code) || f.expertise.includes(subject.name)
      );
      if (qualifiedFaculty.length === 0) {
        errors.push(`No qualified faculty found for ${subject.name} (${subject.code})`);
      }
    });

    // Check room capacity vs subject requirements
    subjects.forEach(subject => {
      const suitableRooms = rooms.filter(room => 
        room.type === subject.requiredRoomType &&
        room.capacity >= subject.maxStudents &&
        subject.requiredFacilities.every(facility => room.facilities.includes(facility))
      );
      if (suitableRooms.length === 0) {
        errors.push(`No suitable rooms found for ${subject.name}`);
      }
    });

    // Validate NEP 2020 compliance
    if (this.config.prioritizeNEPCompliance) {
      const nepValidation = NEPConstraints.validateMultidisciplinaryCombination(
        subjects.filter(s => s.type === 'major'),
        subjects.filter(s => s.type === 'minor'),
        subjects.filter(s => s.type === 'elective')
      );
      if (!nepValidation.valid) {
        errors.push(...nepValidation.recommendations);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // Create initial schedule using intelligent greedy algorithm
  private async createInitialSchedule(
    subjects: Subject[],
    faculty: Faculty[],
    rooms: Room[],
    students: Student[]
  ): Promise<ScheduleSlot[]> {
    const schedule: ScheduleSlot[] = [];

    // Sort subjects by priority (required subjects first, then by difficulty to schedule)
    const sortedSubjects = this.prioritizeSubjects(subjects, faculty, rooms);

    for (const subject of sortedSubjects) {
      const sessionCount = Math.ceil(subject.hoursPerWeek);
      
      for (let session = 0; session < sessionCount; session++) {
        const bestSlot = await this.findBestSlotForSubject(
          subject, faculty, rooms, students, schedule
        );

        if (bestSlot) {
          schedule.push(bestSlot);
        } else {
          console.warn(`⚠️ Could not schedule ${subject.name} session ${session + 1}`);
        }
      }
    }

    return schedule;
  }

  // Prioritize subjects based on scheduling difficulty
  private prioritizeSubjects(subjects: Subject[], faculty: Faculty[], rooms: Room[]): Subject[] {
    return subjects.sort((a, b) => {
      // Priority factors:
      let aScore = 0, bScore = 0;

      // 1. Core subjects get higher priority
      if (a.type === 'core') aScore += 100;
      if (b.type === 'core') bScore += 100;

      // 2. Subjects with fewer qualified faculty are harder to schedule
      const aFacultyCount = faculty.filter(f => f.expertise.includes(a.code)).length;
      const bFacultyCount = faculty.filter(f => f.expertise.includes(b.code)).length;
      aScore += (10 - aFacultyCount) * 10; // Fewer faculty = higher priority
      bScore += (10 - bFacultyCount) * 10;

      // 3. Subjects requiring specialized rooms get priority
      const aRoomCount = rooms.filter(r => r.type === a.requiredRoomType).length;
      const bRoomCount = rooms.filter(r => r.type === b.requiredRoomType).length;
      aScore += (10 - aRoomCount) * 5;
      bScore += (10 - bRoomCount) * 5;

      // 4. Higher credit subjects get priority
      aScore += a.credits * 2;
      bScore += b.credits * 2;

      return bScore - aScore; // Higher score = higher priority
    });
  }

  // Find the best time slot for a subject using AI scoring
  private async findBestSlotForSubject(
    subject: Subject,
    faculty: Faculty[],
    rooms: Room[],
    students: Student[],
    existingSchedule: ScheduleSlot[]
  ): Promise<ScheduleSlot | null> {
    const candidates: { slot: ScheduleSlot; score: number }[] = [];

    // Get qualified faculty and suitable rooms
    const qualifiedFaculty = faculty.filter(f => 
      f.expertise.includes(subject.code) || f.expertise.includes(subject.name)
    );
    const suitableRooms = rooms.filter(room => 
      room.type === subject.requiredRoomType &&
      room.capacity >= subject.maxStudents &&
      subject.requiredFacilities.every(facility => room.facilities.includes(facility))
    );

    if (qualifiedFaculty.length === 0 || suitableRooms.length === 0) {
      return null;
    }

    // Generate all possible combinations
    for (const timeSlot of this.timeSlots) {
      for (const facultyMember of qualifiedFaculty) {
        for (const room of suitableRooms) {
          const enrolledStudents = students.filter(s => 
            s.enrolledSubjects.includes(subject.id)
          );

          const candidateSlot: ScheduleSlot = {
            id: `${subject.id}-${timeSlot.id}-${facultyMember.id}-${room.id}`,
            timeSlot,
            subject,
            faculty: facultyMember,
            room,
            students: enrolledStudents,
            status: 'pending',
            priority: 'medium'
          };

          // Validate and score the candidate
          const validation = ConstraintValidator.validateScheduleSlot(candidateSlot, existingSchedule);
          
          if (validation.valid) {
            candidates.push({
              slot: candidateSlot,
              score: validation.score
            });
          }
        }
      }
    }

    // Return the best candidate
    if (candidates.length === 0) return null;

    candidates.sort((a, b) => b.score - a.score);
    const bestCandidate = candidates[0];
    bestCandidate.slot.status = 'scheduled';

    return bestCandidate.slot;
  }

  // Genetic Algorithm optimization
  private async optimizeWithGeneticAlgorithm(
    initialSchedule: ScheduleSlot[],
    subjects: Subject[],
    faculty: Faculty[],
    rooms: Room[],
    students: Student[]
  ): Promise<ScheduleSlot[]> {
    const POPULATION_SIZE = 50;
    const GENERATIONS = 100;
    const MUTATION_RATE = 0.1;
    const ELITE_SIZE = 10;

    console.log('🧬 Initializing genetic algorithm...');

    // Create initial population
    let population = await this.createInitialPopulation(
      initialSchedule, subjects, faculty, rooms, students, POPULATION_SIZE
    );

    for (let generation = 0; generation < GENERATIONS; generation++) {
      // Evaluate fitness
      const fitnessScores = population.map(schedule => this.calculateFitness(schedule));

      // Select elite individuals
      const eliteIndices = fitnessScores
        .map((score, index) => ({ score, index }))
        .sort((a, b) => b.score - a.score)
        .slice(0, ELITE_SIZE)
        .map(item => item.index);

      const newPopulation: ScheduleSlot[][] = [];

      // Keep elite
      eliteIndices.forEach(index => {
        newPopulation.push([...population[index]]);
      });

      // Generate offspring
      while (newPopulation.length < POPULATION_SIZE) {
        const parent1 = this.tournamentSelection(population, fitnessScores);
        const parent2 = this.tournamentSelection(population, fitnessScores);
        
        let offspring = this.crossover(parent1, parent2);
        
        if (Math.random() < MUTATION_RATE) {
          offspring = await this.mutate(offspring, subjects, faculty, rooms, students);
        }

        newPopulation.push(offspring);
      }

      population = newPopulation;

      if (generation % 20 === 0) {
        const bestFitness = Math.max(...fitnessScores);
        console.log(`Generation ${generation}: Best fitness = ${bestFitness.toFixed(2)}`);
      }
    }

    // Return the best schedule
    const finalScores = population.map(schedule => this.calculateFitness(schedule));
    const bestIndex = finalScores.indexOf(Math.max(...finalScores));
    
    console.log(`🏆 Genetic algorithm completed. Best fitness: ${finalScores[bestIndex].toFixed(2)}`);
    return population[bestIndex];
  }

  // Create initial population for genetic algorithm
  private async createInitialPopulation(
    baseSchedule: ScheduleSlot[],
    subjects: Subject[],
    faculty: Faculty[],
    rooms: Room[],
    students: Student[],
    populationSize: number
  ): Promise<ScheduleSlot[][]> {
    const population: ScheduleSlot[][] = [];
    
    // Add the base schedule
    population.push([...baseSchedule]);

    // Generate variations
    for (let i = 1; i < populationSize; i++) {
      let variant = [...baseSchedule];
      
      // Apply random modifications
      const modificationsCount = Math.floor(Math.random() * 10) + 1;
      for (let j = 0; j < modificationsCount; j++) {
        variant = await this.randomModification(variant, subjects, faculty, rooms, students);
      }
      
      population.push(variant);
    }

    return population;
  }

  // Calculate fitness score for a schedule
  private calculateFitness(schedule: ScheduleSlot[]): number {
    let totalScore = 0;
    let validSlots = 0;

    schedule.forEach(slot => {
      const validation = ConstraintValidator.validateScheduleSlot(slot, schedule);
      
      if (validation.valid) {
        totalScore += validation.score;
        validSlots++;
      } else {
        // Penalty for invalid slots
        totalScore -= 50;
      }
    });

    // Bonus for having more valid slots
    const completenessBonus = validSlots * 10;
    
    // Penalty for conflicts
    const conflictPenalty = (schedule.length - validSlots) * 25;

    return totalScore + completenessBonus - conflictPenalty;
  }

  // Tournament selection for genetic algorithm
  private tournamentSelection(population: ScheduleSlot[][], fitnessScores: number[]): ScheduleSlot[] {
    const tournamentSize = 5;
    let bestIndex = Math.floor(Math.random() * population.length);
    let bestFitness = fitnessScores[bestIndex];

    for (let i = 1; i < tournamentSize; i++) {
      const candidateIndex = Math.floor(Math.random() * population.length);
      if (fitnessScores[candidateIndex] > bestFitness) {
        bestIndex = candidateIndex;
        bestFitness = fitnessScores[candidateIndex];
      }
    }

    return population[bestIndex];
  }

  // Crossover operation for genetic algorithm
  private crossover(parent1: ScheduleSlot[], parent2: ScheduleSlot[]): ScheduleSlot[] {
    const crossoverPoint = Math.floor(Math.random() * Math.min(parent1.length, parent2.length));
    
    const offspring: ScheduleSlot[] = [];
    
    // Take first part from parent1
    for (let i = 0; i < crossoverPoint; i++) {
      offspring.push({ ...parent1[i] });
    }
    
    // Take remaining from parent2, avoiding duplicates
    const usedSubjects = new Set(offspring.map(slot => slot.subject.id));
    
    for (const slot of parent2) {
      if (!usedSubjects.has(slot.subject.id)) {
        offspring.push({ ...slot });
        usedSubjects.add(slot.subject.id);
      }
    }

    return offspring;
  }

  // Mutation operation for genetic algorithm
  private async mutate(
    schedule: ScheduleSlot[],
    subjects: Subject[],
    faculty: Faculty[],
    rooms: Room[],
    students: Student[]
  ): Promise<ScheduleSlot[]> {
    const mutated = [...schedule];
    
    if (mutated.length === 0) return mutated;

    const randomIndex = Math.floor(Math.random() * mutated.length);
    const slotToMutate = mutated[randomIndex];

    // Try to find a better time slot for this subject
    const newSlot = await this.findBestSlotForSubject(
      slotToMutate.subject,
      faculty,
      rooms,
      students,
      mutated.filter((_, index) => index !== randomIndex)
    );

    if (newSlot) {
      mutated[randomIndex] = newSlot;
    }

    return mutated;
  }

  // Apply random modification to schedule
  private async randomModification(
    schedule: ScheduleSlot[],
    subjects: Subject[],
    faculty: Faculty[],
    rooms: Room[],
    students: Student[]
  ): Promise<ScheduleSlot[]> {
    if (schedule.length === 0) return schedule;

    const modified = [...schedule];
    const randomIndex = Math.floor(Math.random() * modified.length);
    
    // Different types of modifications
    const modificationType = Math.random();
    
    if (modificationType < 0.5) {
      // Change time slot
      const availableSlots = this.timeSlots.filter(slot => 
        !modified.some(s => s.timeSlot.id === slot.id && s.timeSlot.day === slot.day)
      );
      
      if (availableSlots.length > 0) {
        const newTimeSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
        modified[randomIndex] = {
          ...modified[randomIndex],
          timeSlot: newTimeSlot,
          id: `${modified[randomIndex].subject.id}-${newTimeSlot.id}-${modified[randomIndex].faculty.id}-${modified[randomIndex].room.id}`
        };
      }
    } else {
      // Change faculty or room
      const slot = modified[randomIndex];
      const qualifiedFaculty = faculty.filter(f => 
        f.expertise.includes(slot.subject.code) || f.expertise.includes(slot.subject.name)
      );
      
      if (qualifiedFaculty.length > 1) {
        const newFaculty = qualifiedFaculty[Math.floor(Math.random() * qualifiedFaculty.length)];
        modified[randomIndex] = {
          ...slot,
          faculty: newFaculty,
          id: `${slot.subject.id}-${slot.timeSlot.id}-${newFaculty.id}-${slot.room.id}`
        };
      }
    }

    return modified;
  }

  // Local search optimization
  private async applyLocalSearchOptimization(schedule: ScheduleSlot[]): Promise<ScheduleSlot[]> {
    console.log('🔍 Applying local search optimization...');
    
    let optimized = [...schedule];
    let improved = true;
    let iterations = 0;
    const maxIterations = 50;

    while (improved && iterations < maxIterations) {
      improved = false;
      iterations++;

      for (let i = 0; i < optimized.length; i++) {
        const currentSlot = optimized[i];
        const currentScore = ConstraintValidator.validateScheduleSlot(currentSlot, optimized).score;

        // Try swapping with other slots
        for (let j = i + 1; j < optimized.length; j++) {
          const otherSlot = optimized[j];

          // Create swapped version
          const swapped = [...optimized];
          [swapped[i], swapped[j]] = [swapped[j], swapped[i]];

          const newScore1 = ConstraintValidator.validateScheduleSlot(swapped[i], swapped).score;
          const newScore2 = ConstraintValidator.validateScheduleSlot(swapped[j], swapped).score;

          if (newScore1 + newScore2 > currentScore + ConstraintValidator.validateScheduleSlot(otherSlot, optimized).score) {
            optimized = swapped;
            improved = true;
            break;
          }
        }

        if (improved) break;
      }

      if (iterations % 10 === 0) {
        const avgScore = optimized.reduce((sum, slot) => 
          sum + ConstraintValidator.validateScheduleSlot(slot, optimized).score, 0
        ) / optimized.length;
        console.log(`Local search iteration ${iterations}: Average score = ${avgScore.toFixed(2)}`);
      }
    }

    console.log(`🎯 Local search completed after ${iterations} iterations`);
    return optimized;
  }

  // Resolve remaining conflicts
  private async resolveConflicts(
    schedule: ScheduleSlot[],
    faculty: Faculty[],
    rooms: Room[]
  ): Promise<ScheduleSlot[]> {
    console.log('⚡ Resolving remaining conflicts...');
    
    const resolved = [...schedule];
    const conflicts: ScheduleSlot[] = [];

    // Identify conflicted slots
    resolved.forEach(slot => {
      const validation = ConstraintValidator.validateScheduleSlot(slot, resolved);
      if (!validation.valid) {
        conflicts.push(slot);
        slot.status = 'conflict';
        slot.conflictReasons = validation.conflicts;
      }
    });

    console.log(`Found ${conflicts.length} conflicts to resolve`);

    // Try to resolve each conflict
    for (const conflictedSlot of conflicts) {
      // Remove the conflicted slot temporarily
      const tempSchedule = resolved.filter(s => s.id !== conflictedSlot.id);

      // Try to find an alternative slot
      const alternativeSlot = await this.findBestSlotForSubject(
        conflictedSlot.subject,
        faculty,
        rooms,
        conflictedSlot.students,
        tempSchedule
      );

      if (alternativeSlot) {
        // Replace the conflicted slot
        const index = resolved.findIndex(s => s.id === conflictedSlot.id);
        resolved[index] = alternativeSlot;
        console.log(`✅ Resolved conflict for ${conflictedSlot.subject.name}`);
      } else {
        console.warn(`❌ Could not resolve conflict for ${conflictedSlot.subject.name}`);
      }
    }

    return resolved;
  }

  // Generate comprehensive scheduling result
  private generateSchedulingResult(
    schedule: ScheduleSlot[],
    subjects: Subject[],
    faculty: Faculty[],
    rooms: Room[],
    students: Student[]
  ): SchedulingResult {
    const conflicts: { slot: ScheduleSlot; issues: string[] }[] = [];
    let totalScore = 0;
    let validSlots = 0;

    // Analyze each slot
    schedule.forEach(slot => {
      const validation = ConstraintValidator.validateScheduleSlot(slot, schedule);
      
      if (validation.valid) {
        totalScore += validation.score;
        validSlots++;
      } else {
        conflicts.push({
          slot,
          issues: validation.conflicts
        });
      }
    });

    // Calculate statistics
    const facultyUtilization: { [facultyId: string]: number } = {};
    const roomUtilization: { [roomId: string]: number } = {};

    faculty.forEach(f => {
      const assignedHours = schedule
        .filter(s => s.faculty.id === f.id)
        .reduce((sum, s) => sum + (s.timeSlot.duration / 60), 0);
      facultyUtilization[f.id] = (assignedHours / f.maxHoursPerWeek) * 100;
    });

    rooms.forEach(r => {
      const usageCount = schedule.filter(s => s.room.id === r.id).length;
      roomUtilization[r.id] = usageCount;
    });

    // Generate optimization suggestions
    const suggestions = ConstraintValidator.generateOptimizationSuggestions(schedule);

    const optimizationScore = validSlots > 0 ? totalScore / validSlots : 0;
    const satisfactionScore = (validSlots / schedule.length) * 100;

    return {
      schedule,
      conflicts,
      optimizationScore,
      suggestions: suggestions.map(s => s.description),
      statistics: {
        facultyUtilization,
        roomUtilization,
        conflictCount: conflicts.length,
        satisfactionScore
      }
    };
  }

  // Generate time slots based on configuration
  private generateTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    let slotId = 1;

    this.config.workingDays.forEach(day => {
      let currentTime = this.timeToMinutes(this.config.startTime);
      const endTime = this.timeToMinutes(this.config.endTime);
      const lunchStart = this.timeToMinutes(this.config.lunchBreak.start);
      const lunchEnd = lunchStart + this.config.lunchBreak.duration;

      while (currentTime + this.config.slotDuration <= endTime) {
        // Skip lunch break
        if (currentTime >= lunchStart && currentTime < lunchEnd) {
          currentTime = lunchEnd;
          continue;
        }

        const startTimeStr = this.minutesToTime(currentTime);
        const endTimeStr = this.minutesToTime(currentTime + this.config.slotDuration);

        slots.push({
          id: `slot-${slotId++}`,
          day: day as any,
          startTime: startTimeStr,
          endTime: endTimeStr,
          duration: this.config.slotDuration
        });

        currentTime += this.config.slotDuration + this.config.breakTime;
      }
    });

    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}

// Export default configuration
export const DEFAULT_SCHEDULING_CONFIG: SchedulingConfig = {
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  startTime: '08:00',
  endTime: '17:00',
  slotDuration: 60, // 1 hour
  breakTime: 15,    // 15 minutes between classes
  lunchBreak: {
    start: '12:00',
    duration: 60    // 1 hour lunch
  },
  maxConsecutiveHours: 3,
  prioritizeNEPCompliance: true,
  optimizationWeights: {
    facultyPreference: 0.3,
    workloadBalance: 0.3,
    studentConvenience: 0.25,
    roomUtilization: 0.15
  }
};