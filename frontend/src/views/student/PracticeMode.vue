<template>
  <div class="practice-page">
    <header class="page-header">
      <div>
        <h1>做題模式 (Practice)</h1>
        <p>支援智慧題庫練習、拍照搜題與數位白板解題。</p>
      </div>
    </header>
    <div class="layout">
      <div class="left">
        <!-- 智慧題庫選擇 (FR1.1) -->
        <div class="question-bank-section">
          <h3>智慧題庫練習</h3>
          <div class="form-group">
            <label>科目</label>
            <select v-model="selectedSubject" class="select-input">
              <option value="">請選擇科目</option>
              <option value="math">數學</option>
              <option value="chinese">國文</option>
              <option value="english">英文</option>
            </select>
          </div>
          <div class="form-group">
            <label>單元</label>
            <select v-model="selectedUnit" class="select-input" :disabled="!selectedSubject">
              <option value="">請選擇單元</option>
              <option v-for="unit in availableUnits" :key="unit.value" :value="unit.value">
                {{ unit.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>難度</label>
            <select v-model="selectedDifficulty" class="select-input" :disabled="!selectedUnit">
              <option value="">請選擇難度</option>
              <option value="easy">簡單</option>
              <option value="medium">中等</option>
              <option value="hard">困難</option>
            </select>
          </div>
          <button 
            class="start-btn" 
            :disabled="!canStart"
            @click="startPractice"
          >
            🎯 開始練習
          </button>
        </div>

        <!-- 拍照搜題 (FR1.2) -->
        <div class="camera-section">
          <h3>或使用拍照搜題</h3>
          <button class="camera-btn" @click="openCamera">
            📷 拍照搜題 (OCR)
          </button>
        </div>

        <!-- 題目顯示區 -->
        <div class="question" v-if="currentQuestion">
          <div class="question-header">
            <h4>題目 {{ currentQuestion.number }}</h4>
            <span class="question-info" v-if="currentQuestion.source === 'ocr'">📷 OCR 識別</span>
          </div>
          <p class="question-text">{{ currentQuestion.text }}</p>
          <div class="answer-section" v-if="practiceStarted">
            <input 
              type="text" 
              v-model="userAnswer" 
              placeholder="輸入你的答案..."
              class="answer-input"
              @keyup.enter="submitAnswer"
            />
          </div>
          <div class="question-actions">
            <button class="action-btn" @click="submitAnswer" v-if="practiceStarted && userAnswer">
              ✓ 提交答案
            </button>
            <button class="action-btn" @click="addToMistakes">❌ 加入錯題本</button>
            <button class="action-btn secondary" @click="nextQuestion" v-if="practiceStarted">
              下一題
            </button>
          </div>
          <div class="practice-stats" v-if="practiceStarted && questionCount > 0">
            <small>進度：{{ questionCount }}/10 | 正確：{{ correctCount }}</small>
          </div>
        </div>
        <div class="question-placeholder" v-else>
          <p>請選擇題庫或使用拍照搜題開始練習</p>
        </div>
      </div>
      <!-- <div class="right">
        <div class="whiteboard-header">
          <h3>數位白板 (FR1.3)</h3>
          <p>在此進行手寫計算，系統會自動保存</p>
        </div>
        <WhiteboardCanvas />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import WhiteboardCanvas from '@/components/teaching/WhiteboardCanvas.vue';

const router = useRouter();

const selectedSubject = ref('');
const selectedUnit = ref('');
const selectedDifficulty = ref('');
const currentQuestion = ref(null);
const userAnswer = ref('');

const availableUnits = computed(() => {
  if (selectedSubject === 'math') {
    return [
      { value: 'equation', label: '一元一次方程式' },
      { value: 'factorization', label: '因式分解' },
      { value: 'quadratic', label: '二次函數' },
      { value: 'geometry', label: '幾何' }
    ];
  }
  return [];
});

const canStart = computed(() => {
  return selectedSubject && selectedUnit && selectedDifficulty;
});

// 假資料題庫
const questionBank = {
  math: {
    equation: {
      easy: [
        '解方程式：2x + 5 = 13',
        '解方程式：3x - 7 = 8',
        '解方程式：x + 10 = 15'
      ],
      medium: [
        '解方程式：5x + 3 = 2x + 12',
        '解方程式：4(x - 2) = 20',
        '解方程式：2x + 7 = 3x - 5'
      ],
      hard: [
        '解方程式：3(2x + 1) - 4(x - 2) = 15',
        '解方程式：2x/3 + 5 = x - 1',
        '解方程式：5(x + 3) - 2(2x - 1) = 18'
      ]
    },
    factorization: {
      easy: ['因式分解：x² - 4', '因式分解：x² - 9', '因式分解：x² - 16'],
      medium: ['因式分解：x² + 5x + 6', '因式分解：x² - 7x + 12', '因式分解：x² + 8x + 15'],
      hard: ['因式分解：2x² + 7x + 3', '因式分解：3x² - 11x + 6', '因式分解：4x² - 12x + 9']
    },
    quadratic: {
      easy: ['解二次方程式：x² = 16', '解二次方程式：x² = 25', '解二次方程式：x² = 36'],
      medium: ['解二次方程式：x² - 5x + 6 = 0', '解二次方程式：x² - 8x + 15 = 0', '解二次方程式：x² + 6x + 8 = 0'],
      hard: ['解二次方程式：2x² - 7x + 3 = 0', '解二次方程式：3x² - 10x + 3 = 0', '解二次方程式：x² - 6x + 1 = 0']
    },
    geometry: {
      easy: ['計算三角形面積：底=5cm，高=8cm', '計算正方形面積：邊長=6cm', '計算長方形周長：長=10cm，寬=5cm'],
      medium: ['計算圓形面積：半徑=7cm', '計算梯形面積：上底=4cm，下底=8cm，高=6cm', '計算平行四邊形面積：底=9cm，高=5cm'],
      hard: ['計算圓柱體體積：半徑=5cm，高=10cm', '計算圓錐體體積：半徑=6cm，高=8cm', '計算球體體積：半徑=7cm']
    }
  }
};

const questionCount = ref(0);
const correctCount = ref(0);
const practiceStarted = ref(false);

const startPractice = () => {
  practiceStarted.value = true;
  questionCount.value = 0;
  correctCount.value = 0;
  loadNextQuestion();
};

const loadNextQuestion = () => {
  const units = questionBank[selectedSubject.value];
  if (!units || !units[selectedUnit.value]) {
    alert('此單元暫無題目');
    return;
  }
  
  const questions = units[selectedUnit.value][selectedDifficulty.value];
  if (!questions || questions.length === 0) {
    alert('此難度暫無題目');
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  currentQuestion.value = {
    id: Date.now(),
    text: questions[randomIndex],
    subject: selectedSubject.value,
    unit: selectedUnit.value,
    difficulty: selectedDifficulty.value,
    number: questionCount.value + 1
  };
  questionCount.value++;
};

const openCamera = () => {
  // 模擬拍照搜題
  const mockOCRResult = '解方程式：3x + 7 = 22';
  currentQuestion.value = {
    id: Date.now(),
    text: mockOCRResult,
    subject: 'math',
    unit: 'equation',
    difficulty: 'medium',
    source: 'ocr',
    number: questionCount.value + 1
  };
  questionCount.value++;
  practiceStarted.value = true;
  alert('📷 OCR 識別成功！題目已載入');
};

const addToMistakes = () => {
  if (!currentQuestion.value) return;
  
  // 模擬加入錯題本
  alert(`✅ 已將題目加入錯題本\n題目：${currentQuestion.value.text}`);
  // 實際應該調用 API 或更新 store
  router.push({ name: 'student-mistakes' });
};

const submitAnswer = () => {
  // 模擬提交答案
  const isCorrect = Math.random() > 0.3; // 70% 正確率
  if (isCorrect) {
    correctCount.value++;
    alert('✅ 答對了！');
  } else {
    alert('❌ 答錯了，再想想看！');
  }
  nextQuestion();
};

const nextQuestion = () => {
  if (questionCount.value >= 10) {
    const accuracy = (correctCount.value / questionCount.value * 100).toFixed(0);
    alert(`練習完成！\n總題數：${questionCount.value}\n正確數：${correctCount.value}\n正確率：${accuracy}%`);
    practiceStarted.value = false;
    currentQuestion.value = null;
    return;
  }
  loadNextQuestion();
};
</script>

<style scoped>
.practice-page {
  padding: 2rem;
  color: #1e3a8a;
  background: #F8FAFC;
  min-height: 100vh;
}

.page-header {
  background: #FFFFFF;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 2px solid #BFDBFE;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
  margin-bottom: 1.5rem;
}

.page-header h1 {
  color: #1e3a8a;
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
}

.page-header p {
  color: #3b82f6;
  margin: 0;
  font-size: 0.95rem;
}

.layout {
  display: grid;
  grid-template-columns: minmax(300px, 400px) 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-bank-section,
.camera-section {
  background: #FFFFFF;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 2px solid #BFDBFE;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
}

.question-bank-section h3,
.camera-section h3 {
  margin: 0 0 1rem 0;
  color: #1e3a8a;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #3b82f6;
  font-weight: 500;
  font-size: 0.9rem;
}

.select-input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 2px solid #BFDBFE;
  border-radius: 0.5rem;
  background: #FFFFFF;
  color: #1e3a8a;
  font-size: 0.95rem;
  cursor: pointer;
}

.select-input:disabled {
  background: #F3F4F6;
  color: #9CA3AF;
  cursor: not-allowed;
}

.select-input:focus {
  outline: none;
  border-color: #2563eb;
}

.start-btn,
.camera-btn {
  width: 100%;
  border-radius: 0.5rem;
  border: none;
  padding: 0.75rem 1rem;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
}

.start-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.start-btn:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
}

.camera-btn {
  background: #3b82f6;
}

.camera-btn:hover {
  background: #2563eb;
}

.question {
  background: #FFFFFF;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 2px solid #BFDBFE;
  min-height: 200px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
}

.question h4 {
  margin: 0 0 0.75rem 0;
  color: #1e3a8a;
}

.question p {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.question-placeholder {
  background: #EFF6FF;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 2px dashed #BFDBFE;
  text-align: center;
  color: #3b82f6;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.action-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.action-btn {
  background: #2563eb;
  color: white;
}

.action-btn:hover {
  background: #1d4ed8;
}

.action-btn.secondary {
  background: #EFF6FF;
  color: #2563eb;
  border: 2px solid #BFDBFE;
}

.action-btn.secondary:hover {
  background: #DBEAFE;
}

.right {
  display: flex;
  flex-direction: column;
}

.whiteboard-header {
  margin-bottom: 1rem;
}

.whiteboard-header h3 {
  color: #1e3a8a;
  margin: 0 0 0.25rem 0;
}

.whiteboard-header p {
  color: #3b82f6;
  margin: 0;
  font-size: 0.9rem;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.question-info {
  font-size: 0.75rem;
  color: #3b82f6;
  background: #EFF6FF;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.question-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #1e3a8a;
  margin-bottom: 1rem;
}

.answer-section {
  margin: 1rem 0;
}

.answer-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #BFDBFE;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #1e3a8a;
}

.answer-input:focus {
  outline: none;
  border-color: #2563eb;
}

.practice-stats {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E5E7EB;
  text-align: center;
  color: #6B7280;
  font-size: 0.85rem;
}
</style>


