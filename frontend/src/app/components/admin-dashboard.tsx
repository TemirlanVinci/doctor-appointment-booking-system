import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Calendar, Users, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

// Типы данных
type View = 'appointments' | 'schedule';

interface TimeSlot {
  date: string;
  times: string[];
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availableSlots: TimeSlot[];
}

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string; // ISO string
  time: string; // Форматированное время
  status: string;
}

export function AdminDashboard() {
  const [view, setView] = useState<View>('appointments');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Состояния для данных
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных с сервера
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, appointmentsRes] = await Promise.all([
          fetch('http://localhost:8080/api/doctors'),
          fetch('http://localhost:8080/api/appointments')
        ]);

        const doctorsData = await doctorsRes.json();
        const appointmentsData = await appointmentsRes.json();

        setDoctors(doctorsData);
        
        // Преобразуем данные с бэкенда
        const formattedAppointments = appointmentsData.map((item: any) => ({
          id: item.id,
          patientName: item.patientName,
          doctorName: item.doctorName,
          date: item.startTime,
          time: format(parseISO(item.startTime), 'HH:mm'),
          status: item.status
        }));

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesDoctor = selectedDoctor === 'all' || apt.doctorName.includes(selectedDoctor);
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesDoctor && matchesStatus;
  });

  // Group appointments by doctor for schedule view
  const scheduleByDoctor = doctors.map((doctor) => ({
    doctor,
    appointments: appointments.filter((apt) => apt.doctorName === doctor.name),
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-[#0066ff] bg-blue-50 border-blue-100';
      case 'pending':
        return 'text-[#f59e0b] bg-amber-50 border-amber-100';
      case 'completed':
        return 'text-[#10b981] bg-emerald-50 border-emerald-100';
      case 'cancelled':
        return 'text-[#ef4444] bg-red-50 border-red-100';
      default:
        return 'text-[#1a1a1a] bg-gray-50 border-gray-100';
    }
  };

  // Функция перевода статусов для отображения
  const translateStatus = (status: string) => {
      switch(status) {
          case 'confirmed': return 'Подтверждено';
          case 'pending': return 'Ожидание';
          case 'completed': return 'Завершено';
          case 'cancelled': return 'Отменено';
          default: return status;
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0066ff]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-[#e5e7eb] sticky top-0 bg-white z-10">
        <div className="px-4 py-6 md:px-8 lg:px-12 flex justify-between items-center">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#1a1a1a] transition-colors mb-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Вернуться к сайту</span>
            </Link>
            <h1 className="tracking-tight text-[#1a1a1a] font-bold text-xl">ПАНЕЛЬ АДМИНИСТРАТОРА</h1>
          </div>
          <div className="text-sm text-[#6b7280]">
             {appointments.length} Всего записей
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8 lg:px-12">
        {/* View Toggle */}
        <div className="flex gap-px bg-[#e5e7eb] mb-8 w-fit rounded-lg overflow-hidden border border-[#e5e7eb]">
          <button
            onClick={() => setView('appointments')}
            className={`px-6 py-2 text-sm font-medium transition-colors ${
              view === 'appointments'
                ? 'bg-[#0066ff] text-white'
                : 'bg-white text-[#6b7280] hover:bg-[#f7f8fa]'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Список записей
          </button>
          <button
            onClick={() => setView('schedule')}
            className={`px-6 py-2 text-sm font-medium transition-colors ${
              view === 'schedule'
                ? 'bg-[#0066ff] text-white'
                : 'bg-white text-[#6b7280] hover:bg-[#f7f8fa]'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Расписание врачей
          </button>
        </div>

        {view === 'appointments' && (
          <>
            {/* Filters */}
            <div className="mb-6 flex gap-4 flex-wrap p-4 bg-[#f9fafb] rounded-lg border border-[#e5e7eb]">
              <div>
                <label className="block text-xs font-semibold text-[#6b7280] mb-1 uppercase">Врач</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="bg-white border border-[#e5e7eb] px-3 py-2 text-sm text-[#1a1a1a] focus:border-[#0066ff] outline-none rounded-md min-w-[200px]"
                >
                  <option value="all">Все врачи</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.name}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6b7280] mb-1 uppercase">Статус</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-[#e5e7eb] px-3 py-2 text-sm text-[#1a1a1a] focus:border-[#0066ff] outline-none rounded-md min-w-[150px]"
                >
                  <option value="all">Все статусы</option>
                  <option value="confirmed">Подтверждено</option>
                  <option value="pending">Ожидание</option>
                  <option value="completed">Завершено</option>
                  <option value="cancelled">Отменено</option>
                </select>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="overflow-hidden border border-[#e5e7eb] rounded-lg shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Пациент</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Врач</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Дата и Время</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Статус</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#e5e7eb]">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#f7f8fa] transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#1a1a1a]">{apt.patientName}</div>
                        <div className="text-xs text-[#6b7280] font-mono mt-0.5">ID: {apt.id.slice(0, 8)}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#1a1a1a]">{apt.doctorName}</td>
                      <td className="py-4 px-4 text-sm text-[#1a1a1a]">
                        <div>{format(parseISO(apt.date), 'dd MMM yyyy', { locale: ru })}</div>
                        <div className="text-[#6b7280]">{apt.time}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                          {translateStatus(apt.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-20 bg-white border border-[#e5e7eb] rounded-lg mt-4 border-dashed">
                <div className="text-[#6b7280]">Записей не найдено.</div>
              </div>
            )}
          </>
        )}

        {view === 'schedule' && (
          <div className="space-y-8">
            {scheduleByDoctor.map(({ doctor, appointments }) => (
              <div key={doctor.id} className="border border-[#e5e7eb] rounded-xl bg-white overflow-hidden shadow-sm">
                {/* Doctor Header */}
                <div className="bg-[#f9fafb] px-6 py-4 border-b border-[#e5e7eb] flex justify-between items-center">
                   <div>
                    <h3 className="font-semibold text-[#1a1a1a] text-lg">{doctor.name}</h3>
                    <p className="text-[#6b7280] text-sm">{doctor.specialization}</p>
                   </div>
                   <div className="text-sm bg-white px-3 py-1 rounded-md border border-[#e5e7eb] text-[#6b7280]">
                     {appointments.length} активных записей
                   </div>
                </div>

                <div className="p-6">
                  {/* Section 1: Booked Appointments */}
                  <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0066ff]"></span>
                    Занятые слоты
                  </h4>
                  
                  {appointments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                      {appointments.map((apt) => (
                        <div 
                          key={apt.id} 
                          className="border border-[#e5e7eb] p-4 rounded-lg bg-white hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                          <div className={`absolute top-0 left-0 w-1 h-full ${apt.status === 'confirmed' ? 'bg-[#0066ff]' : 'bg-gray-300'}`}></div>
                          <div className="flex justify-between items-start mb-2 pl-2">
                            <div className="font-medium text-[#1a1a1a]">{format(parseISO(apt.date), 'dd MMM', { locale: ru })}</div>
                            <div className="text-[#0066ff] font-bold">{apt.time}</div>
                          </div>
                          <div className="pl-2">
                            <div className="text-sm text-[#1a1a1a] font-medium">{apt.patientName}</div>
                            <div className="text-xs text-[#6b7280] mt-1 uppercase">{translateStatus(apt.status)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-[#9ca3af] italic mb-8 pl-4 border-l-2 border-[#e5e7eb]">
                      Нет записей на ближайшее время.
                    </div>
                  )}

                  {/* Section 2: Available Slots */}
                  <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 flex items-center gap-2 mt-8 border-t border-[#e5e7eb] pt-8">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                    Свободные окна (График)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctor.availableSlots && doctor.availableSlots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm border border-dashed border-[#e5e7eb] p-3 rounded-lg bg-[#f0fdf4]">
                        <div className="font-medium text-[#15803d] min-w-[100px] capitalize">
                          {format(parseISO(slot.date), 'dd MMM', { locale: ru })}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {slot.times.map((time) => (
                            <span key={time} className="px-2 py-1 bg-white rounded border border-[#bbf7d0] text-[#15803d] text-xs">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}