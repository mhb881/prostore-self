import { Metadata } from "next";
import UnauthorizedContent from "./unauthorized-content";

export const metadata: Metadata = {
  title: "未授权访问",
};

export default function UnauthorizedPage() {
  return (
    <div className="wrapper flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4">
      <UnauthorizedContent />
    </div>
  );
}
