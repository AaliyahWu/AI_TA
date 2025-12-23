-- ==========================================
-- AI 助教 (AI TA) 資料庫初始化腳本
-- ==========================================

-- 1. 使用者表
-- CREATE TABLE IF NOT EXISTS users (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   username VARCHAR(100) UNIQUE NOT NULL,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   password_hash VARCHAR(255) NOT NULL,
--   role ENUM('admin', 'teacher', 'student', 'parent') NOT NULL DEFAULT 'student',
--   full_name VARCHAR(255),
--   profile_image VARCHAR(255),
--   id_document VARCHAR(255),
--   is_verified BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   INDEX idx_role (role),
--   INDEX idx_email (email)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 班級表
CREATE TABLE IF NOT EXISTS classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_name VARCHAR(255) NOT NULL,
  teacher_id INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_teacher_id (teacher_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 班級學生關聯表
CREATE TABLE IF NOT EXISTS class_students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id INT NOT NULL,
  student_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_class_student (class_id, student_id),
  INDEX idx_class_id (class_id),
  INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 家長-學生關聯表
CREATE TABLE IF NOT EXISTS parent_students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT NOT NULL,
  student_id INT NOT NULL,
  relationship VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_parent_student (parent_id, student_id),
  INDEX idx_parent_id (parent_id),
  INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 科目表
CREATE TABLE IF NOT EXISTS subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 單元表
CREATE TABLE IF NOT EXISTS units (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_id INT NOT NULL,
  unit_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  INDEX idx_subject_id (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. 題目表
CREATE TABLE IF NOT EXISTS questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  unit_id INT NOT NULL,
  question_text TEXT NOT NULL,
  question_image VARCHAR(255),
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
  answer_text TEXT,
  solution_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
  INDEX idx_unit_id (unit_id),
  INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. 學習記錄表
CREATE TABLE IF NOT EXISTS study_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  question_id INT,
  class_id INT,
  session_type ENUM('practice', 'teaching', 'mistake_clinic') NOT NULL DEFAULT 'practice',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  duration_seconds INT,
  status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  INDEX idx_student_id (student_id),
  INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. 學生答題記錄表
CREATE TABLE IF NOT EXISTS student_answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  question_id INT NOT NULL,
  session_id INT,
  answer_text TEXT,
  answer_voice_path VARCHAR(255),
  whiteboard_drawing VARCHAR(255),
  is_correct BOOLEAN,
  attempts INT DEFAULT 1,
  hint_level INT DEFAULT 0,
  wpm FLOAT,
  pause_ratio FLOAT,
  fluency_score FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES study_sessions(id) ON DELETE SET NULL,
  INDEX idx_student_id (student_id),
  INDEX idx_question_id (question_id),
  INDEX idx_is_correct (is_correct)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. 學生指標表（聚合資料）
CREATE TABLE IF NOT EXISTS student_metrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL UNIQUE,
  class_id INT,
  total_practice_hours FLOAT DEFAULT 0,
  total_questions_answered INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  accuracy_rate FLOAT DEFAULT 0,
  average_wpm FLOAT DEFAULT 0,
  average_fluency FLOAT DEFAULT 0,
  average_hint_dependency FLOAT DEFAULT 0,
  focus_time_minutes INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. 錯題本表
CREATE TABLE IF NOT EXISTS mistake_notebooks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  question_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  review_count INT DEFAULT 0,
  last_reviewed TIMESTAMP NULL,
  mastered BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_mistake (student_id, question_id),
  INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. WE2 邊緣裝置數據表
CREATE TABLE IF NOT EXISTS we2_sensor_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  session_id INT,
  focus_level FLOAT,
  posture_quality ENUM('good', 'warning', 'bad') DEFAULT 'good',
  distance_to_camera FLOAT,
  stress_indicators TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES study_sessions(id) ON DELETE SET NULL,
  INDEX idx_student_id (student_id),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. 教學建議表
CREATE TABLE IF NOT EXISTS teaching_suggestions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id INT,
  teacher_id INT,
  unit_id INT,
  suggestion_text TEXT,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. 會話表（用於前端狀態管理）
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  session_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 插入基本資料
-- ==========================================

-- 插入科目
INSERT INTO subjects (subject_name, description) VALUES
('國文', '國語文教學'),
('數學', '數學基礎與進階'),
('英文', '英語學習'),
('自然科學', '物理、化學、生物'),
('社會科學', '歷史、地理、公民')
ON DUPLICATE KEY UPDATE subject_name=subject_name;

-- 插入管理員用戶
-- 臨時密碼：admin123
-- INSERT INTO users (username, email, password_hash, role, full_name, is_verified)
-- VALUES ('admin', 'admin@aitta.com', '$2b$10$TnZbXPn0ybW7Ov1sQi5d0.5K3F2qwL8mH9R6vB4cQj2uX3pD1a.gC', 'admin', 'System Admin', TRUE)
-- ON DUPLICATE KEY UPDATE email=email;

-- ==========================================
-- 驗證表已建立
-- ==========================================
SELECT 'Database initialization completed!' AS status;
