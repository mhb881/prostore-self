import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "../types/types";
import "dotenv/config";
import PurchaseReceiptEmail from "./purchrse-receipt";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `${APP_NAME} - Purchase Receipt | Order Confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
};
