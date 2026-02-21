import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      {/* 优化 header 样式：毛玻璃效果 + 粘性定位 + 更高的 z-index */}
      <div className="wrapper flex items-center justify-between">
        {/* 替换自定义的 flex-between/flex-start 为通用 tailwind 类 */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={40}
              width={40}
              className="transition-transform hover:scale-105"
            />
            <span className="hidden lg:block font-bold text-2xl tracking-tight">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
