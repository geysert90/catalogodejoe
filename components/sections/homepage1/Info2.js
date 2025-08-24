import Link from "next/link";

export default function Info2() {
    return (
        <>
            <section className="section mt-55 bg-1 position-relative pt-90 pb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6"><span className="btn btn-tag wow animate__animated animate__fadeIn">Joe Supply LLC</span>
                          
                            <h3 className="color-grey-900 mb-20 mt-15 wow animate__animated animate__fadeIn">Orgullosos de Ofrecer<br className="d-none d-lg-block" />Excelencia en Todo Momento</h3>
                            <p className="font-md color-grey-900 mb-40 wow animate__animated animate__fadeIn">Garantizamos la seguridad y calidad de su carga y ofrecemos
                                los mejores precios del mercado. Nuestra experiencia y compromiso nos permiten brindar un servicio excepcional a nuestros clientes.</p>
                           
                            <div className="row">
                                <div className="col-lg-6 mb-30">
                                    <h6 className="chart-title font-md-bold color-grey-900 wow animate__animated animate__fadeIn">
                                        Impulsa tus ventas</h6>
                                    <p className="font-xs color-grey-900 wow animate__animated animate__fadeIn">Con nuestros productos mayoristas obtienes los mejores precios de compra.</p>
                                </div>
                                <div className="col-lg-6 mb-30">
                                    <h6 className="feature-title font-md-bold color-grey-900 wow animate__animated animate__fadeIn">
                                        Documentación y Certificación</h6>
                                    <p className="font-xs color-grey-900 wow animate__animated animate__fadeIn">Cada envío cuenta con la documentación y certificación 
                                        necesaria para garantizar la calidad y seguridad de tu carga.</p>
                             
                                </div>
                            </div>
                            <div className="mt-20"><Link className="btn btn-brand-2 mr-20 wow animate__animated animate__fadeIn" href="/contact">Contáctanos</Link>
                            {/*<Link className="btn btn-link-medium wow animate__animated animate__fadeIn" href="/contact">Ver Más
                                <svg className="w-6 h-6 icon-16 ml-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg></Link>*/}
                                </div>
                        </div>
                    </div>
                </div>
                <div className="box-image-touch" />
            </section>
        </>
    )
}
