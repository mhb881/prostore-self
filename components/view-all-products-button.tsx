import Link from "next/link";
import { Button } from "./ui/button";

const ViewAllProductsButton = () => {
  return (
    <div className="flex items-center justify-center rounded-full">
      <Button
        asChild
        className="rounded-full px-8 py-4 text-lg font-semibold"
        variant="default"
      >
        <Link href="/search" className="text-primary font-bold">
          查看所有商品
        </Link>
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;
