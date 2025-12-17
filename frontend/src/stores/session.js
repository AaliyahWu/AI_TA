import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
  state: () => ({
    role: null, // 'student' | 'teacher' | 'parent' | 'admin'
    user: null
  }),
  actions: {
    setRole(role) {
      this.role = role;
    },
    setUser(user) {
      this.user = user;
    },
    reset() {
      this.role = null;
      this.user = null;
    }
  }
});


