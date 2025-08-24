import Link from "next/link"
import { useRouter } from "next/router"

export default function Menu() {
    const router = useRouter()

    return (
        <>

            <ul className="main-menu">
                <li className="/home"><Link className="active" href="/">Catálogo</Link></li>
                
                {/* <li><Link href="/about">Acerca de</Link></li> */}
                
                <li className="/seguirpedido"><Link href="/seguirpedido">Rastreo</Link></li>
                <li><Link href="/contact">Contáctanos</Link></li>
                <li className="/tienda"><Link className="active" href="/acercade">Quiénes Somos</Link></li>
            </ul>
        </>
    )
}
