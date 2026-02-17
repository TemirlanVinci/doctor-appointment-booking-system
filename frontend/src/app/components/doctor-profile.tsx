import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Star, Briefcase, Clock, MapPin } from 'lucide-react';
import { BookingModal } from './booking-modal';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale'; // Для русского форматирования даты

// ... интерфейсы TimeSlot и Doctor ... (оставь как есть или скопируй ниже)
interface TimeSlot {
  date: string;
  times: string[];
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  price: number;
  imageUrl: string;
  rating: number;
  experience: number;
  availableSlots: TimeSlot[];
}

export function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    fetch(`http://localhost:8080/api/doctors/${id}`)
      .then(res => {
         if(!res.ok) throw new Error("Doctor not found");
         return res.json();
      })
      .then(data => {
        setDoctor(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-10 text-center">Загрузка профиля...</div>;
  if (!doctor) return <div className="p-10 text-center">Врач не найден</div>;

  const handleTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Navbar */}
      <nav className="border-b border-[#e5e7eb] sticky top-0 bg-white z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#1a1a1a] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад к поиску</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <img 
            src={doctor.imageUrl || "https://via.placeholder.com/200"} 
            alt={doctor.name} 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-[#1a1a1a]">{doctor.name}</h1>
              <span className="px-3 py-1 bg-[#EFF6FF] text-[#0066FF] text-sm font-semibold rounded-full">
                {doctor.specialization}
              </span>
            </div>
            
            <p className="text-[#4b5563] text-lg leading-relaxed max-w-2xl mb-6">
              {doctor.bio}
            </p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-[#4b5563]">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-[#1a1a1a]">{doctor.rating}</span>
                <span>Рейтинг</span>
              </div>
              <div className="flex items-center gap-2 text-[#4b5563]">
                <Briefcase className="w-5 h-5 text-[#9ca3af]" />
                <span className="font-semibold text-[#1a1a1a]">{doctor.experience} лет</span>
                <span>Опыт</span>
              </div>
              <div className="flex items-center gap-2 text-[#4b5563]">
                <MapPin className="w-5 h-5 text-[#9ca3af]" />
                <span>Бишкек</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-[#e5e7eb] mb-10" />

        {/* Schedule Section */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0066FF]" />
            Выберите время приема
          </h2>
          
          <div className="grid gap-8">
            {doctor.availableSlots.map((slot, index) => (
              <div key={index} className="bg-[#F9FAFB] rounded-xl p-6 border border-[#e5e7eb]">
                <h3 className="font-semibold text-[#1a1a1a] mb-4 capitalize">
                   {format(parseISO(slot.date), 'EEEE, d MMMM', { locale: ru })}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {slot.times.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(slot.date, time)}
                      className="px-6 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-[#1a1a1a] font-medium hover:border-[#0066FF] hover:text-[#0066FF] hover:shadow-md transition-all active:scale-95"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={doctor}
        date={selectedDate}
        time={selectedTime}
      />
    </div>
  );
}