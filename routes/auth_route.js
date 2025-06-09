const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// 회원가입 (역할별)
router.post('/register/student', authController.registerStudent);
router.post('/register/professor', authController.registerProfessor);
router.post('/register/admin', authController.registerAdmin);

// 로그인
router.post('/login', authController.login);

// 로그아웃
router.post('/logout', authController.logout);

// 회원가입 페이지 보여주기
router.get('/register/student', authController.registerStudent);
router.get('/register/professor', authController.registerProfessor);
router.get('/register/admin', authController.registerAdmin);


module.exports = router;
