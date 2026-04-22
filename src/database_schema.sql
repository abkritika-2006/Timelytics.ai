-- Timetable Generator Database Schema
-- This file contains all the SQL commands to create the database structure
-- Run these commands in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('admin', 'faculty', 'student');
CREATE TYPE timetable_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE room_type AS ENUM ('classroom', 'laboratory', 'auditorium', 'seminar_hall', 'library');

-- =============================================
-- INSTITUTIONS TABLE
-- =============================================
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'university', 'college', 'school'
    location TEXT NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website VARCHAR(255),
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- USERS TABLE (Base user information)
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FACULTY TABLE (Faculty-specific information)
-- =============================================
CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    specialization TEXT,
    qualification VARCHAR(255),
    experience_years INTEGER DEFAULT 0,
    max_hours_per_week INTEGER DEFAULT 40,
    max_hours_per_day INTEGER DEFAULT 8,
    preferred_time_slots TEXT[], -- Array of preferred time slots
    unavailable_days TEXT[], -- Array of unavailable days
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STUDENTS TABLE (Student-specific information)
-- =============================================
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL, -- 'B.Tech', 'M.Tech', 'MBA', etc.
    branch VARCHAR(100), -- 'Computer Science', 'Mechanical', etc.
    semester INTEGER NOT NULL CHECK (semester > 0 AND semester <= 12),
    section VARCHAR(10) NOT NULL DEFAULT 'A',
    batch_year INTEGER NOT NULL,
    current_year INTEGER NOT NULL DEFAULT 1,
    cgpa DECIMAL(4,2) DEFAULT 0.00,
    credits_completed INTEGER DEFAULT 0,
    is_lateral_entry BOOLEAN DEFAULT false,
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COURSES TABLE
-- =============================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0),
    department VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL CHECK (semester > 0 AND semester <= 12),
    course_type VARCHAR(50) NOT NULL DEFAULT 'theory', -- 'theory', 'practical', 'project'
    duration_hours INTEGER NOT NULL DEFAULT 1, -- Duration of each class in hours
    total_hours INTEGER NOT NULL, -- Total hours per week
    prerequisites TEXT[], -- Array of prerequisite course codes
    description TEXT,
    syllabus TEXT,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(code, institution_id)
);

-- =============================================
-- ROOMS TABLE
-- =============================================
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    type room_type NOT NULL DEFAULT 'classroom',
    building VARCHAR(100) NOT NULL,
    floor INTEGER NOT NULL,
    room_number VARCHAR(20),
    equipment TEXT[] DEFAULT '{}', -- Array of available equipment
    features TEXT[] DEFAULT '{}', -- Array of room features
    is_accessible BOOLEAN DEFAULT true, -- Wheelchair accessible
    has_projector BOOLEAN DEFAULT false,
    has_computer BOOLEAN DEFAULT false,
    has_whiteboard BOOLEAN DEFAULT true,
    has_blackboard BOOLEAN DEFAULT false,
    has_ac BOOLEAN DEFAULT false,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(code, institution_id)
);

-- =============================================
-- COURSE ASSIGNMENTS (Faculty-Course mapping)
-- =============================================
CREATE TABLE course_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL, -- '2024-25'
    semester INTEGER NOT NULL,
    section VARCHAR(10) NOT NULL DEFAULT 'A',
    hours_per_week INTEGER NOT NULL DEFAULT 1,
    is_primary BOOLEAN DEFAULT true, -- Primary faculty for the course
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(faculty_id, course_id, academic_year, semester, section)
);

-- =============================================
-- STUDENT ENROLLMENTS
-- =============================================
CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    semester INTEGER NOT NULL,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_id, academic_year, semester)
);

-- =============================================
-- TIME SLOTS
-- =============================================
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- 'Period 1', 'Morning Slot', etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    is_break BOOLEAN DEFAULT false,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- =============================================
-- TIMETABLES (Main timetable container)
-- =============================================
CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    semester INTEGER NOT NULL CHECK (semester > 0 AND semester <= 12),
    academic_year VARCHAR(20) NOT NULL,
    status timetable_status DEFAULT 'draft',
    version INTEGER DEFAULT 1,
    data JSONB NOT NULL DEFAULT '{}', -- Complete timetable data
    constraints JSONB DEFAULT '{}', -- Timetable generation constraints
    statistics JSONB DEFAULT '{}', -- Generation statistics
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    published_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TIMETABLE ENTRIES (Individual schedule entries)
-- =============================================
CREATE TABLE timetable_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_id UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    section VARCHAR(10) NOT NULL DEFAULT 'A',
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    entry_type VARCHAR(50) DEFAULT 'regular', -- 'regular', 'makeup', 'extra'
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT no_conflicts UNIQUE(timetable_id, day_of_week, start_time, room_id),
    CONSTRAINT no_faculty_conflicts UNIQUE(timetable_id, day_of_week, start_time, faculty_id)
);

-- =============================================
-- CONSTRAINTS (Timetable generation constraints)
-- =============================================
CREATE TABLE constraints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'hard', 'soft', 'preference'
    category VARCHAR(100) NOT NULL, -- 'faculty', 'room', 'course', 'time', 'student'
    description TEXT,
    rule JSONB NOT NULL, -- Constraint rule definition
    weight INTEGER DEFAULT 1, -- Weight for soft constraints
    is_active BOOLEAN DEFAULT true,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AUDIT LOG (Track all changes)
-- =============================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info', 'warning', 'error', 'success'
    category VARCHAR(100), -- 'timetable', 'system', 'announcement'
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SYSTEM SETTINGS
-- =============================================
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    is_public BOOLEAN DEFAULT false,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES for better performance
-- =============================================

-- Users indexes
CREATE INDEX idx_users_institution_id ON users(institution_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Faculty indexes
CREATE INDEX idx_faculty_user_id ON faculty(user_id);
CREATE INDEX idx_faculty_employee_id ON faculty(employee_id);
CREATE INDEX idx_faculty_department ON faculty(department);

-- Students indexes
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_program_semester ON students(program, semester);

-- Courses indexes
CREATE INDEX idx_courses_institution_id ON courses(institution_id);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_department_semester ON courses(department, semester);

-- Rooms indexes
CREATE INDEX idx_rooms_institution_id ON rooms(institution_id);
CREATE INDEX idx_rooms_building_floor ON rooms(building, floor);
CREATE INDEX idx_rooms_type_capacity ON rooms(type, capacity);

-- Course assignments indexes
CREATE INDEX idx_course_assignments_faculty_id ON course_assignments(faculty_id);
CREATE INDEX idx_course_assignments_course_id ON course_assignments(course_id);
CREATE INDEX idx_course_assignments_academic_year ON course_assignments(academic_year, semester);

-- Student enrollments indexes
CREATE INDEX idx_student_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_course_id ON student_enrollments(course_id);

-- Time slots indexes
CREATE INDEX idx_time_slots_institution_id ON time_slots(institution_id);
CREATE INDEX idx_time_slots_day_time ON time_slots(day_of_week, start_time);

-- Timetables indexes
CREATE INDEX idx_timetables_institution_id ON timetables(institution_id);
CREATE INDEX idx_timetables_academic_year ON timetables(academic_year, semester);
CREATE INDEX idx_timetables_status ON timetables(status);

-- Timetable entries indexes
CREATE INDEX idx_timetable_entries_timetable_id ON timetable_entries(timetable_id);
CREATE INDEX idx_timetable_entries_course_id ON timetable_entries(course_id);
CREATE INDEX idx_timetable_entries_faculty_id ON timetable_entries(faculty_id);
CREATE INDEX idx_timetable_entries_room_id ON timetable_entries(room_id);
CREATE INDEX idx_timetable_entries_day_time ON timetable_entries(day_of_week, start_time);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Audit log indexes
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_changed_by ON audit_log(changed_by);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);

-- =============================================
-- TRIGGERS for updated_at timestamps
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_assignments_updated_at BEFORE UPDATE ON course_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_enrollments_updated_at BEFORE UPDATE ON student_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timetables_updated_at BEFORE UPDATE ON timetables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timetable_entries_updated_at BEFORE UPDATE ON timetable_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_constraints_updated_at BEFORE UPDATE ON constraints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample institution
INSERT INTO institutions (name, code, type, location, contact_email) VALUES
('Sample University', 'SU001', 'university', 'Sample City, Sample State', 'admin@sampleuniversity.edu');

-- Insert sample time slots (Monday to Friday, 9 AM to 5 PM)
INSERT INTO time_slots (name, start_time, end_time, duration_minutes, day_of_week, institution_id) 
SELECT 
    'Period ' || period_num,
    (TIME '09:00:00' + (period_num - 1) * INTERVAL '1 hour')::TIME,
    (TIME '10:00:00' + (period_num - 1) * INTERVAL '1 hour')::TIME,
    60,
    day_num,
    (SELECT id FROM institutions WHERE code = 'SU001')
FROM generate_series(1, 8) AS period_num
CROSS JOIN generate_series(1, 5) AS day_num; -- Monday to Friday

-- =============================================
-- COMMENTS for documentation
-- =============================================

COMMENT ON TABLE institutions IS 'Educational institutions using the timetable system';
COMMENT ON TABLE users IS 'Base user information for all system users';
COMMENT ON TABLE faculty IS 'Faculty-specific information and preferences';
COMMENT ON TABLE students IS 'Student-specific information and academic details';
COMMENT ON TABLE courses IS 'Course catalog with all course information';
COMMENT ON TABLE rooms IS 'Room inventory with capacity and equipment details';
COMMENT ON TABLE course_assignments IS 'Faculty-course assignments for each semester';
COMMENT ON TABLE student_enrollments IS 'Student course enrollments';
COMMENT ON TABLE time_slots IS 'Available time slots for scheduling';
COMMENT ON TABLE timetables IS 'Generated timetables with metadata';
COMMENT ON TABLE timetable_entries IS 'Individual schedule entries within timetables';
COMMENT ON TABLE constraints IS 'Scheduling constraints and rules';
COMMENT ON TABLE audit_log IS 'Audit trail for all database changes';
COMMENT ON TABLE notifications IS 'User notifications and alerts';
COMMENT ON TABLE system_settings IS 'System configuration settings';

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

-- This completes the database schema setup
-- Next step: Set up Row Level Security (RLS) policies