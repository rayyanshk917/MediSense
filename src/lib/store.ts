import { create } from 'zustand';

interface Case {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  symptoms: string[];
  vitals: {
    bp: string;
    hr: number;
    temp: number;
  };
  analysis?: any;
  createdAt: string;
}

interface AppState {
  cases: Case[];
  addCase: (newCase: Case) => void;
  user: { name: string; role: string } | null;
  setUser: (user: { name: string; role: string } | null) => void;
}

export const useStore = create<AppState>((set) => ({
  cases: [
    {
      id: '1',
      patientName: 'John Doe',
      age: 45,
      gender: 'Male',
      symptoms: ['Chest pain', 'Shortness of breath'],
      vitals: { bp: '140/90', hr: 88, temp: 98.6 },
      createdAt: new Date().toISOString(),
      analysis: {
        risk_level: 'High',
        diagnosis: [{ condition: 'Angina Pectoris', confidence: 0.8, reasoning: 'Classic presentation of exertional chest pain.' }]
      }
    }
  ],
  addCase: (newCase) => set((state) => ({ cases: [newCase, ...state.cases] })),
  user: { name: 'Dr. Rayyan', role: 'Chief Medical Officer' },
  setUser: (user) => set({ user }),
}));
