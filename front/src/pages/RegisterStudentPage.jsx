import React, { useState } from 'react';

export default function RegisterStudentPage() {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = '이름을 입력하세요.';
    if (!formData.studentId.trim()) newErrors.studentId = '학번을 입력하세요.';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력하세요.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '유효한 이메일 형식이 아닙니다.';
    if (!formData.password) newErrors.password = '비밀번호를 입력하세요.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    
    const response = await fetch("/auth/register/student", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loginid: formData.studentId,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        walletAddress: '',
      }),
    });

    const data = await response.json();
    console.log('응답:', data);
    
    if (data.success) {
      alert('회원가입 성공!');
      // 초기화 코드...
    } else {
      alert(data.message || '회원가입 실패');
    }
  } catch (err) {
    console.error('에러:', err);
    alert('서버 오류로 회원가입 실패');
  }
};

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '2rem' }}>
      <form className="card" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '1rem' }}>학생 회원가입</h2>

        <label htmlFor="name">이름</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="이름 입력"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

        <label htmlFor="studentId">학번 (ID)</label>
        <input
          type="text"
          id="studentId"
          name="studentId"
          placeholder="학번 입력"
          value={formData.studentId}
          onChange={handleInputChange}
          required
        />
        {errors.studentId && <p style={{ color: 'red' }}>{errors.studentId}</p>}

        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="이메일 입력"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호 입력"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="비밀번호 다시 입력"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
        {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

