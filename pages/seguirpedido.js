import { useState } from "react";
import Layout from "@/components/layout/Layout";
import Brand1Slider from "@/components/slider/Brand1Slider";
import Accordion from "@/components/elements/Accordion";
import dynamic from "next/dynamic";
import Link from "next/link";
import ModalVideo from "react-modal-video";

const Mapa = dynamic(() => import("@/components/Mapa"), { ssr: false });
const MapaReal = dynamic(() => import("@/components/MapaReal"), { ssr: false });

/**
 * Mapea estado → progreso (0 a 1) para mover el barco en el mapa.
 * Ajusta etiquetas si tus estados en Directus son distintos.
 */
function statusToProgress(estado) {
  if (!estado) return 0;
  const e = estado.toLowerCase();

  // Mapa básico (personaliza a tu gusto)
  if (e.includes("almac")) return 0.1;          // En almacén
  if (e.includes("salid") || e.includes("desp")) return 0.25; // Salida/Despachado
  if (e.includes("trán") || e.includes("trans") || e.includes("mar")) return 0.6; // En tránsito (mar)
  if (e.includes("puerto")) return 0.8;         // En puerto (Cuba)
  if (e.includes("entreg") || e.includes("final")) return 1.0; // Entregado/Finalizado
  return 0.4; // Default intermedio
}

/**
 * Coordenadas relativas dentro del SVG (0..100) para origen/destino
 * Origen = Florida (aprox), Destino = Puerto del Mariel, Cuba (aprox)
 */
const FLORIDA = { x: 28, y: 18 }; // ajustado para el SVG de abajo
const MARIEL  = { x: 63, y: 43 };

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ShipMap({ estado }) {
  const t = statusToProgress(estado);

  // Posición del barco
  const x = lerp(FLORIDA.x, MARIEL.x, t);
  const y = lerp(FLORIDA.y, MARIEL.y, t);

  return (
    <div className="w-full rounded-3 shadow-md p-4 bg-white">
      <h5 className="mb-3">Ruta marítima Florida → Mariel (Cuba)</h5>
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        {/* SVG simple del Caribe/Centroamérica estilizado */}
        <svg viewBox="0 0 100 56" className="w-full h-full rounded-2">
          {/* Mar */}
          <defs>
            <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopOpacity="1" stopColor="#bfe7ff" />
              <stop offset="100%" stopOpacity="1" stopColor="#7ac8ff" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100" height="56" fill="url(#sea)" />

          {/* Tierras (muy estilizadas) */}
          <path
            d="M10,6 C20,6 25,10 30,12 C35,14 36,18 33,21 C30,24 24,25 18,24 C13,23 8,20 7,16 C6,12 6,8 10,6 Z
               M55,18 C60,16 64,16 67,18 C69,19 70,21 69,23 C67,26 63,27 60,26 C56,25 54,22 55,18 Z
               M70,36 C73,34 77,34 80,35 C82,36 84,38 84,40 C84,42 82,44 79,45 C76,45 73,44 71,42 C69,40 68,38 70,36 Z"
            fill="#c8e6c9"
            stroke="#86b88a"
            strokeWidth="0.2"
            opacity="0.9"
          />

          {/* Línea ruta */}
          <line
            x1={FLORIDA.x}
            y1={FLORIDA.y}
            x2={MARIEL.x}
            y2={MARIEL.y}
            stroke="#0ea5e9"
            strokeWidth="0.6"
            strokeDasharray="1.2 1.2"
          />

          {/* Puntos inicio/fin */}
          <circle cx={FLORIDA.x} cy={FLORIDA.y} r="1.2" fill="#22c55e" />
          <text x={FLORIDA.x + 1.8} y={FLORIDA.y - 1} fontSize="2.2" fill="#065f46">Florida</text>

          <circle cx={MARIEL.x} cy={MARIEL.y} r="1.2" fill="#ef4444" />
          <text x={MARIEL.x + 1.8} y={MARIEL.y - 1} fontSize="2.2" fill="#7f1d1d">Mariel (Cuba)</text>

          {/* Barco */}
          <g transform={`translate(${x} ${y})`}>
            <g className="ship-anim">
              <path d="M-2,0 L2,0 L1,1.4 L-1,1.4 Z" fill="#111827" />
              <rect x="-1.4" y="-1.2" width="2.8" height="1.2" fill="#f59e0b" />
              <circle cx="-0.6" cy="-0.6" r="0.2" fill="#fff" />
              <circle cx="0" cy="-0.6" r="0.2" fill="#fff" />
              <circle cx="0.6" cy="-0.6" r="0.2" fill="#fff" />
            </g>
          </g>
        </svg>
      </div>

      <style jsx>{`
        .ship-anim {
          animation: bob 2s ease-in-out infinite;
        }
        @keyframes bob {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-0.6px) }
          100% { transform: translateY(0px) }
        }
      `}</style>

      <div className="mt-3 text-sm text-gray-700">
        <div>Estado: <span className="font-semibold">{estado || "—"}</span></div>
        <div className="w-full h-2 bg-gray-200 rounded mt-2">
          <div
            className="h-2 rounded"
            style={{
              width: `${Math.round(Math.min(1, Math.max(0, t))) * 100}%`,
              background:
                t >= 1 ? "#22c55e" : t >= 0.8 ? "#f59e0b" : "#0ea5e9",
              transition: "width 400ms ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TrackParcel() {
  const [isOpen, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!code.trim()) {
      setError("Ingresa un código de seguimiento");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`/api/track?code=${encodeURIComponent(code.trim())}`);
      const data = await r.json();
      if (!r.ok) {
        setError(data?.error || "No se pudo consultar el tracking");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Error de red consultando el tracking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Layout>
        {/* HERO / BUSCADOR */}
        <section className="section d-block">
          <div className="container position-relative">
            <div className="banner-trackyourparcel" />
            <div className="box-info-trackyourparcel">
              <h2 className="color-brand-2 mb-25 wow animate__animated animate__fadeIn">
                El Rastreo de Contenedores es Fácil<br className="d-none d-lg-block" />
                con tu Código de Seguimiento
              </h2>
              <p className="color-grey-900 font-md wow animate__animated animate__fadeIn">
                Desde Estados Unidos y Centroamérica hasta el puerto del Mariel (Cuba)
              </p>

              <div className="form-trackparcel wow animate__animated animate__fadeIn">
                <form onSubmit={onSubmit}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Tu código de seguimiento (ej. TRK354842)"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                      className="btn btn-brand-1 btn-track"
                      disabled={loading}
                      type="submit"
                    >
                      {loading ? "Consultando..." : "Consultar"}
                    </button>
                  </div>
                </form>
                {error && <div className="mt-2 text-danger">{error}</div>}
              </div>

              {/* Resultado */}
              {result && (
  <div className="mt-4 wow animate__animated animate__fadeInUp">
    <div className="rounded-3 p-3 bg-white shadow-sm">
      <div className="d-flex align-items-center gap-2 mb-2">
        <span style={{ fontSize: 24 }}>📦</span>
        <h5 className="m-0">Tracking <strong>{result.tracking_code}</strong></h5>
      </div>

      <div className="text-muted mb-2">
        Pedido: <strong>#{result.pedido_id ?? "—"}</strong> · Cliente:{" "}
        <strong>{result.cliente?.nombre || "—"}</strong>
      </div>

      <div className="mb-2">
        <span className="badge bg-info text-dark">
          Estado: {result.estado || "—"}
        </span>
      </div>

      {/* Etiquetas Origen/Destino (opcional) */}
      <div className="d-flex flex-wrap gap-2 mb-2">
        <span className="badge bg-light text-dark border">
          🟢 Origen: <strong className="ms-1">{result.origen_nombre || result?.origen?.nombre || "Puerto de salida"}</strong>
        </span>
        <span className="badge bg-light text-dark border">
          🔴 Destino: <strong className="ms-1">{result.destino_nombre || result?.destino?.nombre || "Puerto del Mariel, Cuba"}</strong>
        </span>
      </div>

      {/* Mapa con puerto dinámico */}
      <MapaReal
        estado={result.estado}
        coords={result.coords}
        origen={result.origen}
        destino={result.destino}
      />
    </div>
  </div>
)}


              {/*<div className="mt-40 d-flex justify-content-center">
                <Link className="hover-up mr-10 wow animate__animated animate__fadeIn" href="#">
                  <img src="/assets/imgs/template/appstore-btn.png" alt="transp" />
                </Link>
                <Link className="hover-up wow animate__animated animate__fadeIn" href="#">
                  <img src="/assets/imgs/template/google-play-btn.png" alt="transp" />
                </Link>
              </div>*/}
            </div>
          </div>
        </section>

        <section className="section pt-85">
          <div className="container">
            <div className="row mt-50 align-items-center">
              <div className="col-lg-6 mb-30">
                <h6 className="color-brand-2 mb-15 wow animate__animated animate__fadeIn">Seguimiento internacional para</h6>
                <h2 className="color-brand-2 mb-25 wow animate__animated animate__fadeIn">Contenedores y Barcos </h2>
                <div className="row">
                  <div className="col-lg-9">
                    <p className="font-md color-grey-900 wow animate__animated animate__fadeIn">
                      Nuestro sistema de seguimiento se actualiza en tiempo real...
                    </p>
                  </div>
                </div>
                <div className="row mt-50">
                  <div className="col-lg-6 mb-30">
                    <h6 className="chart-title font-md-bold color-grey-900 wow animate__animated animate__fadeIn">
                      Impulsa tus ventas
                    </h6>
                    <p className="font-xs color-grey-900 wow animate__animated animate__fadeIn">
                      Con nuestros productos mayoristas obtienes los mejores precios de compra.
                    </p>
                  </div>
                  <div className="col-lg-6 mb-30">
                    <h6 className="chart-title font-md-bold color-grey-900 wow animate__animated animate__fadeIn">
                      Documentación y Certificación
                    </h6>
                    <p className="font-xs color-grey-900 wow animate__animated animate__fadeIn">
                      Cada envío cuenta con la documentación y certificación necesaria para garantizar la calidad y seguridad de tu carga.
                    </p>
                  </div>
                  <div className="col-lg-6 mb-30">
                    <h6 className="feature2-title font-md-bold color-grey-900 wow animate__animated animate__fadeIn">
                      Flexibilidad en el Pago
                    </h6>
                    <p className="font-xs color-grey-900 wow animate__animated animate__fadeIn">
                      Ofrecemos diversas opciones de pago para adaptarnos a tus necesidades.
                    </p>
                  </div>
                  <div className="col-lg-6 mb-30">
                    <h6 className="feature3-title font-md-bold color-grey-900 wow animate__animated animate__fadeIn">
                      Nacionalización y Aduanas
                    </h6>
                    <p className="font-xs color-grey-900 wow animate__animated animate__fadeIn">
                      Nos encargamos de la nacionalización de sus cargas en Cuba, gestionando todo el proceso legal y aduanal por usted.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-30">
                <div className="box-image-how">
                  <img className="w-100 wow animate__animated animate__fadeIn" src="/assets/imgs/page/trackyourparcel/img-info-7.png" alt="transp" />
                  <div className="box-info-bottom-img">
                    <div className="image-play wow animate__animated animate__fadeIn">
                      <img className="mb-15" src="/assets/imgs/template/icons/play.svg" alt="transp" />
                    </div>
                    <div className="info-play wow animate__animated animate__fadeIn">
                      <h4 className="color-white mb-15">Contamos con la Experiencia y el Profesionalismo necesario para Garantizar un Servicio Logístico Confiable.</h4>
                      <p className="font-sm color-white">
                        A lo largo de los años hemos trabajado con fábricas internacionales y principales importadoras cubanas. 
                        Ofrecemos envíos marítimos rápidos y seguros hacia Cuba, con seguimiento en tiempo real. 
                        Nuestro equipo altamente capacitado asegura eficiencia y transparencia en cada operación. 
                        Su carga siempre protegida, con los mejores precios y tiempos de entrega del mercado. Más que un proveedor, 
                        somos un aliado estratégico para sus negocios en Cuba.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-90" />
        <div className="section bg-2 pt-65 pb-35">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-3 mb-30 text-center text-lg-start wow animate__animated animate__fadeIn">
                <p className="font-2xl-bold color-brand-2">
                  Las principales<span className="color-brand-1"> marcas</span> trabajan con nosotros.
                </p>
              </div>
              <div className="col-lg-9 mb-30">
                <div className="box-swiper">
                  <div className="swiper-container swiper-group-6 pb-0">
                    <Brand1Slider />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
               {/* <section className="section pt-100">
                    <div className="container">
                        <div className="text-center"><span className="btn btn-tag color-grey-900 wow animate__animated animate__fadeIn">Our Features</span>
                            <h2 className="color-brand-2 mb-15 mt-20 wow animate__animated animate__fadeIn">Why choose us</h2>
                        </div>
                        <div className="row mt-60">
                            <div className="col-xl-3 col-lg-3 col-md-6 wow animate__animated animate__fadeIn">
                                <div className="item-reason">
                                    <div className="card-offer cardServiceStyle3 hover-up">
                                        <div className="card-image"><img src="/assets/imgs/page/homepage4/container.png" alt="transp" /></div>
                                        <div className="card-info">
                                            <h5 className="color-brand-2 mb-15">Over 1200 couriers</h5>
                                            <p className="font-sm color-grey-900">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo consectetur.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-6 wow animate__animated animate__fadeIn">
                                <div className="item-reason">
                                    <div className="card-offer cardServiceStyle3 hover-up">
                                        <div className="card-image"><img src="/assets/imgs/page/homepage4/24-hours.png" alt="transp" /></div>
                                        <div className="card-info">
                                            <h5 className="color-brand-2 mb-15">Automatic courier</h5>
                                            <p className="font-sm color-grey-900">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo consectetur.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-6 wow animate__animated animate__fadeIn">
                                <div className="item-reason">
                                    <div className="card-offer cardServiceStyle3 hover-up">
                                        <div className="card-image"><img src="/assets/imgs/page/homepage4/stopwatch.png" alt="transp" /></div>
                                        <div className="card-info">
                                            <h5 className="color-brand-2 mb-15">Real-time alert</h5>
                                            <p className="font-sm color-grey-900">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo consectetur.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-6 wow animate__animated animate__fadeIn">
                                <div className="item-reason">
                                    <div className="card-offer cardServiceStyle3 hover-up">
                                        <div className="card-image"><img src="/assets/imgs/page/homepage4/pallet.png" alt="transp" /></div>
                                        <div className="card-info">
                                            <h5 className="color-brand-2 mb-15">Email alerts</h5>
                                            <p className="font-sm color-grey-900">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo consectetur.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="mt-50" />
                <section className="section pt-80 mb-70 bg-faqs">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="box-faqs-left">
                                    <h2 className="title-favicon mb-20 wow animate__animated animate__fadeIn">FAQs</h2>
                                    <p className="font-md color-grey-700 mb-50 wow animate__animated animate__fadeIn">Feeling inquisitive? Have a read through some of our FAQs or contact our supporters for help</p>
                                    <div className="box-gallery-faqs">
                                        <div className="image-top wow animate__animated animate__fadeIn"><img src="/assets/imgs/page/trackyourparcel/img-faqs1.png" alt="transp" /></div>
                                        <div className="image-bottom wow animate__animated animate__fadeIn">
                                            <div className="image-faq-1"><img src="/assets/imgs/page/trackyourparcel/img-faqs2.png" alt="transp" /></div>
                                            <div className="image-faq-2"><img src="/assets/imgs/page/trackyourparcel/img-faqs3.png" alt="transp" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="box-accordion">
                                    <Accordion />
                                    <div className="line-border mt-50 mb-50" />
                                    <h3 className="color-brand-2 wow animate__animated animate__fadeIn">Nead more help?</h3>
                                    <div className="mt-20"><Link className="btn btn-brand-1-big mr-20 wow animate__animated animate__fadeIn" href="/contact">Contact Us</Link><Link className="btn btn-link-medium wow animate__animated animate__fadeIn" href="#">Learn More
                                        <svg className="w-6 h-6 icon-16 ml-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg></Link></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section mt-100">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-50">
                                <div className="box-info-6 box-info-8"><span className="btn btn-tag wow animate__animated animate__fadeIn">Who We Are?</span>
                                    <h2 className="color-grey-900 mb-20 mt-15 wow animate__animated animate__fadeIn">We are the world's leading shipping service provider</h2>
                                    <p className="font-md color-grey-900 mb-35 wow animate__animated animate__fadeIn">Over the years, we have worked together to expand our network of partners to deliver reliability and consistency. We’ve also made significant strides to tightly integrate technology with our processes, giving our clients greater visibility into every engagement.</p>
                                    <div className="row">
                                        <div className="col-lg-6 mb-30">
                                            <h6 className="chart-title font-md-bold color-grey-900 wow animate__animated animate__fadeIn">Boost your sale</h6>
                                            <p className="font-xs color-grey-900 wow animate__animated animate__fadeIn">The latest design trends meet hand-crafted templates.</p>
                                        </div>
                                        <div className="col-lg-6 mb-30">
                                            <h6 className="chart-title font-md-bold color-grey-900 wow animate__animated animate__fadeIn">Boost your sale</h6>
                                            <p className="font-xs color-grey-900 wow animate__animated animate__fadeIn">The latest design trends meet hand-crafted templates.</p>
                                        </div>
                                        <div className="col-lg-6 mb-30">
                                            <h6 className="feature2-title font-md-bold color-grey-900 wow animate__animated animate__fadeIn">Introducing New Features</h6>
                                            <p className="font-xs color-grey-900 wow animate__animated animate__fadeIn">The latest design trends meet hand-crafted templates.</p>
                                        </div>
                                        <div className="col-lg-6 mb-30">
                                            <h6 className="feature3-title font-md-bold color-grey-900 wow animate__animated animate__fadeIn">Introducing New Features</h6>
                                            <p className="font-xs color-grey-900 wow animate__animated animate__fadeIn">The latest design trends meet hand-crafted templates.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 mb-50">
                                <div className="box-image-why box-image-why-info-8"><img className="wow animate__animated animate__fadeIn" src="/assets/imgs/page/homepage3/img-info-6.png" alt="transp" />
                                    <div className="box-button-play"><a className="btn btn-play popup-youtube hover-up wow animate__animated animate__fadeIn" onClick={() => setOpen(true)}><img className="wow animate__animated animate__fadeIn" src="/assets/imgs/template/icons/play.svg" alt="transp" /><span className="color-white wow animate__animated animate__fadeIn">How it work ?<br />Watch video tour</span></a></div>
                                    <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="vfhzo499OeA" onClose={() => setOpen(false)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>*/}
                <div className="mt-90" />
                <div className="section bg-map d-block">
                    <div className="container">
                        <div className="box-newsletter">
                            <h3 className="color-brand-2 mb-20 wow animate__animated animate__fadeIn">Mantente en Contacto</h3>
                            <div className="row">
                                <div className="col-lg-5 mb-30">
                                    <div className="form-newsletter wow animate__animated animate__fadeIn">
                                        <form action="#">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input className="form-control" type="text" placeholder="Tu nombre *" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input className="form-control" type="text" placeholder="Tu correo *" />
                                                    </div>
                                                </div>
                                               {/* <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input className="form-control" type="text" placeholder="Weight" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input className="form-control" type="text" placeholder="Height" />
                                                    </div>
                                                </div>*/}
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <textarea className="form-control" placeholder="Mensaje / Nota" rows={5} defaultValue={""} />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <input className="btn btn-brand-1-big" type="enviar" defaultValue="Enviar" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-lg-7 mb-30">
                                    <div className="d-flex box-newsletter-right">
                                        <div className="box-map-2 wow animate__animated animate__fadeIn">
                                            <iframe
                                          src="https://www.google.com/maps?q=25.77417,-80.17111&hl=es&z=16&output=embed"
                                          height={242}
                                          style={{ border: 0 }}
                                          allowFullScreen
                                          loading="lazy"
                                          referrerPolicy="no-referrer-when-downgrade"
                                        />

                                        </div>
                                        <ul className="list-info-footer">
                                            <li className="wow animate__animated animate__fadeIn">
                                                <div className="cardImage"><span className="icon-brand-1"><img src="/assets/imgs/page/homepage2/address.svg" alt="transp" /></span></div>
                                                <div className="cardInfo">
                                                    <h6 className="font-sm-bold color-grey-900">Dirección</h6>
                                                    <p className="font-sm color-grey-900">6434 Red Pine ln, Greenacres Fl 33415</p>
                                                </div>
                                            </li>
                                            <li className="wow animate__animated animate__fadeIn">
                                                <div className="cardImage"><span className="icon-brand-1"><img src="/assets/imgs/page/homepage2/email.svg" alt="transp" /></span></div>
                                                <div className="cardInfo">
                                                    <h6 className="font-sm-bold color-grey-900">Correo</h6>
                                                    <p className="font-sm color-grey-900">molivera@joesupplyllc.com</p>
                                                </div>
                                            </li>
                                            <li className="wow animate__animated animate__fadeIn">
                                                <div className="cardImage"><span className="icon-brand-1"><img src="/assets/imgs/page/homepage2/phone.svg" alt="transp" /></span></div>
                                                <div className="cardInfo">
                                                    <h6 className="font-sm-bold color-grey-900">Teléfono</h6>
                                                    <p className="font-sm color-grey-900">+1 (786) 493-9342</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
            <ModalVideo channel="youtube" autoplay isOpen={isOpen} videoId="vfhzo499OeA" onClose={() => setOpen(false)} />

        </>
    )
}