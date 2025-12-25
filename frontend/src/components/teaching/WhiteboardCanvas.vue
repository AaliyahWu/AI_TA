<template>
  <div class="whiteboard-container">
    <header class="toolbar">
      <button @click="setTool('pen')" :class="{ active: currentTool === 'pen' }">✏️ 鋼筆</button>
      <button @click="setTool('eraser')" :class="{ active: currentTool === 'eraser' }">🧼 橡皮擦</button>
      <button @click="setTool('undoEraser')" :class="{ active: currentTool === 'undoEraser' }">↶ 恢復擦拭</button>
      <button @click="resetView">🗑️ 清空畫布</button>      <button @click="resetViewport">🔎 重設視圖</button>
      <button @click="saveCanvas">💾 保存</button>
      <button @click="loadCanvas">📁 加載</button>
      <input type="file" ref="fileInput" @change="handleFileLoad" accept=".json" style="display: none;">
      <span class="mode" :class="modeClass">
        模式：{{ modeLabel }}
      </span>
    </header>
    <canvas ref="canvasEl" class="whiteboard"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue';
import 'fabric-with-erasing/dist/fabric.js';

const props = defineProps({
  mode: {
    type: String,
    default: 'normal' // normal | repair
  }
});

const canvasEl = ref(null);
const fileInput = ref(null);
let canvas = null;
const currentTool = ref('pen');

const modeLabel = computed(() =>
  props.mode === 'repair' ? '修正 Repair' : '一般'
);

const modeClass = computed(() =>
  props.mode === 'repair' ? 'repair' : 'normal'
);

const setTool = (tool) => {
  currentTool.value = tool;
  if (canvas) {
    if (tool === 'pen') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = '#000000';
    } else if (tool === 'eraser') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
      canvas.freeDrawingBrush.width = 10;
    } else if (tool === 'undoEraser') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
      canvas.freeDrawingBrush.width = 10;
      canvas.freeDrawingBrush.inverted = true; // 恢復被擦拭的地方
    }
  }
};

const resetView = () => {
  if (canvas) {
    // 清空畫布內容
    canvas.clear();
    // 重設視圖變換
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    // 重新設置背景色
    canvas.setBackgroundColor('#eff6ff', () => {
      canvas.renderAll();
    });
  }
};

const resetViewport = () => {
  if (canvas) {
    // 只重設視圖變換，不清空內容
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.renderAll();
  }
};

const saveCanvas = () => {
  if (canvas) {
    const json = canvas.toJSON();
    const dataStr = JSON.stringify(json, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `whiteboard-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
};

const loadCanvas = () => {
  fileInput.value.click();
};

const handleFileLoad = (event) => {
  const file = event.target.files[0];
  if (file && canvas) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      canvas.loadFromJSON(json, () => {
        canvas.renderAll();
      });
    };
    reader.readAsText(file);
  }
};

onMounted(() => {
  const canvasElement = canvasEl.value;
  if (!canvasElement) return;

  // 初始化 Fabric.js Canvas
  canvas = new fabric.Canvas(canvasElement, {
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
    backgroundColor: '#eff6ff'
  });

  // 啟用自由繪圖模式
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.width = 2;
  canvas.freeDrawingBrush.color = '#000000';

  // 實現無限畫布：添加滾輪縮放
  canvas.on('mouse:wheel', (opt) => {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });

  // 添加拖拽平移功能
  let isDragging = false;
  let lastPosX, lastPosY;

  canvas.on('mouse:down', (opt) => {
    if (opt.e.altKey) { // Alt + 拖拽進行平移
      isDragging = true;
      lastPosX = opt.e.clientX;
      lastPosY = opt.e.clientY;
    }
    // 橡皮擦功能現在通過 EraserBrush 實現，不需要額外的點擊處理
  });

  canvas.on('mouse:move', (opt) => {
    if (isDragging) {
      const e = opt.e;
      const vpt = canvas.viewportTransform;
      vpt[4] += e.clientX - lastPosX;
      vpt[5] += e.clientY - lastPosY;
      canvas.requestRenderAll();
      lastPosX = e.clientX;
      lastPosY = e.clientY;
    }
  });

  canvas.on('mouse:up', () => {
    isDragging = false;
  });

  // 處理視窗大小變化
  const resizeCanvas = () => {
    canvas.setDimensions({
      width: canvasElement.clientWidth,
      height: canvasElement.clientHeight
    });
  };

  window.addEventListener('resize', resizeCanvas);
  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas);
  });
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
  transition: all 0.2s;
}

.toolbar button:hover {
  background: rgba(30, 41, 59, 0.9);
}

.toolbar button.active {
  background: rgba(37, 99, 235, 0.8);
  color: #ffffff;
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


