// src/components/MapaTiendas.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Estilos base de Leaflet
import L from 'leaflet'; // Importa Leaflet para el icono

// Corrige el problema del icono por defecto de Leaflet con Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function MapaTiendas() {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Coordenadas aproximadas del centro de Maipú
  const posicionInicial = [-33.51, -70.76];

  useEffect(() => {
    fetch('/tiendas.json') // Carga desde la carpeta public
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar tiendas.json");
        return res.json();
      })
      .then(data => setTiendas(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando mapa...</p>;
  if (error) return <p style={{ color: 'red' }}>Error cargando tiendas: {error}</p>;

  return (
    <MapContainer center={posicionInicial} zoom={14} style={{ height: '500px', width: '100%' }}>
      {/* Capa base del mapa (usando OpenStreetMap, que es gratis) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores para cada tienda */}
      {tiendas.map(tienda => (
        <Marker key={tienda.id} position={[tienda.lat, tienda.lng]}>
          <Popup>
            <strong>{tienda.nombre}</strong><br />
            {tienda.direccion}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}