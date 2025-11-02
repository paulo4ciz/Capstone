// src/components/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles.css";
import loginImg from "../../public/hand.png"; // puedes seguir usando esta imagen

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Ingresa correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const payload = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(payload?.error || `Error ${r.status}`);
        return;
      }

      // Sesión mínima
      localStorage.setItem("auth:user", JSON.stringify(payload.user));
      window.dispatchEvent(new Event("auth:user-changed"));
      navigate("/"); // al Home, el Header ya mostrará "Terminar sesión"
    } catch {
      setError("No se pudo iniciar sesión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <div className="login-container">
      <div className="login-box">
        {/* Panel Izquierdo (formulario) */}
        <div className="login-left">
          <h2 className="login-title">Iniciar sesión</h2>
          <p className="login-subtitle">Bienvenido a la ruta del ahorro, por favor inicia sesión</p>

          {error && <p className="form-error">{error}</p>}

          <form className="login-form" onSubmit={onSubmit}>
            <label>Email:</label>
            <input
              name="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Contraseña:</label>
            <div className="password-wrapper">
              <input
                name="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="show-pass" aria-hidden="true"></span>
            </div>

            <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <div className="divider">
              <span>O continúa con</span>
            </div>

            <div className="social-login">
              <button type="button" className="google-btn">Google</button>
              <button type="button" className="facebook-btn">Facebook</button>
            </div>

            <p className="signup-text">
              ¿No tienes cuenta? <Link to="/Register">Regístrate</Link>
            </p>
          </form>
        </div>

        {/* Panel Derecho (imagen + SVGs que ya tenías) */}
        <div className="login-right">
          <div className="login-content">
            <div className="inicial">
              <svg className="textoini" viewBox="0 0 215 100">
                <text className="textini" x="50%" y="50%" textAnchor="middle">
                  Bienvenido
                </text>
              </svg>
            </div>

            <div>
              <svg className="textd" viewBox="0 0 200 100">
                <text className="dtext" x="50%" y="65%" textAnchor="middle">
                  ¿Dónde está
                </text>
                <text className="mano" x="50%" y="100%" textAnchor="middle">
                  la mano?
                </text>
              </svg>
            </div>

            <div className="login-image">
              <img src={loginImg} alt="login" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
