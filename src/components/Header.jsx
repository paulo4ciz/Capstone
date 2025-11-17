// src/components/Header.jsx
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";



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


    <><header className="site-header shadow-sm sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid container-xl">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <span>¿Dónde esta la mano?</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/productos" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Productos</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/Proyecto" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Proyecto</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/Vision" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Visión</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/mapa" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Mapa</NavLink>
              </li>
            </ul>

            {/* En pantallas grandes mostramos el searchbar y botones alineados a la derecha */}
            <div className="d-flex align-items-center">
              <div className="searchbar">
                <SearchBar compact />
              </div>

              {!user ? (

                <div className="d-flex gap-2">
                  <Link to="/Login" className="btn-login-header">Iniciar sesión</Link>
                  <Link to="/Register" className="btn-registro">Registrarse</Link>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <span className="me-2 hello">Hola, {user.name || user.email}</span>
                  <Link to="/mi-historial" className="btn btn-outline-secondary">Mi historial</Link>
                  <button className="btn btn-outline-danger" onClick={logout}>Cerrar sesión</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
          <div className="marquee">
     <p>¿Te gustaría que tus productos o tu almacén se vean en nuestro sitio y asi llegar a más personas que buscan su Canasta Básica? Únete a nuestro proyecto, muy pronto contaremos con formulario de contacto</p>
    </div>
    </header>

    </>
  );
}
