"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";

function clamp01(v) { return Math.min(1, Math.max(0, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function clean(s="") {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, ""); // quita tildes
}

function statusCategory(estado) {
  const e = clean(estado || "");

  // DONE / CANCEL primero para cortar
  if (e.includes("orden completada") || e.includes("completada") || e.includes("finalizada")) return "DONE";
  if (e.includes("cancelado") || e.includes("cancelada") || e.includes("anulado") || e.includes("anulada")) return "CANCEL";

  // En fábrica / En puerto -> ORIGEN
  if (e.includes("fabrica") || e.includes("puerto")) return "ORIGIN";

  // En mariel / Liberado y listo para pre-cita / Esperando devolución del vacío -> DESTINO
  if (
    e.includes("mariel") ||
    e.includes("liberado") ||
    e.includes("pre") ||           // pre-cita / precita
    e.includes("cita") ||
    e.includes("devolucion") ||
    e.includes("vacio")
  ) return "DEST";

  // Otros casos -> transit
  return "TRANSIT";
}

function statusToProgress(estado) {
  // solo para categoría TRANSIT, lo demás se fuerza a origen/destino/oculto
  if (!estado) return 0.4;
  const e = clean(estado);
  if (e.includes("almac")) return 0.1;
  if (e.includes("salid") || e.includes("desp")) return 0.25;
  if (e.includes("tran") || e.includes("mar")) return 0.6;
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
  const ORIGEN = origen?.lat && origen?.lng ? [Number(origen.lat), Number(origen.lng)] : [25.7617, -80.1918]; // Miami
  const DESTINO = destino?.lat && destino?.lng ? [Number(destino.lat), Number(destino.lng)] : [23.0419, -82.7859]; // Mariel

  const cat = statusCategory(estado);

  // Interpolación solo si cat === "TRANSIT" y no vienen coords
  const t = clamp01(statusToProgress(estado));
  const interp = [ lerp(ORIGEN[0], DESTINO[0], t), lerp(ORIGEN[1], DESTINO[1], t) ];

  // Decidir posición del barco (si aplica)
  let shipPos = null;
  if (cat === "ORIGIN") shipPos = ORIGEN;
  else if (cat === "DEST") shipPos = DESTINO;
  else if (cat === "TRANSIT") {
    shipPos = (coords?.lat && coords?.lng) ? [Number(coords.lat), Number(coords.lng)] : interp;
  } // DONE / CANCEL -> shipPos = null (oculto)

  // Control de visibilidad
  const showShip = !!shipPos && (cat === "ORIGIN" || cat === "DEST" || cat === "TRANSIT");
  const showEndpoints = (cat === "ORIGIN" || cat === "DEST" || cat === "TRANSIT");
  const showPolyline = showEndpoints;

  // Centro del mapa
  const center = showEndpoints
    ? [ (ORIGEN[0] + DESTINO[0]) / 2, (ORIGEN[1] + DESTINO[1]) / 2 ]
    : DESTINO; // en DONE/CANCEL centramos en destino por defecto

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

  // Estilos de la cinta de estado para DONE / CANCEL
  const isDone = cat === "DONE";
  const isCancel = cat === "CANCEL";

  return (
    <div style={{ height: 420, width: "100%", borderRadius: 12, overflow: "hidden", position: "relative" }}>
      <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showPolyline && (
          <Polyline positions={[ORIGEN, DESTINO]} pathOptions={{ color: "#0ea5e9", weight: 3, dashArray: "6 6" }} />
        )}

        {showEndpoints && (
          <>
            <Marker position={ORIGEN} icon={defaultIcon}>
              <Popup>🟢 Origen: {origen?.nombre || "Puerto de salida"}</Popup>
            </Marker>
            <Marker position={DESTINO} icon={defaultIcon}>
              <Popup>🔴 Destino: {destino?.nombre || "Puerto del Mariel, Cuba"}</Popup>
            </Marker>
          </>
        )}

        {showShip && (
          <Marker position={shipPos} icon={shipIcon}>
            <Popup>📦 Estado: <strong>{estado || "—"}</strong></Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Cinta de estado para DONE / CANCEL */}
      {(isDone || isCancel) && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "10px 14px",
            borderRadius: 12,
            fontWeight: 800,
            letterSpacing: ".02em",
            color: "#fff",
            background: isDone ? "#16a34a" : "#ef4444",
            border: `2px solid ${isDone ? "#ffffff" : "#000000"}`,
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            textTransform: "uppercase",
            zIndex: 9999,
            pointerEvents: "none",
          }}
          aria-label={`Estado: ${estado || ""}`}
          title={estado || ""}
        >
          {estado || (isDone ? "Orden Completada" : "Cancelado")}
        </div>
      )}

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
