// NEP 2020 Compliance Engine
// Specialized logic for National Education Policy 2020 requirements

import { Subject, Student, Faculty, ScheduleSlot } from './constraints';

export interface NEPProgram {
  id: string;
  name: string;
  type: 'undergraduate' | 'postgraduate' | 'integrated';
  duration: number; // years
  totalCredits: number;
  exitOptions: NEPExitOption[];
  requirements: NEPRequirements;
}

export interface NEPExitOption {
  year: number;
  credits: number;
  qualification: string;
  description: string;
}

export interface NEPRequirements {
  majorCredits: {
    min: number;
    max: number;
  };
  minorCredits: {
    min: number;
    max: number;
  };
  electiveCredits: {
    min: number;
    max: number;
  };
  interdisciplinaryCredits: {
    min: number;
    recommended: number;
  };
  skillEnhancementCredits: {
    min: number;
    max: number;
  };
  internshipCredits: {
    min: number;
    mandatory: boolean;
  };
  researchCredits: {
    min: number;
    requiredFromYear: number;
  };
  languageRequirements: {
    mandatoryLanguages: string[];
    optionalLanguages: string[];
    minCredits: number;
  };
  valueEducationCredits: {
    min: number;
    mandatory: boolean;
  };
}

export interface MultidisciplinaryConstraint {
  type: 'major_minor_combination' | 'interdisciplinary_exposure' | 'skill_development';
  description: string;
  validator: (student: Student, subjects: Subject[]) => { valid: boolean; message: string };
}

export interface NEPComplianceReport {
  student: Student;
  program: NEPProgram;
  currentCredits: {
    major: number;
    minor: number;
    elective: number;
    interdisciplinary: number;
    skillEnhancement: number;
    internship: number;
    research: number;
    language: number;
    valueEducation: number;
    total: number;
  };
  compliance: {
    overallCompliant: boolean;
    majorCompliant: boolean;
    minorCompliant: boolean;
    electiveCompliant: boolean;
    interdisciplinaryCompliant: boolean;
    skillCompliant: boolean;
    internshipCompliant: boolean;
    researchCompliant: boolean;
    languageCompliant: boolean;
    valueEducationCompliant: boolean;
  };
  recommendations: string[];
  exitOptions: NEPExitOption[];
  progressToNextLevel: {
    canProgress: boolean;
    requirements: string[];
  };
}

export class NEPComplianceEngine {
  private programs: Map<string, NEPProgram> = new Map();
  private constraints: MultidisciplinaryConstraint[] = [];

  constructor() {
    this.initializeNEPPrograms();
    this.initializeConstraints();
  }

  // Initialize NEP 2020 compliant programs
  private initializeNEPPrograms(): void {
    // Four-Year Undergraduate Programme (FYUP)
    const fyup: NEPProgram = {
      id: 'fyup',
      name: 'Four Year Undergraduate Programme',
      type: 'undergraduate',
      duration: 4,
      totalCredits: 176,
      exitOptions: [
        {
          year: 1,
          credits: 44,
          qualification: 'Certificate',
          description: 'Certificate in Disciplinary/Professional/Vocational area'
        },
        {
          year: 2,
          credits: 88,
          qualification: 'Diploma',
          description: 'Diploma in Disciplinary/Professional/Vocational area'
        },
        {
          year: 3,
          credits: 132,
          qualification: "Bachelor's Degree",
          description: "Bachelor's degree in the chosen discipline"
        },
        {
          year: 4,
          credits: 176,
          qualification: "Bachelor's with Honours/Research",
          description: "Bachelor's degree with Honours or Research specialization"
        }
      ],
      requirements: {
        majorCredits: { min: 80, max: 96 },
        minorCredits: { min: 40, max: 48 },
        electiveCredits: { min: 24, max: 32 },
        interdisciplinaryCredits: { min: 16, recommended: 24 },
        skillEnhancementCredits: { min: 12, max: 16 },
        internshipCredits: { min: 8, mandatory: true },
        researchCredits: { min: 8, requiredFromYear: 3 },
        languageRequirements: {
          mandatoryLanguages: ['English', 'Hindi'],
          optionalLanguages: ['Sanskrit', 'Urdu', 'Regional Language'],
          minCredits: 12
        },
        valueEducationCredits: { min: 4, mandatory: true }
      }
    };

    // Bachelor of Education (B.Ed)
    const bed: NEPProgram = {
      id: 'bed',
      name: 'Bachelor of Education',
      type: 'integrated',
      duration: 4,
      totalCredits: 160,
      exitOptions: [
        {
          year: 4,
          credits: 160,
          qualification: 'B.Ed.',
          description: 'Bachelor of Education degree'
        }
      ],
      requirements: {
        majorCredits: { min: 64, max: 72 },
        minorCredits: { min: 32, max: 40 },
        electiveCredits: { min: 24, max: 32 },
        interdisciplinaryCredits: { min: 12, recommended: 16 },
        skillEnhancementCredits: { min: 16, max: 20 },
        internshipCredits: { min: 20, mandatory: true },
        researchCredits: { min: 8, requiredFromYear: 3 },
        languageRequirements: {
          mandatoryLanguages: ['English', 'Hindi'],
          optionalLanguages: ['Sanskrit', 'Regional Language'],
          minCredits: 8
        },
        valueEducationCredits: { min: 6, mandatory: true }
      }
    };

    // Master of Education (M.Ed)
    const med: NEPProgram = {
      id: 'med',
      name: 'Master of Education',
      type: 'postgraduate',
      duration: 2,
      totalCredits: 80,
      exitOptions: [
        {
          year: 1,
          credits: 40,
          qualification: 'PG Diploma',
          description: 'Post Graduate Diploma in Education'
        },
        {
          year: 2,
          credits: 80,
          qualification: 'M.Ed.',
          description: 'Master of Education degree'
        }
      ],
      requirements: {
        majorCredits: { min: 40, max: 48 },
        minorCredits: { min: 16, max: 20 },
        electiveCredits: { min: 8, max: 12 },
        interdisciplinaryCredits: { min: 8, recommended: 12 },
        skillEnhancementCredits: { min: 4, max: 8 },
        internshipCredits: { min: 8, mandatory: true },
        researchCredits: { min: 16, requiredFromYear: 1 },
        languageRequirements: {
          mandatoryLanguages: ['English'],
          optionalLanguages: ['Hindi', 'Regional Language'],
          minCredits: 4
        },
        valueEducationCredits: { min: 2, mandatory: true }
      }
    };

    // Integrated Teacher Education Programme (ITEP)
    const itep: NEPProgram = {
      id: 'itep',
      name: 'Integrated Teacher Education Programme',
      type: 'integrated',
      duration: 4,
      totalCredits: 180,
      exitOptions: [
        {
          year: 4,
          credits: 180,
          qualification: 'B.A./B.Sc. B.Ed.',
          description: 'Integrated Bachelor degree with Education'
        }
      ],
      requirements: {
        majorCredits: { min: 72, max: 80 },
        minorCredits: { min: 40, max: 48 },
        electiveCredits: { min: 28, max: 36 },
        interdisciplinaryCredits: { min: 20, recommended: 28 },
        skillEnhancementCredits: { min: 16, max: 20 },
        internshipCredits: { min: 24, mandatory: true },
        researchCredits: { min: 12, requiredFromYear: 3 },
        languageRequirements: {
          mandatoryLanguages: ['English', 'Hindi'],
          optionalLanguages: ['Sanskrit', 'Regional Language'],
          minCredits: 12
        },
        valueEducationCredits: { min: 8, mandatory: true }
      }
    };

    this.programs.set('fyup', fyup);
    this.programs.set('bed', bed);
    this.programs.set('med', med);
    this.programs.set('itep', itep);
  }

  // Initialize multidisciplinary constraints
  private initializeConstraints(): void {
    // Major-Minor combination constraint
    this.constraints.push({
      type: 'major_minor_combination',
      description: 'Major and Minor subjects must be from different disciplines',
      validator: (student: Student, subjects: Subject[]) => {
        const majorSubjects = subjects.filter(s => s.type === 'major');
        const minorSubjects = subjects.filter(s => s.type === 'minor');

        if (majorSubjects.length === 0) {
          return { valid: false, message: 'At least one major subject is required' };
        }

        if (student.minor && minorSubjects.length === 0) {
          return { valid: false, message: `No minor subjects found for declared minor: ${student.minor}` };
        }

        // Check that major and minor are from different departments
        const majorDepartments = new Set(majorSubjects.map(s => s.department));
        const minorDepartments = new Set(minorSubjects.map(s => s.department));

        const overlap = [...majorDepartments].some(dept => minorDepartments.has(dept));
        if (overlap) {
          return { 
            valid: false, 
            message: 'Major and Minor subjects should be from different disciplines as per NEP 2020' 
          };
        }

        return { valid: true, message: 'Major-Minor combination is valid' };
      }
    });

    // Interdisciplinary exposure constraint
    this.constraints.push({
      type: 'interdisciplinary_exposure',
      description: 'Minimum interdisciplinary course exposure required',
      validator: (student: Student, subjects: Subject[]) => {
        const interdisciplinarySubjects = subjects.filter(s => s.type === 'interdisciplinary');
        const program = this.programs.get(student.program.toLowerCase());

        if (!program) {
          return { valid: false, message: 'Invalid program type' };
        }

        const minInterdisciplinaryCredits = program.requirements.interdisciplinaryCredits.min;
        const currentInterdisciplinaryCredits = interdisciplinarySubjects.reduce((sum, s) => sum + s.credits, 0);

        if (currentInterdisciplinaryCredits < minInterdisciplinaryCredits) {
          return {
            valid: false,
            message: `Insufficient interdisciplinary credits. Required: ${minInterdisciplinaryCredits}, Current: ${currentInterdisciplinaryCredits}`
          };
        }

        return { valid: true, message: 'Interdisciplinary requirements met' };
      }
    });

    // Skill development constraint
    this.constraints.push({
      type: 'skill_development',
      description: 'Skill enhancement courses mandatory for holistic development',
      validator: (student: Student, subjects: Subject[]) => {
        const skillSubjects = subjects.filter(s => 
          s.name.toLowerCase().includes('skill') || 
          s.name.toLowerCase().includes('vocational') ||
          s.name.toLowerCase().includes('practical')
        );

        const program = this.programs.get(student.program.toLowerCase());
        if (!program) {
          return { valid: false, message: 'Invalid program type' };
        }

        const minSkillCredits = program.requirements.skillEnhancementCredits.min;
        const currentSkillCredits = skillSubjects.reduce((sum, s) => sum + s.credits, 0);

        if (currentSkillCredits < minSkillCredits) {
          return {
            valid: false,
            message: `Insufficient skill enhancement credits. Required: ${minSkillCredits}, Current: ${currentSkillCredits}`
          };
        }

        return { valid: true, message: 'Skill development requirements met' };
      }
    });
  }

  // Generate comprehensive NEP compliance report
  generateComplianceReport(
    student: Student, 
    subjects: Subject[], 
    schedule?: ScheduleSlot[]
  ): NEPComplianceReport {
    const program = this.programs.get(student.program.toLowerCase());
    if (!program) {
      throw new Error(`Program ${student.program} not found in NEP 2020 programs`);
    }

    // Calculate current credits by category
    const currentCredits = this.calculateCreditDistribution(subjects);
    
    // Check compliance for each requirement
    const compliance = this.checkCompliance(currentCredits, program.requirements);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      student, currentCredits, program.requirements, compliance
    );

    // Determine exit options available
    const availableExitOptions = program.exitOptions.filter(option => 
      currentCredits.total >= option.credits
    );

    // Check progression requirements
    const progressToNextLevel = this.checkProgressionRequirements(
      student, currentCredits, program
    );

    return {
      student,
      program,
      currentCredits,
      compliance,
      recommendations,
      exitOptions: availableExitOptions,
      progressToNextLevel
    };
  }

  // Calculate credit distribution across categories
  private calculateCreditDistribution(subjects: Subject[]): NEPComplianceReport['currentCredits'] {
    const distribution = {
      major: 0,
      minor: 0,
      elective: 0,
      interdisciplinary: 0,
      skillEnhancement: 0,
      internship: 0,
      research: 0,
      language: 0,
      valueEducation: 0,
      total: 0
    };

    subjects.forEach(subject => {
      const credits = subject.credits;
      distribution.total += credits;

      switch (subject.type) {
        case 'major':
          distribution.major += credits;
          break;
        case 'minor':
          distribution.minor += credits;
          break;
        case 'elective':
          distribution.elective += credits;
          break;
        case 'interdisciplinary':
          distribution.interdisciplinary += credits;
          break;
      }

      // Check subject name for additional categories
      const subjectName = subject.name.toLowerCase();
      
      if (subjectName.includes('skill') || subjectName.includes('vocational')) {
        distribution.skillEnhancement += credits;
      }
      
      if (subjectName.includes('internship') || subjectName.includes('practicum')) {
        distribution.internship += credits;
      }
      
      if (subjectName.includes('research') || subjectName.includes('dissertation')) {
        distribution.research += credits;
      }
      
      if (subjectName.includes('language') || subjectName.includes('english') || 
          subjectName.includes('hindi') || subjectName.includes('sanskrit')) {
        distribution.language += credits;
      }
      
      if (subjectName.includes('value') || subjectName.includes('ethics') || 
          subjectName.includes('moral') || subjectName.includes('constitution')) {
        distribution.valueEducation += credits;
      }
    });

    return distribution;
  }

  // Check compliance against NEP requirements
  private checkCompliance(
    currentCredits: NEPComplianceReport['currentCredits'],
    requirements: NEPRequirements
  ): NEPComplianceReport['compliance'] {
    return {
      overallCompliant: this.isOverallCompliant(currentCredits, requirements),
      majorCompliant: currentCredits.major >= requirements.majorCredits.min,
      minorCompliant: currentCredits.minor >= requirements.minorCredits.min,
      electiveCompliant: currentCredits.elective >= requirements.electiveCredits.min,
      interdisciplinaryCompliant: currentCredits.interdisciplinary >= requirements.interdisciplinaryCredits.min,
      skillCompliant: currentCredits.skillEnhancement >= requirements.skillEnhancementCredits.min,
      internshipCompliant: requirements.internshipCredits.mandatory ? 
        currentCredits.internship >= requirements.internshipCredits.min : true,
      researchCompliant: currentCredits.research >= requirements.researchCredits.min,
      languageCompliant: currentCredits.language >= requirements.languageRequirements.minCredits,
      valueEducationCompliant: requirements.valueEducationCredits.mandatory ?
        currentCredits.valueEducation >= requirements.valueEducationCredits.min : true
    };
  }

  // Check overall compliance
  private isOverallCompliant(
    currentCredits: NEPComplianceReport['currentCredits'],
    requirements: NEPRequirements
  ): boolean {
    return (
      currentCredits.major >= requirements.majorCredits.min &&
      currentCredits.minor >= requirements.minorCredits.min &&
      currentCredits.elective >= requirements.electiveCredits.min &&
      currentCredits.interdisciplinary >= requirements.interdisciplinaryCredits.min &&
      currentCredits.skillEnhancement >= requirements.skillEnhancementCredits.min &&
      (!requirements.internshipCredits.mandatory || currentCredits.internship >= requirements.internshipCredits.min) &&
      currentCredits.research >= requirements.researchCredits.min &&
      currentCredits.language >= requirements.languageRequirements.minCredits &&
      (!requirements.valueEducationCredits.mandatory || currentCredits.valueEducation >= requirements.valueEducationCredits.min)
    );
  }

  // Generate personalized recommendations
  private generateRecommendations(
    student: Student,
    currentCredits: NEPComplianceReport['currentCredits'],
    requirements: NEPRequirements,
    compliance: NEPComplianceReport['compliance']
  ): string[] {
    const recommendations: string[] = [];

    if (!compliance.majorCompliant) {
      const needed = requirements.majorCredits.min - currentCredits.major;
      recommendations.push(`Add ${needed} more credits in major subjects (${student.major})`);
    }

    if (!compliance.minorCompliant && student.minor) {
      const needed = requirements.minorCredits.min - currentCredits.minor;
      recommendations.push(`Add ${needed} more credits in minor subjects (${student.minor})`);
    }

    if (!compliance.electiveCompliant) {
      const needed = requirements.electiveCredits.min - currentCredits.elective;
      recommendations.push(`Add ${needed} more credits in elective subjects for flexibility`);
    }

    if (!compliance.interdisciplinaryCompliant) {
      const needed = requirements.interdisciplinaryCredits.min - currentCredits.interdisciplinary;
      recommendations.push(`Add ${needed} more credits in interdisciplinary subjects as per NEP 2020`);
    }

    if (!compliance.skillCompliant) {
      const needed = requirements.skillEnhancementCredits.min - currentCredits.skillEnhancement;
      recommendations.push(`Add ${needed} more credits in skill enhancement/vocational subjects`);
    }

    if (!compliance.internshipCompliant && requirements.internshipCredits.mandatory) {
      const needed = requirements.internshipCredits.min - currentCredits.internship;
      recommendations.push(`Complete ${needed} more credits of internship/practical experience`);
    }

    if (!compliance.researchCompliant) {
      const needed = requirements.researchCredits.min - currentCredits.research;
      recommendations.push(`Add ${needed} more credits in research/dissertation work`);
    }

    if (!compliance.languageCompliant) {
      const needed = requirements.languageRequirements.minCredits - currentCredits.language;
      recommendations.push(`Complete ${needed} more language credits (${requirements.languageRequirements.mandatoryLanguages.join(', ')})`);
    }

    if (!compliance.valueEducationCompliant && requirements.valueEducationCredits.mandatory) {
      const needed = requirements.valueEducationCredits.min - currentCredits.valueEducation;
      recommendations.push(`Add ${needed} more credits in value education/ethics courses`);
    }

    // Positive recommendations
    if (compliance.overallCompliant) {
      recommendations.push('🎉 Congratulations! Your course selection is fully NEP 2020 compliant');
    }

    if (currentCredits.interdisciplinary >= requirements.interdisciplinaryCredits.recommended) {
      recommendations.push('✅ Excellent interdisciplinary exposure - exceeds NEP 2020 recommendations');
    }

    return recommendations;
  }

  // Check progression requirements
  private checkProgressionRequirements(
    student: Student,
    currentCredits: NEPComplianceReport['currentCredits'],
    program: NEPProgram
  ): { canProgress: boolean; requirements: string[] } {
    const requirements: string[] = [];
    let canProgress = true;

    // Basic credit requirement for progression
    const expectedCreditsPerYear = program.totalCredits / program.duration;
    const expectedCreditsForSemester = (expectedCreditsPerYear * student.semester) / 2;

    if (currentCredits.total < expectedCreditsForSemester * 0.8) { // 80% threshold
      canProgress = false;
      requirements.push(`Complete at least ${Math.ceil(expectedCreditsForSemester * 0.8)} credits to progress`);
    }

    // Year-specific requirements
    if (student.semester >= 6) { // 3rd year onwards
      if (currentCredits.research < program.requirements.researchCredits.min) {
        requirements.push('Complete research component requirements');
      }

      if (program.requirements.internshipCredits.mandatory && 
          currentCredits.internship < program.requirements.internshipCredits.min) {
        canProgress = false;
        requirements.push('Complete mandatory internship requirements');
      }
    }

    return { canProgress, requirements };
  }

  // Validate multidisciplinary constraints
  validateMultidisciplinaryConstraints(
    student: Student, 
    subjects: Subject[]
  ): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    this.constraints.forEach(constraint => {
      const result = constraint.validator(student, subjects);
      if (!result.valid) {
        violations.push(`${constraint.description}: ${result.message}`);
      }
    });

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // Generate NEP-compliant subject suggestions
  generateSubjectSuggestions(
    student: Student,
    availableSubjects: Subject[]
  ): { category: string; subjects: Subject[]; priority: 'high' | 'medium' | 'low' }[] {
    const suggestions: { category: string; subjects: Subject[]; priority: 'high' | 'medium' | 'low' }[] = [];
    const compliance = this.generateComplianceReport(student, student.enrolledSubjects.map(id => 
      availableSubjects.find(s => s.id === id)!
    ).filter(Boolean));

    // High priority suggestions
    if (!compliance.compliance.majorCompliant) {
      const majorSubjects = availableSubjects.filter(s => 
        s.type === 'major' && s.department === student.major
      );
      suggestions.push({
        category: 'Major Subjects (Required)',
        subjects: majorSubjects,
        priority: 'high'
      });
    }

    if (!compliance.compliance.interdisciplinaryCompliant) {
      const interdisciplinarySubjects = availableSubjects.filter(s => s.type === 'interdisciplinary');
      suggestions.push({
        category: 'Interdisciplinary Subjects (NEP 2020)',
        subjects: interdisciplinarySubjects,
        priority: 'high'
      });
    }

    // Medium priority suggestions
    if (!compliance.compliance.minorCompliant && student.minor) {
      const minorSubjects = availableSubjects.filter(s => 
        s.type === 'minor' && s.department === student.minor
      );
      suggestions.push({
        category: 'Minor Subjects',
        subjects: minorSubjects,
        priority: 'medium'
      });
    }

    if (!compliance.compliance.skillCompliant) {
      const skillSubjects = availableSubjects.filter(s => 
        s.name.toLowerCase().includes('skill') || 
        s.name.toLowerCase().includes('vocational')
      );
      suggestions.push({
        category: 'Skill Enhancement',
        subjects: skillSubjects,
        priority: 'medium'
      });
    }

    // Low priority suggestions
    if (!compliance.compliance.electiveCompliant) {
      const electiveSubjects = availableSubjects.filter(s => s.type === 'elective');
      suggestions.push({
        category: 'Elective Subjects',
        subjects: electiveSubjects,
        priority: 'low'
      });
    }

    return suggestions;
  }

  // Get program information
  getProgram(programId: string): NEPProgram | undefined {
    return this.programs.get(programId.toLowerCase());
  }

  // Get all available programs
  getAllPrograms(): NEPProgram[] {
    return Array.from(this.programs.values());
  }
}