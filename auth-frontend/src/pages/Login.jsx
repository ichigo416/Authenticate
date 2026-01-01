// src/pages/Login.jsx
import { useState, useEffect } from "react"; // ✅ useEffect ADDED
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  // =======================
  // ✅ GOOGLE SIGN-IN ADDITION
  // =======================
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "351970370806-qg2ia7bnehbmc6a5h8ne34igh28918d5.apps.googleusercontent.com", // 🔴 replace
      callback: handleGoogleLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignIn"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      }
    );
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const res = await api.post("/auth/google", {
        token: response.credential,
      });

      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Google Sign-In failed. Please try again.");
    }
  };
  // =======================

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to continue</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </form>

        {/* ✅ Google Sign-In UI (ADDED ONLY) */}
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <div style={{ margin: "8px 0", color: "#777" }}>OR</div>
          <div id="googleSignIn"></div>
        </div>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
