// src/components/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import loginImg from "../../public/hand.png"; // cambia esta ruta por tu imagen real

const LoginForm = () => {
  const navigate = useNavigate();
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Aquí iría la lógica de login
    console.log("RUT:", rut, "Password:", password);
    navigate("/home");
  };

  const handleRegister = () => {
    navigate("/registro");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Panel Izquierdo (formulario) */}
        <div className="login-left">
          <h2 className="login-title">Iniciar sesion</h2>
          <p className="login-subtitle">Bienvenido a la ruta del ahorro, Por favor inicia sesion</p>

          <form className="login-form">
            <label>Email:</label>
            <input type="email" placeholder="Ingresa tu correo electronico" required />

            <label>Contraseña:</label>
            <div className="password-wrapper">
              <input type="password" placeholder="Ingresa tu contraseña" required />
              <span className="show-pass">👁</span>
            </div>

            <a href="#" className="forgot-link">Olvidaste tu contrase­ña?</a>

            <button type="submit" className="btn-login">Iniciar sesion</button>

            <div className="divider">
              <span>O Continua Con</span>
            </div>

            <div className="social-login">
              <button className="google-btn">Google</button>
              <button className="facebook-btn">Facebook</button>
            </div>

            <p className="signup-text">
              No tienes cuenta? <a href="/register">Registrate</a>
            </p>
          </form>
        </div>

        {/* Panel Derecho (imagen) */}
      <div className="login-right">
        <div className="login-content">
          
          {/* SVG inicial animado */}
          <div className="inicial">
            <svg className="textoini" viewBox="0 0 215 100">
              <text className="textini" x="50%" y="50%" textAnchor="middle">
                Bienvenido
              </text>
            </svg>
          </div>

          {/* SVG secundario (donde aparece el texto después) */}
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

          {/* Imagen login */}
          <div className="login-image">
            <img src={loginImg} alt="login" />
          </div>

        </div>
      </div>
    </div>
  </div>
  );
};

export default LoginForm;

