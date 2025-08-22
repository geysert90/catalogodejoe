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

  // Si viene array, toma el primero
  if (Array.isArray(img)) {
    img = img[0];
  }

  // string -> id de asset o URL absoluta
  if (typeof img === "string") {
    if (/^https?:\/\//i.test(img)) return img;
    return base ? `${base}/assets/${img}` : ph;
  }

  // objeto -> Single File (Directus)
  if (typeof img === "object") {
    // Si viene url absoluta ya
    if (img.url && /^https?:\/\//i.test(img.url)) return img.url;

    // Preferimos armar: /assets/:id/:filename_download (mejor para caches/CSP)
    if (img.id) {
      const filename =
        img.filename_download ||
        img.filename_disk ||
        "image";
      return base ? `${base}/assets/${img.id}/${filename}` : ph;
    }
  }

  return ph;
}

function toWhatsNumber(n) {
  return String(n || "").replace(/\D+/g, "");
}

function formatDate(d) {
  if (!d) return null;

  // Si ya es Date
  if (d instanceof Date && !Number.isNaN(d.valueOf())) {
    return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
  }

  // Si es string (Directus suele enviar "YYYY-MM-DD" o ISO)
  if (typeof d === "string") {
    // Si viene como "YYYY-MM-DD", le añadimos hora y Z para evitar problemas de zona
    const s = /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : d;
    const ts = Date.parse(s);
    if (!Number.isNaN(ts)) {
      return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(ts));
    }
    // Fallback: muestra el string crudo si no se pudo parsear
    return d;
  }

  return null;
}


// -------- Tarjeta de producto --------
function ProductCard({ p }) {
  const [qty, setQty] = useState(1);

  const titulo = p?.nombre || `Producto #${p?.id}`;
  const precio = p?.precio ?? null;
  const imgSrc = productImageSrc(p);

  const salida = formatDate(p?.fecha_salida);
  const llegada = formatDate(p?.fecha_llegada);
  const enMariel = Boolean(p?.en_mariel);
  const ofertaEspecial = Boolean(p?.oferta_especial);

  const phone = toWhatsNumber("+381628451160");
  const texto = `Hola, estoy interesado en el producto ${titulo}. Me interesa ${qty} contenedores, ¿me puedes dar detalles por favor?`;
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`;

  return (
    <div className="col-6 col-md-4" key={p.id}>
      <div className="card h-100 shadow-sm bg-white">
        {/* Contenedor de imagen sin depender de .ratio de Bootstrap */}
       <div
          className="w-100"
          style={{
            position: "relative",           // <-- para posicionar el badge
            height: 400,
            overflow: "hidden",
            borderTopLeftRadius: ".375rem",
            borderTopRightRadius: ".375rem",
            background: "#f8f9fa",
          }}
        >
          {ofertaEspecial && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,                    // esquina superior izquierda
                zIndex: 2,
                padding: "6px 10px",
                borderRadius: "9999px",
                fontSize: 12,
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
              ⭐ Oferta especial
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

        <div className="card-body d-flex flex-column">
          <h6 className="card-title mb-1">{titulo}</h6>

          {precio !== null ? (
            <div className="mb-2">
              <span className="badge bg-success">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "USD",
                }).format(Number(precio))}
              </span>
            </div>
          ) : (
            <div className="mb-2 text-muted">—</div>
          )}

          <p className="text-muted mb-2" style={{ minHeight: 40 }}>
            {p?.descripcion || ""}
          </p>

          {/* Estado "En Mariel" o Fechas */}
            {enMariel ? (
              <div className="mb-3">
                <div
                  className="w-100 rounded-3 px-3 py-3"
                  style={{
                    // Card llamativa
                    background:
                      "linear-gradient(90deg, rgba(239,68,68,0.95) 0%, rgba(249,115,22,0.95) 100%)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 6px 18px rgba(249,115,22,0.25)",
                    minHeight: 52,
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: 20 }}>🚢</span>
                    <div>
                      <div className="text-uppercase fw-bold" style={{ letterSpacing: ".03em" }}>
                        En Mariel
                      </div>
                      <div className="small" style={{ opacity: 0.95 }}>
                        En el Puerto / Pendiente de Recogida
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex gap-2 mb-3">
                <div
                  className="flex-fill rounded-3 px-2 py-2"
                  style={{
                    background: "rgba(62,127,255,0.08)",
                    border: "1px solid #3E7FFF",
                    color: "#2449A1",
                    minHeight: 52,
                  }}
                >
                  <div className="text-uppercase fw-semibold" style={{ fontSize: 11, opacity: 0.8 }}>
                    Salida
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {salida || "—"}
                  </div>
                </div>
                <div
                  className="flex-fill rounded-3 px-2 py-2"
                  style={{
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid #22C55E",
                    color: "#166534",
                    minHeight: 52,
                  }}
                >
                  <div className="text-uppercase fw-semibold" style={{ fontSize: 11, opacity: 0.8 }}>
                    Llegada
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {llegada || "—"}
                  </div>
                </div>
              </div>
            )}

          {/* Cantidad centrada */}
          <div
            className="input-group input-group-sm mb-3 "
            style={{ maxWidth: 140, marginInline: "auto", background: "rgba(34,197,94,0.08)" }}
          >
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Disminuir"
            >
              −
            </button>
            <input
              type="number"
              className="form-control text-center"
              min={1}
              max={100}
              value={qty}
              onChange={(e) => {
                const v = parseInt(e.target.value || "1", 10);
                setQty(Number.isNaN(v) ? 1 : Math.max(1, Math.min(100, v)));
              }}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setQty((q) => Math.min(100, q + 1))}
              aria-label="Aumentar"
            >
              +
            </button>
          </div>

          <div className="mt-auto d-grid gap-2">
            {/* Ajusta si tienes página de detalle */}
            {/*<Link className="btn btn-sm btn-brand-1 w-100 rounded-3" href="#">
              Ver detalle
            </Link>*/}

            {/* Botón WhatsApp */}
            <a
              className="btn btn-sm btn-success d-flex align-items-center justify-content-center gap-2 rounded-3"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={18} />
              Solicitar a WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
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
}) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  return (
    <Layout>
      <section className="section pt-60 pb-60">
        <div className="container">
          <div className="row">
            {/* Sidebar de categorías */}
            <aside className="col-lg-3 mb-40">
              <div className="p-3 rounded-3 bg-white shadow-sm">
                <h5 className="mb-3">Categorías</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link
                      href={{
                        pathname: "/tienda",
                        query: { ...(search ? { q: search } : {}) },
                      }}
                      className={!selectedCategory ? "fw-bold" : ""}
                    >
                      Todas
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id} className="mb-2">
                      <Link
                        href={{
                          pathname: "/tienda",
                          query: { cat: cat.id, ...(search ? { q: search } : {}) },
                        }}
                        className={
                          Number(selectedCategory) === Number(cat.id)
                            ? "fw-bold"
                            : ""
                        }
                      >
                        {cat.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Listado de productos */}
            <div className="col-lg-9">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="m-0">Tienda</h3>
                <form className="d-flex" method="GET" action="/tienda">
                  {selectedCategory && (
                    <input type="hidden" name="cat" value={selectedCategory} />
                  )}
                  <input
                    name="q"
                    defaultValue={search || ""}
                    className="form-control me-2"
                    placeholder="Buscar producto..."
                  />
                  <button className="btn btn-brand-1" type="submit">
                    Buscar
                  </button>
                </form>
              </div>

              <div className="text-muted mb-3">
                {selectedCategory ? (
                  <>
                    Filtrado por categoría <strong>#{selectedCategory}</strong>.{" "}
                  </>
                ) : (
                  <>Todas las categorías. </>
                )}
                {search ? (
                  <>
                    Búsqueda: <strong>{search}</strong>.{" "}
                  </>
                ) : null}
                <span>
                  Mostrando página <strong>{page}</strong> de{" "}
                  <strong>{Math.max(1, Math.ceil((total || 0) / pageSize))}</strong>{" "}
                  · <strong>{total}</strong> resultados
                </span>
              </div>

              <div className="row g-3">
                {products.length === 0 && (
                  <div className="col-12">
                    <div className="alert alert-info">
                      No hay productos para mostrar.
                    </div>
                  </div>
                )}

                {products.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination">
                    <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                      <Link
                        className="page-link"
                        href={{
                          pathname: "/tienda",
                          query: {
                            ...(selectedCategory ? { cat: selectedCategory } : {}),
                            ...(search ? { q: search } : {}),
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
                        <li
                          key={n}
                          className={`page-item ${n === page ? "active" : ""}`}
                        >
                          <Link
                            className="page-link"
                            href={{
                              pathname: "/tienda",
                              query: {
                                ...(selectedCategory ? { cat: selectedCategory } : {}),
                                ...(search ? { q: search } : {}),
                                page: n,
                              },
                            }}
                          >
                            {n}
                          </Link>
                        </li>
                      );
                    })}

                    <li
                      className={`page-item ${
                        page >= totalPages ? "disabled" : ""
                      }`}
                    >
                      <Link
                        className="page-link"
                        href={{
                          pathname: "/tienda",
                          query: {
                            ...(selectedCategory ? { cat: selectedCategory } : {}),
                            ...(search ? { q: search } : {}),
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
    },
  };
  if (!base || !token) return empty;

  const pageSize = 12;
  const page = Math.max(1, parseInt(ctx.query.page || "1", 10));
  const selectedCategory = ctx.query.cat ? String(ctx.query.cat) : null;
  const search = ctx.query.q ? String(ctx.query.q) : "";

  // Categorías
  const catUrl = new URL(`${base}/items/categorias`);
  catUrl.searchParams.set("fields", "id,nombre");
  catUrl.searchParams.set("limit", "100");

  // Productos
  const prodUrl = new URL(`${base}/items/productos`);
  prodUrl.searchParams.set(
    "fields",
    [
      "id",
      "nombre",
      "descripcion",
      "precio",
      "fecha_salida",          // <-- añadido
      "fecha_llegada",         // <-- añadido
      "imagen",                 // si es string id/URL
      "imagen.id",              // si es relación File
      "imagen.filename_disk",
      "imagen.filename_download",
      "en_mariel",
      "oferta_especial",
      "Disponible",
      "categoria_id.id",
      "categoria_id.nombre",
    ].join(",")
  );
  prodUrl.searchParams.set("limit", String(pageSize));
  prodUrl.searchParams.set("offset", String((page - 1) * pageSize));
  prodUrl.searchParams.set("meta", "filter_count");
  prodUrl.searchParams.set("sort", "-id");
  prodUrl.searchParams.set("filter[Disponible][_eq]", "true");
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
        error: "No se pudieron cargar los datos",
      },
    };
  }
}
