import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  tags: null, // ✅ 추가
  setUser: (user) => set({ user }),
  setTags: (tags) => set({ tags }), // ✅ 추가
  logout: () => set({ user: null, tags: null }), // ✅ 함께 초기화
}));

export default useUserStore;
