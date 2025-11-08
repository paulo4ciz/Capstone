// src/pages/MapaPage.jsx
import React from 'react';
import MapaTiendas from '../components/MapaTiendas'; // Importa el componente del mapa
import '../styles.css'; // O tu archivo CSS principal

export default function MapaPage() {
  return (
    <main className="page-mapa" style={{ padding: '20px' }}>
      <section className="vision-hero">
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

    <section className="sections">
        <div className="container">
          <div className="row">
           <div className="col-12 col-xl-4 my-3">
            <div class="card">
             <div class="card-header">
              ¿Dónde esta la mano?
             </div>
             <div class="card-body">
              <h5 class="card-title">Nuestro proyecto</h5>
              <p class="card-text">Conoce el objetivo, el alcance y cómo “Dónde está la mano” ayuda a la comunidad.</p>
              <a href="/Proyecto" class="btn-card">Ver más</a>
             </div>
            </div>
           </div>

            
           <div className="col-12 col-xl-4 my-3">
            <div class="card">
             <div class="card-header">
              ¿Dónde esta la mano?
             </div>
             <div class="card-body">
              <h5 class="card-title">Nuestra visión</h5>
              <p class="card-text">Principios, transparencia de precios y el impacto que buscamos a largo plazo.</p>
              <a href="/vision" class="btn-card">Ver más</a>
             </div>
            </div>
           </div>

           <div className="col-12 col-xl-4 my-3">
            <div class="card">
             <div class="card-header">
              ¿Dónde esta la mano?
             </div>
             <div class="card-body">
              <h5 class="card-title">Historial</h5>
              <p class="card-text">Avances del proyecto, releases, y registro de cambios importantes.</p>
              <a href="/Historial" class="btn-card">Ver más</a>
             </div>
            </div>
           </div>
          </div>
        </div>
      </section>
    </main>
    
  );
  
}