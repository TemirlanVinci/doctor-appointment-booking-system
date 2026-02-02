// Mock data for the application
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  price: number;
  rating: number;
  experience: number;
  imageUrl: string;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  date: string;
  times: string[];
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

export const specializations = [
  'All',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialization: 'Cardiology',
    bio: 'Board-certified cardiologist with 15+ years of experience in interventional cardiology and preventive heart care.',
    price: 150,
    rating: 4.9,
    experience: 15,
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    availableSlots: [
      { date: '2026-02-05', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { date: '2026-02-06', times: ['09:00', '10:00', '13:00', '14:00', '16:00'] },
      { date: '2026-02-07', times: ['10:00', '11:00', '14:00', '15:00', '16:00'] },
      { date: '2026-02-09', times: ['09:00', '11:00', '13:00', '15:00', '16:00'] },
    ],
  },
  {
    id: '2',
    name: 'Dr. Michael Rodriguez',
    specialization: 'Dermatology',
    bio: 'Specialized in medical and cosmetic dermatology, with expertise in treating complex skin conditions.',
    price: 120,
    rating: 4.8,
    experience: 12,
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    availableSlots: [
      { date: '2026-02-05', times: ['08:00', '09:00', '13:00', '14:00', '15:00'] },
      { date: '2026-02-06', times: ['08:00', '10:00', '11:00', '14:00', '16:00'] },
      { date: '2026-02-07', times: ['09:00', '10:00', '13:00', '15:00', '16:00'] },
      { date: '2026-02-08', times: ['08:00', '09:00', '11:00', '14:00', '15:00'] },
    ],
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    specialization: 'Neurology',
    bio: 'Neurologist focusing on epilepsy, stroke management, and neurodegenerative disorders.',
    price: 180,
    rating: 4.9,
    experience: 18,
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    availableSlots: [
      { date: '2026-02-05', times: ['10:00', '11:00', '14:00', '15:00'] },
      { date: '2026-02-06', times: ['09:00', '10:00', '13:00', '15:00'] },
      { date: '2026-02-08', times: ['10:00', '11:00', '14:00', '16:00'] },
      { date: '2026-02-09', times: ['09:00', '10:00', '14:00', '15:00'] },
    ],
  },
  {
    id: '4',
    name: 'Dr. James Kim',
    specialization: 'Orthopedics',
    bio: 'Orthopedic surgeon with specialization in sports medicine and joint replacement procedures.',
    price: 160,
    rating: 4.7,
    experience: 14,
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    availableSlots: [
      { date: '2026-02-05', times: ['08:00', '09:00', '13:00', '15:00'] },
      { date: '2026-02-07', times: ['08:00', '10:00', '11:00', '14:00'] },
      { date: '2026-02-08', times: ['09:00', '10:00', '13:00', '16:00'] },
      { date: '2026-02-09', times: ['08:00', '11:00', '14:00', '15:00'] },
    ],
  },
  {
    id: '5',
    name: 'Dr. Rachel Thompson',
    specialization: 'Pediatrics',
    bio: 'Pediatrician committed to providing comprehensive healthcare for children from infancy through adolescence.',
    price: 110,
    rating: 4.9,
    experience: 10,
    imageUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
    availableSlots: [
      { date: '2026-02-05', times: ['09:00', '10:00', '11:00', '13:00', '14:00'] },
      { date: '2026-02-06', times: ['08:00', '09:00', '10:00', '14:00', '15:00'] },
      { date: '2026-02-07', times: ['09:00', '11:00', '13:00', '14:00', '16:00'] },
      { date: '2026-02-09', times: ['08:00', '09:00', '10:00', '13:00', '15:00'] },
    ],
  },
  {
    id: '6',
    name: 'Dr. David Lee',
    specialization: 'Psychiatry',
    bio: 'Psychiatrist specializing in mood disorders, anxiety treatment, and cognitive behavioral therapy.',
    price: 140,
    rating: 4.8,
    experience: 13,
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    availableSlots: [
      { date: '2026-02-05', times: ['10:00', '11:00', '14:00', '16:00'] },
      { date: '2026-02-06', times: ['09:00', '10:00', '13:00', '15:00', '16:00'] },
      { date: '2026-02-07', times: ['10:00', '11:00', '14:00', '15:00'] },
      { date: '2026-02-08', times: ['09:00', '11:00', '13:00', '14:00', '16:00'] },
    ],
  },
];

export const mockAppointments: Appointment[] = [
  { id: '1', patientName: 'John Smith', doctorName: 'Dr. Sarah Chen', date: '2026-02-05', time: '09:00', status: 'confirmed' },
  { id: '2', patientName: 'Emma Johnson', doctorName: 'Dr. Sarah Chen', date: '2026-02-05', time: '10:00', status: 'confirmed' },
  { id: '3', patientName: 'Michael Brown', doctorName: 'Dr. Emily Watson', date: '2026-02-05', time: '10:00', status: 'pending' },
  { id: '4', patientName: 'Sarah Davis', doctorName: 'Dr. Michael Rodriguez', date: '2026-02-05', time: '08:00', status: 'confirmed' },
  { id: '5', patientName: 'James Wilson', doctorName: 'Dr. James Kim', date: '2026-02-05', time: '08:00', status: 'completed' },
  { id: '6', patientName: 'Lisa Anderson', doctorName: 'Dr. Rachel Thompson', date: '2026-02-05', time: '09:00', status: 'confirmed' },
  { id: '7', patientName: 'Robert Taylor', doctorName: 'Dr. David Lee', date: '2026-02-05', time: '10:00', status: 'confirmed' },
  { id: '8', patientName: 'Jennifer Martinez', doctorName: 'Dr. Sarah Chen', date: '2026-02-06', time: '09:00', status: 'pending' },
  { id: '9', patientName: 'David Garcia', doctorName: 'Dr. Michael Rodriguez', date: '2026-02-06', time: '08:00', status: 'confirmed' },
  { id: '10', patientName: 'Mary Rodriguez', doctorName: 'Dr. Emily Watson', date: '2026-02-06', time: '09:00', status: 'confirmed' },
];
