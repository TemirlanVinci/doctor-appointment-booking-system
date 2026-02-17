import { useState } from 'react';
import { X, Calendar, Clock, User, Phone, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: any;
  date: string;
  time: string;
}

export function BookingModal({ isOpen, onClose, doctor, date, time }: BookingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullDate = `${date.split('T')[0]}T${time}:00Z`;

    try {
      const res = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: doctor.id,
          patient_name: name,
          patient_phone: phone,
          start_time: fullDate
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
            onClose();
            setSuccess(false);
            setName('');
            setPhone('');
        }, 2000);
      } else {
        alert('Ошибка при записи. Возможно время уже занято.');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {success ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">Вы записаны!</h3>
            <p className="text-[#6b7280]">Мы свяжемся с вами для подтверждения.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-[#e5e7eb] flex justify-between items-center bg-[#F9FAFB]">
              <h3 className="font-bold text-lg text-[#1a1a1a]">Подтверждение записи</h3>
              <button onClick={onClose} className="text-[#9ca3af] hover:text-[#1a1a1a] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Info Card */}
              <div className="bg-[#EFF6FF] rounded-lg p-4 mb-6 border border-[#DBEAFE]">
                <div className="font-semibold text-[#1e3a8a] mb-1">{doctor.name}</div>
                <div className="text-sm text-[#1e40af] mb-3">{doctor.specialization}</div>
                <div className="flex items-center gap-4 text-sm text-[#1e3a8a]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{date ? format(parseISO(date), 'dd.MM.yyyy') : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{time}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Ваше Имя</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-5 h-5 text-[#9CA3AF]" />
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all"
                      placeholder="Алмаз Акунов"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Номер телефона</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-5 h-5 text-[#9CA3AF]" />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all"
                      placeholder="0555 123 456"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 bg-white border border-[#e5e7eb] text-[#374151] font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 bg-[#0066FF] text-white font-medium rounded-lg hover:bg-[#0055d4] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Запись...' : 'Записаться'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}