import React, { useState, useEffect } from 'react';

export default function Verified() {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [status, setStatus] = useState('');
  const [courses, setCourses] = useState([]);

  // 과목 목록을 처음에 불러오기
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/enrollment/course');
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        } else {
          setStatus('과목 목록 불러오기 실패');
        }
      } catch (err) {
        console.error(err);
        setStatus('서버 오류');
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCourseId) {
      setStatus('과목을 선택하세요.');
      return;
    }

    try {
      const res = await fetch(`/attendance/verify/${selectedCourseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setStatus(`출석 상태: ${data.message || '확인됨'}`);
      } else {
        setStatus('출석 상태 확인 실패');
      }
    } catch (err) {
      console.error(err);
      setStatus('서버 오류');
    }
  };

  return (
    <div>
      <h2>출석 상태 확인</h2>
      <select
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
      >
        <option value="">과목 선택</option>
        {courses.map((course) => (
          <option key={course.course_id} value={course.course_id}>
            {course.course_name}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>출석 확인</button>
      <p>{status}</p>
    </div>
  );
}
