# 老師介面快速啟動指南

## 🚀 快速開始

### 1. 啟動後端服務
```bash
cd backend
npm install  # 如果還沒安裝依賴
node server.js
```

成功啟動會顯示：
```
Connected to the MySQL database successfully!
Server is running on port 3001
```

### 2. 啟動前端開發服務
```bash
cd frontend
npm install  # 如果還沒安裝依賴
npm run dev
```

會顯示類似的信息：
```
  ➜  Local:   http://localhost:5173/
```

### 3. 訪問應用
打開瀏覽器訪問：`http://localhost:5173`

### 4. 老師登入
- **郵箱：** admin@test.com
- **密碼：** admin123

---

## 📋 功能導覽

登入後，在左側導航菜單可以看到：

### 🏠 班級總覽
查看班級統計數據和學生掌握度

### 📚 班級管理
- **建立新班級** - 點擊「建立新班級」按鈕
  - 填寫班級名稱（例：2年3班）
  - 輸入班級描述（可選）
  - 選擇科目（數學、英文等）

- **查看班級學生** - 在班級卡片點擊「查看學生」
  - 查看班級中所有學生
  - 可以移除學生

- **刪除班級** - 點擊班級卡片右上角的🗑️按鈕

### 📤 匯入題目
- **準備題目檔案** - 支援 .xlsx, .xls, .csv 格式
- **下載模板** - 點擊「下載 Excel 模板」獲取標準格式
- **拖拽或選擇檔案** - 將檔案拖到上傳區或點擊選擇
- **預覽題目** - 確認題目資料正確
- **選擇科目和單元** - 從下拉菜單選擇
- **點擊匯入** - 開始匯入題目

### 💡 教學建議
AI 基於學生成績提供教學建議

---

## 📊 題目匯入 CSV 格式範例

```csv
question_text,answer_text,solution_text,difficulty
計算 2+2,4,2+2=4,easy
計算 3×4,12,3乘以4等於12,medium
解方程 x+5=10,5,x=10-5=5,medium
因式分解 x^2-4,(x-2)(x+2),x^2-4=(x-2)(x+2),hard
```

### 欄位說明：
- **question_text** (必填) - 題目內容
- **answer_text** (必填) - 答案
- **solution_text** (選填) - 解題步驟或說明
- **difficulty** (選填) - easy/medium/hard

---

## 🔧 API 文檔

### 班級管理 API

#### 獲取班級列表
```
GET /api/teacher/classes
Headers: user-id: {teacher_id}
Response: { classes: [...] }
```

#### 建立班級
```
POST /api/teacher/classes
Headers: user-id: {teacher_id}, Content-Type: application/json
Body: { class_name: "2年3班", description: "...", subject: "數學" }
Response: { classId: 1 }
```

#### 刪除班級
```
DELETE /api/teacher/classes/{classId}
Headers: user-id: {teacher_id}
```

#### 獲取班級學生
```
GET /api/teacher/classes/{classId}/students
Headers: user-id: {teacher_id}
Response: { students: [...] }
```

#### 移除班級學生
```
DELETE /api/teacher/classes/{classId}/students/{studentId}
Headers: user-id: {teacher_id}
```

### 題目匯入 API

#### 匯入題目
```
POST /api/teacher/questions/import
Headers: user-id: {teacher_id}, Content-Type: application/json
Body: {
  unit_id: 1,
  difficulty: "medium",
  questions: [
    { question_text: "...", answer_text: "...", solution_text: "...", difficulty: "easy" }
  ]
}
Response: { imported_count: 5 }
```

#### 獲取科目
```
GET /api/subjects
Response: { subjects: [...] }
```

#### 獲取單元
```
GET /api/units
Response: { units: [...] }
```

---

## 🎨 UI 特性

- ✅ **深色和淺色模式支援**
- ✅ **響應式設計** - 支援手機、平板、桌面
- ✅ **拖拽上傳** - 方便上傳題目檔案
- ✅ **實時預覽** - 匯入前查看題目
- ✅ **錯誤提示** - 清晰的錯誤和成功信息
- ✅ **加載狀態** - 操作中會顯示加載動畫

---

## 💾 數據庫表結構

### classes 表
```sql
CREATE TABLE classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_name VARCHAR(255) NOT NULL,
  teacher_id INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
)
```

### class_students 表
```sql
CREATE TABLE class_students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id INT NOT NULL,
  student_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (class_id, student_id)
)
```

### questions 表
```sql
CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  unit_id INT NOT NULL,
  question_text TEXT NOT NULL,
  question_image VARCHAR(255),
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
  answer_text TEXT,
  solution_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
)
```

---

## 🐛 常見問題

### Q: 建立班級時出現「郵箱已存在」
**A:** 這是個 bug，原因是系統在檢查郵箱而不是班級名稱。請聯繫開發人員。

### Q: 匯入題目時看不到科目列表
**A:** 確保後端已經啟動，檢查 `/api/subjects` 端點是否可訪問。

### Q: 班級中看不到學生
**A:** 學生需要在註冊時填寫班級代碼才會自動加入班級。

### Q: 如何修改班級信息？
**A:** 編輯功能預留在代碼中，可以點擊班級卡片上的✏️圖標開啟（暫未實現UI）。

---

## 📞 支援

如遇到問題，請檢查：
1. 後端服務是否正常運行
2. 前端是否成功載入
3. 瀏覽器控制台是否有 JavaScript 錯誤
4. 數據庫連接是否正常
5. 用戶是否有正確的登入狀態

---

## 📝 下次迭代計畫

- [ ] 實現班級編輯功能
- [ ] 添加班級篩選和搜尋
- [ ] 實現題目批量編輯
- [ ] 添加題目預覽圖片
- [ ] 實現題目版本管理
- [ ] 添加班級成績導出功能

---

**最後更新：** 2025-12-23
**版本：** 1.0
