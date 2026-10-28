"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail } from "lucide-react";
import { signUpUser } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";

const signInDefaultValues = {
  email: "",
  password: "",
} as const;

const SignUpButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground h-12 w-full cursor-pointer bg-gradient-to-r font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
          提交中...
        </div>
      ) : (
        "注册"
      )}
    </Button>
  );
};

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [formState, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // 监听登录状态变化
  useEffect(() => {
    if (formState?.success) {
      // 登录成功后显示成功消息，然后跳转
      setTimeout(() => {
        router.push(callbackUrl || "/");
      }, 1000);
    }
  }, [callbackUrl, formState?.success, router]);

  // 自定义提交处理函数
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    action(formData);
    // 在action执行完成后重置提交状态
    setIsSubmitting(false);
  };

  return (
    <form className="flex flex-col gap-3" action={handleSubmit}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {/*  */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-foreground flex items-center gap-2 text-sm font-medium"
        >
          姓名
        </label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            type="name"
            placeholder="Enter your name"
            required
            defaultValue={signUpDefaultValues.name}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground h-12 transition-all duration-200"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/*  */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-foreground flex items-center gap-2 text-sm font-medium"
        >
          <Mail className="text-primary h-4 w-4" />
          邮箱
        </label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            defaultValue={signUpDefaultValues.email}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground h-12 transition-all duration-200"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/*  */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-foreground text-sm font-medium"
        >
          密码
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            defaultValue={signUpDefaultValues.password}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground h-12 pr-12 transition-all duration-200"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isSubmitting}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/*  */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-foreground flex items-center text-sm font-medium"
        >
          确认密码
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            defaultValue={signUpDefaultValues.confirmPassword}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground h-12 pr-12 transition-all duration-200"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <SignUpButton />

      {/* 错误信息展示 */}
      {formState && !formState.success && formState.message && (
        <div className="text-destructive bg-destructive/10 rounded-md p-2 text-center text-sm">
          {formState.message}
        </div>
      )}

      {/* 成功信息展示 */}
      {formState && formState.success && formState.message && (
        <div className="rounded-md bg-green-500/10 p-2 text-center text-sm text-green-500">
          {formState.message} ✓ 正在跳转到主页...
        </div>
      )}

      <div className="text-muted-foreground text-center text-sm">
        已经注册了？{" "}
        <Link
          href="/sign-in"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          登录
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
