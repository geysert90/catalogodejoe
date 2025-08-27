import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Menu from "./Menu";

export default function Header({ topBarStyle, handleMobileMenuOpen }) {
  const [isSticky, setIsSticky] = useState(false);
  const [hideOnMobile, setHideOnMobile] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    // Evita SSR issues
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const y = window.scrollY || 0;
      const lastY = lastYRef.current;

      // Activa “sticky” al pasar 100px (igual que tu lógica anterior)
      setIsSticky(y > 100);

      // Solo aplicar auto-ocultar en móvil (≤ 991.98px)
      const isMobile = window.innerWidth <= 991.98;

      if (isMobile) {
        const goingDown = y > lastY + 8;   // umbral pequeño para evitar jitter
        const goingUp   = y < lastY - 8;

        if (goingDown && y > 80) {
          // Oculta al bajar
          setHideOnMobile(true);
        } else if (goingUp) {
          // Muestra al subir
          setHideOnMobile(false);
        }
      } else {
        // En desktop nunca ocultamos por scroll
        setHideOnMobile(false);
      }

      lastYRef.current = y;
    };

    // Inicializa
    lastYRef.current = window.scrollY || 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll); // recalcula al cambiar tamaño
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className={topBarStyle ? topBarStyle : ""}>
        <div className={`box-bar bg-grey-900 ${hideOnMobile ? "hide-mobile" : ""}`}>
          <div className="container position-relative">
            <div className="row align-items-center">
              <div className="col-lg-7 col-md-8 col-sm-5 col-4">
                <Link className="phone-icon mr-45" href="tel:+01-561-814-0985">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"></path>
                  </svg>
                  Telefono: +1 (786) 493-9342 (Disponible 24/7)
                </Link>
                <Link className="email-icon" href="mailto:molivera@joesupplyllc.com">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                  </svg>
                  molivera@joesupplyllc.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <header
        className={`header sticky-bar ${isSticky ? "stick" : ""} ${hideOnMobile ? "hide-mobile" : ""}`}
      >
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <Link className="d-flex" href="/">
                  <img
                    alt="Joe Supply"
                    src="/assets/imgs/template/logo-joesupply.png"
                    width="60"
                    height="auto"
                  />
                </Link>
              </div>

              <div className="header-nav">
                <nav className="nav-main-menu d-none d-xl-block">
                  <Menu />
                </nav>
                <div className="burger-icon burger-icon-white" onClick={handleMobileMenuOpen}>
                  <span className="burger-icon-top" />
                  <span className="burger-icon-mid" />
                  <span className="burger-icon-bottom" />
                </div>
              </div>

              <div className="header-right">
                <div className="d-none d-sm-inline-block">
                  <Link className="btn btn-brand-1 d-none d-xl-inline-block hover-up" href="/seguirpedido">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"></path>
                    </svg>
                    Rastrear Contenedor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
