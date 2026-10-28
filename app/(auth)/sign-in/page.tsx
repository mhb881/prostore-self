import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import CredentialsSignInForm from "./credential-signin-form";
import { Home } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}) => {
  // 所以 callbackUrl 的本质是：
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
            欢迎回来
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            登录你的账户以继续
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* FORM HERE */}
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
