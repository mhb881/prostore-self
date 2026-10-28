import { LucideLoaderCircle } from "lucide-react";

function Spinner() {
  return (
    <div className="fixed z-999 flex flex-1 items-center justify-center self-center">
      <LucideLoaderCircle className="h-16 w-16 animate-spin" />
    </div>
  );
}

export default Spinner;
