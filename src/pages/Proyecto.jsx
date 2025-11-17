import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles.css";


export default function Proyecto() {

  return (
    <main className="page-vision">   

      {/* Hero / encabezado corto con claim */}
 
    <section className="proyect-hero">
        <div className="container py-5">

          <div className="row  align-items-center">
            <div className="col-12 col-md-10 col-lg-6">
              <h1 className="fw-bold display-5">Nuestro Proyecto</h1>
              <p className="lead mb-3 text-white">
               “Dónde está la Mano” es una plataforma chilena pensada para que familias, estudiantes y personas mayores encuentren el mejor precio en productos de uso diario. En pocos segundos, comparas opciones de distintas tiendas y ves los resultados claros y ordenados de menor a mayor precio, con nombre, foto y comercio. Nuestro objetivo es simple: ahorrarte dinero y tiempo, entregándote información transparente para decidir mejor cada compra.
              </p>
            </div>
      
          </div>
        </div>
    </section>

       <section className="my-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="h3 fw-bold">INTRODUCCIÓN</h2>
                   <p>
            <strong>Dónde está la mano</strong> nace como una plataforma pensada
            para apoyar a hogares de menores ingresos, adultos mayores y estudiantes
            que enfrentan dificultades al momento de organizar sus gastos o acceder
            a información clara sobre precios de productos básicos.
          </p>
          <p>
            A diferencia de los grupos de WhatsApp, Facebook o el boca a boca entre
            vecinos, nuestro proyecto busca entregar
            <strong> transparencia y confianza</strong>, ayudando a las personas a
            encontrar los precios más convenientes de forma simple y rápida,
            optimizando su tiempo y mejorando su economía familiar.
          </p>
          <p>
            Este espacio es la base de nuestra visión: aportar a la comunidad con
            una herramienta gratuita, accesible y confiable, que fomente el ahorro
            y genere un impacto real en la vida de las personas.
          </p>
            </div>
          </div>

         
        </div>
      </section>

 

{/* VIDEO / CANASTA FAMILIAR */}
<section className="video-section py-5 bg-white">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 text-center">
        <h2 className="h4 fw-bold mb-4 text-uppercase text-dark">
         ACERCA DE LA CANASTA FAMILIAR
        </h2>
        <div className="ratio ratio-16x9 rounded overflow-hidden shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/lW94jBzc5YM?rel=0"
            title="Video del proyecto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  </div>
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
