import Footer from './Footer'
import Navbar from './Navbar';
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
    <Navbar/>
      <Head>
          <title>Doc Chat</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      <main>{children}</main>
      <Footer />
    </>
  )
}