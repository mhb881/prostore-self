import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import CategoryDrawer from "./catagory-drawer";
import SearchRoot from "./search";

const Header = () => {
  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
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
            <span className="hidden text-2xl font-bold tracking-tight lg:block">
              {APP_NAME}
            </span>
          </Link>
          <div className="ml-4">
            <CategoryDrawer />
          </div>
        </div>
        <div className="hidden md:block">
          <SearchRoot />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
