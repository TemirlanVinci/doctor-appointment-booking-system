import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';

// 1. ОПРЕДЕЛЯЕМ ТИП ДАННЫХ ПРЯМО ЗДЕСЬ
// Это то, что мы ждем от Rust-сервера
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
  rating: number;
  experience: number;
  price: number;
}

// 2. СПИСОК СПЕЦИАЛЬНОСТЕЙ
// Мы перенесли его из mock-data, чтобы не зависеть от лишних файлов
const specializations = [
  "All",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry"
];

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // ЗАГРУЗКА ДАННЫХ С RUST
  useEffect(() => {
    fetch('http://localhost:8080/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch doctors:", err);
        setLoading(false);
      });
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = 
      selectedSpecialization === 'All' || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-[#1a1a1a]">Loading system...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-[#e5e7eb] sticky top-0 bg-white z-10">
        <div className="px-4 py-6 md:px-8 lg:px-12">
          <h1 className="tracking-tight mb-1 text-[#1a1a1a] font-bold text-2xl">MEDBOOK</h1>
          <p className="text-[#6b7280] text-sm">System Powered by Rust & React</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* Search Section */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#6b7280] w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors or specializations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-[#e5e7eb] pl-8 pr-0 pb-3 text-[#1a1a1a] placeholder:text-[#6b7280] focus:border-[#0066ff] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="mb-12">
          <div className="flex gap-2 flex-wrap">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-2 border transition-colors rounded-lg text-sm ${
                  selectedSpecialization === spec
                    ? 'bg-[#0066ff] text-white border-[#0066ff]'
                    : 'bg-white text-[#1a1a1a] border-[#e5e7eb] hover:border-[#0066ff]'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Link
              key={doctor.id}
              to={`/doctor/${doctor.id}`}
              className="bg-white border border-[#e5e7eb] p-6 hover:border-[#0066ff] transition-colors group rounded-xl"
            >
              <div className="aspect-square mb-4 bg-[#f7f8fa] overflow-hidden rounded-lg">
                <img 
                  src={doctor.imageUrl || "https://via.placeholder.com/400"} 
                  alt={doctor.name}
                  className="w-full h-full object-cover transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-[#1a1a1a] font-semibold">{doctor.name}</h3>
                <p className="text-[#6b7280] text-sm">{doctor.specialization}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#0066ff] text-[#0066ff]" />
                    <span className="text-[#1a1a1a]">{doctor.rating}</span>
                  </div>
                  <span className="text-[#6b7280]">{doctor.experience}y exp</span>
                </div>

                <div className="pt-2 border-t border-[#e5e7eb] mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-[#1a1a1a] font-medium">${doctor.price}</span>
                    <span className="text-[#6b7280] text-sm"> / session</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}