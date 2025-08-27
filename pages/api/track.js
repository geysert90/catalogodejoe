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

    // Helper
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

    // Posición estimada del barco (si no tienes coords en BD)
    const t = clamp01(statusToProgress(item.estado));
    const lat = lerp(ORIGEN.lat, DESTINO.lat, t);
    const lng = lerp(ORIGEN.lng, DESTINO.lng, t);

    res.status(200).json({
      tracking_code: item.tracking_code,
      estado: item.estado,
      //pedido_id: item?.pedido_id?.id ?? null,
     // cliente: {
     //   nombre: item?.pedido_id?.usuario_id?.nombre ?? "",
     //   telefono: item?.pedido_id?.usuario_id?.telefono ?? "",
      //},
      origen: ORIGEN,
      destino: DESTINO,
      coords: { lat, lng },
      origen_nombre: ORIGEN.nombre,
      destino_nombre: DESTINO.nombre,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
}
