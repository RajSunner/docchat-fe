import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex mt-96 h-24 w-full items-center justify-center border-t">
      <Link
        className="flex items-center justify-center gap-2"
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{" "}
        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
      </Link>
    </footer>
  );
};

export default Footer;
