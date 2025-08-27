// pages/acercade.js
import Layout from "@/components/layout/Layout";
import Bgmap from "@/components/sections/homepage1/Bgmap";
import Brands1 from "@/components/sections/homepage1/Brands1";
import Cta1 from "@/components/sections/homepage1/Cta1";
import Faqs1 from "@/components/sections/homepage1/Faqs1";
import Howitwork1 from "@/components/sections/homepage1/Howitwork1";
import Info1 from "@/components/sections/homepage1/Info1";
import Info2 from "@/components/sections/homepage1/Info2";
import News1 from "@/components/sections/homepage1/News1";
import Pricing1 from "@/components/sections/homepage1/Pricing1";
import Projects1 from "@/components/sections/homepage1/Projects1";
import Requestquote1 from "@/components/sections/homepage1/Requestquote1";
import Services1 from "@/components/sections/homepage1/Services1";
import Testimonial1 from "@/components/sections/homepage1/Testimonial1";

// 👉 Importa el slider que recibe los banners (versión que ya hicimos con webSrc/mobileSrc)
import Hero1Slider from "@/components/slider/Hero1Slider";

// Utilidad para construir URLs de assets de Directus (sirve con id o con objeto file)
function directusAssetUrl(file) {
  const base = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || "";
  if (!file || !base) return "";
  if (typeof file === "string") return `${base}/assets/${file}`;
  const id = file.id || file;
  const filename = file.filename_download || file.filename_disk || "file";
  return `${base}/assets/${id}/${filename}`;
}

export default function AcercaDePage({ banners = [] }) {
  return (
    <Layout>
      {/* Slider dinámico desde Directus */}
      <Hero1Slider banners={banners} />

      {/* El resto de tu página “Acerca de” tal cual la tenías */}
      <Brands1 />
      {/* <Services1 /> */}
      <Info1 />
      <Info2 />
      <Howitwork1 />
      {/* <Testimonial1 /> */}
      {/* <Projects1 /> */}
      {/* <Requestquote1 /> */}
      {/* <Pricing1 /> */}
      {/* <Faqs1 /> */}
      <Cta1 />
      {/* <News1 /> */}
      <Bgmap />
    </Layout>
  );
}

// SSR: traer banners de Directus
export async function getServerSideProps() {
  const base = process.env.DIRECTUS_URL;
  const token = process.env.DIRECTUS_STATIC_TOKEN;

  if (!base || !token) {
    return { props: { banners: [] } };
  }

  const url = new URL(`${base}/items/banners`);
  url.searchParams.set(
    "fields",
    [
      "id",
      "orden",
      "activo",
      "titulo",
      "cta_text",
      "cta_url",
      "banner_web.id",
      "banner_web.filename_download",
      "banner_web.filename_disk",
      "banner_mobil.id",
      "banner_mobil.filename_download",
      "banner_mobil.filename_disk",
    ].join(",")
  );
  url.searchParams.set("limit", "50");
  url.searchParams.set("sort", "orden");

  try {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error(await r.text());
    const { data = [] } = await r.json();

    const banners = (data || [])
      .filter((b) => b.activo !== false)
      .map((b) => ({
        id: b.id,
        orden: b.orden ?? 0,
        titulo: b.titulo || "",
        cta_text: b.cta_text || "",
        cta_url: b.cta_url || "",
        webSrc: directusAssetUrl(b.banner_web),     // imagen desktop
        mobileSrc: directusAssetUrl(b.banner_mobil) // imagen móvil
      }))
      .sort((a, z) => (a.orden || 0) - (z.orden || 0));

    return { props: { banners } };
  } catch (e) {
    console.error("Directus banners error:", e);
    return { props: { banners: [] } };
  }
}
