import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import { mockAppointments, mockDoctors } from '@/app/data/mock-data';
import { format, parseISO } from 'date-fns';

type View = 'appointments' | 'schedule';

export function AdminDashboard() {
  const [view, setView] = useState<View>('appointments');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesDoctor = selectedDoctor === 'all' || apt.doctorName.includes(selectedDoctor);
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesDoctor && matchesStatus;
  });

  // Group appointments by doctor for schedule view
  const scheduleByDoctor = mockDoctors.map((doctor) => ({
    doctor,
    appointments: mockAppointments.filter((apt) => apt.doctorName === doctor.name),
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-[#0066ff]';
      case 'pending':
        return 'text-[#f59e0b]';
      case 'completed':
        return 'text-[#10b981]';
      case 'cancelled':
        return 'text-[#ef4444]';
      default:
        return 'text-[#1a1a1a]';
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-[#e5e7eb] sticky top-0 bg-white z-10">
        <div className="px-4 py-6 md:px-8 lg:px-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#1a1a1a] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to search</span>
          </Link>
          <h1 className="tracking-tight text-[#1a1a1a]">ADMIN DASHBOARD</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8 lg:px-12">
        {/* View Toggle */}
        <div className="flex gap-px bg-[#e5e7eb] mb-8 w-fit rounded-lg overflow-hidden">
          <button
            onClick={() => setView('appointments')}
            className={`px-6 py-3 transition-colors ${
              view === 'appointments'
                ? 'bg-[#0066ff] text-white'
                : 'bg-white text-[#1a1a1a] hover:bg-[#f7f8fa]'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            APPOINTMENTS
          </button>
          <button
            onClick={() => setView('schedule')}
            className={`px-6 py-3 transition-colors ${
              view === 'schedule'
                ? 'bg-[#0066ff] text-white'
                : 'bg-white text-[#1a1a1a] hover:bg-[#f7f8fa]'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            SCHEDULE
          </button>
        </div>

        {view === 'appointments' && (
          <>
            {/* Filters */}
            <div className="mb-8 flex gap-4 flex-wrap">
              <div>
                <label className="block text-sm text-[#6b7280] mb-2">Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="bg-white border border-[#e5e7eb] px-4 py-2 text-[#1a1a1a] focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff] outline-none rounded-lg"
                >
                  <option value="all" className="bg-white">All Doctors</option>
                  {mockDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.name} className="bg-white">
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#6b7280] mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-[#e5e7eb] px-4 py-2 text-[#1a1a1a] focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff] outline-none rounded-lg"
                >
                  <option value="all" className="bg-white">All Status</option>
                  <option value="confirmed" className="bg-white">Confirmed</option>
                  <option value="pending" className="bg-white">Pending</option>
                  <option value="completed" className="bg-white">Completed</option>
                  <option value="cancelled" className="bg-white">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="overflow-x-auto border border-[#e5e7eb] rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f7f8fa]">
                    <th className="text-left py-4 px-4 text-[#6b7280] font-normal">ID</th>
                    <th className="text-left py-4 px-4 text-[#6b7280] font-normal">Patient Name</th>
                    <th className="text-left py-4 px-4 text-[#6b7280] font-normal">Doctor</th>
                    <th className="text-left py-4 px-4 text-[#6b7280] font-normal">Date</th>
                    <th className="text-left py-4 px-4 text-[#6b7280] font-normal">Time</th>
                    <th className="text-left py-4 px-4 text-[#6b7280] font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-[#e5e7eb] hover:bg-[#f7f8fa]">
                      <td className="py-4 px-4 text-[#6b7280]">{apt.id.padStart(3, '0')}</td>
                      <td className="py-4 px-4 text-[#1a1a1a]">{apt.patientName}</td>
                      <td className="py-4 px-4 text-[#1a1a1a]">{apt.doctorName}</td>
                      <td className="py-4 px-4 text-[#1a1a1a]">{format(parseISO(apt.date), 'MMM d, yyyy')}</td>
                      <td className="py-4 px-4 text-[#1a1a1a]">{apt.time}</td>
                      <td className={`py-4 px-4 uppercase text-sm ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-20 text-[#6b7280]">
                <p>No appointments found matching your criteria.</p>
              </div>
            )}
          </>
        )}

        {view === 'schedule' && (
          <div className="space-y-8">
            {scheduleByDoctor.map(({ doctor, appointments }) => (
              <div key={doctor.id} className="border border-[#e5e7eb] p-6 rounded-lg bg-white">
                <div className="mb-6 pb-4 border-b border-[#e5e7eb]">
                  <h3 className="mb-1 text-[#1a1a1a]">{doctor.name}</h3>
                  <p className="text-[#6b7280] text-sm">{doctor.specialization}</p>
                </div>

                {appointments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {appointments.map((apt) => (
                      <div 
                        key={apt.id} 
                        className="border border-[#e5e7eb] p-4 hover:border-[#0066ff] transition-colors rounded-lg bg-[#f7f8fa]"
                      >
                        <div className="text-sm text-[#6b7280] mb-2">
                          {format(parseISO(apt.date), 'MMM d, yyyy')}
                        </div>
                        <div className="mb-2 text-[#1a1a1a]">{apt.time}</div>
                        <div className="text-sm text-[#1a1a1a]">{apt.patientName}</div>
                        <div className={`text-xs uppercase mt-2 ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#6b7280]">
                    <p>No appointments scheduled</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}