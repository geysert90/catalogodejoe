import Link from "next/link";
import { useState } from "react";

export default function Sidebar({ openClass, handleMobileMenuClose }) {
    const [isActive, setIsActive] = useState({
        status: false,
        key: "",
    });

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            });
        } else {
            setIsActive({
                status: true,
                key,
            });
        }
    };

    return (
        <>
            <div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${openClass}`}>
                <div className="mobile-header-wrapper-inner">
                    <div className="mobile-header-content-area">

                        {/* Logo + botón seguir pedido */}
                        <div className="mobile-logo">
                        <Link
                            className="btn btn-brand-1 hover-up btn-compact"
                            href="/seguirpedido"
                        >
                            <svg
                            width="12"   // fuerza 16px en móvil
                            height="12"
                            className="md:w-6 md:h-6" // si usas tailwind y quieres que crezca en >= md
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            style={{ marginRight: 6, verticalAlign: 'middle' }}
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                            />
                            </svg>
                            Seguir Pedido
                        </Link>
                        </div>


                        {/* Botón cerrar menú */}
                        <div className="burger-icon burger-close" onClick={handleMobileMenuClose}>
                            <span className="burger-icon-top" />
                            <span className="burger-icon-mid" />
                            <span className="burger-icon-bottom" />
                        </div>

                        {/* Contenido del menú */}
                        <div className="perfect-scroll">
                            <div className="mobile-menu-wrap mobile-header-border">
                                <nav className="mt-15">
                                    <ul className="mobile-menu font-heading">

                                       
                                        {/* Enlaces simples */}
                                        <li><Link href="/">Catálogo</Link></li>
                                        <li><Link href="/seguirpedidos">Pedidos</Link></li>
                                        <li><Link href="/contact">Contáctanos</Link></li>
                                        <li><Link href="/acercade">Acerca de</Link></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
