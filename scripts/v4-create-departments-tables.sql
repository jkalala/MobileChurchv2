-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES members(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    meeting_day VARCHAR(20),
    meeting_time TIME,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create department_members junction table
CREATE TABLE IF NOT EXISTS department_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(department_id, member_id)
);

-- Create department_activities table
CREATE TABLE IF NOT EXISTS department_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'meeting' CHECK (type IN ('meeting', 'event', 'training', 'service')),
    attendance_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_departments_type ON departments(type);
CREATE INDEX IF NOT EXISTS idx_departments_status ON departments(status);
CREATE INDEX IF NOT EXISTS idx_departments_leader ON departments(leader_id);
CREATE INDEX IF NOT EXISTS idx_department_members_dept ON department_members(department_id);
CREATE INDEX IF NOT EXISTS idx_department_members_member ON department_members(member_id);
CREATE INDEX IF NOT EXISTS idx_department_activities_dept ON department_activities(department_id);
CREATE INDEX IF NOT EXISTS idx_department_activities_date ON department_activities(date);

-- Add RLS policies
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_activities ENABLE ROW LEVEL SECURITY;

-- Policies for departments
CREATE POLICY "Enable read access for all users" ON departments FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON departments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON departments FOR DELETE USING (true);

-- Policies for department_members
CREATE POLICY "Enable read access for all users" ON department_members FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON department_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON department_members FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON department_members FOR DELETE USING (true);

-- Policies for department_activities
CREATE POLICY "Enable read access for all users" ON department_activities FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON department_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON department_activities FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON department_activities FOR DELETE USING (true);

-- Insert sample departments
INSERT INTO departments (name, type, description, status, meeting_day, meeting_time, location) VALUES
('Ministério de Louvor', 'worship', 'Responsável pela música e adoração nos cultos', 'active', 'wednesday', '19:00', 'Sala de Música'),
('Ministério Feminino', 'women_ministry', 'Ministério dedicado às mulheres da igreja', 'active', 'saturday', '14:00', 'Sala 2'),
('Grupo de Jovens', 'youth_group', 'Ministério voltado para jovens e adolescentes', 'active', 'friday', '18:30', 'Auditório'),
('Escola Dominical', 'sunday_school', 'Ensino bíblico para todas as idades', 'active', 'sunday', '09:00', 'Salas de Aula'),
('Ministério de Intercessão', 'intercession', 'Grupo dedicado à oração e intercessão', 'active', 'tuesday', '06:00', 'Capela'),
('Ministério de Recepção', 'ushers', 'Responsável pela recepção e hospitalidade', 'active', 'sunday', '08:30', 'Entrada Principal'),
('Ministério Infantil', 'children', 'Ministério dedicado às crianças', 'active', 'sunday', '10:00', 'Sala Infantil'),
('Ministério de Mídia', 'media', 'Som, imagem e transmissões', 'active', 'sunday', '08:00', 'Cabine de Som'),
('Segurança', 'security', 'Segurança e ordem durante os cultos', 'active', 'sunday', '08:00', 'Portaria'),
('Missões', 'missions', 'Evangelismo e missões', 'active', 'thursday', '19:30', 'Sala de Reuniões')
ON CONFLICT DO NOTHING;
