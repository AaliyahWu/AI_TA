<template>
  <div class="whiteboard-container">
    <header class="toolbar">
      <button>✏️ 鋼筆</button>
      <button>🧼 橡皮擦</button>
      <button>🔎 重設視圖</button>
      <span class="mode" :class="modeClass">
        模式：{{ modeLabel }}
      </span>
    </header>
    <canvas ref="canvasEl" class="whiteboard"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';

const props = defineProps({
  mode: {
    type: String,
    default: 'normal' // normal | repair
  }
});

const canvasEl = ref(null);

const modeLabel = computed(() =>
  props.mode === 'repair' ? '修正 Repair' : '一般'
);

const modeClass = computed(() =>
  props.mode === 'repair' ? 'repair' : 'normal'
);

onMounted(() => {
  const canvas = canvasEl.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // TODO: 實作實際繪圖與無限畫布邏輯。
  ctx.fillStyle = '#eff6ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});
</script>

<style scoped>
.whiteboard-container {
  background: #020617;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
}

.toolbar button {
  border-radius: 999px;
  border: none;
  padding: 0.35rem 0.9rem;
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  cursor: pointer;
}

.mode {
  margin-left: auto;
  font-size: 0.85rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.mode.normal {
  background: rgba(37, 99, 235, 0.15);
  color: #93c5fd;
}

.mode.repair {
  background: rgba(239, 68, 68, 0.15);
  color: #fecaca;
}

.whiteboard {
  flex: 1;
  display: block;
  width: 100%;
  height: 100%;
  background: #eff6ff;
}
</style>


