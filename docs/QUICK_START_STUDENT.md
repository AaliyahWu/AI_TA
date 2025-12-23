# 🚀 學生功能快速開始指南

## 30 分鐘快速實施

### 步驟 1: 驗證數據庫（5 分鐘）

```bash
# 連接 MySQL
mysql -h localhost -P 3305 -u root -p626Angel

# 選擇數據庫
USE ai_ta_db;

# 驗證新表是否存在
SHOW TABLES LIKE '%reason%';
SHOW TABLES LIKE '%similar%';
SHOW TABLES LIKE '%teaching%';

# 應該看到 4 個新表：
# - mistake_reasons
# - similar_questions
# - teaching_sessions
# - teaching_suggestions
```

### 步驟 2: 更新後端服務（5 分鐘）

✅ 已完成 - `server.js` 已添加 8 個新端點

**驗證**:
```bash
cd backend
npm start
# 應看到: "Server is running on port 3001"
```

**測試一個端點**:
```bash
curl http://localhost:3001/api/questions?unit_id=1
```

### 步驟 3: 添加路由配置（5 分鐘）

**編輯**: `/frontend/src/router/index.js`

在 `student` 路由組件下添加：

```javascript
{
  path: 'search',
  name: 'question-search',
  component: QuestionSearch
},
{
  path: 'teaching',
  name: 'teaching-mode',
  component: TeachingMode
},
{
  path: 'mistakes',
  name: 'mistake-clinic',
  component: MistakeClinicEnhanced
}
```

### 步驟 4: 更新導航菜單（5 分鐘）

**編輯**: `/frontend/src/views/student/StudentLayout.vue`

在導航中添加：

```vue
<router-link to="/student/search" class="nav-link">
  🔍 搜題
</router-link>
<router-link to="/student/mistakes" class="nav-link">
  🏥 錯題診所
</router-link>
```

### 步驟 5: 導入新組件（5 分鐘）

**編輯**: `/frontend/src/router/index.js` 頂部

```javascript
import QuestionSearch from '@/views/student/QuestionSearch.vue';
import MistakeClinicEnhanced from '@/views/student/MistakeClinicEnhanced.vue';
```

### 步驟 6: 測試功能（5 分鐘）

```bash
# 1. 啟動前端
cd frontend
npm run dev
# 訪問: http://localhost:5173

# 2. 使用學生賬號登錄

# 3. 進入 "搜題" → 應看到搜題界面
#    - 科目下拉（固定數學）
#    - 單元列表
#    - 題目搜尋
#    - 左側題目列表，右側白板

# 4. 進入 "錯題診所" → 應看到錯題列表
#    - 統計卡片
#    - 錯題列表
#    - 原因診斷按鈕
#    - 改進建議

# 5. 點擊 "診斷錯題原因" → 應看到 6 個原因選項
#    ❌ 看錯題目
#    ❌ 概念不清
#    ❌ 計算錯誤
#    ❌ 粗心大意
#    ❌ 不會做
#    ✏️ 自訂原因
```

---

## 核心功能檢查清單

### ✅ 前端組件

- [x] QuestionSearch.vue - 搜題界面（347 行）
- [x] MistakeClinicEnhanced.vue - 錯題診所（614 行）
- [x] PracticeMode.vue - 練習模式（已存在，可增強）
- [x] TeachingMode.vue - 講題模式（已存在，可增強）
- [x] WhiteboardCanvas.vue - 白板組件（已存在）

### ✅ 後端 API

- [x] GET /api/questions - 搜尋題目
- [x] GET /api/questions/:id/similar - 獲取相似題
- [x] POST /api/student/mistake-reasons - 保存錯題原因
- [x] GET /api/student/mistake-reasons/:questionId - 獲取該題原因記錄
- [x] POST /api/teaching-sessions - 保存教學會話
- [x] GET /api/teaching-sessions/:id - 獲取會話
- [x] GET /api/student/mistakes - 獲取所有錯題
- [x] GET /api/student/stats - 獲取統計信息

### ✅ 數據庫表

- [x] similar_questions - 相似題關聯
- [x] mistake_reasons - 錯題原因記錄
- [x] teaching_sessions - 教學會話（逐字稿、白板、音頻）
- [x] teaching_suggestions - 教師建議

---

## 功能演示

### 場景 1: 搜題並講題

```
1. 學生進入 "搜題" 頁面
2. 選擇 "數學" 科目
3. 從下拉菜單選擇 "一元一次方程式" 單元
4. 點擊 "搜尋題目"
5. 看到題目列表，點擊一題
6. 預覽題目、查看解答、查看相似題
7. 點擊 "開始講題"
8. 進入講題模式，聆聽 EPHRC 講解
9. 在白板上記筆記
10. 點擊 "完成講題"
11. 選擇錯誤原因並保存

結果: 錯題原因已保存到數據庫，可在 "錯題診所" 查看
```

### 場景 2: 查看錯題診所

```
1. 學生進入 "錯題診所"
2. 看到統計卡片（總錯題、本週、最常原因）
3. 看到所有歷史錯題列表
4. 對於已診斷的錯題，看到 "診斷結果" 和 "改進建議"
5. 對於未診斷的錯題，看到 6 個原因選項
6. 選擇一個原因或輸入自訂原因
7. 點擊 "獲取改進建議"
8. 看到針對性的改進建議
9. 點擊 "開始練習" 回到練習模式

結果: 學生可追踪錯題根因並獲得針對性改進指導
```

### 場景 3: 練習相似題

```
1. 學生在做題或講題時
2. 完成後點擊 "AI 相似題" 或 "練習類似題"
3. 看到 3 道相似題目（同單元、同難度）
4. 選擇一道繼續練習
5. 完成後再次選擇錯誤原因

結果: 通過相似題練習加深理解
```

---

## API 快速測試

### 測試工具：Postman 集合

```json
{
  "info": {
    "name": "AI TA - 學生功能 API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "搜尋題目",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/api/questions?unit_id=1&difficulty=easy",
        "header": [
          {"key": "user-id", "value": "1"}
        ]
      }
    },
    {
      "name": "獲取相似題",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/api/questions/1/similar",
        "header": [
          {"key": "user-id", "value": "1"}
        ]
      }
    },
    {
      "name": "保存錯題原因",
      "request": {
        "method": "POST",
        "url": "http://localhost:3001/api/student/mistake-reasons",
        "header": [
          {"key": "user-id", "value": "1"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"question_id\": 1, \"reason_type\": \"calculation\", \"reason_description\": \"計算時出錯\"}"
        }
      }
    },
    {
      "name": "獲取所有錯題",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/api/student/mistakes",
        "header": [
          {"key": "user-id", "value": "1"}
        ]
      }
    },
    {
      "name": "獲取統計信息",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/api/student/stats",
        "header": [
          {"key": "user-id", "value": "1"}
        ]
      }
    }
  ]
}
```

### Curl 快速測試

```bash
# 測試 1: 搜尋題目
curl -X GET "http://localhost:3001/api/questions?unit_id=1" \
  -H "user-id: 1"

# 測試 2: 獲取相似題
curl -X GET "http://localhost:3001/api/questions/1/similar" \
  -H "user-id: 1"

# 測試 3: 保存錯題原因
curl -X POST "http://localhost:3001/api/student/mistake-reasons" \
  -H "user-id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": 1,
    "reason_type": "calculation",
    "reason_description": "計算時出錯"
  }'

# 測試 4: 獲取所有錯題
curl -X GET "http://localhost:3001/api/student/mistakes" \
  -H "user-id: 1"

# 測試 5: 獲取統計
curl -X GET "http://localhost:3001/api/student/stats" \
  -H "user-id: 1"
```

---

## 常見問題快速解決

### Q: 為什麼搜不到題目？

**A**: 
1. 檢查 `units` 表是否有數據
   ```sql
   SELECT * FROM units WHERE subject_id = 1;
   ```

2. 檢查 `questions` 表是否有數據
   ```sql
   SELECT * FROM questions WHERE unit_id = 1;
   ```

3. 如果沒有數據，使用教師界面匯入題目

### Q: 為什麼錯題原因保存失敗？

**A**: 
1. 檢查 `mistake_reasons` 表是否存在
   ```sql
   DESCRIBE mistake_reasons;
   ```

2. 確保 `reason_type` 值是有效的：
   - misread
   - concept
   - calculation
   - careless
   - unable
   - other

3. 檢查瀏覽器控制台是否有錯誤信息

### Q: 白板為什麼無法繪畫？

**A**: 
1. 檢查 `WhiteboardCanvas.vue` 組件是否正確導入
2. 確保 Canvas API 在瀏覽器中支持
3. 檢查 Z-index 是否有衝突

### Q: 相似題為什麼總是相同的？

**A**: 
1. 這是因為目前使用簡單的隨機查詢
2. 可在下一個版本實現 AI 相似度計算
3. 或在 `similar_questions` 表預先設置手工標注的相似題

---

## 性能優化建議

### 前端優化

1. **虛擬滾動**: 對於大量錯題列表
   ```javascript
   // 使用 vue-virtual-scroller
   import { VirtualScroller } from 'vue-virtual-scroller'
   ```

2. **圖片懶加載**: 對於題目圖片
   ```javascript
   <img v-lazy="questionImageUrl">
   ```

3. **緩存 API 結果**: 使用 localStorage
   ```javascript
   const cachedQuestions = localStorage.getItem('questions_' + unitId);
   ```

### 後端優化

1. **添加分頁**: 減少單次查詢數據量
   ```javascript
   // GET /api/questions?unit_id=1&page=1&limit=20
   ```

2. **添加緩存**: 使用 Redis 緩存熱數據
   ```javascript
   const redis = require('redis');
   const client = redis.createClient();
   ```

3. **數據庫索引**: 已添加 INDEX
   ```sql
   -- 已有
   INDEX idx_student (student_id)
   INDEX idx_original (original_question_id)
   ```

---

## 下一步建議

### 立即可做（1-2 小時）

1. [ ] 添加路由配置
2. [ ] 更新導航菜單
3. [ ] 測試所有功能
4. [ ] 修復任何 bug

### 本週計劃（2-3 天）

1. [ ] 增強 PracticeMode 的相似題功能
2. [ ] 增強 TeachingMode 的會話保存
3. [ ] 添加統計圖表
4. [ ] 優化移動端顯示

### 下週計劃（3-5 天）

1. [ ] 實現 AI 相似度算法
2. [ ] 集成 STT（語音轉文字）
3. [ ] 改進建議個性化
4. [ ] 用戶行為分析

---

## 文件位置速查

### 前端

- 搜題頁: `/frontend/src/views/student/QuestionSearch.vue`
- 錯題診所: `/frontend/src/views/student/MistakeClinicEnhanced.vue`
- 路由配置: `/frontend/src/router/index.js`
- 導航菜單: `/frontend/src/views/student/StudentLayout.vue`
- 白板: `/frontend/src/components/teaching/WhiteboardCanvas.vue`

### 後端

- API 實現: `/backend/server.js` (新增 8 個端點)
- 數據庫: `/backend/init-database.sql` (新增 4 個表)

### 文檔

- 完整指南: `/docs/STUDENT_FEATURES_COMPLETE.md`
- 快速開始: `/docs/QUICK_START_STUDENT.md` (本文件)

---

## 成功標誌

當你看到以下結果，表示實施成功：

✅ 搜題頁面正確加載
✅ 能搜尋到題目
✅ 能查看相似題
✅ 能選擇錯題原因
✅ 能在錯題診所查看原因記錄
✅ 改進建議能正確顯示
✅ 所有 API 端點返回 200 狀態碼
✅ 數據庫表結構正確

---

## 支持

遇到問題？檢查：

1. 後端是否運行？ `npm start` in `/backend`
2. 前端是否運行？ `npm run dev` in `/frontend`
3. 數據庫是否連接？ `mysql -h localhost -P 3305 -u root -p`
4. 路由是否配置？ `/frontend/src/router/index.js`
5. 組件是否導入？ `import ... from '...'`
6. API 端點是否存在？ 檢查 `/backend/server.js`
7. 數據表是否存在？ `SHOW TABLES;`

---

**最後更新**: 2025-12-23  
**預計實施時間**: 30 分鐘  
**難度等級**: ⭐⭐☆☆☆ (中等)  
**狀態**: ✅ 準備就緒
