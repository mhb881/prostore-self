"use client";

import { ShippingAddress } from "@/types/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { Form } from "@/components/ui/form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  LoaderCircle,
  User,
  MapPin,
  Home,
  Mail,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateUserAddress } from "@/lib/actions/user.actions";

const ShippingAddressForm = ({ address }: { address?: ShippingAddress }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      ...shippingAddressDefaultValues,
      ...address,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      try {
        const res = await updateUserAddress(values);
        if (!res.success) {
          toast.error(res.message);
          return;
        }
        toast.success(res.message);
        router.push("/payment-method");
      } catch (error) {
        toast.error("提交失败，请重试");
      }
    });
  };

  const inputClassName =
    "pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20";

  return (
    <div className="mx-auto w-full max-w-lg">
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            收货地址
          </CardTitle>
          <CardDescription className="text-base">
            请在下方输入您的完整收货地址
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="fullName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>姓名</FieldLabel>
                      <div className="relative">
                        <User className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                        <Input
                          {...field}
                          id={field.name}
                          value={field.value ?? ""}
                          type="text"
                          placeholder="请输入姓名"
                          aria-invalid={fieldState.invalid}
                          className={inputClassName}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>详细地址</FieldLabel>
                      <div className="relative">
                        <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                        <Input
                          {...field}
                          id={field.name}
                          value={field.value ?? ""}
                          type="text"
                          placeholder="请输入详细地址"
                          aria-invalid={fieldState.invalid}
                          className={inputClassName}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>城市</FieldLabel>
                        <div className="relative">
                          <Home className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                          <Input
                            {...field}
                            id={field.name}
                            value={field.value ?? ""}
                            type="text"
                            placeholder="请输入城市"
                            aria-invalid={fieldState.invalid}
                            className={inputClassName}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="postalCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>邮政编码</FieldLabel>
                        <div className="relative">
                          <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                          <Input
                            {...field}
                            id={field.name}
                            value={field.value ?? ""}
                            type="text"
                            placeholder="请输入邮政编码"
                            aria-invalid={fieldState.invalid}
                            className={inputClassName}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="country"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>国家/地区</FieldLabel>
                      <div className="relative">
                        <Globe className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                        <Input
                          {...field}
                          id={field.name}
                          value={field.value ?? ""}
                          type="text"
                          placeholder="请输入国家/地区"
                          aria-invalid={fieldState.invalid}
                          className={inputClassName}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="border-border/50 flex gap-3 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => {
                    form.reset();
                  }}
                  className="hover:bg-accent flex-1 transition-colors"
                >
                  重置
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="from-primary to-secondary flex-2 bg-linear-to-r shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingAddressForm;
