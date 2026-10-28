"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";
import React from "react";

const links = [
  {
    title: "概览",
    href: "/admin/overview",
    icon: LayoutDashboard,
  },
  {
    title: "产品",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "分类",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "订单",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    title: "用户",
    href: "/admin/users",
    icon: Users,
  },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  return (
    <nav className={cn("flex items-center gap-1", className)} {...props}>
      {links.map((item) => {
        const isActive = pathname.includes(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
