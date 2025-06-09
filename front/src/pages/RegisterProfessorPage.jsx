// src/pages/RegisterProfessorPage.jsx
import React, { useState } from "react";
import { registerProfessor } from "../utils/api";

const RegisterProfessorPage = () => {
  const [form, setForm] = useState({ name: "", professorId: "", subject: "", password: "", wallet: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await registerProfessor(form);
    alert("교수 등록 완료");
  };

  return (
    <div className="p-8">
      <h2>교수 회원가입</h2>
      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          value={form[key]}
          onChange={handleChange}
          className="block border p-2 my-2"
        />
      ))}
      <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2">가입</button>
    </div>
  );
};

export default RegisterProfessorPage;
