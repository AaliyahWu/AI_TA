const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// multer 用於文件上傳
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 限制
  },
  fileFilter: (req, file, cb) => {
    // 只允許圖片文件和 PDF 文件
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('只允許上傳圖片文件和 PDF 文件'));
    }
  }
});

app.use(cors()); // 啟用 CORS
app.use(express.json());
app.use('/uploads', express.static('uploads')); // 提供上傳文件的資料夾

// 取得所有用戶 API
app.get('/api/users', (req, res) => {
  db.query('SELECT id, username, email, role, created_at FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: results });
  });
});

// 建立新用戶 API
app.post('/api/users', (req, res) => {
  const { username, email, password_hash, role } = req.body;
  db.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [username, email, password_hash, role], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId });
  });
});

// 用戶註冊 API
app.post('/api/auth/register', upload.single('idDocument'), async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;
    const idDocument = req.file;

    // 驗證必填欄位
    if (!email || !password || !role || !fullName) {
      return res.status(400).json({ error: '所有欄位都是必填的' });
    }

    // 驗證角色（不能註冊管理員）
    const allowedRoles = ['student', 'teacher', 'parent'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: '無效的角色選擇' });
    }

    // 驗證身份證明文件（只有老師需要）
    if (role === 'teacher' && !idDocument) {
      return res.status(400).json({ error: '老師必須上傳教師證明文件' });
    }

    // 如果不是老師，不需要文件
    const idDocumentPath = role === 'teacher' ? idDocument?.path : null;

    // 檢查郵箱是否已存在
    const [emailResults] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
    if (emailResults.length > 0) {
      return res.status(400).json({ error: '郵箱已存在' });
    }

    // 雜湊密碼
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 建立新用戶
    const [result] = await db.promise().query(
      'INSERT INTO users (email, password_hash, role, full_name, id_document_path, verification_status) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, role, fullName, idDocumentPath, role === 'teacher' ? 'pending' : 'approved']
    );

    res.status(201).json({
      message: role === 'teacher'
        ? '註冊成功！請等待管理員審核您的教師證明文件。'
        : '註冊成功！您可以立即登入使用系統。',
      user: {
        id: result.insertId,
        email,
        full_name: fullName,
        role,
        verification_status: role === 'teacher' ? 'pending' : 'approved'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 用戶登入 API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 驗證必填欄位
    if (!email || !password) {
      return res.status(400).json({ error: '電子郵件和密碼都是必填的' });
    }

    // 查找用戶
    const [results] = await db.promise().query('SELECT id, email, password_hash, role, full_name, verification_status FROM users WHERE email = ?',
      [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: '電子郵件或密碼錯誤' });
    }

    const user = results[0];

    // 檢查驗證狀態
    if (user.verification_status !== 'approved') {
      return res.status(403).json({ error: '帳戶尚未通過驗證，請等待管理員審核' });
    }

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: '電子郵件或密碼錯誤' });
    }

    // 登入成功，返回用戶資訊
    res.json({
      message: '登入成功',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 獲取當前用戶資訊 API
app.get('/api/auth/me', async (req, res) => {
  try {
    const userId = req.headers['user-id'];

    if (!userId) {
      return res.status(401).json({ error: '未授權訪問' });
    }

    // 查詢用戶資訊
    const [results] = await db.promise().query(
      'SELECT id, email, full_name, role, verification_status, created_at, grade, class, phone, student_name, relationship FROM users WHERE id = ?',
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: '用戶不存在' });
    }

    const user = results[0];

    const mappedUser = {
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      verification_status: user.verification_status,
      created_at: user.created_at,
      ...(user.grade && { grade: user.grade }),
      ...(user.class && { class: user.class }),
      ...(user.phone && { phone: user.phone }),
      ...(user.student_name && { studentName: user.student_name }),
      ...(user.relationship && { relationship: user.relationship })
    };

    res.json({
      user: mappedUser
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新用戶資訊 API
app.put('/api/auth/me', async (req, res) => {
  try {
    const userId = req.headers['user-id'];

    if (!userId) {
      return res.status(401).json({ error: '未授權訪問' });
    }

    const { name, grade, class: userClass, phone, studentName, relationship } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.full_name = name;
    if (grade !== undefined) updateData.grade = grade;
    if (userClass !== undefined) updateData.class = userClass;
    if (phone !== undefined) updateData.phone = phone;
    if (studentName !== undefined) updateData.student_name = studentName;
    if (relationship !== undefined) updateData.relationship = relationship;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: '沒有提供要更新的欄位' });
    }

    // UPDATE
    const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(userId);

    await db.promise().query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      values
    );

    // 重新獲取更新後的用戶資料
    const [results] = await db.promise().query(
      'SELECT id, email, full_name, role, verification_status, created_at, grade, class, phone, student_name, relationship FROM users WHERE id = ?',
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: '用戶不存在' });
    }

    const user = results[0];

    const mappedUser = {
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      verification_status: user.verification_status,
      created_at: user.created_at,
      ...(user.grade && { grade: user.grade }),
      ...(user.class && { class: user.class }),
      ...(user.phone && { phone: user.phone }),
      ...(user.student_name && { studentName: user.student_name }),
      ...(user.relationship && { relationship: user.relationship })
    };

    res.json({
      message: '用戶資訊已更新',
      user: mappedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 管理員審核用戶 API
app.post('/api/admin/verify-user', async (req, res) => {
  try {
    const { userId, action, adminId } = req.body; // action: 'approve' 或 'reject'

    if (!userId || !action || !adminId) {
      return res.status(400).json({ error: '缺少必要參數' });
    }

    // 檢查管理員權限
    const [adminResults] = await db.promise().query('SELECT role FROM users WHERE id = ?', [adminId]);
    if (adminResults.length === 0 || adminResults[0].role !== 'admin') {
      return res.status(403).json({ error: '無權限執行此操作' });
    }

    // 更新用戶驗證狀態
    const status = action === 'approve' ? 'approved' : 'rejected';
    await db.promise().query(
      'UPDATE users SET verification_status = ?, verified_by = ?, verified_at = NOW() WHERE id = ?',
      [status, adminId, userId]
    );

    res.json({
      message: `用戶${action === 'approve' ? '已通過' : '已被拒絕'}驗證`,
      userId,
      status
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 獲取待審核用戶列表 API
app.get('/api/admin/pending-users', async (req, res) => {
  try {
    const [results] = await db.promise().query(
      'SELECT id, email, full_name, role, id_document_path, created_at FROM users WHERE verification_status = ?',
      ['pending']
    );

    res.json({ pendingUsers: results });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 關閉資料庫連接
process.on('SIGINT', () => {
  db.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});