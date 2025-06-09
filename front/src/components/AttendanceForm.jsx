// 📄 src/components/AttendanceForm.jsx
import React, { useState } from 'react';
import { ethers } from 'ethers';

const AttendanceForm = ({ studentId, courseId }) => {
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    try {
      // 1. 시간 생성
      const attendance_time = new Date().toISOString();

      // 2. 지갑 연동 체크
      if (!window.ethereum) {
        setStatus('❌ MetaMask를 설치해주세요.');
        return;
      }

      // 3. 메타마스크 지갑 연결
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const wallet_address = await signer.getAddress();

      // 4. 메시지 생성 및 서명
      const message = `${studentId}-${courseId}-${attendance_time}`;
      const signed_data = await signer.signMessage(message);

      // 5. 서버로 전송
      const response = await fetch('http://localhost:3000/submit-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          courseId,
          attendance_time,
          wallet_address,
          signed_data,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus('✅ 출석 제출 성공!');
      } else {
        setStatus(`❌ 출석 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('출석 에러:', error);
      setStatus('❌ 출석 제출 중 오류 발생');
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>출석 제출</button>
      <p>{status}</p>
    </div>
  );
};

export default AttendanceForm;
