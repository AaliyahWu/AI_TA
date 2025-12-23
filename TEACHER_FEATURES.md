# 老師介面功能實現文檔

## 概述

已成功實現老師介面的以下核心功能：

### 1. **班級管理功能** (TeacherClassManagement.vue)
### 2. **題目匯入功能** (TeacherImportQuestions.vue)

---

## 功能詳細說明

### 1. 班級管理 (`/teacher/classes`)

#### 功能特性：
- ✅ 建立新班級
- ✅ 查看班級列表
- ✅ 查看班級中的學生
- ✅ 從班級移除學生
- ✅ 刪除班級

#### 使用流程：

**建立班級：**
1. 點擊「建立新班級」按鈕
2. 填寫班級名稱（必填）、班級描述、選擇科目
3. 點擊「建立班級」

**查看班級學生：**
1. 在班級卡片上點擊「查看學生」
2. 彈出模態框顯示班級中的所有學生
3. 可以查看學生的名稱、信箱、加入日期

**移除學生：**
1. 在班級學生列表中點擊「移除」按鈕
2. 確認移除後，學生將被移出班級

#### 後端 API：

| 方法 | 端點 | 功能 |
|------|------|------|
| GET | `/api/teacher/classes` | 獲取老師的所有班級 |
| POST | `/api/teacher/classes` | 建立新班級 |
| DELETE | `/api/teacher/classes/:classId` | 刪除班級 |
| GET | `/api/teacher/classes/:classId/students` | 獲取班級學生列表 |
| DELETE | `/api/teacher/classes/:classId/students/:studentId` | 移除學生 |

#### 數據庫表結構：

```sql
-- 班級表
CREATE TABLE classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_name VARCHAR(255) NOT NULL,
  teacher_id INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- 班級學生關聯表
CREATE TABLE class_students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id INT NOT NULL,
  student_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (class_id, student_id)
)
```

---

### 2. 題目匯入 (`/teacher/import-questions`)

#### 功能特性：
- ✅ 支援 Excel (.xlsx, .xls) 和 CSV 格式匯入
- ✅ 拖拽或點擊選擇檔案
- ✅ 預覽題目資料
- ✅ 選擇科目和單元
- ✅ 批量匯入題目
- ✅ 下載 Excel 模板

#### 使用流程：

**匯入題目：**
1. 進入「匯入題目」頁面
2. 拖拽或點擊選擇題目檔案（支援 .xlsx, .xls, .csv）
3. 系統會自動解析檔案內容
4. 選擇要匯入的科目和單元
5. 可選：調整難度設定
6. 預覽題目資料（前 10 條）
7. 點擊「匯入」按鈕完成匯入

**下載模板：**
1. 點擊「下載 Excel 模板」按鈕
2. 模板包含必填欄位說明

#### 模板格式：

CSV 格式範例：
```
question_text,answer_text,solution_text,difficulty
計算 2+2,4,2+2=4,easy
計算 10×10,100,10×10=100,medium
解方程 x=5,5,x-5=0 解得 x=5,hard
```

**欄位說明：**
| 欄位 | 必填 | 說明 | 範例 |
|------|------|------|------|
| question_text | ✅ | 題目內容 | 計算 2+2 |
| answer_text | ✅ | 答案 | 4 |
| solution_text | ❌ | 解析過程 | 2+2=4 |
| difficulty | ❌ | 難度等級 | easy/medium/hard |

#### 後端 API：

| 方法 | 端點 | 功能 |
|------|------|------|
| GET | `/api/subjects` | 獲取所有科目 |
| GET | `/api/units` | 獲取所有單元 |
| POST | `/api/teacher/questions/import` | 匯入題目 |

#### 請求參數範例：

```json
{
  "unit_id": 1,
  "difficulty": "medium",
  "questions": [
    {
      "question_text": "計算 2+2",
      "answer_text": "4",
      "solution_text": "2+2=4",
      "difficulty": "easy"
    },
    {
      "question_text": "計算 10×10",
      "answer_text": "100",
      "solution_text": "10×10=100",
      "difficulty": "medium"
    }
  ]
}
```

---

## 導航菜單更新

TeacherLayout.vue 已更新，新增了以下導航項：

```vue
🏠 班級總覽          → /teacher
📚 班級管理          → /teacher/classes
📤 匯入題目          → /teacher/import-questions
💡 教學建議          → /teacher/suggestions
```

---

## 路由配置

已在 `router/index.js` 中添加以下路由：

```javascript
{
  path: '/teacher',
  component: TeacherLayout,
  children: [
    { path: '', name: 'teacher-overview', component: TeacherOverview },
    { path: 'classes', name: 'teacher-classes', component: TeacherClassManagement },
    { path: 'import-questions', name: 'teacher-import-questions', component: TeacherImportQuestions },
    // ... 其他路由
  ]
}
```

---

## 系統架構

### 前端元件架構：

```
TeacherLayout (主佈局)
├── TeacherOverview (班級總覽)
├── TeacherClassManagement (班級管理)
│   ├── 班級列表卡片
│   ├── 建立班級模態框
│   └── 班級學生列表模態框
├── TeacherImportQuestions (題目匯入)
│   ├── 檔案上傳區
│   ├── 題目預覽表格
│   └── 科目/單元選擇器
├── TeachingSuggestions (教學建議)
├── TeacherStudentDetail (學生詳情)
└── TeacherProfileEdit (個人資料編輯)
```

### 後端 API 架構：

```
/api/teacher/
├── classes/                    # 班級管理
│   ├── GET/POST
│   ├── DELETE /:classId
│   └── GET/DELETE /:classId/students/:studentId
└── questions/import           # 題目匯入
    └── POST

/api/
├── subjects                    # 科目列表
└── units                       # 單元列表
```

---

## 已實現的功能清單

### 班級管理功能
- [x] 創建班級
- [x] 刪除班級
- [x] 查看班級列表
- [x] 查看班級中的學生
- [x] 從班級移除學生
- [x] 編輯班級（預留接口）
- [x] 班級統計（學生數量、建立日期）

### 題目匯入功能
- [x] 檔案上傳（拖拽和點擊）
- [x] 支援 CSV/Excel 格式
- [x] 題目資料預覽
- [x] 科目和單元選擇
- [x] 難度級別設定
- [x] 批量匯入題目
- [x] 下載匯入模板
- [x] 成功提示

### UI/UX 功能
- [x] 響應式設計（支援手機、平板、桌面）
- [x] 模態框對話框
- [x] 表單驗證
- [x] 錯誤處理和提示
- [x] 加載狀態反饋
- [x] 文件大小驗證
- [x] 成功通知提示

---

## 下一步實現建議

### 短期 (立即可做)：
1. ✅ 已完成類名稱重構測試
2. 實現班級編輯功能
3. 添加班級篩選和搜尋
4. 實現題目批量編輯功能

### 中期 (1-2 週)：
1. 實現班級共享功能
2. 實現學生自動加入班級
3. 添加題目庫管理介面
4. 實現題目分類和標籤

### 長期 (1 個月+)：
1. 實現教學進度追蹤
2. 添加班級公告功能
3. 實現作業分配功能
4. 添加評分系統

---

## 故障排查

### 常見問題：

**問題 1：上傳檔案後看不到預覽**
- 解決：檢查檔案格式是否正確（支援 .xlsx, .xls, .csv）
- 檢查檔案大小是否超過 5MB
- 檢查 CSV 格式是否正確

**問題 2：建立班級失敗**
- 解決：確保填寫了班級名稱（必填）
- 檢查是否已登入且有有效的 user-id

**問題 3：看不到班級或學生列表**
- 解決：檢查數據庫連接是否正常
- 確認 API 端點是否正確（localhost:3001）
- 檢查瀏覽器控制台是否有錯誤信息

---

## 開發者備註

### 文件位置：

**前端文件：**
```
frontend/src/
├── views/teacher/
│   ├── TeacherClassManagement.vue     (新增)
│   ├── TeacherImportQuestions.vue     (新增)
│   └── TeacherLayout.vue             (已修改)
└── router/index.js                    (已修改)
```

**後端文件：**
```
backend/
├── server.js                          (已修改 - 添加 API 端點)
└── db.js                              (無改動)
```

### 環境要求：
- Node.js 14+
- Vue.js 3.5.0+
- MySQL 5.7+
- 後端服務運行在 localhost:3001
- 前端開發服務運行在 localhost:5173

### 測試步驟：

1. **啟動後端服務：**
```bash
cd backend
npm install
node server.js
```

2. **啟動前端開發服務：**
```bash
cd frontend
npm install
npm run dev
```

3. **訪問應用：**
```
http://localhost:5173
```

4. **以老師身份登入並測試：**
   - 導航到班級管理頁面
   - 建立新班級
   - 建立新學生後檢查班級學生列表
   - 測試題目匯入功能

---

## 性能優化建議

1. **分頁加載：** 對於有大量班級或學生的老師，建議實現分頁功能
2. **緩存：** 科目和單元列表可以在客戶端緩存
3. **批量操作：** 支援批量移除學生或刪除題目
4. **異步上傳：** 對於大檔案，實現斷點續傳功能

---

**文檔最後更新：** 2025-12-23
**版本：** 1.0
