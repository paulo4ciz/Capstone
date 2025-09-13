// src/components/Body.jsx
function Body(){
  return (
    <main>
      {/* Banner full-width */}
      <section className="banner">
        <img src="/banner1.png" alt="Banner del proyecto" />
        </section>
      <section class="intro">
  <div class="intro__inner">
    <h2 class="intro__title">
      <span class="intro__number">01</span> / INTRODUCCIÓN
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
<section class="video-section">
  <div class="video-header">
    <h2><span>02</span> / VIDEO</h2>
  </div>

  <div class="video-wrapper">
  <iframe
    src="https://www.youtube.com/embed/9TTWUoE7gwk"
    title="Video del proyecto"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>
</section>
<section class="sections">
  <div class="sections__bar">
    <h2><span>03</span> / SECCIONES</h2>
  </div>

  <div class="sections__grid">
  
    <article class="card c1">
      <div class="card__inner">
        <div class="card__num">01</div>
        <h3 class="card__title">Nuestro proyecto</h3>
        <p class="card__desc">Conoce el objetivo, el alcance y cómo “Dónde está la mano” ayuda a la comunidad.</p>
        <a class="card__btn" href="#proyecto">Ver más</a>
      </div>
    </article>

   
    <article class="card c2">
      <div class="card__inner">
        <div class="card__num">02</div>
        <h3 class="card__title">Nuestra visión</h3>
        <p class="card__desc">Principios, transparencia de precios y el impacto que buscamos a largo plazo.</p>
        <a class="card__btn" href="#vision">Ver más</a>
      </div>
    </article>

   
    <article class="card c3">
      <div class="card__inner">
        <div class="card__num">03</div>
        <h3 class="card__title">Historial</h3>
        <p class="card__desc">Avances del proyecto, releases, y registro de cambios importantes.</p>
        <a class="card__btn" href="#historial">Ver más</a>
      </div>
    </article>
  </div>
</section>
    </main>
  );
}
export default Body;
