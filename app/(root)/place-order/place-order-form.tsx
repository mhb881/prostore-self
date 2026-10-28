"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const PlaceOrderForm = () => {
  const router = useRouter();

  function PlaceOrderButton() {
    const { pending } = useFormStatus();

    return (
      <Button
        type="submit"
        className="w-full cursor-pointer transition-colors"
        disabled={pending}
      >
        {pending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            请稍候
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            提交订单
          </>
        )}
      </Button>
    );
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await createOrder();
    if (res.redirect) {
      router.push(res.redirect);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
