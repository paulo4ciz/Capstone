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


      <section className="vision-hero ">
        <div className="container py-5">

          <div className="row  align-items-center">
            <div className="col-12 col-md-10 col-lg-6">
              <h1 className="fw-bold display-5">Nuestra visión</h1>
              <p className="lead mb-3 text-white">
                En “¿Dónde está la mano?”, creemos en un futuro donde la tecnología y la empatía se unen para ayudar a las familias a administrar sus recursos de manera inteligente, justa y sostenible. Siendo la plataforma referencial para comparar precios de productos del barrio, entregando transparencia, ahorro y confianza a hogares de menores ingresos, adultos mayores y estudiantes.
              </p>
            </div>
            <div className="row  align-items-center">
              <div className="col-12 col-md-10 col-lg-6">
                <h1 className="fw-bold display-5 mt-4">Propósito</h1>
                <p className="lead mb-0 text-white">
                  Democratizar la información de precios locales para que cualquier
                  persona pueda <strong>tomar mejores decisiones</strong> de compra en
                  pocos pasos, reduciendo gastos del mes y optimizando su tiempo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Propuesta de valor en tarjetas */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="h3 fw-bold">Propuesta de valor</h2>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <div className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5 card-title fw-bold  ">Transparencia</h3>
                  <p className="card-text">Precios claros, fuentes visibles y datos responsables.</p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5 card-title fw-bold">Ahorro real</h3>
                  <p className="card-text">
                    Comparación simple por producto/tienda, lista inteligente y
                    cálculo de ahorro mensual estimado.
                  </p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5 card-title fw-bold">Accesibilidad</h3>
                  <p className="card-text">Modo accesible, gama baja y uso sin conexión básico.</p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5 card-title fw-bold">Comunidad</h3>
                  <p className="card-text">Visibilidad a negocios del barrio y reseñas responsables.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principios */}
      <section className="vision-principios text-white py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="h3 fw-bold text-center mb-4">Principios</h2>
              <ol className="principios">
                <li>Primero las personas: simple, claro y útil en 30 segundos.</li>
                <li>Datos responsables: trazabilidad, privacidad y fuentes visibles.</li>
                <li>Ligero y rápido: funciona bien en planes/prepagos y gama baja.</li>
                <li>Local primero: foco en negocios del barrio y necesidades reales.</li>
                <li>Impacto medible: decisiones con métricas, no suposiciones.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas/objetivos (12 meses) */}
      <section id="vision-metricas" className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="h3 fw-bold">Objetivos medibles (12 meses)</h2>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            <div className="col">
              <article className="text-center border rounded-3 p-4 h-100">
                <strong className="d-block fs-3 mb-2">5.000+</strong>
                <span className="text-secondary">usuarios activos mensuales</span>
              </article>
            </div>
            <div className="col">
              <article className="text-center border rounded-3 p-4 h-100">
                <strong className="d-block fs-3 mb-2">150+</strong>
                <span className="text-secondary">negocios del barrio visibles</span>
              </article>
            </div>
            <div className="col">
              <article className="text-center border rounded-3 p-4 h-100">
                <strong className="d-block fs-3 mb-2">≥ $15.000</strong>
                <span className="text-secondary">ahorro promedio mensual por hogar</span>
              </article>
            </div>
            <div className="col">
              <article className="text-center border rounded-3 p-4 h-100">
                <strong className="d-block fs-3 mb-2">≥ 70%</strong>
                <span className="text-secondary">satisfacción (encuestas)</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="vision-cta py-5 text-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 text-center">
              <h2 className="h3 fw-bold mb-3">¿Te sumas?</h2>
              <p className="lead mb-0">
                Si eres vecino, negocio local o quieres colaborar, contáctanos y
                ayudemos a que la mano llegue a quien más lo necesita.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas de navegación entre secciones */}
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
