import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          {/* Tus fuentes */}
          <link rel="preconnect" href="https://fonts.bunny.net" />
          <link
            href="https://fonts.bunny.net/css?family=epilogue:400,500,600,700"
            rel="stylesheet"
          />

          {/* PWA manifest */}
          <link rel="manifest" href="/manifest.webmanifest" />
          <meta name="theme-color" content="#0ea5e9" />

          {/* iOS support */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="JoeSupply" />
          <link rel="apple-touch-icon" href="/assets/imgs/template/logo-joesupply-preview.png" />

          {/* Favicon fallback */}
          <link rel="icon" href="/assets/imgs/template/logo-joesupply-preview.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
