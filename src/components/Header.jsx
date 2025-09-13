// Header.jsx (ya estático)
export default function Header(){
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand">
          <img src="/hand.png" alt="mano abierta" width={28} height={28} style={{borderRadius:6}}/>
          ¿Dónde está la mano?
          <nav className="nav">
            <a href="#">Nuestros proyecto</a>
            <a href="#">Productos</a>
            <a href="#">hisorial</a>
            <a href="#">visión</a>
          </nav>
        </div>
        <div className="searchbar">
          <input type="text" placeholder="¿Qué estás buscando?" aria-label="Buscar"/>
          <button type="button" aria-label="Buscar">🔍</button>
        </div>
      </div>
    </header>
  );
}
