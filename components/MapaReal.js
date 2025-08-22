// components/MapaReal.js
"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";

function clamp01(v) { return Math.min(1, Math.max(0, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

function statusToProgress(estado) {
  if (!estado) return 0;
  const e = String(estado).toLowerCase();
  if (e.includes("almac")) return 0.1;
  if (e.includes("salid") || e.includes("desp")) return 0.25;
  if (e.includes("trán") || e.includes("trans") || e.includes("mar")) return 0.6;
  if (e.includes("puerto")) return 0.8;
  if (e.includes("entreg") || e.includes("final")) return 1.0;
  return 0.4;
}

/**
 * Props esperadas:
 * - estado (string)
 * - coords: { lat, lng }  // posición del barco (si viene)
 * - origen: { lat, lng, nombre }
 * - destino: { lat, lng, nombre }
 */
export default function MapaReal({ estado, coords, origen, destino }) {
  const ORIGEN = origen?.lat && origen?.lng ? [origen.lat, origen.lng] : [25.7617, -80.1918];
  const DESTINO = destino?.lat && destino?.lng ? [destino.lat, destino.lng] : [23.0419, -82.7859];

  const t = clamp01(statusToProgress(estado));
  const interp = [ lerp(ORIGEN[0], DESTINO[0], t), lerp(ORIGEN[1], DESTINO[1], t) ];
  const shipPos = (coords?.lat && coords?.lng) ? [coords.lat, coords.lng] : interp;

  const center = [ (ORIGEN[0] + DESTINO[0]) / 2, (ORIGEN[1] + DESTINO[1]) / 2 ];

  const shipIcon = useMemo(
    () =>
      L.divIcon({
        className: "ship-icon",
        html: `<div class="ship-bob" title="Barco">⛴️</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    []
  );

  const defaultIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    []
  );

  return (
    <div style={{ height: 420, width: "100%", borderRadius: 12, overflow: "hidden" }}>
      <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline positions={[ORIGEN, DESTINO]} pathOptions={{ color: "#0ea5e9", weight: 3, dashArray: "6 6" }} />

        <Marker position={ORIGEN} icon={defaultIcon}>
          <Popup>🟢 Origen: {origen?.nombre || "Puerto de salida"}</Popup>
        </Marker>

        <Marker position={DESTINO} icon={defaultIcon}>
          <Popup>🔴 Destino: {destino?.nombre || "Puerto del Mariel, Cuba"}</Popup>
        </Marker>

        <Marker position={shipPos} icon={shipIcon}>
          <Popup>📦 Estado: <strong>{estado || "—"}</strong></Popup>
        </Marker>
      </MapContainer>

      <style jsx global>{`
        .ship-bob {
          font-size: 38px;
          animation: bob 2s ease-in-out infinite;
          transform-origin: center;
          text-shadow: 0 1px 2px rgba(0,0,0,0.25);
        }
        @keyframes bob {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-3px) }
          100% { transform: translateY(0px) }
        }
      `}</style>
    </div>
  );
}
