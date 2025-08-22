import Head from 'next/head'

const PageHead = ({ headTitle }) => {
    return (
        <>
            <Head>
                <title>
                    {headTitle ? headTitle : "JoeSupply - La pincipal empresa de logística y paquetería"}
                </title>
                <link rel="shortcut icon" href="/favicon.svg" />
            </Head>
        </>
    )
}

export default PageHead