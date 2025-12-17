<template>
  <div class="login-page">
    <div class="login-card">
      <h1>AI 助教</h1>
      <p class="subtitle">請選擇您的角色登入</p>
      
      <div class="role-selection">
        <button 
          class="role-btn student" 
          @click="login('student')"
        >
          <span class="role-icon">🎧</span>
          <div class="role-info">
            <h3>學生</h3>
            <p>進入學習模式</p>
          </div>
        </button>
        
        <button 
          class="role-btn parent" 
          @click="login('parent')"
        >
          <span class="role-icon">👨‍👩‍👧</span>
          <div class="role-info">
            <h3>家長</h3>
            <p>追蹤學習趨勢</p>
          </div>
        </button>
        
        <button 
          class="role-btn teacher" 
          @click="login('teacher')"
        >
          <span class="role-icon">📊</span>
          <div class="role-info">
            <h3>老師</h3>
            <p>查看班級數據</p>
          </div>
        </button>
        
        <button 
          class="role-btn admin" 
          @click="login('admin')"
        >
          <span class="role-icon">⚙️</span>
          <div class="role-info">
            <h3>管理員</h3>
            <p>系統管理與設定</p>
          </div>
        </button>
      </div>
      
      <div class="demo-info">
        <p>💡 目前為 Demo 模式，點擊角色即可登入</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/stores/session';

const router = useRouter();
const sessionStore = useSessionStore();

const login = (role) => {
  // 設置假用戶資料
  const userData = {
    student: {
      name: '張小明',
      id: 'student-001',
      grade: '國中二年級',
      class: '2年3班'
    },
    teacher: {
      name: '王老師',
      id: 'teacher-001',
      class: '2年3班'
    },
    parent: {
      name: '張家長',
      id: 'parent-001',
      studentName: '張小明'
    },
    admin: {
      name: '系統管理員',
      id: 'admin-001',
      email: 'admin@example.com'
    }
  };
  
  sessionStore.setRole(role);
  sessionStore.setUser(userData[role]);
  
  // 導航到對應的儀表板
  if (role === 'student') {
    router.push({ name: 'student-dashboard' });
  } else if (role === 'teacher') {
    router.push({ name: 'teacher-overview' });
  } else if (role === 'parent') {
    router.push({ name: 'parent-overview' });
  } else if (role === 'admin') {
    router.push({ name: 'admin-dashboard' });
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%);
  padding: 2rem;
}

.login-card {
  background: #FFFFFF;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.2);
  border: 2px solid #BFDBFE;
  max-width: 600px;
  width: 100%;
}

.login-card h1 {
  text-align: center;
  color: #1e3a8a;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  text-align: center;
  color: #3b82f6;
  margin: 0 0 2rem 0;
  font-size: 1rem;
}

.role-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.role-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #FFFFFF;
  border: 2px solid #BFDBFE;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.role-btn:hover {
  background: #EFF6FF;
  border-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.role-icon {
  font-size: 2rem;
}

.role-info h3 {
  margin: 0 0 0.25rem 0;
  color: #1e3a8a;
  font-size: 1.1rem;
}

.role-info p {
  margin: 0;
  color: #6B7280;
  font-size: 0.9rem;
}

.demo-info {
  text-align: center;
  padding: 1rem;
  background: #EFF6FF;
  border-radius: 0.5rem;
  border: 1px dashed #BFDBFE;
}

.demo-info p {
  margin: 0;
  color: #3b82f6;
  font-size: 0.85rem;
}
</style>

