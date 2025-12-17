import { defineStore } from 'pinia';

export const useStudentMetricsStore = defineStore('student-metrics', {
  state: () => ({
    summary: {
      wpm: 128,
      pauseRatio: 0.22,
      hintDependency: 0.28,
      focusMinutesToday: 52,
      totalPracticeToday: 8,
      correctRateToday: 0.75,
      streakDays: 5
    },
    recentSessions: [
      {
        id: 1,
        unit: '一元一次方程式',
        subject: '數學',
        mode: '講題模式',
        correctRate: 0.85,
        durationMin: 25,
        date: '2025-12-03',
        wpm: 135,
        pauseRatio: 0.18,
        hintUsed: 2
      },
      {
        id: 2,
        unit: '因式分解',
        subject: '數學',
        mode: '做題模式',
        correctRate: 0.80,
        durationMin: 18,
        date: '2025-12-03',
        questionsCount: 10,
        mistakesCount: 2
      },
      {
        id: 3,
        unit: '一次函數 - 斜率與截距',
        subject: '數學',
        mode: '講題模式',
        correctRate: 0.90,
        durationMin: 22,
        date: '2025-12-02',
        wpm: 142,
        pauseRatio: 0.15,
        hintUsed: 1
      },
      {
        id: 4,
        unit: '連加數列',
        subject: '數學',
        mode: '做題模式',
        correctRate: 0.67,
        durationMin: 15,
        date: '2025-12-02',
        questionsCount: 12,
        mistakesCount: 4
      },
      {
        id: 5,
        unit: '勾股定理',
        subject: '數學',
        mode: '講題模式',
        correctRate: 0.88,
        durationMin: 20,
        date: '2025-12-01',
        wpm: 125,
        pauseRatio: 0.25,
        hintUsed: 3
      },
      {
        id: 6,
        unit: '二次函數',
        subject: '數學',
        mode: '做題模式',
        correctRate: 0.75,
        durationMin: 30,
        date: '2025-12-01',
        questionsCount: 15,
        mistakesCount: 4
      },
      {
        id: 7,
        unit: '一元一次方程式',
        subject: '數學',
        mode: '講題模式',
        correctRate: 0.82,
        durationMin: 19,
        date: '2025-11-30',
        wpm: 118,
        pauseRatio: 0.28,
        hintUsed: 4
      },
      {
        id: 8,
        unit: '因式分解',
        subject: '數學',
        mode: '做題模式',
        correctRate: 0.70,
        durationMin: 16,
        date: '2025-11-30',
        questionsCount: 10,
        mistakesCount: 3
      }
    ],
    weeklyStats: {
      avgWpm: [115, 120, 125, 128, 130, 128, 132],
      avgPauseRatio: [0.30, 0.28, 0.25, 0.24, 0.23, 0.22, 0.22],
      avgHintDependency: [0.40, 0.38, 0.35, 0.32, 0.30, 0.29, 0.28],
      focusMinutes: [35, 42, 48, 45, 50, 46, 52]
    },
    subjectStats: {
      math: {
        totalPractice: 156,
        avgCorrectRate: 0.78,
        masteredUnits: 8,
        strugglingUnits: 2
      }
    }
  }),
  getters: {
    avgWpmThisWeek: (state) => {
      const wpmValues = state.recentSessions
        .filter(s => s.wpm)
        .map(s => s.wpm);
      if (wpmValues.length === 0) return 0;
      return Math.round(wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length);
    },
    avgCorrectRate: (state) => {
      if (state.recentSessions.length === 0) return 0;
      const total = state.recentSessions.reduce((sum, s) => sum + s.correctRate, 0);
      return total / state.recentSessions.length;
    },
    totalPracticeTime: (state) => {
      return state.recentSessions.reduce((sum, s) => sum + s.durationMin, 0);
    }
  }
});


