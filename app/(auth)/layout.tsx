export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden from-blue-50 via-white to-purple-50 **:not-only:bg-linear-to-br">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200 opacity-30 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-200 opacity-30 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute top-40 left-40 h-60 w-60 rounded-full bg-pink-200 opacity-20 mix-blend-multiply blur-xl filter"></div>
      </div>
      {/* 主要内容 */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        {children}
      </div>
    </div>
  );
}
