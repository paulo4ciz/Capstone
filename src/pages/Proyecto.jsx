import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles.css";


export default function Proyecto() {

  return (
    <main className="page-vision">   

      {/* Hero / encabezado corto con claim */}
      <section className="protecto-hero">
        <div className="protecto-banner">
          <div className="protecto-text"><h1>Nuestro Proyecto</h1>
          <p>
            “Dónde está la Mano” es una plataforma chilena 
            pensada para que familias, estudiantes y personas mayores encuentren 
            el mejor precio en productos de uso diario. En pocos segundos, comparas opciones de 
            distintas tiendas y ves los resultados claros y ordenados de menor a mayor precio, con nombre, 
            foto y comercio. Nuestro objetivo es simple: ahorrarte dinero y tiempo, entregándote 
            información transparente para decidir mejor cada compra.
          </p>
        </div>
        </div>
      </section>


      <section className="intro">
        <div className="intro__inner">
          <h2 className="intro__title">
            <span className="intro__number">01</span> / INTRODUCCIÓN
          </h2>
          <p>
            <strong>Dónde está la mano</strong> nace como una plataforma pensada para apoyar a hogares de menores ingresos,
            adultos mayores y estudiantes que enfrentan dificultades al momento de organizar sus gastos o acceder a
            información clara sobre precios de productos básicos.
          </p>
          <p>
            A diferencia de los grupos de WhatsApp, Facebook o el boca a boca entre vecinos, nuestro proyecto busca entregar
            <strong> transparencia y confianza</strong>, ayudando a las personas a encontrar los precios más convenientes de forma
            simple y rápida, optimizando su tiempo y mejorando su economía familiar.
          </p>
          <p>
            Este espacio es la base de nuestra visión: aportar a la comunidad con una herramienta gratuita, accesible y
            confiable, que fomente el ahorro y genere un impacto real en la vida de las personas.
          </p>
        </div>
      </section>

      
      <section className="video-section">
        <div className="video-header">
          <h2><span>02</span> / ACERCA DE LA CANASTA FAMILIAR</h2>
        </div>

        <div className="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/lW94jBzc5YM"
            title="Video del proyecto"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>

      

 <section className="sections">
        <div className="sections__bar">
          <h2><span>03</span> / SECCIONES</h2>
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
