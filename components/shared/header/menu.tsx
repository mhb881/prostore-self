import ModeToggle from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EllipsisVertical, ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";

const Menu = () => {
  // 定义菜单项配置，便于统一管理
  const menuItems = [
    {
      icon: <ShoppingCartIcon className="h-5 w-5 mr-2" />,
      label: "购物车",
      href: "/cart",
      variant: "ghost",
    },
    {
      icon: <UserIcon className="h-5 w-5 mr-2" />,
      label: "登录",
      href: "/login", // 修正原代码中登录链接指向 cart 的错误
      variant: "default",
    },
  ];

  return (
    <div className="flex justify-end items-center gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        {/* 主题切换按钮 */}
        <div className="rounded-full hover:bg-muted transition-colors">
          <ModeToggle />
        </div>

        {/* 循环渲染菜单项，保持样式统一 */}
        {menuItems.map((item, index) => (
          <Button
            key={index}
            asChild
            variant={item.variant as "ghost" | "default"}
            className="relative transition-all "
          >
            <Link href={item.href} className="flex items-center">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>

      {/* 移动端菜单 (md以下显示) */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger
            className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
            aria-label="打开菜单"
          >
            <EllipsisVertical />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex flex-col gap-6 p-6 pt-8"
            // 自定义抽屉背景和圆角，提升视觉质感
            style={{
              borderTopLeftRadius: "1.5rem",
              borderBottomLeftRadius: "1.5rem",
            }}
          >
            <SheetTitle className="text-lg font-semibold flex items-center gap-2">
              功能菜单
            </SheetTitle>
            <ModeToggle />
            {/* 移动端菜单项 - 更大的点击区域，更好的视觉层级 */}
            {menuItems.map((item, index) => (
              <Button
                key={index}
                asChild
                variant={item.variant as "ghost" | "default"}
                className=" text-base"
                size="lg"
              >
                <Link href={item.href} className="w-full flex items-center">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
