# 老師介面 API 完整文檔

## 📚 API 概述

老師介面包含 **8 個 API 端點**，分為三個功能模塊：

1. **班級管理 API** (5 個端點) - 創建、讀取、更新、刪除班級和班級成員
2. **科目與單元 API** (2 個端點) - 獲取題庫的科目和單元信息
3. **題目匯入 API** (1 個端點) - 批量導入題目

---

## 🔐 認證

所有 API 端點都需要以下認證方式：

```
Header: user-id: <teacher_id>
```

示例：
```bash
curl -H "user-id: 1" http://localhost:3001/api/teacher/classes
```

**認證失敗時的響應：**
```json
{
  "error": "未授權：缺少用戶 ID",
  "status": 401
}
```

---

## 📋 班級管理 API

### 1. 獲取老師的所有班級

```
GET /api/teacher/classes
```

**認證：** 必需（user-id header）

**參數：** 無

**響應示例（成功）：**

```json
{
  "classes": [
    {
      "id": 1,
      "class_name": "2年3班",
      "teacher_id": 1,
      "description": "這是一個數學班級",
      "created_at": "2025-12-23T10:30:00Z",
      "updated_at": "2025-12-23T10:30:00Z",
      "studentCount": 15
    },
    {
      "id": 2,
      "class_name": "3年1班",
      "teacher_id": 1,
      "description": "英文班級",
      "created_at": "2025-12-23T11:00:00Z",
      "updated_at": "2025-12-23T11:00:00Z",
      "studentCount": 20
    }
  ]
}
```

**可能的錯誤：**

| 狀態碼 | 錯誤信息 | 原因 |
|------|---------|------|
| 401 | "未授權：缺少用戶 ID" | 缺少 user-id header |
| 500 | "獲取班級列表失敗：..." | 數據庫查詢錯誤 |

**cURL 示例：**
```bash
curl -H "user-id: 1" http://localhost:3001/api/teacher/classes
```

---

### 2. 創建新班級

```
POST /api/teacher/classes
```

**認證：** 必需（user-id header）

**請求體：**

```json
{
  "class_name": "2年3班",
  "description": "這是一個數學班級",
  "subject": "數學"
}
```

**參數說明：**

| 參數 | 類型 | 必需 | 說明 |
|-----|------|------|------|
| class_name | string | ✅ | 班級名稱（例如：2年3班） |
| description | string | ❌ | 班級描述 |
| subject | string | ❌ | 科目名稱（例如：數學、英文） |

**響應示例（成功）：**

```json
{
  "message": "班級創建成功",
  "classId": 3,
  "class": {
    "id": 3,
    "class_name": "2年3班",
    "teacher_id": 1,
    "description": "這是一個數學班級",
    "created_at": "2025-12-23T12:00:00Z",
    "updated_at": "2025-12-23T12:00:00Z"
  }
}
```

**可能的錯誤：**

| 狀態碼 | 錯誤信息 | 原因 |
|------|---------|------|
| 400 | "班級名稱是必需的" | 沒有提供 class_name |
| 401 | "未授權：缺少用戶 ID" | 缺少 user-id header |
| 500 | "創建班級失敗：..." | 數據庫插入錯誤 |

**cURL 示例：**
```bash
curl -X POST \
  -H "user-id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "class_name": "2年3班",
    "description": "這是一個數學班級",
    "subject": "數學"
  }' \
  http://localhost:3001/api/teacher/classes
```

**驗證：**
```sql
SELECT * FROM classes WHERE class_name='2年3班';
```

---

### 3. 刪除班級

```
DELETE /api/teacher/classes/:classId
```

**認證：** 必需（user-id header）

**參數：**

| 參數 | 位置 | 類型 | 說明 |
|-----|------|------|------|
| classId | URL路徑 | integer | 班級 ID |

**響應示例（成功）：**

```json
{
  "message": "班級刪除成功"
}
```

**可能的錯誤：**

| 狀態碼 | 錯誤信息 | 原因 |
|------|---------|------|
| 400 | "班級 ID 是必需的" | 沒有提供 classId |
| 401 | "未授權：缺少用戶 ID" | 缺少 user-id header |
| 403 | "您沒有權限刪除此班級" | 班級不屬於該老師 |
| 404 | "班級不存在" | 班級 ID 不存在 |
| 500 | "刪除班級失敗：..." | 數據庫刪除錯誤 |

**cURL 示例：**
```bash
curl -X DELETE \
  -H "user-id: 1" \
  http://localhost:3001/api/teacher/classes/3
```

---

### 4. 獲取班級學生

```
GET /api/teacher/classes/:classId/students
```

**認證：** 必需（user-id header）

**參數：**

| 參數 | 位置 | 類型 | 說明 |
|-----|------|------|------|
| classId | URL路徑 | integer | 班級 ID |

**響應示例（成功）：**

```json
{
  "classId": 1,
  "className": "2年3班",
  "students": [
    {
      "id": 5,
      "email": "student1@test.com",
      "full_name": "王小明",
      "role": "student",
      "joined_at": "2025-12-23T10:35:00Z"
    },
    {
      "id": 6,
      "email": "student2@test.com",
      "full_name": "李美美",
      "role": "student",
      "joined_at": "2025-12-23T10:40:00Z"
    }
  ]
}
```

**可能的錯誤：**

| 狀態碼 | 錯誤信息 | 原因 |
|------|---------|------|
| 400 | "班級 ID 是必需的" | 沒有提供 classId |
| 401 | "未授權：缺少用戶 ID" | 缺少 user-id header |
| 403 | "您沒有權限查看此班級" | 班級不屬於該老師 |
| 404 | "班級不存在" | 班級 ID 不存在 |
| 500 | "獲取班級學生失敗：..." | 數據庫查詢錯誤 |

**cURL 示例：**
```bash
curl -H "user-id: 1" \
  http://localhost:3001/api/teacher/classes/1/students
```

---

### 5. 從班級移除學生

```
DELETE /api/teacher/classes/:classId/students/:studentId
```

**認證：** 必需（user-id header）

**參數：**

| 參數 | 位置 | 類型 | 說明 |
|-----|------|------|------|
| classId | URL路徑 | integer | 班級 ID |
| studentId | URL路徑 | integer | 學生 ID |

**響應示例（成功）：**

```json
{
  "message": "學生已從班級移除"
}
```

**可能的錯誤：**

| 狀態碼 | 錯誤信息 | 原因 |
|------|---------|------|
| 400 | "班級 ID 和學生 ID 是必需的" | 缺少參數 |
| 401 | "未授權：缺少用戶 ID" | 缺少 user-id header |
| 403 | "您沒有權限移除此班級的學生" | 班級不屬於該老師 |
| 404 | "班級或學生不存在" | 班級/學生 ID 不存在 |
| 500 | "移除學生失敗：..." | 數據庫刪除錯誤 |

**cURL 示例：**
```bash
curl -X DELETE \
  -H "user-id: 1" \
  http://localhost:3001/api/teacher/classes/1/students/5
```

---

## 📚 科目與單元 API

### 6. 獲取所有科目

```
GET /api/subjects
```

**認證：** 不需要

**參數：** 無

**響應示例（成功）：**

```json
{
  "subjects": [
    {
      "id": 1,
      "subject_name": "數學",
      "description": "基礎數學課程"
    },
    {
      "id": 2,
      "subject_name": "英文",
      "description": "英語語言學習"
    },
    {
      "id": 3,
      "subject_name": "科學",
      "description": "物理化學生物"
    }
  ]
}
```

**cURL 示例：**
```bash
curl http://localhost:3001/api/subjects
```

---

### 7. 獲取所有單元

```
GET /api/units
```

**認證：** 不需要

**參數：** 無

**響應示例（成功）：**

```json
{
  "units": [
    {
      "id": 1,
      "unit_name": "一元一次方程式",
      "subject_id": 1,
      "subject_name": "數學",
      "description": "學習解一元一次方程式"
    },
    {
      "id": 2,
      "unit_name": "三角函數",
      "subject_id": 1,
      "subject_name": "數學",
      "description": "學習三角函數基礎"
    },
    {
      "id": 3,
      "unit_name": "英文語法",
      "subject_id": 2,
      "subject_name": "英文",
      "description": "英文語法綜合學習"
    }
  ]
}
```

**cURL 示例：**
```bash
curl http://localhost:3001/api/units
```

---

## 📤 題目匯入 API

### 8. 批量匯入題目

```
POST /api/teacher/questions/import
```

**認證：** 必需（user-id header）

**請求體：**

```json
{
  "unit_id": 1,
  "difficulty": "medium",
  "questions": [
    {
      "question_text": "計算 2+2",
      "answer_text": "4",
      "solution_text": "2+2=4"
    },
    {
      "question_text": "計算 3×5",
      "answer_text": "15",
      "solution_text": "3乘以5等於15"
    }
  ]
}
```

**參數說明：**

| 參數 | 類型 | 必需 | 說明 |
|-----|------|------|------|
| unit_id | integer | ✅ | 單元 ID（來自 GET /api/units） |
| difficulty | string | ✅ | 難度級別：easy, medium, hard |
| questions | array | ✅ | 題目數組 |
| questions[].question_text | string | ✅ | 題目文本 |
| questions[].answer_text | string | ✅ | 答案 |
| questions[].solution_text | string | ✅ | 解析 |

**響應示例（成功）：**

```json
{
  "message": "題目匯入成功",
  "imported_count": 2
}
```

**可能的錯誤：**

| 狀態碼 | 錯誤信息 | 原因 |
|------|---------|------|
| 400 | "unit_id, difficulty, 和 questions 是必需的" | 缺少必需參數 |
| 400 | "questions 必須是一個陣列" | questions 格式錯誤 |
| 400 | "單元 ID 不存在" | unit_id 在數據庫中不存在 |
| 401 | "未授權：缺少用戶 ID" | 缺少 user-id header |
| 500 | "匯入題目失敗：..." | 數據庫插入錯誤 |

**cURL 示例：**
```bash
curl -X POST \
  -H "user-id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "unit_id": 1,
    "difficulty": "medium",
    "questions": [
      {
        "question_text": "計算 2+2",
        "answer_text": "4",
        "solution_text": "2+2=4"
      },
      {
        "question_text": "計算 3×5",
        "answer_text": "15",
        "solution_text": "3乘以5等於15"
      }
    ]
  }' \
  http://localhost:3001/api/teacher/questions/import
```

**驗證：**
```sql
SELECT * FROM questions WHERE unit_id=1 ORDER BY created_at DESC LIMIT 2;
```

---

## 🧪 API 集成測試

### 測試場景 1：完整班級工作流

```bash
#!/bin/bash

# 1. 獲取所有班級
echo "1. 獲取班級列表..."
curl -H "user-id: 1" http://localhost:3001/api/teacher/classes

# 2. 創建新班級
echo -e "\n2. 創建班級..."
CLASS_RESPONSE=$(curl -s -X POST \
  -H "user-id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "class_name": "測試班",
    "description": "API 測試班級"
  }' \
  http://localhost:3001/api/teacher/classes)

CLASS_ID=$(echo $CLASS_RESPONSE | grep -o '"classId":[0-9]*' | grep -o '[0-9]*')
echo "新班級 ID: $CLASS_ID"

# 3. 查看班級學生
echo -e "\n3. 查看班級學生..."
curl -H "user-id: 1" http://localhost:3001/api/teacher/classes/$CLASS_ID/students

# 4. 刪除班級
echo -e "\n4. 刪除班級..."
curl -X DELETE \
  -H "user-id: 1" \
  http://localhost:3001/api/teacher/classes/$CLASS_ID
```

### 測試場景 2：題目匯入工作流

```bash
#!/bin/bash

# 1. 獲取科目
echo "1. 獲取科目..."
curl http://localhost:3001/api/subjects

# 2. 獲取單元
echo -e "\n2. 獲取單元..."
curl http://localhost:3001/api/units

# 3. 匯入題目
echo -e "\n3. 匯入題目..."
curl -X POST \
  -H "user-id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "unit_id": 1,
    "difficulty": "easy",
    "questions": [
      {
        "question_text": "測試題目 1",
        "answer_text": "答案 1",
        "solution_text": "解析 1"
      }
    ]
  }' \
  http://localhost:3001/api/teacher/questions/import
```

---

## 🔍 故障排除

### 問題 1：404 Not Found

**症狀：** 調用 API 返回 404

**可能原因：**
- 後端服務未運行
- API 端點拼寫錯誤
- 版本不匹配

**解決方案：**
```bash
# 檢查後端是否運行
curl http://localhost:3001/api/subjects

# 檢查所有端點
curl http://localhost:3001/api/teacher/classes
```

---

### 問題 2：401 Unauthorized

**症狀：** 返回「未授權：缺少用戶 ID」

**可能原因：**
- 沒有提供 user-id header
- user-id 為空

**解決方案：**
```bash
# ❌ 錯誤
curl http://localhost:3001/api/teacher/classes

# ✅ 正確
curl -H "user-id: 1" http://localhost:3001/api/teacher/classes
```

---

### 問題 3：403 Forbidden

**症狀：** 返回「您沒有權限...」

**可能原因：**
- 試圖訪問其他老師的班級
- 班級不屬於該用戶

**解決方案：**
```bash
# 使用正確的老師 ID
curl -H "user-id: <correct_teacher_id>" \
  http://localhost:3001/api/teacher/classes/1
```

---

### 問題 4：500 Internal Server Error

**症狀：** 返回 500 錯誤

**可能原因：**
- 數據庫連接失敗
- SQL 語句錯誤
- 數據庫不存在

**解決方案：**
```bash
# 檢查數據庫
mysql -u root -p626Angel -h localhost -P 3305 ai_ta_db

# 檢查表
SHOW TABLES;
DESCRIBE classes;
```

---

## 📊 API 性能指標

| 操作 | 預期時間 | 最大值 |
|-----|---------|--------|
| GET /classes | < 100ms | 500ms |
| POST /classes | < 200ms | 1000ms |
| DELETE /classes/:id | < 200ms | 1000ms |
| GET /classes/:id/students | < 100ms | 500ms |
| POST /questions/import (100 題) | < 500ms | 3000ms |

---

## 📝 API 更新日誌

**v1.0 (2025-12-23)**
- ✅ 8 個 API 端點正式上線
- ✅ 班級管理完整功能
- ✅ 題目匯入功能
- ✅ 完整文檔和示例

---

**文檔版本：** 1.0  
**最後更新：** 2025-12-23
