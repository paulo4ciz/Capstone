// src/components/Header.jsx
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand">
          <img src="/hand.png" alt="mano abierta" width={28} height={28} style={{ borderRadius: 6 }}  />
        
          <a href="home">¿Dónde está la mano?</a>
          <nav className="nav">
            <a href="#">Nuestros proyecto</a>
            <a href="/productos">Productos</a>
            <a href="#">Historial</a>
            <a href="#">Visión</a>
          </nav>
        </div>

        {/* Aquí usamos nuestro componente SearchBar */}
        <div className="searchbar">
          <SearchBar compact />
        </div>
      </div>
    </header>
  );
}
