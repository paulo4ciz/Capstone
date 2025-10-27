import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles.css";


export default function Historial() {

  return (
    <main className="page-vision">   

      {/* Hero / encabezado corto con claim */}
      <section className="protecto-hero">
        <div className="protecto-banner">
          <div className="protecto-text"><h1>HISTORIAL</h1>
          <p>
            sección en mantenimiento
          </p>
        </div>
        </div>
      </section>


      <section className="sections">
        <div className="sections__bar">
          <h2> SECCIONES</h2>
        </div>

        <div className="sections__grid">
          <article className="card c1">
            <div className="card__inner">
              <div className="card__num">01</div>
              <h3 className="card__title">Nuestro proyecto</h3>
              <p className="card__desc">Conoce el objetivo, el alcance y cómo “Dónde está la mano” ayuda a la comunidad.</p>
              <a className="card__btn" href="/Proyecto">Ver más</a>
            </div>
          </article>

          <article className="card c2">
            <div className="card__inner">
              <div className="card__num">02</div>
              <h3 className="card__title">Nuestra visión</h3>
              <p className="card__desc">Principios, transparencia de precios y el impacto que buscamos a largo plazo.</p>
              <a className="card__btn" href="/vision">Ver más</a>
            </div>
          </article>

          <article className="card c3">
            <div className="card__inner">
              <div className="card__num">03</div>
              <h3 className="card__title">Historial</h3>
              <p className="card__desc">Avances del proyecto, releases, y registro de cambios importantes.</p>
              <a className="card__btn" href="/Historial">Ver más</a>
            </div>
          </article>
        </div>
      </section>

      

     
    </main>
  );
}
