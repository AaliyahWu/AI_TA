<template>
  <div class="student-dashboard">
    <header class="dashboard-header">
      <div>
        <h1>學生儀表板</h1>
        <p>快速總覽你的口說表現與專注狀態（目前為假資料 Demo）</p>
      </div>
    </header>

    <div class="dashboard-content" v-if="metrics && metrics.summary">
      <div class="content-wrapper">
      <!-- 口說與專注指標 + 今日學習統計 (並排，寬度等於儀表板標題框) -->
      <div class="kpis-and-stats-wrapper">
        <!-- 核心指標卡片 -->
        <div class="card kpis">
          <h2>口說與專注指標 (FR4.1)</h2>
          <div class="kpi-row">
            <div class="kpi">
              <label>平均語速 WPM</label>
              <strong>{{ metrics.summary.wpm }}</strong>
              <span>字 / 分鐘</span>
              <div class="kpi-trend" v-if="metricsStore.avgWpmThisWeek">
                <small>本週平均: {{ metricsStore.avgWpmThisWeek }} WPM</small>
              </div>
            </div>
            <div class="kpi">
              <label>停頓比例</label>
              <strong>{{ (metrics.summary.pauseRatio * 100).toFixed(0) }}%</strong>
              <span :class="metrics.summary.pauseRatio < 0.25 ? 'good' : 'warning'">
                {{ metrics.summary.pauseRatio < 0.25 ? '✓ 表現良好' : '建議 &lt; 25%' }}
              </span>
            </div>
            <div class="kpi">
              <label>提示依賴度</label>
              <strong>{{ (metrics.summary.hintDependency * 100).toFixed(0) }}%</strong>
              <span :class="metrics.summary.hintDependency < 0.3 ? 'good' : 'warning'">
                {{ metrics.summary.hintDependency < 0.3 ? '✓ 獨立解題' : '可再降低' }}
              </span>
            </div>
            <div class="kpi">
              <label>今日專注時長</label>
              <strong>{{ metrics.summary.focusMinutesToday }} 分</strong>
              <span>來自 WE2 專注追蹤</span>
            </div>
          </div>
        </div>

        <!-- 今日學習統計 -->
        <div class="card stats-card">
          <h2>今日學習統計</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ metrics.summary.totalPracticeToday }}</div>
              <div class="stat-label">練習題數</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ (metrics.summary.correctRateToday * 100).toFixed(0) }}%</div>
              <div class="stat-label">正確率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ metrics.summary.streakDays }} 天</div>
              <div class="stat-label">連續學習</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ metricsStore.totalPracticeTime }} 分</div>
              <div class="stat-label">總學習時長</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid">
      <!-- 本週學習趨勢 -->
      <div class="card trend-card-full">
        <h2>本週學習趨勢</h2>
        <div class="trend-content">
          <div class="trend-item">
            <label>平均語速趨勢</label>
            <div class="trend-bars">
              <div 
                v-for="(wpm, index) in metrics.weeklyStats.avgWpm" 
                :key="index"
                class="trend-bar"
                :style="{ height: `${(wpm / 150) * 100}%` }"
                :title="`週${index + 1}: ${wpm} WPM`"
              ></div>
            </div>
          </div>
          <div class="trend-item">
            <label>平均正確率</label>
            <div class="trend-value">{{ (metricsStore.avgCorrectRate * 100).toFixed(1) }}%</div>
            <div class="trend-description">近{{ metrics.recentSessions.length }}次練習</div>
          </div>
        </div>
      </div>

      <!-- 近期學習紀錄 -->
      <div class="card table-card">
        <h2>近期學習紀錄</h2>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>日期</th>
                <th>單元</th>
                <th>模式</th>
                <th>正確率</th>
                <th>時長</th>
                <th>詳細</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in metrics.recentSessions" :key="s.id">
                <td>{{ formatDate(s.date) }}</td>
                <td>
                  <div class="unit-info">
                    <strong>{{ s.unit }}</strong>
                    <small v-if="s.subject">{{ s.subject }}</small>
                  </div>
                </td>
                <td>
                  <span class="mode-badge" :class="s.mode === '講題模式' ? 'teaching' : 'practice'">
                    {{ s.mode }}
                  </span>
                </td>
                <td>
                  <span class="correct-rate" :class="getCorrectRateClass(s.correctRate)">
                    {{ (s.correctRate * 100).toFixed(0) }}%
                  </span>
                </td>
                <td>{{ s.durationMin }} 分</td>
                <td>
                  <div class="session-details">
                    <span v-if="s.wpm" class="detail-item">WPM: {{ s.wpm }}</span>
                    <span v-if="s.pauseRatio" class="detail-item">
                      停頓: {{ (s.pauseRatio * 100).toFixed(0) }}%
                    </span>
                    <span v-if="s.hintUsed !== undefined" class="detail-item">
                      提示: {{ s.hintUsed }}次
                    </span>
                    <span v-if="s.questionsCount" class="detail-item">
                      題數: {{ s.questionsCount }}
                    </span>
                    <span v-if="s.mistakesCount !== undefined" class="detail-item">
                      錯題: {{ s.mistakesCount }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      </div>
      </div>
    </div>
    <div v-else class="loading">
      <p>載入中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useStudentMetricsStore } from '@/stores/studentMetrics';
import { useSessionStore } from '@/stores/session';

const router = useRouter();
const metricsStore = useStudentMetricsStore();
const sessionStore = useSessionStore();

// 正確的方式：直接解構 ref
const { summary, recentSessions, weeklyStats, avgWpmThisWeek, avgCorrectRate, totalPracticeTime } = storeToRefs(metricsStore);

// 創建 metrics 對象供模板使用
const metrics = computed(() => ({
  summary: summary.value,
  recentSessions: recentSessions.value,
  weeklyStats: weeklyStats.value
}));

const currentUser = ref({
  name: '張小明',
  id: 'student-001',
  grade: '國中二年級',
  class: '2年3班'
});

onMounted(() => {
  // 如果沒有登入，設置假資料
  if (!sessionStore.user) {
    sessionStore.setUser(currentUser.value);
    sessionStore.setRole('student');
  } else {
    currentUser.value = sessionStore.user;
  }
});

const handleLogout = () => {
  sessionStore.reset();
  router.push({ name: 'login' });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return '今天';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天';
  } else {
    return dateString;
  }
};

const getCorrectRateClass = (rate) => {
  if (rate >= 0.8) return 'excellent';
  if (rate >= 0.7) return 'good';
  if (rate >= 0.6) return 'fair';
  return 'poor';
};
</script>

<style scoped>
.student-dashboard {
  padding: 2rem;
  background: #F8FAFC;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  background: #FFFFFF;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 2px solid #BFDBFE;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
}

.dashboard-header h1 {
  margin: 0 0 0.5rem 0;
  color: #1e3a8a;
  font-size: 1.75rem;
}

.dashboard-header p {
  margin: 0;
  color: #3b82f6;
  font-size: 0.95rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: #1e3a8a;
  font-weight: 600;
  font-size: 0.95rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #DC2626;
}

.dashboard-content {
  background: #F8FAFC;
}

.content-wrapper {
  background: #F8FAFC;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.kpis-and-stats-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .kpis-and-stats-wrapper {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #FFFFFF;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 2px solid #BFDBFE;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
}

.card h2 {
  color: #1e3a8a;
  margin: 0 0 0.75rem 0;
  font-size: 1.2rem;
}

.kpis .kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;
}

.kpi {
  background: #EFF6FF;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 2px solid #BFDBFE;
}

.kpi label {
  display: block;
  font-size: 0.85rem;
  color: #3b82f6;
  font-weight: 500;
}

.kpi strong {
  display: block;
  font-size: 1.5rem;
  margin-top: 0.5rem;
  color: #1e3a8a;
  font-weight: 700;
}

.kpi span {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #6B7280;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.table th,
.table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #E5E7EB;
  text-align: left;
}

.table th {
  color: #1e3a8a;
  font-weight: 600;
  background: #F3F4F6;
}

.table td {
  color: #374151;
}

.table tbody tr:hover {
  background: #F9FAFB;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #3b82f6;
}

.kpi-trend {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6B7280;
}

.kpi span.good {
  color: #10B981;
}

.kpi span.warning {
  color: #F59E0B;
}

.stats-card {
  grid-column: span 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 0.75rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #EFF6FF;
  border-radius: 0.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #6B7280;
}

.trend-card-full {
  grid-column: 1 / -1;
}

.trend-card-full .trend-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .trend-card-full .trend-content {
    grid-template-columns: 1fr;
  }
}

.table-card {
  grid-column: 1 / -1;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 0.75rem;
}

.unit-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.unit-info strong {
  color: #1e3a8a;
  font-weight: 600;
}

.unit-info small {
  color: #6B7280;
  font-size: 0.8rem;
}

.mode-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.mode-badge.teaching {
  background: #DBEAFE;
  color: #1e40af;
}

.mode-badge.practice {
  background: #FEF3C7;
  color: #92400e;
}

.correct-rate {
  font-weight: 600;
}

.correct-rate.excellent {
  color: #10B981;
}

.correct-rate.good {
  color: #3b82f6;
}

.correct-rate.fair {
  color: #F59E0B;
}

.correct-rate.poor {
  color: #EF4444;
}

.session-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.detail-item {
  padding: 0.2rem 0.5rem;
  background: #F3F4F6;
  border-radius: 0.25rem;
  color: #6B7280;
}

.trend-card {
  grid-column: span 1;
}

.trend-content {
  margin-top: 0.75rem;
}

.trend-item {
  margin-bottom: 1.5rem;
}

.trend-item:last-child {
  margin-bottom: 0;
}

.trend-item label {
  display: block;
  color: #3b82f6;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 120px;
  padding: 0.5rem 0;
}

.trend-bar {
  flex: 1;
  background: linear-gradient(to top, #2563eb, #3b82f6);
  border-radius: 0.25rem 0.25rem 0 0;
  min-height: 10px;
  transition: opacity 0.2s;
  cursor: pointer;
}

.trend-bar:hover {
  opacity: 0.8;
}

.trend-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 0.25rem;
}

.trend-description {
  color: #6B7280;
  font-size: 0.85rem;
}
</style>


