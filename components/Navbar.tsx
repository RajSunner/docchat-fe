import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import SlideOver from "./SlideOver";
import Router from "next/router";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { status, data: session } = useSession();
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState(null);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

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
    setOpen(false);
    Router.reload();
  };

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
    handleData(dataRes);
  };

  return (
    <>
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/">
                <img
                  className="block h-8 w-auto lg:hidden"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </Link>
              <Link href="/">
                <img
                  className="hidden h-8 w-auto lg:block"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4"></div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open menu</span>
                  {session ? (
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={session.user?.image}
                      alt="profile pic"
                      width={500}
                      height={500}
                    />
                  ) : (
                    <></>
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={() => setOpen(true)}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Add PDF Document
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) =>
                      status === "authenticated" ? (
                        <a
                          onClick={() => signOut()}
                          type="button"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          <span className="sr-only">Login or Logout</span>
                          Log out
                        </a>
                      ) : (
                        <a
                          onClick={() => signIn()}
                          type="button"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          <span className="sr-only">Login or Logout</span>
                          Log in
                        </a>
                      )
                    }
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
    <SlideOver onChange={changeHandler} onClick={handleSubmission} open={open} setOpen={setOpen}/>
    </>
  );
}
