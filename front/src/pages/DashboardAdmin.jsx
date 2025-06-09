// src/pages/DashboardAdmin.jsx 
import React, { useState } from "react"; 

const DashboardAdmin = () => { 
  const [courseForm, setCourseForm] = useState({
    courseName: '',
    semester: ''
  });

  const [courses, setCourses] = useState([]);

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    
    if (!courseForm.courseName || !courseForm.semester) {
      alert('수업명과 학기를 모두 입력해주세요.');
      return;
    }

    try {
      console.log('📚 수업 생성 요청 시작:', courseForm);
      
      const response = await fetch('/enrollment/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: courseForm.courseName,
          semester: courseForm.semester,
        }),
      });

      console.log('📡 수업생성 응답 상태:', response.status);
      const data = await response.json();
      console.log('📦 수업생성 응답 데이터:', data);

      if (data.success) {
        alert('수업이 성공적으로 생성되었습니다!');
        
        // 새로 생성된 수업을 목록에 추가
        setCourses(prev => [...prev, data.course]);
        
        // 폼 초기화
        setCourseForm({
          courseName: '',
          semester: ''
        });
      } else {
        alert(data.message || '수업 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 수업생성 에러:', error);
      alert('서버 오류로 수업 생성에 실패했습니다.');
    }
  };

  const loadCourses = async () => {
    try {
      const response = await fetch('/enrollment/course');
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('❌ 수업 목록 로드 에러:', error);
    }
  };

  // 컴포넌트 마운트 시 수업 목록 불러오기
  React.useEffect(() => {
    loadCourses();
  }, []);

  return ( 
    <div className="p-8"> 
      <h2 className="text-2xl font-bold mb-6">관리자 대시보드</h2> 
      
      {/* 수업 생성 폼 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">새 수업 생성</h3>
        
        <form onSubmit={handleCourseSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수업명
            </label>
            <input
              type="text"
              name="courseName"
              value={courseForm.courseName}
              onChange={handleCourseChange}
              placeholder="예: 한국사"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              학기
            </label>
            <select
              name="semester"
              value={courseForm.semester}
              onChange={handleCourseChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">학기를 선택하세요</option>
              <option value="1학기">1학기</option>
              <option value="2학기">2학기</option>
              <option value="여름학기">여름학기</option>
              <option value="겨울학기">겨울학기</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            수업 생성
          </button>
        </form>
      </div>

      {/* 생성된 수업 목록 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">생성된 수업 목록</h3>
        
        </div>
        
        {courses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">생성된 수업이 없습니다.</p>
        ) : (
          <div className="grid gap-4">
            {courses.map((course, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-lg">{course.course_name}</h4>
                    <p className="text-gray-600">{course.semester}</p>
                    {course.createdAt && (
                      <p className="text-sm text-gray-500">
                        생성일: {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex space-x-2">
                  </div>
                  </div>
                
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div> 
  ); 
}; 

export default DashboardAdmin;