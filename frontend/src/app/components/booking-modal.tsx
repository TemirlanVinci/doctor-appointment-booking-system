import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  date: string;
  time: string;
  price: number;
  doctorId: string;
}

export function BookingModal({
  isOpen,
  onClose,
  doctorName,
  date,
  time,
  price,
  doctorId,
}: BookingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const dateTimeString = `${date}T${time}:00Z`;

    try {
      const response = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: doctorId,
          patient_name: name,
          patient_phone: phone,
          start_time: dateTimeString,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to book');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setName('');
        setPhone('');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError('Booking failed. That slot might be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#f7f8fa] px-6 py-4 flex justify-between items-center border-b border-[#e5e7eb]">
          <h3 className="font-semibold text-lg text-[#1a1a1a]">Confirm Booking</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-[#1a1a1a] mb-2">Booking Confirmed!</h4>
              <p className="text-[#6b7280]">We have sent the details to your phone.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Summary */}
              <div className="bg-[#f7f8fa] p-4 rounded-xl space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">Doctor</span>
                  <span className="font-medium text-[#1a1a1a]">{doctorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">Date & Time</span>
                  <span className="font-medium text-[#1a1a1a]">
                    {new Date(date).toLocaleDateString()} at {time}
                  </span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-sm">
                  <span className="text-[#6b7280]">Total Fee</span>
                  <span className="font-bold text-[#0066ff]">${price}</span>
                </div>
              </div>

              {/* Inputs (HTML instead of components) */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                <input 
                  id="name" 
                  placeholder="Enter your full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone Number</label>
                <input 
                  id="phone" 
                  placeholder="+1 (555) 000-0000" 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#1a1a1a] text-white hover:bg-black h-10 px-4 py-2 w-full mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  'Confirm & Pay'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}