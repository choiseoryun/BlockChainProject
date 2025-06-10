import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ id: '', password: '' });

  const [studentForm, setStudentForm] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [professorForm, setProfessorForm] = useState({
    name: '',
    professorId: '',
    subject: '',
    password: '',
    wallet: '',
  });

  const [adminForm, setAdminForm] = useState({
    name: '',
    adminId: '',
    email: '',
    password: '',
    confirmPassword: '',
    wallet: '', // 관리자 지갑 주소
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfessorChange = (e) => {
    const { name, value } = e.target;
    setProfessorForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('🔐 로그인 요청 시작:', loginForm);
      
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginid: loginForm.id,
          password: loginForm.password,
        }),
      });

      console.log('📡 로그인 응답 상태:', response.status);
      const data = await response.json();
      console.log('📦 로그인 응답 데이터:', data);

      if (data.success) {
        console.log("durl")
        alert('로그인 성공!');
        
        if (data.role === 'admin') {
          navigate('/dashboard/admin');
        } else if (data.role === 'professor') {
          navigate('/dashboard/professor');
        } else {
          navigate('/dashboard/student');
        }
      } else {
        alert(data.message || '로그인 실패');
      }
    } catch (error) {
      console.error('❌ 로그인 에러:', error);
      alert('서버 오류로 로그인 실패');
    }
  };

  // 🚀 학생 회원가입 API 요청
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    
    if (studentForm.password !== studentForm.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      console.log('👨‍🎓 학생 회원가입 요청 시작:', studentForm);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const response = await fetch('/auth/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginid: studentForm.studentId,
          password: studentForm.password,
          name: studentForm.name,
          email: studentForm.email,
          walletAddress: accounts, // 일단 비워두기
        }),
      });

      console.log('📡 학생가입 응답 상태:', response.status);
      const data = await response.json();
      console.log('📦 학생가입 응답 데이터:', data);

      if (data.success) {
        alert('학생 회원가입 성공!');
        // 폼 초기화
        setStudentForm({
          name: '',
          studentId: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        // 로그인 탭으로 이동
        setActiveTab('login');
      } else {
        alert(data.message || '회원가입 실패');
      }
    } catch (error) {
      console.error('❌ 학생가입 에러:', error);
      alert('서버 오류로 회원가입 실패');
    }
  };

  // 🚀 교수 회원가입 API 요청
  const handleProfessorSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('👨‍🏫 교수 회원가입 요청 시작:', professorForm);
      
      const response = await fetch('/auth/register/professor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginid: professorForm.professorId,
          password: professorForm.password,
          name: professorForm.name,
          subject: professorForm.subject,
          walletAddress: '0x5E0abDb6BaD181E49E466sa5CD9bBf9352888F4c',
        }),
      });

      console.log('📡 교수가입 응답 상태:', response.status);
      const data = await response.json();
      console.log('📦 교수가입 응답 데이터:', data);

      if (data.success) {
        alert('교수 회원가입 성공!');
        // 폼 초기화
        setProfessorForm({
          name: '',
          professorId: '',
          subject: '',
          password: '',
          wallet: '0x5E0abDb6BaD181E49E466sa5CD9bBf9352888F4c',
        });
        // 로그인 탭으로 이동
        setActiveTab('login');
      } else {
        alert(data.message || '회원가입 실패');
      }
    } catch (error) {
      console.error('❌ 교수가입 에러:', error);
      alert('서버 오류로 회원가입 실패');
    }
  };

  // 🚀 관리자 회원가입 API 요청
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    
    if (adminForm.password !== adminForm.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      console.log('👨‍💼 관리자 회원가입 요청 시작:', adminForm);
      
      const response = await fetch('/auth/register/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginid: adminForm.adminId,
          password: adminForm.password,
          name: adminForm.name,
          email: adminForm.email,
          walletAddress: "0x5E0abDb6BaD181E49E466aa5CD9bBf9352888F4d",
        }),
      });

      console.log('📡 관리자가입 응답 상태:', response.status);
      const data = await response.json();
      console.log('📦 관리자가입 응답 데이터:', data);

      if (data.success) {
        alert('관리자 회원가입 성공!');
        // 폼 초기화
        setAdminForm({
          name: '',
          adminId: '',
          email: '',
          password: '',
          confirmPassword: '',
          wallet: '0x5E0abDb6BaD181E49E466aa5CD9bBf9352888F4c',
        });
        // 로그인 탭으로 이동
        setActiveTab('login');
      } else {
        alert(data.message || '회원가입 실패');
      }
    } catch (error) {
      console.error('❌ 관리자가입 에러:', error);
      alert('서버 오류로 회원가입 실패');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button onClick={() => setActiveTab('login')}>로그인</button>
        <button onClick={() => setActiveTab('studentRegister')}>학생가입</button>
        <button onClick={() => setActiveTab('professorRegister')}>교수가입</button>
        <button onClick={() => setActiveTab('adminRegister')}>관리자가입</button>
      </div>

      {/* 로그인 */}
      {activeTab === 'login' && (
        <form className="card" onSubmit={handleLoginSubmit}>
          <h2>로그인</h2>
          <label>ID</label>
          <input type="text" name="id" value={loginForm.id} onChange={handleLoginChange} required />
          <label>비밀번호</label>
          <input type="password" name="password" value={loginForm.password} onChange={handleLoginChange} required />
          <button type="submit">로그인</button>
        </form>
      )}

      {/* 학생가입 */}
      {activeTab === 'studentRegister' && (
        <form className="card" onSubmit={handleStudentSubmit}>
          <h2>학생 회원가입</h2>
          <label>이름</label>
          <input type="text" name="name" value={studentForm.name} onChange={handleStudentChange} required />
          <label>학번 (ID)</label>
          <input type="text" name="studentId" value={studentForm.studentId} onChange={handleStudentChange} required />
          <label>이메일</label>
          <input type="email" name="email" value={studentForm.email} onChange={handleStudentChange} required />
          <label>비밀번호</label>
          <input type="password" name="password" value={studentForm.password} onChange={handleStudentChange} required />
          <label>비밀번호 확인</label>
          <input type="password" name="confirmPassword" value={studentForm.confirmPassword} onChange={handleStudentChange} required />
          <button type="submit">학생 가입</button>
        </form>
      )}

      {/* 교수가입 */}
      {activeTab === 'professorRegister' && (
        <form className="card" onSubmit={handleProfessorSubmit}>
          <h2>교수 회원가입</h2>
          <label>이름</label>
          <input type="text" name="name" value={professorForm.name} onChange={handleProfessorChange} required />
          <label>교수 ID</label>
          <input type="text" name="professorId" value={professorForm.professorId} onChange={handleProfessorChange} required />
               <label>비밀번호</label>
          <input type="password" name="password" value={professorForm.password} onChange={handleProfessorChange} required />
          <label>비밀번호 확인</label>
          <input type="password" name="confirmPassword" value={professorForm.confirmPassword} onChange={handleProfessorChange} required />
          <button type="submit">교수 가입</button>
        </form>
      )}

      {/* 관리자가입 */}
      {activeTab === 'adminRegister' && (
        <form className="card" onSubmit={handleAdminSubmit}>
          <h2>관리자 회원가입</h2>
          <label>이름</label>
          <input type="text" name="name" value={adminForm.name} onChange={handleAdminChange} required />
          <label>관리자 ID</label>
          <input type="text" name="adminId" value={adminForm.adminId} onChange={handleAdminChange} required />
          <label>이메일</label>
          <input type="email" name="email" value={adminForm.email} onChange={handleAdminChange} />
          <label>비밀번호</label>
          <input type="password" name="password" value={adminForm.password} onChange={handleAdminChange} required />
          <label>비밀번호 확인</label>
          <input type="password" name="confirmPassword" value={adminForm.confirmPassword} onChange={handleAdminChange} required />
          <button type="submit">관리자 가입</button>
        </form>
      )}
    </div>
  );
}