// src/utils/api.js
export const loginUser = async ({ id, password, role }) => {
  // 실제 API 요청 코드 작성
  return true; // 성공 가정
};

export const registerStudent = async (data) => {
  console.log("학생 등록 요청:", data);
};

export const registerProfessor = async (data) => {
  console.log("교수 등록 요청:", data);
};
export const fetchStudentAttendance = async (studentWallet) => {
  const res = await fetch(`/api/attendance?wallet=${studentWallet}`);
  return res.ok ? res.json() : [];
};

