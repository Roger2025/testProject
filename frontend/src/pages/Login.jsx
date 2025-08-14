import React, { useState } from "react";
import { Link } from "react-router-dom";
import JumpImage from "../utils/JumpImg";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("登入中...");
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg("✅ 登入成功！");
        // 你可以在這裡導向首頁或其他頁面
      } else {
        const err = await res.text();
        setMsg("❌ 登入失敗：" + err);
      }
    } catch (err) {
      setMsg("❌ 網路錯誤：" + err.message);
    }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
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
          width: 350,
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
          <Link to="/"><JumpImage /></Link>
          使用者登入
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
          <Link to='/MC'>
          <button
            type="submit"
            name="action"
            value={"login"}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "12px 0",
              background: "linear-gradient(90deg,#f6d365 0%,#ff9256 100%)",
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
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.8)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
            onMouseOver={(e)=>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            登入
          </button>
          </Link>
          <Link to="/Register">
          <button
            type="submit"
            name="action"
            value={"register"}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "12px 0",
              background: "linear-gradient(90deg,#f6d365 0%,#ff9256 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(255,146,86,0.16)",
              transition: "transform 0.08s",
              value:"reg",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.8)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
            onMouseOver={(e)=>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            註冊
            </button>
          </Link>
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
        {label}
        {required && <span style={{ color: "#ff9256" }}> *</span>}
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
        onFocus={(e) =>
          (e.target.style.border = "1.5px solid #ff9256")
        }
        onBlur={(e) =>
          (e.target.style.border = "1.5px solid #e0e0e0")
        }
        autoComplete="off"
      />
    </div>
  );
}
//src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 標準樣式
import '../assets/ogani/css/style.css';          // Ogani 自定義樣式主檔
import '../assets/ogani/css/font-awesome.min.css'; // 如需圖示支援


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => navigate('/dashboard'))
      .catch(err => alert(err.message));
  };

  return (
    <div className="container mt-5">
      <h2>商家登入</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">密碼</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">登入</button>
      </form>
    </div>
  );
};

export default Login;