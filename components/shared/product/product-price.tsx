import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  // 保证有两位小数点显示
  const stringValue = value.toFixed(2);

  // 分割小数部分和整数部分
  const [integerPart, decimalPart] = stringValue.split(".");

  // 创建一个对象，用于存储整数部分和小数部分

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs ">￥</span>
      <span>{integerPart}</span>
      <span className="text-xs ">.{decimalPart}</span>
    </p>
  );
};

export default ProductPrice;
