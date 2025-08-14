import React, { useState } from "react";

export default function UserRegister() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    lineId: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("註冊中...");
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg("✅ 註冊成功！");
        setForm({
          username: "",
          password: "",
          name: "",
          email: "",
          phone: "",
          lineId: "",
        });
      } else {
        const err = await res.text();
        setMsg("❌ 註冊失敗：" + err);
      }
    } catch (err) {
      setMsg("❌ 網路錯誤：" + err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "36px 40px 32px 40px",
          width: 380,
          maxWidth: "90vw",
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 1,
            marginBottom: 18,
            color: "#ff9256",
            textAlign: "center",
          }}
        >
          使用者註冊
        </h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <FormInput
            label="帳號"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <FormInput
            label="密碼"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <FormInput
            label="姓名"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <FormInput
            label="電話"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <FormInput
            label="Line ID"
            name="lineId"
            value={form.lineId}
            onChange={handleChange}
          />
          <button
            type="submit"
            style={{
              marginTop: 16,
              width: "100%",
              padding: "12px 0",
              background:
                "linear-gradient(90deg,#f6d365 0%,#ff9256 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(255,146,86,0.16)",
              transition: "transform 0.08s",
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            註冊
          </button>
        </form>
        {msg && (
          <div
            style={{
              marginTop: 24,
              color: msg.startsWith("✅") ? "#20c997" : "#ff6256",
              textAlign: "center",
              fontWeight: 600,
              fontSize: 16,
              minHeight: 22,
            }}
          >
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}

// 表單欄位元件 (更整齊美觀)
function FormInput({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={name}
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 16,
          fontWeight: 500,
          color: "#333",
          letterSpacing: 0.5,
        }}
      >
        {label}{required && <span style={{ color: "#ff9256" }}> *</span>}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding: "11px 12px",
          fontSize: 16,
          border: "1.5px solid #e0e0e0",
          borderRadius: 8,
          outline: "none",
          background: "#faf9f8",
          transition: "border 0.2s",
        }}
        onFocus={e => (e.target.style.border = "1.5px solid #ff9256")}
        onBlur={e => (e.target.style.border = "1.5px solid #e0e0e0")}
        autoComplete="off"
      />
    </div>
  );
}
