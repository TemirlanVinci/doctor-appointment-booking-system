CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    bio TEXT,
    price INTEGER NOT NULL, 
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
    -- Дата и время начала приема
    start_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed', 
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Уникальный индекс: Врач не может быть в двух местах одновременно!
    -- Ззащита от коллизий на уровне БД.
    CONSTRAINT unique_doctor_time UNIQUE (doctor_id, start_time)
);


INSERT INTO doctors (name, specialization, bio, price, experience_years, image_url) VALUES 
('Dr. Sarah Chen', 'Cardiology', 'Expert in heart health', 150, 15, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'),
('Dr. Michael Rodriguez', 'Dermatology', 'Skin care specialist', 120, 12, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400');