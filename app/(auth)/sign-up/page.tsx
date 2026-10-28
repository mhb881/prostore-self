import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}) => {
  // 所以 callbackUrl 的本质是：保留用户原本想访问的目标地址。
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="bg-card/80 w-full max-w-md border-0 p-4 shadow-xl backdrop-blur-sm">
        <div className="from-background to-muted absolute inset-0 -z-10 rounded-lg bg-linear-to-r"></div>
        <CardHeader className="relative space-y-1 pb-8 text-center">
          <div className="from-primary to-secondary mx-auto mb-2 rounded-full bg-linear-to-r transition-all hover:scale-105">
            <Link
              href="/"
              className="flex h-16 w-16 items-center justify-center p-3"
            >
              <Home className="text-primary-foreground h-8 w-8" />
            </Link>
          </div>
          <CardTitle className="text-foreground text-2xl font-bold">
            注册账号
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            输入以下信息注册账号
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* FORM HERE */}
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
