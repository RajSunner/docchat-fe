import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Chatbot from "../../components/Chatbot";

const Chat = ({session}) => {
  const router = useRouter();
  const { pid, url, name } = router.query;

  return (
    <>
     <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
      <div>
        <Chatbot url={url} name={name}/>
      </div>
      <p>Chat: {pid}</p>
      <p>url: {url}</p>
      <p>file_name: {name}</p>
      </div>
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
