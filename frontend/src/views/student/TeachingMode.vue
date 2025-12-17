<template>
  <div class="teaching-root">
    <div class="teaching-controls">
      <button class="control-btn" @click="startTeaching">🎯 開始講題</button>
      <button class="control-btn" @click="simulateExplain">💬 模擬：講解階段</button>
      <button class="control-btn" @click="simulateProbe">❓ 模擬：追問階段</button>
      <button class="control-btn" @click="simulateHint">💡 模擬：提示階段</button>
      <button class="control-btn" @click="simulateRepair">🔧 模擬：修正階段</button>
      <button class="control-btn" @click="simulateConsolidate">✅ 模擬：鞏固階段</button>
      <button class="control-btn exit-btn" @click="exitTeaching">← 退出</button>
    </div>
    <div class="canvas-area">
      <div class="phase-indicator">
        <span class="phase-badge" :class="phase">{{ phaseLabels[phase] }}</span>
      </div>
      <WhiteboardCanvas :mode="phase === 'repair' ? 'repair' : 'normal'" />
    </div>
    <StreamingSubtitleBar :status="status" :text="subtitle" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import WhiteboardCanvas from '@/components/teaching/WhiteboardCanvas.vue';
import StreamingSubtitleBar from '@/components/teaching/StreamingSubtitleBar.vue';

const router = useRouter();

// EPHRC 流程狀態
const phase = ref('explain'); // explain | probe | hint | repair | consolidate
const status = ref('listening'); // listening | processing | speaking
const subtitle = ref('');

const phaseLabels = {
  explain: '講解 (Explain)',
  probe: '追問 (Probe)',
  hint: '提示 (Hint)',
  repair: '修正 (Repair)',
  consolidate: '鞏固 (Consolidate)'
};

// 假資料：EPHRC 各階段的話術
const ephrcContent = {
  explain: {
    listening: '請開始講解你的解題思路…',
    processing: 'AI 正在分析你的說明…',
    speaking: '很好！我聽到你說要先移項，然後再除以係數。請繼續說明每一步的計算過程。'
  },
  probe: {
    listening: '請回答：為什麼要先移項？',
    processing: 'AI 正在思考追問…',
    speaking: '你提到要移項，但為什麼是移項而不是直接除以係數？移項的目的是什麼？'
  },
  hint: {
    listening: '需要提示嗎？',
    processing: 'AI 正在生成階梯式提示…',
    speaking: '💡 L1 提示：想想看，等號兩邊同時做什麼運算，可以讓 x 單獨在一邊？'
  },
  repair: {
    listening: '請檢查你的計算過程…',
    processing: 'AI 正在識別邏輯謬誤…',
    speaking: '⚠️ 我發現你在移項時忘記變號了。記得：移項時要變號！例如 +5 移到另一邊會變成 -5。'
  },
  consolidate: {
    listening: '讓我們總結一下…',
    processing: 'AI 正在總結核心觀念…',
    speaking: '✅ 總結：解一元一次方程式的步驟是：1) 移項 2) 合併同類項 3) 除以係數。這裡有兩題延伸題，試試看！'
  }
};

const startTeaching = () => {
  phase.value = 'explain';
  status.value = 'listening';
  subtitle.value = ephrcContent.explain.listening;
};

const simulateExplain = () => {
  phase.value = 'explain';
  status.value = 'listening';
  subtitle.value = ephrcContent.explain.listening;
  setTimeout(() => {
    status.value = 'processing';
    subtitle.value = ephrcContent.explain.processing;
    setTimeout(() => {
      status.value = 'speaking';
      subtitle.value = ephrcContent.explain.speaking;
    }, 1500);
  }, 2000);
};

const simulateProbe = () => {
  phase.value = 'probe';
  status.value = 'listening';
  subtitle.value = ephrcContent.probe.listening;
  setTimeout(() => {
    status.value = 'processing';
    subtitle.value = ephrcContent.probe.processing;
    setTimeout(() => {
      status.value = 'speaking';
      subtitle.value = ephrcContent.probe.speaking;
    }, 1500);
  }, 2000);
};

const simulateHint = () => {
  phase.value = 'hint';
  status.value = 'listening';
  subtitle.value = ephrcContent.hint.listening;
  setTimeout(() => {
    status.value = 'processing';
    subtitle.value = ephrcContent.hint.processing;
    setTimeout(() => {
      status.value = 'speaking';
      subtitle.value = ephrcContent.hint.speaking;
    }, 1500);
  }, 2000);
};

const simulateRepair = () => {
  phase.value = 'repair';
  status.value = 'listening';
  subtitle.value = ephrcContent.repair.listening;
  setTimeout(() => {
    status.value = 'processing';
    subtitle.value = ephrcContent.repair.processing;
    setTimeout(() => {
      status.value = 'speaking';
      subtitle.value = ephrcContent.repair.speaking;
    }, 1500);
  }, 2000);
};

const simulateConsolidate = () => {
  phase.value = 'consolidate';
  status.value = 'listening';
  subtitle.value = ephrcContent.consolidate.listening;
  setTimeout(() => {
    status.value = 'processing';
    subtitle.value = ephrcContent.consolidate.processing;
    setTimeout(() => {
      status.value = 'speaking';
      subtitle.value = ephrcContent.consolidate.speaking;
    }, 1500);
  }, 2000);
};

const exitTeaching = () => {
  router.push({ name: 'student-dashboard' });
};
</script>

<style scoped>
.teaching-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #0b1220;
  display: flex;
  flex-direction: column;
}

.teaching-controls {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.5rem 1rem;
  background: rgba(37, 99, 235, 0.9);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(37, 99, 235, 1);
}

.control-btn.exit-btn {
  background: rgba(239, 68, 68, 0.9);
}

.control-btn.exit-btn:hover {
  background: rgba(239, 68, 68, 1);
}

.canvas-area {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  padding-top: 4rem;
  display: flex;
  flex-direction: column;
}

.phase-indicator {
  margin-bottom: 1rem;
  text-align: center;
}

.phase-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.phase-badge.explain {
  background: rgba(59, 130, 246, 0.2);
  color: #93C5FD;
}

.phase-badge.probe {
  background: rgba(245, 158, 11, 0.2);
  color: #FCD34D;
}

.phase-badge.hint {
  background: rgba(34, 197, 94, 0.2);
  color: #86EFAC;
}

.phase-badge.repair {
  background: rgba(239, 68, 68, 0.2);
  color: #FCA5A5;
}

.phase-badge.consolidate {
  background: rgba(168, 85, 247, 0.2);
  color: #C4B5FD;
}
</style>


