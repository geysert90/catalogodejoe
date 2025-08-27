// components/slider/Hero1Slider.jsx
import { useState } from "react";
import Link from "next/link";
import ModalVideo from "react-modal-video";
import { Autoplay, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Espera props.banners con: { id, webSrc, mobileSrc, titulo, cta_text, cta_url }
export default function Hero1Slider({ banners = [] }) {
  const [isOpen, setOpen] = useState(false);

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
        {banners.map((b, i) => (
          <SwiperSlide key={b.id || i}>
            <div className="hero-slide">
              {/* Imagen responsive: móvil vs desktop */}
              <picture>
                {/* móvil primero */}
                {b.mobileSrc ? (
                  <source
                    media="(max-width: 575.98px)"
                    srcSet={b.mobileSrc}
                  />
                ) : null}
                {/* fallback desktop */}
                <img
                  src={b.webSrc || b.mobileSrc || "/assets/imgs/template/placeholder.png"}
                  alt={b.titulo || "Banner"}
                  className="hero-img"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </picture>

              {/* Capa de contenido opcional */}
              {(b.titulo || b.cta_text) && (
                <div className="hero-content container">
                  <div className="row align-items-center">
                    <div className="col-lg-12">
                      {b.titulo ? (
                        <h1 className="hero-title">{b.titulo}</h1>
                      ) : null}

                      {b.cta_text && b.cta_url ? (
                        <div className="box-button">
                          <Link
                            className="btn btn-brand-1-big hover-up mr-40"
                            href={b.cta_url}
                          >
                            {b.cta_text}
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-pagination swiper-pagination-banner" />

      {/* Estilos scoped para este slider */}
      <style jsx>{`
        .hero-slide {
          position: relative;
          width: 100%;
          /* altura adaptable */
          min-height: 72vh; /* desktop */
          background: transparent;
          overflow: hidden;
        }
        @media (max-width: 991.98px) {
          .hero-slide {
            min-height: 42vh;
          }
        }
        @media (max-width: 575.98px) {
          .hero-slide {
            min-height: 56vh; /* puedes subir/bajar según tu arte móvil */
          }
        }

        .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover; /* rellena, sin bandas */
          object-position: center center;
          display: block;
          background: #f5f7fa;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding-top: 40vh; /* separa textos del borde superior */
          padding-bottom: 8vh;
        }

        .hero-title {
          color: #111827;
          margin: 0 0 12px 0;
          line-height: 1.15;
          font-weight: 800;
          font-size: clamp(22px, 3.4vw, 44px);
          text-shadow: 0 1px 2px rgba(0,0,0,.05);
        }

        .box-button :global(.btn) {
          margin-top: 10px;
        }
      `}</style>

      {/* Estilos globales mínimos para evitar “fondo negro” del Swiper */}
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
