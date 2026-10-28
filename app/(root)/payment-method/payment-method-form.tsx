"use client";

import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";

const inputClassName =
  "pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const onSubmit = async (data: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(data);

      if (!res.success) {
        toast.error(res.message || "更新支付方式失败，请稍后重试");
        return;
      }

      toast.success("支付方式更新成功");
      router.push("/place-order");
    });
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="space-y-1 pb-6">
        <h1 className="text-2xl font-bold tracking-tight">支付方式</h1>
        <p className="text-muted-foreground text-base">请选择您的支付方式</p>
      </div>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <RadioGroup
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                  >
                    {PAYMENT_METHODS.map((paymentMethod) => {
                      return (
                        <FieldLabel
                          key={paymentMethod}
                          className="cursor-pointer"
                        >
                          <Field
                            orientation="horizontal"
                            className="flex items-center"
                            data-invalid={fieldState.invalid}
                          >
                            <RadioGroupItem
                              value={paymentMethod}
                              checked={field.value === paymentMethod}
                              className="mr-2"
                            />
                            {paymentMethod}
                          </Field>
                        </FieldLabel>
                      );
                    })}
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldSet>

          <div className="border-border/50 flex gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                form.reset();
              }}
              className="hover:bg-accent flex-1 cursor-pointer transition-colors"
            >
              重置
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="from-primary to-secondary flex-2 cursor-pointer bg-linear-to-r shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg"
            >
              {isPending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  继续
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentMethodForm;
