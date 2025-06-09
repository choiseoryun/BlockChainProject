import React, { useEffect, useState } from 'react';

export default function EnrollmentStudent() {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/enrollment/course');
                const data = await res.json();
                if (data.success) {
                    setCourses(data.courses);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchCourses();
    }, []);

    const coursesWithoutProfessor = courses.filter(
        (course) => !course.professor_id
    );

    const handleSubmit = async () => {
        try {
            const res = await fetch('/enrollment/course/student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: selectedCourseId,
                }),
            });
            const data = await res.json();
            if (data.success) {
                alert('수강신청에 성공하였습니다');
                window.location.reload();
            } else {
                alert(data.message || '업데이트 실패');
            }
        } catch (err) {
            console.error(err);
            alert('서버 오류');
        }
    };

    return (
        <div className="container p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">수업 목록</h2>

            <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
            >
                <option value="">-- 수업을 선택하세요 --</option>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name} ({course.semester})
                        </option>
                    ))
                ) : (
                    <option disabled>수업이 없습니다.</option>
                )}
            </select>

            <button
                onClick={handleSubmit}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                disabled={!selectedCourseId}
            >
                수강 신청하기
            </button>

        </div>
    );
}
