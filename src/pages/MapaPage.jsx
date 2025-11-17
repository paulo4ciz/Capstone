// src/pages/MapaPage.jsx
import React from 'react';
import MapaTiendas from '../components/MapaTiendas'; // Importa el componente del mapa
import '../styles.css'; // O tu archivo CSS principal

export default function MapaPage() {
  return (
    <main className="page-mapa" style={{ padding: '20px' }}>
      <section className="maps-hero">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="text-center my-3">
                 Mapa de Tiendas Cercanas
              </h2>
            </div>
          </div>
        </div>
      </section>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
      </h1>
      <section>
        <MapaTiendas /> {/* Renderiza el componente del mapa aquí */}
      </section>

  <section className="py-5 sections">
  <div className="container">
    <div className="row">
      <div className="col-12 col-md-4 mb-4">
        <div className="card h-100 shadow-sm">
          <div className="card-header fw-semibold">
            ¿Dónde está la mano?
          </div>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-bold">Nuestro proyecto</h5>
            <p className="card-text">
              Conoce el objetivo, el alcance y cómo “Dónde está la mano” ayuda a la comunidad.
            </p>
            <a href="/Proyecto" className="btn btn-outline-dark mt-auto">
              Ver más
            </a>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4 mb-4">
        <div className="card h-100 shadow-sm">
          <div className="card-header fw-semibold">
            ¿Dónde está la mano?
          </div>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-bold">Nuestra visión</h5>
            <p className="card-text">
              Principios, transparencia de precios y el impacto que buscamos a largo plazo.
            </p>
            <a href="/vision" className="btn btn-outline-dark mt-auto">
              Ver más
            </a>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4 mb-4">
        <div className="card h-100 shadow-sm">
          <div className="card-header fw-semibold">
            ¿Dónde está la mano?
          </div>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-bold">Historial</h5>
            <p className="card-text">
              Avances del proyecto, releases, y registro de cambios importantes.
            </p>
            <a href="/Historial" className="btn btn-outline-dark mt-auto">
              Ver más
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </main>
    
  );
  
}