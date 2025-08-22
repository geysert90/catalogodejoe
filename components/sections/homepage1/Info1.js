import Link from "next/link";

export default function Info1() {
    return (
        <>
            <section className="section mt-85">
                <div className="container">
                    <div className="text-center"><img className="mb-15" src="/assets/imgs/template/icons/joe-supply-embedded.svg" alt="Joe Supply" width="120" height="120" />
                        <p className="font-md color-grey-700 wow animate__animated animate__fadeIn">Envíos mayoristas 
                            para MyPymes</p>
                        <h2 className="color-brand-2 mb-65 mt-15 wow animate__animated animate__fadeIn">Somos los principales proveedores
                            Mayoristas<br className="d-none d-lg-block" />de envíos a CUBA.</h2>
                    </div>
                    <div className="row mt-50 align-items-center">
                        <div className="col-xl-7 col-lg-6 mb-30">
                            <div className="box-images-pround">
                                <div className="box-images wow animate__animated animate__fadeIn"><img className="img-main" src="/assets/imgs/page/homepage1/img1.png" alt="transp" />
                                    <div className="image-2 shape-3"><img src="/assets/imgs/page/homepage1/icon1.png" alt="transp" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6 mb-30">
                            <div className="box-info-pround">
                                <h3 className="color-brand-2 mb-15 wow animate__animated animate__fadeIn">Envíos seguros y confiables con 
                                    seguimiento en tiempo real</h3>
                                <p className="font-md color-grey-500 wow animate__animated animate__fadeIn">A lo largo de los años, hemos colaborado para ampliar nuestra red de socios y ofrecer fiabilidad y consistencia. 
                                    También hemos logrado importantes avances para integrar la tecnología con nuestros procesos, ofreciendo a nuestros clientes los mejores precios en cada compromiso.</p>
                                <div className="mt-30">
                                    <ul className="list-ticks">
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Envíos rápidos y seguros
                                        </li>
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Seguimiento de envíos en tiempo real
                                        </li>
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Mejores precios garantizados
                                        </li>
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Seguridad y confianza en cada envío
                                        </li>
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Nacionalización de envíos
                                        </li>
                                        <li className="wow animate__animated animate__fadeIn">
                                            <svg className="w-6 h-6 icon-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>Documentación y certificación de calidad de envíos
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
