// src/components/MapaTiendas.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Componente para mover el mapa cuando cambia userPos
function MapMover({ userPos, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (userPos && map) {
      map.flyTo(userPos, zoom, { duration: 1.2 });
    }
  }, [userPos, zoom, map]);
  return null;
}

export default function MapaTiendas() {
  const navigate = useNavigate();
  const [tiendas, setTiendas] = useState([]);
  const [loadingTiendas, setLoadingTiendas] = useState(true);
  const [userPos, setUserPos] = useState(null);

  const [permisoPregunta, setPermisoPregunta] = useState(true);
  const [usarGeolocalizacion, setUsarGeolocalizacion] = useState(false);

  const [manualAddress, setManualAddress] = useState("");
  const [direccionTexto, setDireccionTexto] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentAddresses, setRecentAddresses] = useState([]);

  const mapRef = useRef(null);
  const defaultCenter = [-33.4489, -70.6693]; // Santiago Centro

  // ======= CARGAR TIENDAS =======
  useEffect(() => {
    fetch("/tiendas.json")
      .then((res) => res.json())
      .then((data) => setTiendas(data))
      .finally(() => setLoadingTiendas(false));
  }, []);

  // ======= GEOLOCALIZACION =======
  const activarGeolocalizacion = () => {
    setUsarGeolocalizacion(true);
    setPermisoPregunta(false);
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => alert("No se pudo acceder a la ubicación.")
    );
  };
  const rechazarGeolocalizacion = () => {
    setUsarGeolocalizacion(false);
    setPermisoPregunta(false);
    setUserPos(defaultCenter);
  };

  // ======= CARGAR DIRECCIONES RECIENTES =======
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentAddresses") || "[]");
    setRecentAddresses(stored);
  }, []);

  function guardarDireccionReciente(direccion) {
    const updated = [direccion, ...recentAddresses.filter(d => d.lat !== direccion.lat || d.lon !== direccion.lon)];
    if (updated.length > 5) updated.splice(5);
    setRecentAddresses(updated);
    localStorage.setItem("recentAddresses", JSON.stringify(updated));
  }

  // ======= BUSCADOR MANUAL =======
  useEffect(() => {
    if (usarGeolocalizacion) return;

    if (manualAddress.trim().length < 1) {
      setSuggestions(recentAddresses);
      return;
    }

    const delay = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${manualAddress}`
      )
        .then((res) => res.json())
        .then((data) => setSuggestions(data.slice(0, 5)))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(delay);
  }, [manualAddress, usarGeolocalizacion, recentAddresses]);

  function seleccionarDireccion(s) {
    if (!s) return;
    let lat = parseFloat(s.lat);
    let lon = parseFloat(s.lon);
    let nombre = s.display_name || manualAddress;

    if (!lat || !lon) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${nombre}`)
        .then((res) => res.json())
        .then((data) => {
          if (data[0]) {
            lat = parseFloat(data[0].lat);
            lon = parseFloat(data[0].lon);
            flyToSelected(lat, lon, nombre);
          } else {
            alert("No se pudo encontrar la ubicación");
          }
        });
    } else {
      flyToSelected(lat, lon, nombre);
    }
  }

  function flyToSelected(lat, lon, nombre) {
    setUserPos([lat, lon]);
    setDireccionTexto(nombre);
    setManualAddress(nombre);
    setSuggestions([]);
    guardarDireccionReciente({ display_name: nombre, lat, lon });
    // Zoom amplio ~10 cuadras
  }

  if (loadingTiendas) return <p>Cargando mapa…</p>;

  return (
    <div className="mapa-container">
      {/* MODAL UBICACION */}
      {permisoPregunta && (
        <div className="ubicacion-modal">
          <div className="ubicacion-modal-content">
            <h2>¿Deseas activar tu ubicación?</h2>
            <p>Esto permitirá centrar el mapa automáticamente.</p>
            <div className="ubicacion-modal-buttons">
              <button className="btn-ubicacion-si" onClick={activarGeolocalizacion}>
                Sí, activar
              </button>
              <button className="btn-ubicacion-no" onClick={rechazarGeolocalizacion}>
                No, ingresar dirección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA DIRECCION MANUAL */}
      {!usarGeolocalizacion && !permisoPregunta && (
        <div className="barra-direccion">
          <div className="barra-direccion-inner">
            <input
              type="text"
              placeholder="Ingresa tu dirección…"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              className="input-direccion-barra"
            />
            <button
              className="btn-confirmar-direccion"
              onClick={() => {
                if (suggestions[0]) seleccionarDireccion(suggestions[0]);
              }}
            >
              Confirmar
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="lista-sugerencias">
              {suggestions.map((s, idx) => (
                <li key={idx} onClick={() => seleccionarDireccion(s)}>
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* DIRECCION ACTUAL */}
      {direccionTexto && (
        <div className="direccion-actual">
          {direccionTexto}
        </div>
      )}

      {/* MAPA */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        whenCreated={(map) => (mapRef.current = map)}
        className="leaflet-map"
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapMover userPos={userPos} zoom={16.5} />

        {userPos && <Marker position={userPos} icon={userIcon}></Marker>}

        {tiendas.map((t) => (
          <Marker key={t.id} position={[t.lat, t.lng]}>
            <Popup>
              <strong>{t.nombre}</strong>
              <br />
              {t.direccion}
              <br />
              <button
                className="btn-ver-precios"
                onClick={() => navigate(`/tienda/${t.id}?stores=acuenta`)}
              >
                Ver productos y precios
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
