// Si tu logo está en /public, usa "/logo.png". 
// Si lo tienes en src/assets, importa: import logo from "../assets/logo.png";
export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
   <footer className="text-white">
    <div className="container py-5 px-4">
      <div className="row g-4">
        <div className="col-md-6">
          <h3 className="h5 fw-bold mb-4">Contacto</h3>
           <ul className="list-unstyled">
            <li className="d-flex align-items-center gap-2 mb-2">
             <span>📧</span><span>https://www.dondestalamano.cl</span>
            </li>
            <li className="d-flex align-items-center gap-2 mb-2">
             <span>📱</span><span>+56 9999999</span>
            </li>
            <li className="d-flex align-items-center gap-2">
             <span>📍</span><span>Av. Esq. Blanca 501, 9251863 Maipú, Región Metropolitana</span>
            </li>
           </ul>
        </div>
        <div className="col-md-6">
         <h3 className="h5 fw-bold mb-4">Síguenos</h3>
          <div className="d-flex gap-4">
            <a href="#" className="text-white text-decoration-none hover-primary">Facebook</a>
            <a href="#" className="text-white text-decoration-none hover-primary">Twitter</a>
            <a href="#" className="text-white text-decoration-none hover-primary">Instagram</a>
          </div>
        </div>
       </div>
       <div className="border-top border-secondary mt-4 pt-4 text-center">
        <p className="mb-0">© 2025 Donde Está la Mano. Todos los derechos reservados.</p>
       </div>
      </div>
     </footer>
  );
}
