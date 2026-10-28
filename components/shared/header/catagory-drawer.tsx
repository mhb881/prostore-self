import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getCategoryTree } from "@/lib/actions/category.actions";
import { ChevronRight, MenuIcon, Package, X } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const CategoryDrawer = async () => {
  const categoriesData = await getCategoryTree();
  const categories = categoriesData.data || [];

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center gap-2"
        >
          <MenuIcon className="h-5 w-5" />
          <span className="hidden sm:inline">商品分类</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen w-80 max-w-[85vw]">
        <DrawerHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Package className="text-primary h-4 w-4" />
            </div>
            <DrawerTitle className="text-lg font-semibold">
              商品分类
            </DrawerTitle>

            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {categories.length > 0 ? (
              categories.map((category) => (
                <DrawerClose key={category.id} asChild>
                  <Link
                    href={`/search?category=${category.name}`}
                    className="group hover:bg-muted flex items-center justify-between rounded-lg px-3 py-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                        <Package className="text-primary h-4 w-4" />
                      </div> */}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {category._count.products}
                      </Badge>
                      <ChevronRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </DrawerClose>
              ))
            ) : (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
                <Package className="mb-2 h-12 w-12 opacity-50" />
                <p>暂无分类</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
