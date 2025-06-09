// 📄 src/pages/DashboardProfessor.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardProfessor() {
  const [duration, setDuration] = useState(10);
  const [status, setStatus] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/enrollment/course/professor');
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
          if (data.courses.length > 0) {
            setSelectedCourseId(data.courses[0].course_id);
          }
        } else {
          setStatus('과목 목록 로드 실패');
        }
      } catch (err) {
        console.error(err);
        setStatus('서버 오류');
      }
    };
    fetchCourses();
  }, []);

  // 🟡 출석 세션 시작
  const startAttendanceSession = async () => {
    if (!selectedCourseId) {
      setStatus('과목을 선택하세요.');
      return;
    }

    try {
      const res = await fetch(`/attendance/session/${selectedCourseId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration }),
      });

      if (res.ok) {
        setStatus(`출석 세션이 ${duration}초 동안 시작되었습니다.`);

        // ⏰ 자동으로 duration 초 후에 종료 API 호출
        setTimeout(async () => {
          await endAttendanceSession();
        }, duration * 1000);
      } else {
        setStatus('출석 세션 시작 실패');
      }
    } catch (err) {
      console.error(err);
      setStatus('서버 오류');
    }
  };

  // 🟡 출석 세션 종료
  const endAttendanceSession = async () => {
    if (!selectedCourseId) {
      setStatus('과목을 선택하세요.');
      return;
    }

    try {
      const res = await fetch(`/attendance/session/${selectedCourseId}/end`, {
        method: 'POST',
      });

      if (res.ok) {
        setStatus('출석 세션이 종료되었습니다.');
      } else {
        setStatus('출석 세션 종료 실패');
      }
    } catch (err) {
      console.error(err);
      setStatus('서버 오류');
    }
  };

  const goToEnrollmentPage = () => {
    navigate('/enrollment/professor');
  };
  const goUnverifiedPage = () => {
    navigate('/attendance/unverified');
  };
    const goVerifiedPage = () => {
    navigate('/attendance/verified');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">교수 대시보드</h2>

      <label className="block mb-1">담당 과목</label>
      <select
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
        className="block border border-gray-300 rounded p-2 mb-2 w-full"
      >
        {courses.length > 0 ? (
          courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name} ({course.semester})
            </option>
          ))
        ) : (
          <option disabled>담당 과목이 없습니다</option>
        )}
      </select>

      <label className="block mb-1">출석 허용 시간 (초)</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="block border border-gray-300 rounded p-2 mb-4 w-full"
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={startAttendanceSession}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          출석 시작
        </button>

        <button
          onClick={endAttendanceSession}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          출석 종료
        </button>
      </div>

      <p className="text-red-500">{status}</p>

      <div className="mt-4">
        <button
          onClick={goToEnrollmentPage}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          수강신청 페이지로 이동
        </button>
                <button
          onClick={goVerifiedPage}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          검증 페이지로 이동
        </button>
                <button
          onClick={goUnverifiedPage}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          미검증 페이지로 이동
        </button>
      </div>
    </div>
  );
}
