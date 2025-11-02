// src/components/Header.jsx
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Link, useNavigate, useLocation } from "react-router-dom";



export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const read = () => {
      try {
        const u = JSON.parse(localStorage.getItem("auth:user") || "null");
        setUser(u);
      } catch { }
    };
    read();
    // si se abre otra pestaña y cierra sesión, sincroniza
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);
const location = useLocation();

// Re-lee user cuando cambia la ruta (navegación)
useEffect(() => {
  try {
    const u = JSON.parse(localStorage.getItem("auth:user") || "null");
    setUser(u);
  } catch {}
}, [location.key]);

// Escucha un evento custom para cambios de sesión en la MISMA pestaña
useEffect(() => {
  const onAuthChanged = () => {
    try {
      const u = JSON.parse(localStorage.getItem("auth:user") || "null");
      setUser(u);
    } catch {}
  };
  window.addEventListener("auth:user-changed", onAuthChanged);
  return () => window.removeEventListener("auth:user-changed", onAuthChanged);
}, []);

  const logout = () => {
    localStorage.removeItem("auth:user");
    setUser(null);
    navigate("/"); // vuelve al home
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand">
          <img
            src="/hand.png"
            alt="mano abierta"
            width={28}
            height={28}
            style={{ borderRadius: 6 }}
          />

          {/* Marca principal */}
          <Link to="/" className="brand-title">
            ¿Dónde está la mano?
          </Link>

          {/* Menú de navegación */}
          <nav className="nav">
            <Link to="/productos">Productos</Link>
            <Link to="/Proyecto">Proyecto</Link>
            <Link to="/Vision">Visión</Link>
          </nav>
        </div>

        {/* Barra de búsqueda */}
        <div className="searchbar">
          <SearchBar compact />
        </div>

        {/* Botones de auth / sesión */}
        {!user ? (
          <div className="auth-btns">
            <button className="nav">
              <Link to="/Login">Iniciar sesion</Link>
            </button>
            <button className="nav">
              <Link to="/Register">Registrarse</Link>
            </button>
          </div>
        ) : (
          <div className="auth-user">
            <span className="hello">Hola, {user.name || user.email}</span>

            <button className="nav">
              <Link to="/mi-historial">Mi historial</Link>
            </button>

            <button className="nav" onClick={logout}>
              Terminar sesión
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
