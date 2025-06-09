require('dotenv').config({ path: __dirname + '/settings/.env' });
const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001',  // 프론트 주소 (포트까지 정확히)
  credentials: true,                 // 쿠키, 인증 헤더 허용 시 필요
}));
// 세션 설정
app.use(
  session({
    secret: 'your_secret_key', // 보안을 위해 복잡한 문자열로 변경하세요
    resave: false, // 변경사항 없으면 저장 안함
    saveUninitialized: false, // 세션이 초기화 되지 않았으면 저장하지 않음
    cookie: {
      maxAge: 1000 * 60 * 30, // 쿠키 유효기간
      httpOnly: true, // 클라이언트 JS에서 쿠키 접근 불가 (보안용)
      // secure: true,              // HTTPS 사용 시 true (로컬 테스트 시 false)
    },
  })
);

const authRoutes = require('./routes/auth_route');
const attendanceRoutes = require('./routes/attendance_route');
const enrollmentRoutes = require('./routes/enrollment_route');

app.use('/auth', authRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/enrollment', enrollmentRoutes);
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
