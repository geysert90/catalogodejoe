import Link from "next/link";

export default function Info1() {
    return (
        <>
            <section className="section mt-85">
                <div className="container">
                    <div className="text-center"><img className="mb-15" src="/assets/imgs/template/icons/joe-supply-embedded.svg" alt="Joe Supply" width="120" height="120" />
                        <p className="font-2xl-bold color-brand-2 wow animate__animated animate__fadeIn"><span className="color-brand-1">Envíos de Contenedores 
                            a MiPyme, TCP, Cooperativas y Personas Naturales  </span></p>
                        <h2 className="color-brand-2 mb-65 mt-15 wow animate__animated animate__fadeIn">Ofrecemos los mejores Precios de Importación
                            a Cuba<br className="d-none d-lg-block" />y los menores Tiempos de Envíos.</h2>
                    </div>
                    <div className="row mt-50 align-items-center">
                        <div className="col-xl-7 col-lg-6 mb-30">
                            <div className="box-images-pround">
                                <div className="box-images wow animate__animated animate__fadeIn"><img className="img-main" src="/assets/imgs/page/homepage1/pollo.jpg" alt="transp" />
                                    <div className="image-2 shape-3"><img src="/assets/imgs/page/homepage1/icon1.png" alt="transp" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6 mb-30">
                            <div className="box-info-pround">
                                <h3 className="color-brand-2 mb-15 wow animate__animated animate__fadeIn">Envíos de Cargas Marítimas Seguras con 
                                    Seguimiento en Tiempo Real</h3>
                                <p className="font-md color-grey-500 wow animate__animated animate__fadeIn">A lo largo de los años, hemos creado un vínculo directo con fábricas estadounidenses e internacionales, 
                                    ampliando nuestra red de productos y garantizando los mejores precios junto con un ciclo de reaprovisionamiento ágil con los menores tiempos de entrega del mercado. 
                                    Realizamos envíos semanales con tiempos de llegada a Cuba entre 24 horas y 6 días, asegurando rapidez, eficiencia y puntualidad.</p>
                                <div className="mt-30">
                                    <ul className="list-ticks">
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Entregamos por Puerto Mariel y Puerto de Santiago de Cuba.
                                        </li>
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Seguimiento de Envíos en Tiempo Real
                                        </li>
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Mejores Precios Garantizados
                                        </li>
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Seguridad y Confianza en cada Envío
                                        </li>
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Contratos con las Principales Importadoras Cubanas: Agrimpex, Quimimport, Frutas Selectas, etc.
                                        </li>
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Ofrecemos el Proceso de Nacionalización de sus Cargas, y Pagamos sus Impuestos.
                                        </li>
                                    </ul>
                                </div>
                                {/*<div className="mt-30 text-start d-flex wow animate__animated animate__fadeIn"><Link className="hover-up mr-10" href="#"><img src="/assets/imgs/template/appstore-btn.png" alt="transp" /></Link><Link className="hover-up" href="#"><img src="/assets/imgs/template/google-play-btn.png" alt="transp" /></Link></div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
