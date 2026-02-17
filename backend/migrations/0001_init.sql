-- Таблица врачей
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    bio TEXT,
    price INTEGER NOT NULL, -- цена в сомах
    image_url TEXT,
    rating FLOAT4 DEFAULT 5.0,
    experience_years INTEGER DEFAULT 0
);

-- Таблица записей
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed', 
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_doctor_time UNIQUE (doctor_id, start_time)
);

-- Добавляем врачей
INSERT INTO doctors (name, specialization, bio, price, experience_years, image_url) VALUES 
('Др. Айгуль Сариева', 'Кардиология', 'Ведущий кардиолог с опытом работы в Национальном Госпитале. Специализируется на диагностике сердечных заболеваний.', 1500, 15, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'),
('Др. Бакыт Алиев', 'Терапия', 'Опытный терапевт. Внимательный подход к каждому пациенту, точная диагностика и эффективное лечение.', 1000, 12, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'),
('Др. Чынара Эсенгулова', 'Дерматология', 'Специалист по здоровью кожи. Лечение акне, аллергических реакций и эстетическая косметология.', 1200, 8, 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400'),
('Др. Марат Осмонов', 'Неврология', 'Эксперт в лечении головных болей, мигрени и заболеваний нервной системы. Кандидат медицинских наук.', 1800, 20, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400');