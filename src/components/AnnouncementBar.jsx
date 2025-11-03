export default function AnnouncementBar({
  text = "¿Tienes una tienda o almacén? Muy pronto formulario de contacto.",
  speed = 25, // segundos por ciclo
}) {
  return (
    <div className="announce-bar" role="region" aria-label="Aviso importante">
      <div className="ticker" style={{ "--speed": `${speed}s` }}>
        <div className="ticker__track">
          {/* duplicamos el contenido para loop continuo */}
          <div className="ticker__content">{text}</div>
          <div className="ticker__content" aria-hidden="true">{text}</div>
        </div>
      </div>
    </div>
  );
}
