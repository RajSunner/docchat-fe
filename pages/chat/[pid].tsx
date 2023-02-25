import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Chatbot from "../../components/Chatbot";

const Chat = () => {
  const router = useRouter();
  const { url, name, fname } = router.query;

  return (
    <>
        <Chatbot url={url} name={name} fname={fname}/>
    </>
  );
};

export default Chat;

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
  return {
    props: {
      session,
    },
  };
};
