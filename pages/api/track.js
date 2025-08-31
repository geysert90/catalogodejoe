// pages/api/track.js
export default async function handler(req, res) {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Falta parámetro ?code=" });

    const base = process.env.DIRECTUS_URL;
    const token = process.env.DIRECTUS_STATIC_TOKEN;
    if (!base || !token) {
      return res.status(500).json({ error: "Faltan DIRECTUS_URL o DIRECTUS_STATIC_TOKEN en .env.local" });
    }

    // Destino fijo: Puerto del Mariel
    const DESTINO = { lat: 23.0419, lng: -82.7859, nombre: "Puerto del Mariel, Cuba" };

    const clean = (s="") =>
      String(s).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

    function statusCategory(estado) {
      const e = clean(estado || "");
      if (e.includes("orden completada") || e.includes("completada") || e.includes("finalizada")) return "DONE";
      if (e.includes("cancelado") || e.includes("cancelada") || e.includes("anulado") || e.includes("anulada")) return "CANCEL";
      if (e.includes("fabrica") || e.includes("puerto")) return "ORIGIN";
      if (e.includes("mariel") || e.includes("liberado") || e.includes("pre") || e.includes("cita") || e.includes("devolucion") || e.includes("vacio")) return "DEST";
      return "TRANSIT";
    }

    function statusToProgress(estado) {
      const e = clean(estado || "");
      if (!e) return 0.4;
      if (e.includes("almac")) return 0.1;
      if (e.includes("salid") || e.includes("desp")) return 0.25;
      if (e.includes("tran") || e.includes("mar")) return 0.6;
      if (e.includes("puerto")) return 0.8;
      if (e.includes("entreg") || e.includes("final")) return 1.0;
      return 0.4;
    }

    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const lerp = (a, b, t) => a + (b - a) * t;

    // Traemos tracking + pedido + producto + puerto_salida
    const url = new URL(`${base}/items/tracking`);
    url.searchParams.set("filter[tracking_code][_eq]", code);
    url.searchParams.set("limit", "1");
    url.searchParams.set(
      "fields",
      [
        "id",
        "estado",
        "tracking_code",
        "pedido_id.id",
        "pedido_id.usuario_id.nombre",
        "pedido_id.usuario_id.telefono",
        "pedido_id.producto_id.id",
        "pedido_id.producto_id.nombre",
        "pedido_id.producto_id.puerto_salida_id.id",
        "pedido_id.producto_id.puerto_salida_id.nombre",
        "pedido_id.producto_id.puerto_salida_id.lat",
        "pedido_id.producto_id.puerto_salida_id.lng",
      ].join(",")
    );

    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) return res.status(r.status).json({ error: `Directus error: ${await r.text()}` });

    const data = await r.json();
    const item = data?.data?.[0] || null;
    if (!item) return res.status(404).json({ error: "Tracking no encontrado" });

    // Origen dinámico: si el producto tiene puerto_salida, úsalo; si no, Miami por defecto
    const puerto = item?.pedido_id?.producto_id?.puerto_salida_id;
    const ORIGEN = puerto && puerto.lat && puerto.lng
      ? { lat: Number(puerto.lat), lng: Number(puerto.lng), nombre: puerto.nombre || "Puerto de salida" }
      : { lat: 25.7617, lng: -80.1918, nombre: "Miami, FL" };

    const cat = statusCategory(item.estado);

    // Posición estimada por defecto (solo para TRANSIT)
    const t = clamp01(statusToProgress(item.estado));
    const interp = { lat: lerp(ORIGEN.lat, DESTINO.lat, t), lng: lerp(ORIGEN.lng, DESTINO.lng, t) };

    // Forzar coords según categoría
    let coords = null;
    if (cat === "ORIGIN") coords = { lat: ORIGEN.lat, lng: ORIGEN.lng };
    else if (cat === "DEST") coords = { lat: DESTINO.lat, lng: DESTINO.lng };
    else if (cat === "TRANSIT") coords = interp;
    // DONE / CANCEL -> coords = null

    res.status(200).json({
      tracking_code: item.tracking_code,
      estado: item.estado,
      origen: ORIGEN,
      destino: DESTINO,
      coords, // null en DONE/CANCEL -> el front no pinta barco
      origen_nombre: ORIGEN.nombre,
      destino_nombre: DESTINO.nombre,
      category: cat, // por si te sirve en el front
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
}
