// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import loginImg from "../../public/hand.png"; // misma imagen que en Login

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Ingresa tu nombre.");
    if (!form.email.trim()) return setError("Ingresa tu correo.");
    if (form.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (form.password !== form.confirm) return setError("Las contraseñas no coinciden.");

    try {
      setLoading(true);
      const r = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const payload = await r.json().catch(() => ({}));
      if (!r.ok) return setError(payload?.error || `Error ${r.status}`);

      localStorage.setItem("auth:user", JSON.stringify(payload.user));
      window.dispatchEvent(new Event("auth:user-changed"));
      navigate("/");
    } catch {
      setError("No se pudo registrar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-Login">
      <div className="login-container">
        <div className="login-box">
          {/* Panel izquierdo (form) */}
          <div className="login-left">
            <h2 className="login-title">Crear cuenta</h2>
            <p className="login-subtitle">Únete a la ruta del ahorro ✨</p>

            {error ? <p className="form-error">{error}</p> : null}

            <form onSubmit={onSubmit} className="login-form">
              <label>Nombre</label>
              <input name="name" type="text" value={form.name} onChange={onChange} required />

              <label>Correo</label>
              <input name="email" type="email" value={form.email} onChange={onChange} required />

              <label>Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={onChange} required />

              <label>Confirmar contraseña</label>
              <input name="confirm" type="password" value={form.confirm} onChange={onChange} required />

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Creando..." : "Crear cuenta"}
              </button>

              <p className="signup-text">
                ¿Ya tienes cuenta? <a href="/Login">Inicia sesión</a>
              </p>
            </form>
          </div>

          {/* Panel derecho (visual) */}
          <div className="login-right">
            <div className="login-content">
              {/* SVG inicial (mismo efecto del login) */}
              <div className="inicial">
                <svg className="textoini" viewBox="0 0 215 100">
                  <text className="textini" x="50%" y="50%" textAnchor="middle">
                    Bienvenido
                  </text>
                </svg>
              </div>

              {/* Segundo texto */}
              <div>
                <svg className="textd" viewBox="0 0 200 100">
                  <text className="dtext" x="50%" y="65%" textAnchor="middle">
                    Crea tu cuenta
                  </text>
                  <text className="mano" x="50%" y="100%" textAnchor="middle">
                    ¿Dónde está la mano?
                  </text>
                </svg>
              </div>

              {/* Imagen */}
              <div className="login-image">
                <img src={loginImg} alt="register" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

