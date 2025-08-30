// pages/_app.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Preloader from "@/components/elements/Preloader";
import "swiper/css";
import "swiper/css/pagination";
import "../public/assets/css/style.css";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cleanup = () => {
      document.body.classList.remove("mobile-menu-active");
      document.querySelectorAll(".mobile-header-wrapper-style")
        .forEach(el => el.classList.remove("sidebar-visible"));
    };
    router.events.on("routeChangeStart", cleanup);
    router.events.on("routeChangeComplete", cleanup);
    return () => {
      router.events.off("routeChangeStart", cleanup);
      router.events.off("routeChangeComplete", cleanup);
    };
  }, [router.events]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return !loading ? <Component {...pageProps} /> : <Preloader />;
}

export default MyApp;