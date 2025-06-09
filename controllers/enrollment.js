const db = require('../lib/db');
const registerCourse = async (req, res, role) => {
    const { courseName, semester } = req.body;
    console.log(courseName, semester)
    try {
        const [result] = await db.query(
            'INSERT INTO courses (course_name, semester) VALUES (?, ?)',
            [courseName, semester || '']
        );

        res.json({
            success: true,
            message: `${courseName} 수업 생성 완료`,
            userId: result.insertId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

const showCourse = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM courses');
        res.json({
            success: true,
            courses: rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

const registerStudent = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.session.userId;
        if (!studentId || !courseId) {
            return res.status(400).json({ success: false, message: '학생 ID와 수업 ID가 필요합니다.' });
        }
        const [existing] = await db.query(
            'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
            [studentId, courseId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: '이미 수강 신청한 과목입니다.' });
        }

        // 수강 신청 삽입
        await db.query(
            'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
            [studentId, courseId]
        );

        res.json({ success: true, message: '수강 신청 성공' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

const registerProfessor = async (req, res) => {
    try {
        const professorId = req.session.userId;
        const { courseId } = req.body;
        console.log(req.session.userId)
        const [result] = await db.query(
            'UPDATE courses SET professor_id = ? WHERE course_id = ?',
            [professorId, courseId]
        );

        res.json({
            success: true,
            message: `수업 생성 완료`,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

const showProfessorCourse = async (req, res) => {
    const professorId = req.session.userId; // 세션에서 꺼냄
    if (!professorId) {
        return res.status(401).json({ success: false, message: '로그인 필요' });
    }

    try {
        const [courses] = await db.query(
            'SELECT course_id, course_name, semester FROM courses WHERE professor_id = ?',
            [professorId]
        );
        console.log(courses)
        res.json({ success: true, courses });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
}

const showStudentCourse = async (req, res) => {
    const studentId = req.session.userId; // 세션에서 꺼냄
    if (!studentId) {
        return res.status(401).json({ success: false, message: '로그인 필요' });
    }

    try {
        const [courses] = await db.query(
            `SELECT c.course_id, c.course_name, c.semester
   FROM courses c
   JOIN enrollments e ON c.course_id = e.course_id
   WHERE e.student_id = ?`,
            [studentId]
        );
        console.log(courses)
        res.json({ success: true, courses });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
}
exports.showStudentCourse = showStudentCourse;
exports.showProfessorCourse = showProfessorCourse;
exports.registerProfessor = registerProfessor;
exports.registerStudent = registerStudent;
exports.showCourse = showCourse;
exports.registerCourse = registerCourse;