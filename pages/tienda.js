// pages/tienda.js
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";


// -------- Helpers --------
function productImageSrc(p) {
  const base =
    process.env.NEXT_PUBLIC_DIRECTUS_URL ||
    process.env.DIRECTUS_URL ||
    "";
  const ph = "/assets/imgs/template/placeholder.png";
  let img = p?.imagen;

  if (!img) return ph;

  if (Array.isArray(img)) {
    img = img[0];
  }

  if (typeof img === "string") {
    if (/^https?:\/\//i.test(img)) return img;
    return base ? `${base}/assets/${img}` : ph;
  }

  if (typeof img === "object") {
    if (img.url && /^https?:\/\//i.test(img.url)) return img.url;
    if (img.id) {
      const filename = img.filename_download || img.filename_disk || "image";
      return base ? `${base}/assets/${img.id}/${filename}` : ph;
    }
  }

  return ph;
}

function toWhatsNumber(n) {
  return String(n || "").replace(/\D+/g, "");
}

const MONTHS_ES_SHORT = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function formatDateShort(d) {
  if (!d) return null;

  // Normaliza y parsea
  let dt = null;
  if (d instanceof Date && !Number.isNaN(d.valueOf())) {
    dt = d;
  } else if (typeof d === "string") {
    const s = /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : d;
    const ts = Date.parse(s);
    if (!Number.isNaN(ts)) dt = new Date(ts);
  }

  if (!dt) return null;

  const day = String(dt.getUTCDate()).padStart(2, "0");
  const month = MONTHS_ES_SHORT[dt.getUTCMonth()]; // 0..11
  return `${day} de ${month}`; // ej: "09/sep"
}


// --- NUEVO: helper para precio flexible (número o texto como "20 por saco")
function formatPrecioFlexible(precio) {
  if (precio === null || precio === undefined || precio === "") return null;

  const formatUSD = (n) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(n);

  if (typeof precio === "number" && Number.isFinite(precio)) {
    return formatUSD(precio);
  }

  if (typeof precio === "string") {
    const s = precio.trim();

    // ¿parece numérico? (permite 20, 20.5, 20,5, con o sin espacios)
    const only = s.replace(/\s/g, "");
    const numericLike = /^[\d]+([.,]\d+)?$/.test(only);
    if (numericLike) {
      const num = Number(only.replace(",", "."));
      if (!Number.isNaN(num)) return formatUSD(num);
    }

    // Trae texto (por ejemplo "20 por saco") -> mostrar tal cual
    return s;
  }

  // fallback para otros tipos
  return String(precio);
}

// -------- Tarjeta de producto --------
function ProductCard({ p }) {
  const [qty] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const titulo = p?.nombre || `Producto #${p?.id}`;
  const precio = p?.precio ?? null;
  const imgSrc = productImageSrc(p);

const salida = formatDateShort(p?.fecha_salida);
const llegada = formatDateShort(p?.fecha_llegada);

  const enMariel = Boolean(p?.en_mariel);
  const ofertaEspecial = Boolean(p?.oferta_especial);

  const phone = toWhatsNumber("+17864939342");
  const texto = `Hola, estoy interesado en el producto ${titulo}, ¿me puedes dar detalles por favor?`;
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`;

  return (
    <>
      {/* 2 por fila en móvil, 3 en md+ */}
      <div className="col-6 col-md-3">
        <div className="card h-100 shadow-sm bg-white hover-up border-0">
          {/* Imagen responsiva: altura controlada para que no “salga” del card */}
          <div
            className="w-100"
            style={{
              position: "relative",
              height: "clamp(140px, 36vw, 220px)", // más bajita en móvil para que quepa todo
              overflow: "hidden",
              borderTopLeftRadius: ".375rem",
              borderTopRightRadius: ".375rem",
              background: "#f8f9fa",
              cursor: "zoom-in",
            }}
            onClick={() => setShowModal(true)}
          >
            {ofertaEspecial && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 100,
                  zIndex: 2,
                  padding: "2px 6px",
                  borderRadius: "9999px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".02em",
                  color: "#fff",
                  boxShadow: "0 6px 16px rgba(0,0,0,.15)",
                  background:
                    "linear-gradient(90deg, rgba(34,197,94,1) 0%, rgba(16,185,129,1) 100%)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                }}
                aria-label="Oferta especial"
                title="Oferta especial"
              >
                ⭐ Oferta
              </div>
            )}
            <img
              src={imgSrc}
              alt={titulo}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                e.currentTarget.src = "/assets/imgs/template/placeholder.png";
              }}
            />
          </div>

          {/* Cuerpo más compacto en móvil */}
          <div className="card-body d-flex flex-column p-2 p-sm-3">
            {/* Título más sobrio en móvil */}
            <h6 className="card-title mb-1 text-truncate" title={titulo} style={{ fontSize: 14, fontWeight: 600 }}>
              {titulo}
            </h6>

            {/* Precio compacto (USANDO EL HELPER NUEVO) */}
            {(() => {
              const precioFmt = formatPrecioFlexible(precio);
              return precioFmt ? (
                <div className="mb-2">
                  <span className="badge bg-success" style={{ fontSize: 11 }}>
                    {precioFmt}
                  </span>
                </div>
              ) : (
                <div className="mb-2 text-muted small">—</div>
              );
            })()}

            {/* Descripción: 3 líneas máx. */}
            <p
              className="text-muted mb-2"
              style={{
                fontSize: 12,
                lineHeight: 1.35,
                minHeight: 0, // que no empuje el card
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              title={p?.descripcion || ""}
            >
              {p?.descripcion || ""}
            </p>

            {/* Estado / Fechas — versión compacta para móvil */}
            {enMariel ? (
              <div className="mb-2">
                <div
                  className="w-100 rounded-3 px-2 py-2"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(239,68,68,0.95) 0%, rgba(249,115,22,0.95) 100%)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 4px 12px rgba(249,115,22,0.2)",
                    minHeight: 40,
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: 16, lineHeight: 1 }}>🚢</span>
                    <div>
                      <div
                        className="text-uppercase fw-bold"
                        style={{ letterSpacing: ".02em", fontSize: 11 }}
                      >
                        En Mariel
                      </div>
                      <div className="small" style={{ opacity: 0.95, fontSize: 11 }}>
                        En el Puerto
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex gap-2 mb-2">
                <div
                  className="flex-fill rounded-3 px-1 py-1"
                  style={{
                    background: "rgba(62,127,255,0.08)",
                    border: "1px solid #3E7FFF",
                    color: "#2449A1",
                    minHeight: 40,
                  }}
                >
                  <div className="text-uppercase fw-semibold" style={{ fontSize: 10, opacity: 0.8 }}>
                    Salida
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>
                    {salida || "—"}
                  </div>
                </div>
                <div
                  className="flex-fill rounded-3 px-2 py-2"
                  style={{
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid #22C55E",
                    color: "#166534",
                    minHeight: 40,
                  }}
                >
                  <div className="text-uppercase fw-semibold" style={{ fontSize: 10, opacity: 0.8 }}>
                    Llegada
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>
                    {llegada || "—"}
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto d-grid gap-2">
              <a
                className="btn btn-sm btn-success d-flex align-items-center justify-content-center gap-2 rounded-3"
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 10, paddingTop: 8, paddingBottom: 8 }}
              >
                <FaWhatsapp size={22} />
                <span>Solicitar a WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal con la imagen ampliada */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => setShowModal(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.9)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              cursor: "pointer",
              fontSize: 20,
              fontWeight: "bold",
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>

          <img
            src={imgSrc}
            alt={titulo}
            style={{
              maxWidth: "100%",
              maxHeight: "80%",
              borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

// -------- Página --------
export default function TiendaPage({
  categories,
  products,
  page,
  pageSize,
  total,
  selectedCategory,
  search,
  nat,
}) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const [catsOpen, setCatsOpen] = useState(false);

  return (
    <Layout>
      <section className="section pt-60 pb-60">
        <div className="container">
          <div className="row">
            {/* Sidebar desktop */}
            <aside className="col-lg-3 mb-40 d-none d-lg-block">
              <div className="p-3 rounded-3 bg-white shadow-sm">
                <h5 className="mb-3">Categorías</h5>
                <ul className="list-unstyled m-0">
                  <li className="mb-2">
                    <Link
                      href={{ pathname: "/tienda", query: { ...(search ? { q: search } : {}), nat: nat ?? "1" } }}
                      className={!selectedCategory ? "fw-bold" : ""}
                    >
                      Todas
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id} className="mb-2">
                      <Link
                        href={{ pathname: "/tienda", query: { cat: cat.id, ...(search ? { q: search } : {}), nat: nat ?? "1" } }}
                        className={Number(selectedCategory) === Number(cat.id) ? "fw-bold" : ""}
                      >
                        {cat.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Contenido / Listado */}
            <div className="col-lg-9">
              {/* BOTÓN CATEGORÍAS + PANEL (solo móvil) */}
              <div className="d-lg-none mb-3">
                <button
                  type="button"
                  className="btn w-100 btn-outline-secondary d-flex justify-content-between align-items-center"
                  onClick={() => setCatsOpen((v) => !v)}
                  aria-expanded={catsOpen ? "true" : "false"}
                  aria-controls="mobile-cats-panel"
                >
                  <span>Categorías</span>
                  <span
                    aria-hidden="true"
                    style={{ transition: "transform .2s ease", transform: catsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    ▾
                  </span>
                </button>

                <div
                  id="mobile-cats-panel"
                  className={`mobile-cat-panel mt-2 ${catsOpen ? "open" : ""}`}
                  role="region"
                  aria-label="Lista de categorías"
                >
                  <div className="p-3 rounded-3 bg-white shadow-sm">
                    <ul className="list-unstyled m-0">
                      <li className="mb-2">
                        <Link
                          href={{ pathname: "/tienda", query: { ...(search ? { q: search } : {}), nat: nat ?? "1" } }}
                          className={!selectedCategory ? "fw-bold" : ""}
                          onClick={() => setCatsOpen(false)}
                        >
                          Todas
                        </Link>
                      </li>
                      {categories.map((cat) => (
                        <li key={cat.id} className="mb-2">
                          <Link
                            href={{ pathname: "/tienda", query: { cat: cat.id, ...(search ? { q: search } : {}), nat: nat ?? "1" } }}
                            className={Number(selectedCategory) === Number(cat.id) ? "fw-bold" : ""}
                            onClick={() => setCatsOpen(false)}
                          >
                            {cat.nombre}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="d-flex flex-column gap-2 gap-md-3 mb-3">
                <div className="d-grid gap-2" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="d-grid d-md-inline-flex gap-2">
                    <Link
                      className={`btn btn-sm d-inline-flex align-items-center justify-content-center text-center ${!nat || nat === "mix" ? "btn-brand-1" : "btn-outline-secondary"} w-100 w-md-auto`}
                      href={{
                        pathname: "/tienda",
                        query: {
                          ...(selectedCategory ? { cat: selectedCategory } : {}),
                          ...(search ? { q: search } : {}),
                          nat: "mix",
                          page: 1,
                        },
                      }}
                    >
                      Ver Todo
                    </Link>

                    <Link
                      className={`btn btn-sm d-inline-flex align-items-center justify-content-center text-center ${nat === "1" ? "btn-brand-1" : "btn-outline-secondary"} w-100 w-md-auto`}
                      href={{
                        pathname: "/tienda",
                        query: {
                          ...(selectedCategory ? { cat: selectedCategory } : {}),
                          ...(search ? { q: search } : {}),
                          nat: "1",
                          page: 1,
                        },
                      }}
                    >
                      Con Nacionalización
                    </Link>

                    <Link
                      className={`btn btn-sm d-inline-flex align-items-center justify-content-center text-center ${nat === "0" ? "btn-brand-1" : "btn-outline-secondary"} w-100 w-md-auto`}
                      href={{
                        pathname: "/tienda",
                        query: {
                          ...(selectedCategory ? { cat: selectedCategory } : {}),
                          ...(search ? { q: search } : {}),
                          nat: "0",
                          page: 1,
                        },
                      }}
                    >
                      Sin Nacionalización
                    </Link>
                  </div>

                  {/* Buscador (solo >= md) */}
                  <form
                    className="d-none d-md-flex flex-row w-100 gap-2"
                    method="GET"
                    action="/tienda"
                  >
                    {selectedCategory && (
                      <input type="hidden" name="cat" value={selectedCategory} />
                    )}
                    {typeof nat !== "undefined" && (
                      <input type="hidden" name="nat" value={nat} />
                    )}
                    <input
                      name="q"
                      defaultValue={search || ""}
                      className="form-control"
                      placeholder="Buscar producto..."
                    />
                    <button className="btn btn-brand-1" type="submit">
                      Buscar
                    </button>
                  </form>
                </div>
              </div>

              {/* Info resultados */}
              <div className="text-muted mb-3 small">
                {selectedCategory ? (
                  <>Filtrado por categoría <strong>#{selectedCategory}</strong>. </>
                ) : (
                  <>Todas las categorías. </>
                )}
                {search ? <>Búsqueda: <strong>{search}</strong>. </> : null}
                <span className="me-2">
                  Filtro: <strong>
                    {nat === "0"
                      ? "No nacionalizados"
                      : nat === "1"
                      ? "Nacionalizados"
                      : "Mix (todos)"}
                  </strong>
                </span>
                <span>
                  · Mostrando página <strong>{page}</strong> de{" "}
                  <strong>{Math.max(1, Math.ceil((total || 0) / pageSize))}</strong>{" "}
                  · <strong>{total}</strong> resultados
                </span>
              </div>

            {/* Grid de productos */}
<div className="row g-2 g-sm-3">
  {products.length === 0 && (
    <div className="col-12">
      <div className="alert alert-info">No hay productos para mostrar.</div>
    </div>
  )}

  {(() => {
    // Particionar manteniendo el orden relativo como viene del servidor
    const specials = [];
    const normals = [];
    for (const p of products) {
      (p?.oferta_especial ? specials : normals).push(p);
    }

    // En móvil (col-6), si specials es impar, insertamos un hueco para que
    // el resto empiece en una nueva fila y conserve su orden original.
    const needMobileSpacer = specials.length % 2 === 1;

    return (
      <>
        {/* Primero, todas las ofertas especiales */}
        {specials.map((p) => (
          <ProductCard key={`s-${p.id}`} p={p} />
        ))}

        {/* Hueco SOLO en móvil si hay número impar de ofertas */}
        {needMobileSpacer && (
          <div
            key="specials-spacer"
            className="col-6 d-md-none"
            aria-hidden="true"
            // opcional: una línea mínima para visualizar el hueco en depuración
            style={{ minHeight: 1 }}
          />
        )}

        {/* Luego, el resto en el mismo orden que venía */}
        {normals.map((p) => (
          <ProductCard key={`n-${p.id}`} p={p} />
        ))}
      </>
    );
  })()}
</div>


              {/* Paginación */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination flex-wrap">
                    <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                      <Link
                        className="page-link"
                        href={{
                          pathname: "/tienda",
                          query: {
                            ...(selectedCategory ? { cat: selectedCategory } : {}),
                            ...(search ? { q: search } : {}),
                            nat: nat ?? "1",
                            page: Math.max(1, page - 1),
                          },
                        }}
                      >
                        «
                      </Link>
                    </li>

                    {Array.from({ length: totalPages }).map((_, i) => {
                      const n = i + 1;
                      return (
                        <li key={n} className={`page-item ${n === page ? "active" : ""}`}>
                          <Link
                            className="page-link"
                            href={{
                              pathname: "/tienda",
                              query: {
                                ...(selectedCategory ? { cat: selectedCategory } : {}),
                                ...(search ? { q: search } : {}),
                                nat: nat ?? "1",
                                page: n,
                              },
                            }}
                          >
                            {n}
                          </Link>
                        </li>
                      );
                    })}

                    <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                      <Link
                        className="page-link"
                        href={{
                          pathname: "/tienda",
                          query: {
                            ...(selectedCategory ? { cat: selectedCategory } : {}),
                            ...(search ? { q: search } : {}),
                            nat: nat ?? "1",
                            page: Math.min(totalPages, page + 1),
                          },
                        }}
                      >
                        »
                      </Link>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CSS del panel móvil */}
      <style jsx>{`
        .mobile-cat-panel {
          max-height: 0;
          overflow: hidden;
          transition: max-height .25s ease;
        }
        .mobile-cat-panel.open {
          max-height: 420px; /* Ajusta si tienes muchas categorías */
        }
      `}</style>
    </Layout>
  );
}


// -------- SSR: categorías + productos desde Directus --------
export async function getServerSideProps(ctx) {
  const base = process.env.DIRECTUS_URL;
  const token = process.env.DIRECTUS_STATIC_TOKEN;

  const empty = {
    props: {
      categories: [],
      products: [],
      page: 1,
      pageSize: 12,
      total: 0,
      selectedCategory: null,
      search: "",
      nat: "1",
    },
  };
  if (!base || !token) return empty;

  const pageSize = 12;
  const page = Math.max(1, parseInt(ctx.query.page || "1", 10));
  const selectedCategory = ctx.query.cat ? String(ctx.query.cat) : null;
  const search = ctx.query.q ? String(ctx.query.q) : "";
  const nat = typeof ctx.query.nat !== "undefined" ? String(ctx.query.nat) : "mix";

  const catUrl = new URL(`${base}/items/categorias`);
  catUrl.searchParams.set("fields", "id,nombre");
  catUrl.searchParams.set("limit", "100");

  const prodUrl = new URL(`${base}/items/productos`);
  prodUrl.searchParams.set(
    "fields",
    [
      "id",
      "nombre",
      "descripcion",
      "precio",
      "fecha_salida",
      "fecha_llegada",
      "imagen",
      "imagen.id",
      "imagen.filename_disk",
      "imagen.filename_download",
      "en_mariel",
      "oferta_especial",
      "Disponible",
      "nacionalizado",
      "categoria_id.id",
      "categoria_id.nombre",
    ].join(",")
  );
  prodUrl.searchParams.set("limit", String(pageSize));
  prodUrl.searchParams.set("offset", String((page - 1) * pageSize));
  prodUrl.searchParams.set("meta", "filter_count");
  [/*prodUrl.searchParams.set("sort", "-id");*/]
  prodUrl.searchParams.append("sort[]", "-oferta_especial");
prodUrl.searchParams.append("sort[]", "nombre"); 

  prodUrl.searchParams.set("filter[Disponible][_eq]", "true");

  if (nat === "0") {
    prodUrl.searchParams.set("filter[nacionalizado][_eq]", "false");
  } else if (nat === "1") {
    prodUrl.searchParams.set("filter[nacionalizado][_eq]", "true");
  }

  if (selectedCategory) {
    prodUrl.searchParams.set("filter[categoria_id][_eq]", selectedCategory);
  }
  if (search) {
    prodUrl.searchParams.set("filter[_or][0][nombre][_contains]", search);
    prodUrl.searchParams.set("filter[_or][1][descripcion][_contains]", search);
  }

  async function dget(url) {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  try {
    const [catRes, prodRes] = await Promise.all([dget(catUrl), dget(prodUrl)]);
    const categories = catRes?.data || [];
    const products = prodRes?.data || [];
    const total = prodRes?.meta?.filter_count ?? products.length;

    return {
      props: {
        categories,
        products,
        page,
        pageSize,
        total,
        selectedCategory,
        search,
        nat,
      },
    };
  } catch (e) {
    console.error("Directus tienda error:", e);
    return {
      props: {
        categories: [],
        products: [],
        page,
        pageSize,
        total: 0,
        selectedCategory,
        search,
        nat,
        error: "No se pudieron cargar los datos",
      },
    };
  }
}
