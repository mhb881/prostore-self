import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";
import { UserIcon } from "lucide-react";
import Link from "next/link";

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild variant={"default"} className="transition-all">
        <Link href={"/sign-in"} className="flex items-center">
          <span>
            <UserIcon className="mr-2 h-5 w-5" />
          </span>
          <span>{"登录"}</span>
        </Link>
      </Button>
    );
  }

  const firstInitial = session?.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            className="relative ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-gray-600"
          >
            <span className="text-sm">{firstInitial}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm leading-none font-medium">
                {session?.user?.name}
              </div>
              <div className="text-muted-foreground text-sm leading-none font-medium">
                {session?.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem asChild className="mb-1 p-0">
            <Link
              href={"/user/profile"}
              className="h-4 w-full cursor-pointer justify-start px-2 py-4"
            >
              个人中心
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="mb-1 p-0">
            <Link
              href={"/user/orders"}
              className="h-4 w-full cursor-pointer justify-start px-2 py-4"
            >
              历史订单
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === "admin" && (
            <DropdownMenuItem asChild className="mb-1 p-0">
              <Link
                href={"/admin/overview"}
                className="h-4 w-full cursor-pointer justify-start px-2 py-4"
              >
                管理页面
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild className="mb-1 p-0">
            <form action={signOutUser} className="w-full">
              <Button
                className="h-4 w-full cursor-pointer justify-start px-2 py-4"
                variant={"ghost"}
              >
                退出登录
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
