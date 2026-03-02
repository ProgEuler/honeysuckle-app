import { create } from 'zustand';

interface UserState {
  hasSoughtProfessionalHelp: boolean | null;
  setHasSoughtProfessionalHelp: (value: boolean) => void;
  // Add other profile fields here as needed
  fullName: string;
  setFullName: (name: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  location: string;
  setLocation: (location: string) => void;
  dateOfBirth: string;
  setDateOfBirth: (dob: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  hasSoughtProfessionalHelp: null,
  setHasSoughtProfessionalHelp: (value) => set({ hasSoughtProfessionalHelp: value }),
  fullName: '',
  setFullName: (name) => set({ fullName: name }),
  gender: '',
  setGender: (gender) => set({ gender: gender }),
  location: '',
  setLocation: (location) => set({ location: location }),
  dateOfBirth: '',
  setDateOfBirth: (dob) => set({ dateOfBirth: dob }),
}));
