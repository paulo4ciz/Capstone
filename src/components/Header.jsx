// src/components/Header.jsx
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Header() {
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
            <Link to="/">Nuestro proyecto</Link>
            <Link to="/productos">Productos</Link>
            <Link to="/historial">Historial</Link>
            <Link to="/Vision">Visión</Link>
          </nav>
        </div>

        {/* Barra de búsqueda */}
        <div className="searchbar">
          <SearchBar compact />
          <button className="nav">
            <Link to="/Login" >Iniciar sesion</Link>
          </button>
        </div>
      </div>

    </header>
  );
}
