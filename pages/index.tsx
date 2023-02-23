import type { NextPage } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import ReportList from "../components/Report";
import FileUpload from "../components/FileUpload";
import client from "../lib/prismadb";

const Home: NextPage = ({ session, reports }) => {
  const { status } = useSession();
  const userEmail = session?.user.email;
  const [file, setFile] = useState(null);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const [reportdocs, setReports] = useState(JSON.parse(reports));
  const changeHandler = (event) => {
    setFile(event.target.files[0]);
  };

  function handleData(dataRes) {
    setName(dataRes.original_filename);
    setUrl(dataRes.secure_url);
  }

  useEffect(() => {
    if (name && url) {
      handleReport();
    }
  }, [name, url]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_PRESET);

    const response = await fetch(process.env.NEXT_PUBLIC_CLOUD_URL, {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      return;
    }

    const dataRes = await response.json();
    console.log(dataRes);
    handleData(dataRes);
  };

  const handleReport = async () => {
    const response = await fetch("api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, url }),
    });

    if (!response.ok) {
      return;
    }
    const data = await response.json();
    console.log(data);
    setReports([...reportdocs, data]);
  };

  if (status === "loading") {
    return <p>Hang on there...</p>;
  }
  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <p>Signed in as {userEmail}</p>
          <button onClick={() => signOut()}>Sign out</button>
          <h1 className="text-6xl font-bold">
            {/* <Slide open={open} setOpen={setOpen} /> */}
            Welcome{" "}
            <a className="text-blue-600" href="https://nextjs.org">
            Doc Chat!
            </a>
          </h1>
          <FileUpload onChange={changeHandler} onClick={handleSubmission} />
          <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
            <ReportList reports={reportdocs} />
          </div>
        </main>

        <footer className="flex h-24 w-full items-center justify-center border-t">
          <a
            className="flex items-center justify-center gap-2"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </a>
        </footer>
      </div>
    );
  }
  return (
    <>
      <p>Not signed in.</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default Home;

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const user = await client.user.findUnique({
    where: { email: session.user.email },
  });

  const response = await client.report.findMany({
    where: { userId: user.id },
  });

  const reports = JSON.stringify(response);
  return {
    props: {
      session,
      reports,
    },
  };
};
