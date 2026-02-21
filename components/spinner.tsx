import { LucideLoaderCircle } from "lucide-react";

function Spinner() {
  return (
    <div className="flex flex-1 items-center justify-center self-center z-999 fixed">
      <LucideLoaderCircle className="h-16 w-16 animate-spin" />
    </div>
  );
}

export default Spinner;
