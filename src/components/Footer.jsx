// Si tu logo está en /public, usa "/logo.png". 
// Si lo tienes en src/assets, importa: import logo from "../assets/logo.png";
export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="site-footer" role="contentinfo">
      {/* zona principal */}
      <div className="site-footer__inner">
        {/* Logo */}
        <div className="footer-brand" aria-label="Marca">
          <img src="/hand.png" alt="Dónde está la mano" />
        </div>

        {/* Contacto */}
        <div className="footer-contact">
          <h3>Contacto</h3>

          <ul className="contact-list">
            <li>
              <span className="ico" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
              </span>
              <div>
                <div className="label">Dirección</div>
                <div>Av. Esq. Blanca 501, 9251863 Maipú, Región Metropolitana</div>
              </div>
            </li>

            <li className="contact-sep" aria-hidden="true" />

            <li>
              <span className="ico" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.1-.24 11.7 11.7 0 0 0 3.7.6 1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1A17.9 17.9 0 0 1 2 5a1 1 0 0 1 1-1h3.6a1 1 0 0 1 1 1 11.7 11.7 0 0 0 .6 3.7 1 1 0 0 1-.24 1.1z"/></svg>
              </span>
              <div>
                <div className="label">Teléfono</div>
                <div>+56 9999999</div>
              </div>
            </li>

            <li>
              <span className="ico" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm7.9 9h-3.2a15 15 0 0 0-1.2-6A8.02 8.02 0 0 1 19.9 11zM12 4c.9 1.3 1.9 3.7 2.1 7H9.9c.2-3.3 1.2-5.7 2.1-7zM8.5 4.9a15 15 0 0 0-1.2 6H4.1A8.02 8.02 0 0 1 8.5 4.9zM4.1 13h3.2c.1 2.2.7 4.3 1.6 6A8.02 8.02 0 0 1 4.1 13zm7.9 7c-.9-1.3-1.9-3.7-2.1-7h4.2c-.2 3.3-1.2 5.7-2.1 7zm4.4-1a15 15 0 0 0 1.6-6h3.2a8.02 8.02 0 0 1-4.8 6z"/></svg>
              </span>
              <div>
                <div className="label">Web</div>
                <div>
                  <a className="footer-link" href="https://www.duocuc.cl" target="_blank" rel="noreferrer">
                    https://www.duocuc.cl
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* barra inferior */}
      <div className="site-footer__bottom">
        <div className="copy">
          2025 © Copyrights. Diseñado por <a className="footer-link" href="#">Grupo 2 Capstone</a>
        </div>

        <nav className="social" aria-label="Redes">
          <a className="s s-fb" href="#" aria-label="Facebook" />
          <a className="s s-in" href="https://www.instagram.com/dondeestalamano" aria-label="LinkedIn" />
          <a className="s s-x"  href="#" aria-label="X" />
          <a className="s s-yt" href="https://www.youtube.com/@DondeestálaMano" aria-label="YouTube" />
        </nav>

        <button type="button" className="to-top" onClick={scrollTop} aria-label="Volver arriba">
          <svg viewBox="0 0 24 24"><path d="M12 8l6 6H6l6-6z"/></svg>
        </button>
      </div>
    </footer>
  );
}
