import Link from "next/link"
import { useRouter } from "next/router"

export default function Menu() {
    const router = useRouter()

    return (
        <>

            <ul className="main-menu">
                <li className="/home"><Link className="active" href="/">Home</Link></li>
                <li className="/tienda"><Link className="active" href="/tienda">Tienda</Link></li>
                <li><Link href="/about">Acerca de</Link></li>
                
                <li className="/seguirpedido"><Link href="/seguirpedido">Pedidos</Link></li>
                <li><Link href="/contact">Contactanos</Link></li>
            </ul>
        </>
    )
}
