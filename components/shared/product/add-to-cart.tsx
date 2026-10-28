"use client";

import { Cart, CartItem } from "@/types/types";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingCart, Loader2 } from "lucide-react";
import { toast, useSonner } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();
  const { toasts } = useSonner();

  const [isPending, startTransition] = useTransition();

  const handleAddCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message, {
        action: (
          <Button
            className="bg-primary hover:bg-primary/90 cursor-pointer text-sm text-white"
            onClick={() => router.push("/cart")}
            variant="default"
          >
            查看购物车
          </Button>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  const existItem =
    cart &&
    (cart.items as CartItem[]).find((i) => i.productId === item.productId);

  return existItem ? (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="min-w-[2rem] text-center text-lg font-semibold">
        {existItem.quantity}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={handleAddCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full cursor-pointer gap-2"
      type="button"
      size="lg"
      onClick={handleAddCart}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ShoppingCart className="h-5 w-5" />
      )}
      加入购物车
    </Button>
  );
};

export default AddToCart;
