import type { NextPage } from "next";
import { useSession, getSession } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";
import ReportList from "../components/Report";
import client from "../lib/prismadb";

const Home: NextPage = ({ reports }) => {
  console.log(reports);
  const { status } = useSession();

  if (status === "loading") {
    return (
        <CircularProgress />
    );
  }
  if (status === "authenticated") {
    return (
      <>
        <ReportList reports={JSON.parse(reports)} />
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
