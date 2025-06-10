// 📄 src/pages/DashboardStudent.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ethers } from 'ethers';
import { BrowserProvider } from 'ethers';

const DashboardStudent = () => {
  const [account, setAccount] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [status, setStatus] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('지갑 연결 실패:', error);
      }
    } else {
      alert('MetaMask를 설치해주세요.');
    }
  };

  // 랜덤 CAPTCHA 생성 함수들
  const generateMathCaptcha = () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let question, answer;
    
    switch(operation) {
      case '+':
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
        break;
      case '-':
        // 음수 방지
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        question = `${larger} - ${smaller} = ?`;
        answer = larger - smaller;
        break;
      case '*':
        const small1 = Math.floor(Math.random() * 10) + 1;
        const small2 = Math.floor(Math.random() * 10) + 1;
        question = `${small1} × ${small2} = ?`;
        answer = small1 * small2;
        break;
      default:
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
    }
    
    setCaptchaQuestion(question);
    setCaptchaAnswer(answer.toString());
  };

  const generateTextCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // 혼동되기 쉬운 문자 제외
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setCaptchaAnswer(result);
    setCaptchaQuestion('위의 문자를 입력하세요');
  };

  const generateCaptcha = () => {
    // 랜덤으로 수학 문제 또는 텍스트 CAPTCHA 선택
    if (Math.random() > 0.5) {
      generateMathCaptcha();
      setCaptchaText(''); // 텍스트 CAPTCHA 초기화
    } else {
      generateTextCaptcha();
    }
    setUserAnswer('');
    setIsVerified(false);
  };

  useEffect(() => {
    connectWallet();
    generateCaptcha(); // 초기 CAPTCHA 생성

    // 수강 과목 조회
    const fetchCourses = async () => {
      try {
        const res = await fetch('/enrollment/course/student');
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
          if (data.courses.length > 0) {
            setSelectedCourseId(data.courses[0].course_id);
          }
        } else {
          setStatus('수강 과목 로드 실패');
        }
      } catch (err) {
        console.error(err);
        setStatus('서버 오류');
      }
    };
    fetchCourses();
  }, []);

  const verifyCaptcha = () => {
    if (userAnswer.trim().toUpperCase() === captchaAnswer.toUpperCase()) {
      setIsVerified(true);
      setStatus('CAPTCHA 인증 완료! 이제 수강신청과 출석 제출이 가능합니다.');
    } else {
      setIsVerified(false);
      setStatus('CAPTCHA 답이 틀렸습니다. 다시 시도하세요.');
      generateCaptcha(); // 새로운 CAPTCHA 생성
    }
  };

  const refreshCaptcha = () => {
    generateCaptcha();
    setStatus('새로운 CAPTCHA가 생성되었습니다.');
  };

  const goToEnrollmentPage = () => {
    navigate('/enrollment/student');
  };

  const goToAttendancePage = () => {
    navigate('/attendance/student');
  };

  const submitAttendance = async () => {
    if (!selectedCourseId) {
      setStatus('과목을 선택하세요.');
      return;
    }

    if (!isVerified) {
      setStatus('먼저 CAPTCHA 인증을 완료해주세요.');
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const attendance_time = new Date().toISOString();
    const message = `${selectedCourseId}-${attendance_time}`;

    const wallet_address = account;
    const signed_data = await signer.signMessage(message);
    
    try {
      const res = await fetch(`/attendance/submit/${selectedCourseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          attendance_time, 
          wallet_address, 
          signed_data,
          captcha_verified: true // CAPTCHA 검증 완료 플래그
        }),
      });

      if (res.ok) {
        setStatus('출석이 제출되었습니다!');
        // 출석 제출 후 CAPTCHA 리셋
        generateCaptcha();
        setIsVerified(false);
      } else {
        setStatus('출석 제출 실패');
      }
    } catch (err) {
      console.error(err);
      setStatus('서버 오류');
    }
  };

  return (
    <div className="container p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">학생 대시보드</h2>
      <p className="mb-4">지갑 주소: {account || '연결되지 않음'}</p>

      {/* 텍스트 CAPTCHA */}
      <div className="mb-6 p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">🔒 보안 인증</h3>
        
        {/* 텍스트 CAPTCHA 표시 */}
        {captchaText && (
          <div className="mb-3 p-3 bg-gray-200 border-2 border-dashed border-gray-400 rounded text-center">
            <span className="text-2xl font-mono tracking-widest text-gray-800 select-none">
              {captchaText}
            </span>
          </div>
        )}
        
        <p className="mb-2 font-medium">{captchaQuestion}</p>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && verifyCaptcha()}
            placeholder="답을 입력하세요"
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            disabled={isVerified}
          />
          <button
            onClick={verifyCaptcha}
            disabled={isVerified || !userAnswer.trim()}
            className={`px-4 py-2 rounded transition duration-300 ${
              isVerified 
                ? 'bg-green-500 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isVerified ? '✓ 완료' : '확인'}
          </button>
        </div>
        
        <button
          onClick={refreshCaptcha}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          🔄 새로운 문제 생성
        </button>
      </div>

      {/* CAPTCHA 인증 성공 시에만 네비게이션 버튼들 표시 */}
      {isVerified && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-700">✅ 인증 완료 - 서비스 이용 가능</h3>
          <div className="space-y-2">
            <button
              onClick={goToEnrollmentPage}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 mr-2 w-full sm:w-auto"
            >
              📚 수강신청 페이지로 이동
            </button>
            <button
              onClick={goToAttendancePage}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
            >
              📋 출석 로그 확인 페이지로 이동
            </button>
          </div>
        </div>
      )}

      {/* CAPTCHA 미인증 시 안내 메시지 */}
      {!isVerified && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-yellow-700">🔒 인증 필요</h3>
          <p className="text-yellow-600">수강신청 및 출석 제출을 위해 먼저 보안 인증을 완료해주세요.</p>
        </div>
      )}

      {/* 출석 제출 섹션도 CAPTCHA 인증 후에만 표시 */}
      {account && isVerified && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">📝 출석 제출</h3>
          <label className="block mb-1">수강 과목</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="block border border-gray-300 rounded p-2 mb-4 w-full"
          >
            {courses.length > 0 ? (
              courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name} ({course.semester})
                </option>
              ))
            ) : (
              <option disabled>수강 과목이 없습니다</option>
            )}
          </select>

          <button
            onClick={submitAttendance}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 w-full"
          >
            ✓ 출석 제출
          </button>
        </div>
      )}

      <p className={`mt-4 ${
        status.includes('완료') || status.includes('제출되었습니다') 
          ? 'text-green-600' 
          : status.includes('틀렸습니다') || status.includes('실패')
          ? 'text-red-500'
          : 'text-blue-600'
      }`}>
        {status}
      </p>
    </div>
  );
};

export default DashboardStudent;