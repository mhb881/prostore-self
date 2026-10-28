import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import MainNav from "./main-nav";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="wrapper border-b">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.svg"
                alt={`${APP_NAME} logo`}
                height={40}
                width={40}
                className="transition-transform hover:scale-105"
              />
            </Link>
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Menu />
            </div>
          </div>
        </div>

        <div className="wrapper flex-1 space-y-4 p-8 pt-6">{children}</div>
      </div>
    </>
  );
}
