import React, { useState, useEffect } from 'react';

export default function Attendance() {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [status, setStatus] = useState('');
  const [courses, setCourses] = useState([]);
  const [studentLogs, setStudentLogs] = useState([]);

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

  // 학생 개인 로그 조회 요청
  const handleFetchStudentLogs = async () => {
    if (!selectedCourseId) {
      setStatus('과목을입력하세요.');
      return;
    }

    try {
      const res = await fetch(`/attendance/${selectedCourseId}`);
      if (res.ok) {
        const data = await res.json();
        setStudentLogs(data);
        setStatus(`학생 로그가 ${data.length}건 확인되었습니다.`);
      } else {
        setStatus('학생 로그 조회 실패');
      }
    } catch (err) {
      console.error(err);
      setStatus('서버 오류');
    }
  };

  return (
    <div>
      <h2>학생 개인 출석 로그 조회</h2>
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

      <button onClick={handleFetchStudentLogs}>조회</button>

      <p>{status}</p>

      {studentLogs.length > 0 && (
        <div>
          <h3>출석 로그</h3>
          <table border="1">
            <thead>
              <tr>
                <th>로그 ID</th>
                <th>지갑 주소</th>
                <th>출석 시간</th>
                <th>TX 해시</th>
                <th>출석 유효</th>
                <th>시간 유효</th>
              </tr>
            </thead>
            <tbody>
              {studentLogs.map((log) => (
                <tr key={log.log_id}>
                  <td>{log.log_id}</td>
                  <td>{log.wallet_address}</td>
                  <td>{new Date(log.attendance_time).toLocaleString()}</td>
                  <td>{log.tx_hash || '없음'}</td>
                  <td>{log.is_valid ? '유효' : '무효'}</td>
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