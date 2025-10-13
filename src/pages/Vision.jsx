import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles.css";


export default function Vision() {
  // Permite navegar directo a una sección con ?section=propuesta|principios|metricas|cta
  const [params] = useSearchParams();
  const section = params.get("section");

  useEffect(() => {
    if (!section) return;
    const el = document.getElementById(`vision-${section}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [section]);

  return (
    <main className="page-vision">   

      {/* Hero / encabezado corto con claim */}
      <section className="vision-hero">
        <div className="vision-banner">
          <div className="vision-text"><h1>Nuestra vision</h1>
          <p>
            En “¿Dónde está la mano?”, creemos en un futuro donde la tecnología
            y la empatía se unen para ayudar a las familias a administrar sus
            recursos de manera inteligente, justa y sostenible.
            Siendo la plataforma referencial para comparar precios de
            productos del <strong>barrio</strong>, entregando{" "}
            <strong>transparencia</strong>, <strong>ahorro</strong> y{" "}
            <strong>confianza</strong> a hogares de menores ingresos,
            adultos mayores y estudiantes.
          </p>
        </div>
        </div>
      </section>

      {/* Propósito / misión */}
      <section id="vision-propuesta" className="vision-section">
        <div className="vision-section__inner">
          <h2 className="vision-section__title">Propósito</h2>
          <p className="vision-text">
            Democratizar la información de precios locales para que cualquier
            persona pueda <strong>tomar mejores decisiones</strong> de compra en
            pocos pasos, reduciendo gastos del mes y optimizando su tiempo.
          </p>
        </div>
      </section>

      {/* Propuesta de valor en tarjetas */}
      <section className="vision-section">
        <div className="vision-section__inner">
          <h2 className="vision-section__title">Propuesta de valor</h2>
          <ul className="vision-cards">
            <li className="vision-card">
              <h3>Transparencia</h3>
              <p>Precios claros, fuentes visibles y datos responsables.</p>
            </li>
            <li className="vision-card">
              <h3>Ahorro real</h3>
              <p>
                Comparación simple por producto/tienda, lista inteligente y
                cálculo de ahorro mensual estimado.
              </p>
            </li>
            <li className="vision-card">
              <h3>Accesibilidad</h3>
              <p>Modo accesible, gama baja y uso sin conexión básico.</p>
            </li>
            <li className="vision-card">
              <h3>Comunidad</h3>
              <p>Visibilidad a negocios del barrio y reseñas responsables.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Principios */}
      <section id="vision-principios" className="vision-section">
        <div className="vision-section__inner">
          <h2 className="vision-section__title">Principios</h2>
          <ol className="vision-list">
            <li>Primero las personas: simple, claro y útil en 30 segundos.</li>
            <li>Datos responsables: trazabilidad, privacidad y fuentes visibles.</li>
            <li>Ligero y rápido: funciona bien en planes/prepagos y gama baja.</li>
            <li>Local primero: foco en negocios del barrio y necesidades reales.</li>
            <li>Impacto medible: decisiones con métricas, no suposiciones.</li>
          </ol>
        </div>
      </section>

      {/* Métricas/objetivos (12 meses) */}
      <section id="vision-metricas" className="vision-section">
        <div className="vision-section__inner">
          <h2 className="vision-section__title">Objetivos medibles (12 meses)</h2>
          <div className="vision-metrics">
            <article className="vision-metric">
              <strong>5.000+</strong>
              <span>usuarios activos mensuales</span>
            </article>
            <article className="vision-metric">
              <strong>150+</strong>
              <span>negocios del barrio visibles</span>
            </article>
            <article className="vision-metric">
              <strong>≥ $15.000</strong>
              <span>ahorro promedio mensual por hogar</span>
            </article>
            <article className="vision-metric">
              <strong>≥ 70%</strong>
              <span>satisfacción (encuestas)</span>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="vision-cta" className="vision-cta">
        <div className="vision-cta__inner">
          <h2>¿Te sumas?</h2>
          <p>
            Si eres vecino, negocio local o quieres colaborar, contáctanos y
            ayudemos a que la mano llegue a quien más lo necesita.
          </p>
         
        </div>
      </section>
    </main>
  );
}
