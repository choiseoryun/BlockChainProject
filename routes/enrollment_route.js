const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment');


router.post('/course', enrollmentController.registerCourse)
router.get('/course', enrollmentController.showCourse)

router.post('/course/student', enrollmentController.registerStudent)
router.post('/course/professor', enrollmentController.registerProfessor)
router.get('/course/professor', enrollmentController.showProfessorCourse)
router.get('/course/student', enrollmentController.showStudentCourse)
module.exports = router;
