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

//  FIX ICONOS LEAFLET 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

//  ICONO USUARIO 
const userIcon = new L.Icon({
  iconUrl:"/public/UserMap.png",
  iconSize: [41, 41],
  iconAnchor: [20, 41],
});

//  COMPONENTE PARA MOVER EL MAPA 
function MapMover({ userPos, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (userPos) {
      map.flyTo(userPos, zoom, { duration: 1.2 });
    }
  }, [userPos, zoom, map]);
  return null;
}

//  CONTROL CENTRAR (BOTTOM-RIGHT) 
function BotonCentrar({ userPos }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const customControl = L.control({ position: "bottomright" });

    customControl.onAdd = () => {
      const btn = L.DomUtil.create("button", "btn-centrar-mapa");
      btn.innerHTML = "Centrar";

      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (userPos) map.flyTo(userPos, 16, { duration: 1.2 });
      };

      return btn;
    };

    customControl.addTo(map);

    return () => {
      map.removeControl(customControl);
    };
  }, [map, userPos]);

  return null;
}

export default function MapaTiendas() {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  //  ESTADOS 
  const [tiendas, setTiendas] = useState([]);
  const [loadingTiendas, setLoadingTiendas] = useState(true);

  const [userPos, setUserPos] = useState(null);
  const [direccionConfirmada, setDireccionConfirmada] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [recentAddresses, setRecentAddresses] = useState([]);
  const [showRecent, setShowRecent] = useState(false);

  const [permisoPregunta, setPermisoPregunta] = useState(true);
  const [usarGeolocalizacion, setUsarGeolocalizacion] = useState(false);

  const defaultCenter = [-33.4489, -70.6693];

  //  CARGA TIENDAS 
  useEffect(() => {
    fetch("/tiendas.json")
      .then((res) => res.json())
      .then((data) => setTiendas(data))
      .finally(() => setLoadingTiendas(false));
  }, []);

  //  CARGA DIRECCIONES RECIENTES 
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentAddresses") || "[]");
    setRecentAddresses(stored);

    const last = stored[0];
    if (last) {
      setDireccionConfirmada(last.display_name);
      setManualAddress(last.display_name);
      setUserPos([parseFloat(last.lat), parseFloat(last.lon)]);
    } else {
      setUserPos(defaultCenter);
    }
  }, []);

  //  GUARDAR DIRECCIÓN 
  function guardarDireccionReciente(direccion) {
    const updated = [
      direccion,
      ...recentAddresses.filter((d) => d.display_name !== direccion.display_name),
    ];
    if (updated.length > 5) updated.splice(5);
    setRecentAddresses(updated);
    localStorage.setItem("recentAddresses", JSON.stringify(updated));
  }

  //  GEOLOCALIZACIÓN 
  const activarGeolocalizacion = () => {
    setUsarGeolocalizacion(true);
    setPermisoPregunta(false);

    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setDireccionConfirmada("Mi ubicación actual");
        guardarDireccionReciente({
          display_name: "Mi ubicación actual",
          lat: coords[0],
          lon: coords[1],
        });
      },
      () => alert("No se pudo acceder a la ubicación.")
    );
  };

  const rechazarGeolocalizacion = () => {
    setUsarGeolocalizacion(false);
    setPermisoPregunta(false);
  };

  useEffect(() => {
    if (usarGeolocalizacion) return;

    if (direccionConfirmada && manualAddress === direccionConfirmada) {
      setSuggestions([]);
      return;
    }

    if (!manualAddress.trim()) {
      setSuggestions([]);
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
  }, [manualAddress, usarGeolocalizacion, direccionConfirmada]);

  useEffect(() => {
    const handler = (e) => {
      if (
        !e.target.closest(".barra-direccion-inner") &&
        !e.target.closest(".lista-sugerencias")
      ) {
        setSuggestions([]);
        setShowRecent(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  //  SELECCIONAR DIRECCIÓN 
  function seleccionarDireccion(s) {
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);

    setUserPos([lat, lon]);
    setDireccionConfirmada(s.display_name);
    setManualAddress(s.display_name);

    setSuggestions([]);
    setShowRecent(false);

    guardarDireccionReciente({
      display_name: s.display_name,
      lat,
      lon,
    });
  }

  if (loadingTiendas) return <p>Cargando mapa…</p>;

  return (
    <div className="mapa-container">
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

      {/* BARRA DIRECCIÓN */}
      {!usarGeolocalizacion && !permisoPregunta && (
        <div className="barra-direccion">
          <div className="barra-direccion-inner">
            <input
              type="text"
              placeholder="Ingresa tu dirección…"
              className="input-direccion-barra"
              value={manualAddress}
              onChange={(e) => {
                setManualAddress(e.target.value);
                setDireccionConfirmada("");
              }}
            />

            <button
              className="btn-recientes"
              onClick={() => setShowRecent((prev) => !prev)}
            >
              ▾
            </button>

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

          {showRecent && recentAddresses.length > 0 && (
            <ul className="lista-sugerencias">
              {recentAddresses.map((r, i) => (
                <li
                  key={i}
                  onClick={() =>
                    seleccionarDireccion({
                      display_name: r.display_name,
                      lat: r.lat,
                      lon: r.lon,
                    })
                  }
                >
                  {r.display_name}

                  <span
                    style={{
                      float: "right",
                      color: "red",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = recentAddresses.filter(
                        (x) => x.display_name !== r.display_name
                      );
                      setRecentAddresses(updated);
                      localStorage.setItem("recentAddresses", JSON.stringify(updated));
                    }}
                  >
                    X
                  </span>
                </li>
              ))}
            </ul>
          )}
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
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapMover userPos={userPos} zoom={16} />

        {/* BOTÓN CENTRAR (CONTROL LEAFLET) */}
        <BotonCentrar userPos={userPos} />

        {userPos && <Marker position={userPos} icon={userIcon} />}

        {tiendas.map((t) => (
          <Marker key={t.id} position={[t.lat, t.lng]}>
            <Popup>
              <strong>{t.nombre}</strong>
              <br />
              {t.direccion}
              <br />
              <button
                className="btn-ver-precios"
                onClick={() => navigate(`/tienda/${t.id}`)}
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
