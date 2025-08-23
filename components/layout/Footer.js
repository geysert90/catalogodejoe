import Link from "next/link";

export default function Footer1({ }) {
  return (
    <>
      <footer className="footer">
        {/* 👇 CAMBIO: compactar espacio superior */}
        <div className="footer-1" style={{ paddingTop: 12 }}>
          <div className="container">
            <div className="row">
              {/* Columna izquierda: logo + descripción */}
              <div className="col-lg-3 width-23 mb-30">
                <div className="mb-20">
                  <img
                    src="/assets/imgs/template/logo-joesupply-preview.png"
                    alt="Joe Supply"
                    width="120"
                    height="auto"
                  />
                </div>

                <p className="font-md mb-20 color-white">
                  Somos una Empresa Americana Especializada en Importación hacia Cuba.
                  Con los Precios más Competitivos del Mercado y la Mayor Rapidéz en la Entrega.
                </p>
              </div>

              {/* Columna derecha: Modalidades de servicio (2 columnas internas) */}
              <div className="col-lg-9 mb-30">
                {/* 👇 CAMBIO: sin margen superior del título */}
                <h5
                  className="text-center font-3xl mb-15 color-brand-1"
                  style={{ marginTop: 0, lineHeight: 1.2 }}
                >
                  Ofrecemos dos Modalidades de Venta:
                </h5>

                <div className="row">
                  {/* Modalidad 1 */}
                  <div className="col-md-6 mb-20">
                    <h6 className="mb-10 color-white">
                      🔹 1. Oferta con nacionalización incluida por Joe Supply LLC
                    </h6>
                    <p className="color-white mb-10">
                      Nos encargamos del servicio de nacionalización, por lo que el cliente
                      no necesita contrato con la importadora.
                    </p>
                    <p className="color-white mb-10">
                      Asumimos los costos de aranceles de importación e impuestos ante la ONAT.
                    </p>
                    <p className="color-white mb-10">
                      El proceso de nacionalización demora entre 5 y 7 días laborables después
                      de la llegada del contenedor a Puerto Mariel o Santiago de Cuba.
                    </p>
                    <p className="color-white mb-0">
                      Una vez concluido, entregamos la pre-cita (derecho de recogida) para la
                      extracción en el puerto.
                    </p>
                  </div>

                  {/* Modalidad 2 */}
                  <div className="col-md-6 mb-20">
                    <h6 className="mb-10 color-white">
                      🔹 2. Oferta con nacionalización por parte del cliente
                    </h6>
                    <p className="color-white mb-10">
                      El cliente nacionaliza la mercancía a través de importadoras como
                      Quimimport, Agrimpex, Frutas Selectas, entre otras.
                    </p>
                    <p className="color-white mb-10">
                      Para ello debe estar registrado como cliente en dichas entidades.
                    </p>
                    <p className="color-white mb-0">
                      Si es MIPME, TCP o Cooperativa y aún no está registrado, le apoyamos
                      en el proceso siempre que cuente con la documentación en regla.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloques anteriores del footer (menu / gallery) quedan comentados */}
              {/*
              <div className="col-lg-3 width-16 mb-30">...</div>
              <div className="col-lg-3 width-16 mb-30">...</div>
              <div className="col-lg-3 width-16 mb-30">...</div>
              <div className="col-lg-3 width-20 mb-30">...</div>
              */}
            </div>
          </div>
        </div>

        <div className="footer-2">
          <div className="container">
            <div className="footer-bottom">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-12 text-center text-lg-start">
                  <span className="color-grey-300 font-md">
                    © Joe Supply LLC {new Date().getFullYear()}. Todos los derechos reservados.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
