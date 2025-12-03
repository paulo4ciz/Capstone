import { useState } from 'react';
import { useFontSize } from '../context/FontSizeContext';

export default function FontSizeWidget() {
  const { fontSize, increaseFont, decreaseFont, resetFont } = useFontSize();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fontsize-widget">
      {/* Menú desplegable */}
      {isOpen && (
        <div className="fontsize-menu shadow-sm">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small fw-bold text-muted">Tamaño: {fontSize}%</span>
            <button onClick={resetFont} className="btn btn-sm btn-link text-decoration-none p-0" title="Restablecer">
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
          
          <div className="d-flex gap-2">
            <button onClick={decreaseFont} className="btn btn-outline-dark btn-sm flex-fill" disabled={fontSize <= 75}>
              A-
            </button>
            <button onClick={increaseFont} className="btn btn-outline-dark btn-sm flex-fill" disabled={fontSize >= 150}>
              A+
            </button>
          </div>
        </div>
      )}

      {/* Botón Flotante Principal */}
      <button 
        className={`btn-fontsize-float ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Ajustar tamaño de letra"
      >
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>A</span>
      </button>
    </div>
  );
}