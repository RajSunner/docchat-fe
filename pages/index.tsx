import type { NextPage } from "next";
import { useSession, getSession } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";
import ReportList from "../components/Report";
import client from "../lib/prismadb";

const Home: NextPage = ({ reports }) => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="max-w-xl m-auto">
        <CircularProgress />
      </div>
    );
  }
  if (status === "authenticated") {
    return (
      <>
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
            <ReportList reports={JSON.parse(reports)} />
          </div>
        </main>
      </>
    );
  }
  return (
    <>
      <p>Not signed in.</p>
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
      reports,
    },
  };
};
