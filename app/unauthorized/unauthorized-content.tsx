"use client";

import Link from "next/link";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const UnauthorizedContent = () => {
  return (
    <div className="flex flex-col items-center space-y-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-gray-500/20 blur-3xl" />
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-sm">
          <ShieldX className="text-foreground h-16 w-16" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          访问受限
        </h1>
        <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-gray-600 to-gray-500" />
      </div>

      <div className="max-w-md space-y-3">
        <p className="text-foreground text-xl font-medium">
          抱歉，您没有权限访问此页面
        </p>
        <p className="text-muted-foreground">
          您可能需要登录或联系管理员获取访问权限
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            返回首页
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            返回上一页
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedContent;
