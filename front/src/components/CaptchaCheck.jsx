//  src/components/CaptchaCheck.jsx

import React, { useState } from 'react';

const CaptchaCheck = ({ onVerified }) => {
  const [input, setInput] = useState('');
  const [isPassed, setIsPassed] = useState(false);
  const correctAnswer = '1234'; // 실제 CAPTCHA 값 대체 가능

  const handleSubmit = () => {
    if (input === correctAnswer) {
      setIsPassed(true);
      onVerified(); //  부모 컴포넌트로 전달
    } else {
      alert('❌ CAPTCHA가 틀렸습니다.');
    }
  };

  return (
    <div className="card">
      <h3>🤖 CAPTCHA 인증</h3>
      <p>입력: <strong>{correctAnswer}</strong> ← 테스트용 예시</p>

      <input
        type="text"
        placeholder="CAPTCHA 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPassed}
      />

      <button onClick={handleSubmit} disabled={isPassed}>
        {isPassed ? '✔️ 인증 완료' : '제출'}
      </button>
    </div>
  );
};

export default CaptchaCheck;
