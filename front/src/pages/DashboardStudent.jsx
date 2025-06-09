// 📄 src/pages/DashboardStudent.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CaptchaCheck from '../components/CaptchaCheck';
import { ethers } from 'ethers';
import { BrowserProvider } from 'ethers';

const DashboardStudent = () => {
  const [account, setAccount] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [status, setStatus] = useState('');
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

  useEffect(() => {
    connectWallet();

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
        body: JSON.stringify({ attendance_time, wallet_address, signed_data }),
      });

      if (res.ok) {
        setStatus('출석이 제출되었습니다!');
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

      <CaptchaCheck onVerified={() => setIsVerified(true)} />

      <div className="mt-4">
        <button
          onClick={goToEnrollmentPage}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
        >
          수강신청 페이지로 이동
        </button>
                <button
          onClick={goToAttendancePage}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
        >
          로그 확인 페이지로 이동동
        </button>
      </div>

      {isVerified && account && (
        <div className="mt-4">
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
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            출석 제출
          </button>
        </div>
      )}

      <p className="mt-4 text-red-500">{status}</p>
    </div>
  );
};

export default DashboardStudent;
