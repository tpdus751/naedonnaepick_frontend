// store/locationStore.js
import { create } from 'zustand';

const useLocationStore = create((set) => ({
  globalLocation: null,
  globalDistrict: '',
  setGlobalLocation: (location) => set({ globalLocation: location }),
  setGlobalDistrict: (district) => set({ globalDistrict: district }),
}));

export default useLocationStore;