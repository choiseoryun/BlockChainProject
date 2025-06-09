import React, { useState, useEffect } from 'react';

export default function Verified() {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [status, setStatus] = useState('');
  const [courses, setCourses] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]); // 출석 검증 결과 저장

  // 과목 목록 불러오기
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
      const res = await fetch(`/attendance/unverified/${selectedCourseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAttendanceLogs(data); // 출석 검증 결과 저장
        setStatus(`출석 상태가 ${data.length}건 확인되었습니다.`);
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

      {attendanceLogs.length > 0 && (
        <div>
          <h3>출석 로그</h3>
          <table border="1">
            <thead>
              <tr>
                <th>학생 이름</th>
                <th>지갑 주소</th>
                <th>출석 시간</th>
                <th>유효 여부</th>
              </tr>
            </thead>
            <tbody>
              {attendanceLogs.map((log) => (
                <tr key={log.log_id}>
                  <td>{log.student_name}</td>
                  <td>{log.wallet_address}</td>
                  <td>{new Date(log.attendance_time).toLocaleString()}</td>
                  <td>{log.is_time_valid ? '유효' : '무효'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
