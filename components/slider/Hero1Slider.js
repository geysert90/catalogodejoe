// components/slider/Hero1Slider.jsx
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import ModalVideo from "react-modal-video";
import { Autoplay, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// --- Helper: convierte id/objeto/array/URL -> URL absoluta de Directus
function assetUrl(input) {
  const base =
    process.env.NEXT_PUBLIC_DIRECTUS_URL ||
    process.env.DIRECTUS_URL ||
    "";

  if (!input) return null;

  // Si es array, toma el primero no vacío
  if (Array.isArray(input)) {
    const first = input.find(Boolean);
    return assetUrl(first);
  }

  // Si es objeto con url absoluta
  if (typeof input === "object") {
    if (input.url && /^https?:\/\//i.test(input.url)) return input.url;
    if (input.id) return base ? `${base}/assets/${input.id}` : null;
    // a veces viene como {data:{id:...}}
    if (input.data?.id) return base ? `${base}/assets/${input.data.id}` : null;
  }

  // Si es string
  if (typeof input === "string") {
    // URL absoluta
    if (/^https?:\/\//i.test(input)) return input;

    // id de asset
    if (/^[a-f0-9-]{8,}$/i.test(input)) {
      return base ? `${base}/assets/${input}` : null;
    }
  }

  return null;
}

// Normaliza campos habituales de tu schema
function pickBannerSources(b) {
  const webSrcRaw =
    b.webSrc || b.banner_web || b.banner || b.imagen_web || b.imagen;

  const mobileSrcRaw =
    b.mobileSrc || b.banner_mobil || b.banner_mobile || b.imagen_movil || b.imagen_mobile;

  const webSrc = assetUrl(webSrcRaw) || assetUrl(mobileSrcRaw);
  const mobileSrc = assetUrl(mobileSrcRaw);

  return { webSrc, mobileSrc };
}

// Decide móvil con JS (evita problemas del <picture>/viewport/caching)
function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const calc = () => {
      try {
        setIsMobile(window.innerWidth < breakpointPx);
      } catch {}
    };
    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("orientationchange", calc);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("orientationchange", calc);
    };
  }, [breakpointPx]);
  return isMobile;
}

// Espera props.banners con: { id, webSrc?, mobileSrc?, titulo?, cta_text?, cta_url? }
export default function Hero1Slider({ banners = [] }) {
  const [isOpen, setOpen] = useState(false);
  const isMobile = useIsMobile(768); // usa 768px para cubrir la mayoría de móviles/tablets en layout "mobile"

  // Normaliza de una vez
  const slides = useMemo(
    () =>
      banners.map((b) => {
        const { webSrc, mobileSrc } = pickBannerSources(b);
        return {
          id: b.id,
          titulo: b.titulo || b.title || b.heading || "",
          cta_text: b.cta_text || b.cta || b.button_text,
          cta_url: b.cta_url || b.href || b.link,
          webSrc: webSrc || "/assets/imgs/template/placeholder.png",
          mobileSrc: mobileSrc || null,
        };
      }),
    [banners]
  );

  // Debug visible en consola para confirmar qué URL se usa finalmente
  useEffect(() => {
    const rows = slides.map((s) => ({
      id: s.id,
      webSrc: s.webSrc,
      mobileSrc: s.mobileSrc,
      chosen: isMobile && s.mobileSrc ? s.mobileSrc : s.webSrc,
      isMobile,
    }));
    console.table(rows);
  }, [slides, isMobile]);

  return (
    <>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={0}
        loop
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".swiper-pagination-banner" }}
        className="hero-swiper"
      >
        {slides.map((s, i) => {
          const src = isMobile && s.mobileSrc ? s.mobileSrc : s.webSrc;
          return (
            <SwiperSlide key={s.id || i}>
              <div className="hero-slide">
                {/* Imagen única (decidida por JS) */}
                <img
                  src={src}
                  alt={s.titulo || "Banner"}
                  className="hero-img"
                  loading={i === 0 ? "eager" : "lazy"}
                  data-web={s.webSrc}
                  data-mobile={s.mobileSrc || ""}
                />

                {/* Capa de contenido opcional */}
                {(s.titulo || s.cta_text) && (
                  <div className="hero-content container">
                    <div className="row align-items-center">
                      <div className="col-lg-12">
                        {s.titulo ? (
                          <h1 className="hero-title">{s.titulo}</h1>
                        ) : null}

                        {s.cta_text && s.cta_url ? (
                          <div className="box-button">
                            <Link
                              className="btn btn-brand-1-big hover-up mr-40"
                              href={s.cta_url}
                            >
                              {s.cta_text}
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="swiper-pagination swiper-pagination-banner" />

      {/* Estilos scoped */}
      <style jsx>{`
        .hero-slide {
          position: relative;
          width: 100%;
          min-height: 72vh;
          background: transparent;
          overflow: hidden;
        }
        @media (max-width: 991.98px) {
          .hero-slide {
            min-height: 42vh;
          }
        }
        @media (max-width: 767.98px) {
          .hero-slide {
            min-height: 58vh;
          }
        }

        .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%5
          object-fit: cover;
          object-position: center center;
          display: block;
          background: #f5f7fa;
        }

        /* 🔧 CAMBIO CLAVE: el CTA no debe alterar la altura del slide */
        .hero-content {
          position: absolute;   /* antes: relative */
          inset: 0;             /* ocupa toda el área del slide */
          z-index: 2;
          display: flex;
          align-items: flex-end; /* alinea contenido hacia abajo (ajusta si quieres) */
          /* padding como “márgenes internos” del overlay */
          padding: 12vh 0 8vh 0; /* top right bottom left */
          pointer-events: none;  /* evita bloquear gestos del slider */
        }
        /* Permite clicks en los botones dentro del overlay */
        .hero-content :global(a),
        .hero-content :global(button) {
          pointer-events: auto;
        }

        @media (max-width: 991.98px) {
          .hero-content {
            padding: 10vh 0 6vh 0;
          }
        }
        @media (max-width: 767.98px) {
          .hero-content {
            padding: 8vh 0 5vh 0;
          }
        }

        .hero-title {
          color: #111827;
          margin: 0 0 12px 0;
          line-height: 1.15;
          font-weight: 800;
          font-size: clamp(22px, 3.4vw, 44px);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .box-button :global(.btn) {
          margin-top: 10px;
        }
      `}</style>

      {/* Fondo transparente Swiper */}
      <style jsx global>{`
        .hero-swiper,
        .hero-swiper .swiper-wrapper,
        .hero-swiper .swiper-slide {
          background: transparent !important;
        }
      `}</style>

      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="vfhzo499OeA"
        onClose={() => setOpen(false)}
      />
    </>
  );
}
