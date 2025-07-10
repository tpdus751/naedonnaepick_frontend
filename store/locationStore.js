import { create } from 'zustand';

const useLocationStore = create((set) => ({
  globalLocation: null,              // 위도, 경도 좌표
  globalDistrict: '',                // 예: 성남시 수정구 단대동
  globalDistrictName: '',            // 예: 수정구 또는 단대동 등 간단 명칭만 저장

  setGlobalLocation: (location) => set({ globalLocation: location }),
  setGlobalDistrict: (district) => set({ globalDistrict: district }),
  setGlobalDistrictName: (districtName) => set({ globalDistrictName: districtName }), // ✅ 추가
}));

export default useLocationStore;
