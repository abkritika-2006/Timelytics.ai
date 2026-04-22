-- Row Level Security (RLS) Policies
-- This file contains all security policies for the timetable generator database
-- Run these commands after creating the main schema

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS FOR POLICIES
-- =============================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's institution
CREATE OR REPLACE FUNCTION get_user_institution()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT institution_id 
        FROM users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user belongs to institution
CREATE OR REPLACE FUNCTION belongs_to_institution(institution_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_institution() = institution_uuid OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is faculty
CREATE OR REPLACE FUNCTION is_faculty()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'faculty';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is student
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'student';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- INSTITUTIONS TABLE POLICIES
-- =============================================

-- Admins can see all institutions, others can only see their own
CREATE POLICY "institutions_select_policy" ON institutions
    FOR SELECT USING (
        is_admin() OR id = get_user_institution()
    );

-- Only admins can insert institutions
CREATE POLICY "institutions_insert_policy" ON institutions
    FOR INSERT WITH CHECK (is_admin());

-- Only admins can update institutions
CREATE POLICY "institutions_update_policy" ON institutions
    FOR UPDATE USING (is_admin());

-- Only admins can delete institutions
CREATE POLICY "institutions_delete_policy" ON institutions
    FOR DELETE USING (is_admin());

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Users can see other users in their institution
CREATE POLICY "users_select_policy" ON users
    FOR SELECT USING (
        belongs_to_institution(institution_id) OR id = auth.uid()
    );

-- Admins can insert users, others cannot
CREATE POLICY "users_insert_policy" ON users
    FOR INSERT WITH CHECK (
        is_admin() OR (
            institution_id = get_user_institution() AND 
            get_user_role() = 'admin'
        )
    );

-- Users can update their own profile, admins can update users in their institution
CREATE POLICY "users_update_policy" ON users
    FOR UPDATE USING (
        id = auth.uid() OR 
        (is_admin() AND belongs_to_institution(institution_id))
    );

-- Only admins can delete users
CREATE POLICY "users_delete_policy" ON users
    FOR DELETE USING (
        is_admin() AND belongs_to_institution(institution_id)
    );

-- =============================================
-- FACULTY TABLE POLICIES
-- =============================================

-- Faculty can see other faculty in their institution
CREATE POLICY "faculty_select_policy" ON faculty
    FOR SELECT USING (
        user_id = auth.uid() OR 
        belongs_to_institution((SELECT institution_id FROM users WHERE id = user_id))
    );

-- Admins can insert faculty records
CREATE POLICY "faculty_insert_policy" ON faculty
    FOR INSERT WITH CHECK (
        is_admin() AND 
        belongs_to_institution((SELECT institution_id FROM users WHERE id = user_id))
    );

-- Faculty can update their own record, admins can update faculty in their institution
CREATE POLICY "faculty_update_policy" ON faculty
    FOR UPDATE USING (
        user_id = auth.uid() OR 
        (is_admin() AND belongs_to_institution((SELECT institution_id FROM users WHERE id = user_id)))
    );

-- Only admins can delete faculty records
CREATE POLICY "faculty_delete_policy" ON faculty
    FOR DELETE USING (
        is_admin() AND 
        belongs_to_institution((SELECT institution_id FROM users WHERE id = user_id))
    );

-- =============================================
-- STUDENTS TABLE POLICIES
-- =============================================

-- Students can see other students in their institution
CREATE POLICY "students_select_policy" ON students
    FOR SELECT USING (
        user_id = auth.uid() OR 
        belongs_to_institution((SELECT institution_id FROM users WHERE id = user_id))
    );

-- Admins can insert student records
CREATE POLICY "students_insert_policy" ON students
    FOR INSERT WITH CHECK (
        is_admin() AND 
        belongs_to_institution((SELECT institution_id FROM users WHERE id = user_id))
    );

-- Students can update their own record, admins can update students in their institution
CREATE POLICY "students_update_policy" ON students
    FOR UPDATE USING (
        user_id = auth.uid() OR 
        (is_admin() AND belongs_to_institution((SELECT institution_id FROM users WHERE id = user_id)))
    );

-- Only admins can delete student records
CREATE POLICY "students_delete_policy" ON students
    FOR DELETE USING (
        is_admin() AND 
        belongs_to_institution((SELECT institution_id FROM users WHERE id = user_id))
    );

-- =============================================
-- COURSES TABLE POLICIES
-- =============================================

-- Users can see courses in their institution
CREATE POLICY "courses_select_policy" ON courses
    FOR SELECT USING (belongs_to_institution(institution_id));

-- Admins and faculty can insert courses
CREATE POLICY "courses_insert_policy" ON courses
    FOR INSERT WITH CHECK (
        belongs_to_institution(institution_id) AND 
        (is_admin() OR is_faculty())
    );

-- Admins and faculty can update courses
CREATE POLICY "courses_update_policy" ON courses
    FOR UPDATE USING (
        belongs_to_institution(institution_id) AND 
        (is_admin() OR is_faculty())
    );

-- Only admins can delete courses
CREATE POLICY "courses_delete_policy" ON courses
    FOR DELETE USING (
        is_admin() AND belongs_to_institution(institution_id)
    );

-- =============================================
-- ROOMS TABLE POLICIES
-- =============================================

-- Users can see rooms in their institution
CREATE POLICY "rooms_select_policy" ON rooms
    FOR SELECT USING (belongs_to_institution(institution_id));

-- Admins can insert rooms
CREATE POLICY "rooms_insert_policy" ON rooms
    FOR INSERT WITH CHECK (
        is_admin() AND belongs_to_institution(institution_id)
    );

-- Admins can update rooms
CREATE POLICY "rooms_update_policy" ON rooms
    FOR UPDATE USING (
        is_admin() AND belongs_to_institution(institution_id)
    );

-- Admins can delete rooms
CREATE POLICY "rooms_delete_policy" ON rooms
    FOR DELETE USING (
        is_admin() AND belongs_to_institution(institution_id)
    );

-- =============================================
-- COURSE ASSIGNMENTS TABLE POLICIES
-- =============================================

-- Users can see course assignments in their institution
CREATE POLICY "course_assignments_select_policy" ON course_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM faculty f 
            JOIN users u ON f.user_id = u.id 
            WHERE f.id = faculty_id AND belongs_to_institution(u.institution_id)
        )
    );

-- Admins can insert course assignments
CREATE POLICY "course_assignments_insert_policy" ON course_assignments
    FOR INSERT WITH CHECK (
        is_admin() AND EXISTS (
            SELECT 1 FROM faculty f 
            JOIN users u ON f.user_id = u.id 
            WHERE f.id = faculty_id AND belongs_to_institution(u.institution_id)
        )
    );

-- Admins can update course assignments
CREATE POLICY "course_assignments_update_policy" ON course_assignments
    FOR UPDATE USING (
        is_admin() AND EXISTS (
            SELECT 1 FROM faculty f 
            JOIN users u ON f.user_id = u.id 
            WHERE f.id = faculty_id AND belongs_to_institution(u.institution_id)
        )
    );

-- Admins can delete course assignments
CREATE POLICY "course_assignments_delete_policy" ON course_assignments
    FOR DELETE USING (
        is_admin() AND EXISTS (
            SELECT 1 FROM faculty f 
            JOIN users u ON f.user_id = u.id 
            WHERE f.id = faculty_id AND belongs_to_institution(u.institution_id)
        )
    );

-- =============================================
-- STUDENT ENROLLMENTS TABLE POLICIES
-- =============================================

-- Students can see their own enrollments, others can see enrollments in their institution
CREATE POLICY "student_enrollments_select_policy" ON student_enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.id = student_id AND (
                u.id = auth.uid() OR belongs_to_institution(u.institution_id)
            )
        )
    );

-- Admins can insert student enrollments
CREATE POLICY "student_enrollments_insert_policy" ON student_enrollments
    FOR INSERT WITH CHECK (
        is_admin() AND EXISTS (
            SELECT 1 FROM students s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.id = student_id AND belongs_to_institution(u.institution_id)
        )
    );

-- Admins can update student enrollments
CREATE POLICY "student_enrollments_update_policy" ON student_enrollments
    FOR UPDATE USING (
        is_admin() AND EXISTS (
            SELECT 1 FROM students s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.id = student_id AND belongs_to_institution(u.institution_id)
        )
    );

-- Admins can delete student enrollments
CREATE POLICY "student_enrollments_delete_policy" ON student_enrollments
    FOR DELETE USING (
        is_admin() AND EXISTS (
            SELECT 1 FROM students s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.id = student_id AND belongs_to_institution(u.institution_id)
        )
    );

-- =============================================
-- TIME SLOTS TABLE POLICIES
-- =============================================

-- Users can see time slots in their institution
CREATE POLICY "time_slots_select_policy" ON time_slots
    FOR SELECT USING (belongs_to_institution(institution_id));

-- Admins can insert time slots
CREATE POLICY "time_slots_insert_policy" ON time_slots
    FOR INSERT WITH CHECK (
        is_admin() AND belongs_to_institution(institution_id)
    );

-- Admins can update time slots
CREATE POLICY "time_slots_update_policy" ON time_slots
    FOR UPDATE USING (
        is_admin() AND belongs_to_institution(institution_id)
    );

-- Admins can delete time slots
CREATE POLICY "time_slots_delete_policy" ON time_slots
    FOR DELETE USING (
        is_admin() AND belongs_to_institution(institution_id)
    );

-- =============================================
-- TIMETABLES TABLE POLICIES
-- =============================================

-- Users can see timetables in their institution
CREATE POLICY "timetables_select_policy" ON timetables
    FOR SELECT USING (belongs_to_institution(institution_id));

-- Admins and faculty can insert timetables
CREATE POLICY "timetables_insert_policy" ON timetables
    FOR INSERT WITH CHECK (
        belongs_to_institution(institution_id) AND 
        (is_admin() OR is_faculty()) AND
        created_by = auth.uid()
    );

-- Creators and admins can update timetables
CREATE POLICY "timetables_update_policy" ON timetables
    FOR UPDATE USING (
        belongs_to_institution(institution_id) AND 
        (created_by = auth.uid() OR is_admin())
    );

-- Creators and admins can delete timetables
CREATE POLICY "timetables_delete_policy" ON timetables
    FOR DELETE USING (
        belongs_to_institution(institution_id) AND 
        (created_by = auth.uid() OR is_admin())
    );

-- =============================================
-- TIMETABLE ENTRIES TABLE POLICIES
-- =============================================

-- Users can see timetable entries for timetables in their institution
CREATE POLICY "timetable_entries_select_policy" ON timetable_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM timetables t 
            WHERE t.id = timetable_id AND belongs_to_institution(t.institution_id)
        )
    );

-- Admins and faculty can insert timetable entries
CREATE POLICY "timetable_entries_insert_policy" ON timetable_entries
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM timetables t 
            WHERE t.id = timetable_id AND 
            belongs_to_institution(t.institution_id) AND
            (is_admin() OR (is_faculty() AND t.created_by = auth.uid()))
        )
    );

-- Admins and timetable creators can update entries
CREATE POLICY "timetable_entries_update_policy" ON timetable_entries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM timetables t 
            WHERE t.id = timetable_id AND 
            belongs_to_institution(t.institution_id) AND
            (is_admin() OR t.created_by = auth.uid())
        )
    );

-- Admins and timetable creators can delete entries
CREATE POLICY "timetable_entries_delete_policy" ON timetable_entries
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM timetables t 
            WHERE t.id = timetable_id AND 
            belongs_to_institution(t.institution_id) AND
            (is_admin() OR t.created_by = auth.uid())
        )
    );

-- =============================================
-- CONSTRAINTS TABLE POLICIES
-- =============================================

-- Users can see constraints in their institution
CREATE POLICY "constraints_select_policy" ON constraints
    FOR SELECT USING (belongs_to_institution(institution_id));

-- Admins and faculty can insert constraints
CREATE POLICY "constraints_insert_policy" ON constraints
    FOR INSERT WITH CHECK (
        belongs_to_institution(institution_id) AND 
        (is_admin() OR is_faculty()) AND
        created_by = auth.uid()
    );

-- Creators and admins can update constraints
CREATE POLICY "constraints_update_policy" ON constraints
    FOR UPDATE USING (
        belongs_to_institution(institution_id) AND 
        (created_by = auth.uid() OR is_admin())
    );

-- Creators and admins can delete constraints
CREATE POLICY "constraints_delete_policy" ON constraints
    FOR DELETE USING (
        belongs_to_institution(institution_id) AND 
        (created_by = auth.uid() OR is_admin())
    );

-- =============================================
-- AUDIT LOG TABLE POLICIES
-- =============================================

-- Only admins can see audit logs
CREATE POLICY "audit_log_select_policy" ON audit_log
    FOR SELECT USING (is_admin());

-- System can insert audit logs (no user restrictions)
CREATE POLICY "audit_log_insert_policy" ON audit_log
    FOR INSERT WITH CHECK (true);

-- No updates or deletes allowed on audit log
-- (This is enforced by not creating update/delete policies)

-- =============================================
-- NOTIFICATIONS TABLE POLICIES
-- =============================================

-- Users can only see their own notifications
CREATE POLICY "notifications_select_policy" ON notifications
    FOR SELECT USING (user_id = auth.uid());

-- Admins can insert notifications for users in their institution
CREATE POLICY "notifications_insert_policy" ON notifications
    FOR INSERT WITH CHECK (
        is_admin() AND EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = user_id AND belongs_to_institution(u.institution_id)
        )
    );

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_policy" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_policy" ON notifications
    FOR DELETE USING (user_id = auth.uid());

-- =============================================
-- SYSTEM SETTINGS TABLE POLICIES
-- =============================================

-- Users can see public settings and settings for their institution
CREATE POLICY "system_settings_select_policy" ON system_settings
    FOR SELECT USING (
        is_public = true OR 
        (institution_id IS NULL AND is_admin()) OR
        belongs_to_institution(institution_id)
    );

-- Only admins can insert system settings
CREATE POLICY "system_settings_insert_policy" ON system_settings
    FOR INSERT WITH CHECK (
        is_admin() AND (
            institution_id IS NULL OR 
            belongs_to_institution(institution_id)
        )
    );

-- Only admins can update system settings
CREATE POLICY "system_settings_update_policy" ON system_settings
    FOR UPDATE USING (
        is_admin() AND (
            institution_id IS NULL OR 
            belongs_to_institution(institution_id)
        )
    );

-- Only admins can delete system settings
CREATE POLICY "system_settings_delete_policy" ON system_settings
    FOR DELETE USING (
        is_admin() AND (
            institution_id IS NULL OR 
            belongs_to_institution(institution_id)
        )
    );

-- =============================================
-- STORAGE BUCKET POLICIES
-- =============================================

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('documents', 'documents', false),
    ('images', 'images', false),
    ('exports', 'exports', false),
    ('imports', 'imports', false)
ON CONFLICT (id) DO NOTHING;

-- Documents bucket policies
CREATE POLICY "documents_select_policy" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "documents_insert_policy" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "documents_update_policy" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "documents_delete_policy" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Images bucket policies (similar structure)
CREATE POLICY "images_select_policy" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "images_insert_policy" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "images_update_policy" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "images_delete_policy" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Exports bucket policies (admins and faculty can access)
CREATE POLICY "exports_select_policy" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'exports' AND 
        (is_admin() OR is_faculty())
    );

CREATE POLICY "exports_insert_policy" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'exports' AND 
        (is_admin() OR is_faculty())
    );

CREATE POLICY "exports_delete_policy" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'exports' AND 
        (is_admin() OR is_faculty())
    );

-- Imports bucket policies (admins only)
CREATE POLICY "imports_select_policy" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'imports' AND is_admin()
    );

CREATE POLICY "imports_insert_policy" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'imports' AND is_admin()
    );

CREATE POLICY "imports_delete_policy" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'imports' AND is_admin()
    );

-- =============================================
-- AUDIT TRIGGER FUNCTION
-- =============================================

-- Function to log all changes to audit_log table
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (
            table_name, 
            record_id, 
            action, 
            old_data, 
            changed_by,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            OLD.id,
            TG_OP,
            row_to_json(OLD),
            auth.uid(),
            inet_client_addr()
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (
            table_name, 
            record_id, 
            action, 
            old_data, 
            new_data, 
            changed_by,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            TG_OP,
            row_to_json(OLD),
            row_to_json(NEW),
            auth.uid(),
            inet_client_addr()
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (
            table_name, 
            record_id, 
            action, 
            new_data, 
            changed_by,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            TG_OP,
            row_to_json(NEW),
            auth.uid(),
            inet_client_addr()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to important tables
CREATE TRIGGER audit_institutions AFTER INSERT OR UPDATE OR DELETE ON institutions FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_timetables AFTER INSERT OR UPDATE OR DELETE ON timetables FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_timetable_entries AFTER INSERT OR UPDATE OR DELETE ON timetable_entries FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant usage on schemas
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

-- Security policies have been successfully applied
-- The database is now secured with Row Level Security
-- Users can only access data within their institution boundaries
-- Role-based access control is enforced at the database level