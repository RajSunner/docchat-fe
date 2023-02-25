import Footer from './Footer'
import Navbar from './Navbar';
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
          <title>Doc Chat</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar/>
        <main className="mx-auto max-w-3xl">
        {children}
        </main>
        <Footer />
        
      
    </>
  )
}