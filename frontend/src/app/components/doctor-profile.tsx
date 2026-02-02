import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { BookingModal } from './booking-modal';
import { Button } from './ui/button';

// Тот же интерфейс, что и на главной
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
  rating: number;
  experience: number;
  price: number;
  bio: string;
  availableSlots: { date: string; times: string[] }[];
}

export function DoctorProfile() {
  const { id } = useParams(); // Берем ID из URL
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Состояния для бронирования
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // ЗАГРУЗКА ДАННЫХ
  useEffect(() => {
    fetch(`http://localhost:8080/api/doctors/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Doctor not found');
        return res.json();
      })
      .then(data => {
        setDoctor(data);
        // Выбираем первую дату по умолчанию
        if (data.availableSlots?.length > 0) {
          setSelectedDate(data.availableSlots[0].date);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  if (!doctor) return <div className="min-h-screen flex items-center justify-center">Doctor not found</div>;

  // Логика отображения слотов
  const activeSlots = doctor.availableSlots.find(s => s.date === selectedDate)?.times || [];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-[#e5e7eb] sticky top-0 bg-white z-10">
        <div className="px-4 py-4 md:px-8 lg:px-12 flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#6b7280]" />
          </Link>
          <h1 className="font-semibold text-lg">Doctor Profile</h1>
        </div>
      </header>

      <main className="px-4 py-8 md:px-8 lg:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info */}
        <div className="lg:col-span-1">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-6">
            <img 
              src={doctor.imageUrl || "https://via.placeholder.com/400"} 
              alt={doctor.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
          <p className="text-[#0066ff] font-medium mb-4">{doctor.specialization}</p>
          
          <div className="flex gap-6 mb-8 text-sm">
            <div>
              <p className="text-[#6b7280] mb-1">Experience</p>
              <p className="font-semibold">{doctor.experience} Years</p>
            </div>
            <div>
              <p className="text-[#6b7280] mb-1">Rating</p>
              <div className="flex items-center gap-1 font-semibold">
                <Star className="w-4 h-4 fill-[#0066ff] text-[#0066ff]" />
                {doctor.rating}
              </div>
            </div>
            <div>
              <p className="text-[#6b7280] mb-1">Price</p>
              <p className="font-semibold">${doctor.price}</p>
            </div>
          </div>

          <div className="prose prose-sm text-[#6b7280]">
            <h3 className="text-[#1a1a1a] font-semibold text-lg mb-2">About</h3>
            <p>{doctor.bio || "No biography available."}</p>
          </div>
        </div>

        {/* Right Column: Booking */}
        <div className="lg:col-span-2">
          <div className="bg-[#f7f8fa] rounded-2xl p-8 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Select Date & Time
            </h2>

            {/* Date Selection */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
              {doctor.availableSlots.map((slot) => (
                <button
                  key={slot.date}
                  onClick={() => setSelectedDate(slot.date)}
                  className={`flex-shrink-0 p-4 rounded-xl border transition-all min-w-[120px] text-left ${
                    selectedDate === slot.date
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-lg'
                      : 'bg-white text-[#1a1a1a] border-[#e5e7eb] hover:border-[#0066ff]'
                  }`}
                >
                  <span className="block text-sm opacity-70 mb-1">
                    {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="block text-lg font-bold">
                    {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </button>
              ))}
            </div>

            {/* Time Selection */}
            <h3 className="text-sm font-semibold text-[#6b7280] mb-4 uppercase tracking-wider">Available Times</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8">
              {activeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-[#0066ff] text-white shadow-md transform scale-105'
                      : 'bg-white text-[#1a1a1a] border border-[#e5e7eb] hover:border-[#0066ff]'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Action Button */}
            <Button 
              className="w-full h-14 text-lg bg-[#1a1a1a] hover:bg-black text-white rounded-xl"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setIsBookingModalOpen(true)}
            >
              {selectedDate && selectedTime 
                ? `Book Appointment for $${doctor.price}` 
                : 'Select Date & Time to Continue'}
            </Button>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {selectedDate && selectedTime && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          doctorName={doctor.name}
          date={selectedDate}
          time={selectedTime}
          price={doctor.price}
          doctorId={doctor.id}
        />
      )}
    </div>
  );
}