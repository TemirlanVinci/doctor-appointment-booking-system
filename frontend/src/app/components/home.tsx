import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, Star, Clock, Briefcase } from 'lucide-react';
import { DoctorProfile } from './doctor-profile';

// Интерфейс врача
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  price: number;
  imageUrl: string;
  rating: number;
  experience: number;
}

// Список специализаций для фильтра (должен совпадать с БД)
const specializations = ['Все', 'Кардиология', 'Терапия', 'Дерматология', 'Неврология'];

export function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('Все');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => console.error("Ошибка:", err));
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpec === 'Все' || doctor.specialization === selectedSpec;

    return matchesSearch && matchesSpec;
  });

  if (loading) return <div className="p-10 text-center">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1a1a1a] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0066FF] rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-xl tracking-tight">MEDBOOK.KG</span>
          </div>
          <div className="text-xs text-[#6B7280] hidden sm:block">
            Медицинская система записи
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight text-[#111827]">
          Найдите своего врача
        </h1>
        <p className="text-center text-[#6B7280] mb-8 text-lg">
          Записывайтесь к лучшим специалистам Бишкека онлайн
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-12 shadow-sm">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#9CA3AF]" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-[#E5E7EB] focus:ring-2 focus:ring-[#0066FF] shadow-sm bg-white text-lg placeholder:text-[#9CA3AF] transition-all"
            placeholder="Поиск по имени или специальности..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Tags */}
        <div className="flex gap-2 overflow-x-auto pb-4 justify-center mb-8 no-scrollbar">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedSpec === spec
                  ? 'bg-[#111827] text-white shadow-md transform scale-105'
                  : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:border-[#9CA3AF]'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Link key={doctor.id} to={`/doctor/${doctor.id}`} className="group">
              <div className="bg-white rounded-2xl p-6 border border-[#F3F4F6] hover:border-[#0066FF]/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doctor.imageUrl || "https://via.placeholder.com/150"}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-[#111827] group-hover:text-[#0066FF] transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-[#0066FF] font-medium text-sm">{doctor.specialization}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-[#4B5563] bg-[#F9FAFB] p-2 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{doctor.rating} Рейтинг</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4B5563] bg-[#F9FAFB] p-2 rounded-lg">
                    <Briefcase className="w-4 h-4 text-[#9CA3AF]" />
                    <span>{doctor.experience} лет</span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                  <div className="text-lg font-bold text-[#111827]">
                    {doctor.price} сом
                    <span className="text-xs font-normal text-[#6B7280] ml-1">/ прием</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0066FF] group-hover:underline">
                    Записаться →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredDoctors.length === 0 && (
           <div className="text-center py-20 text-[#6B7280]">
             Ничего не найдено по вашему запросу.
           </div>
        )}
      </div>
    </div>
  );
}