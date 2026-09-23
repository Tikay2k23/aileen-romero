import Image from "next/image";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/ar-logo.png"
        alt="Aileen Romero"
        width={471}
        height={120}
        priority
        className="h-10 w-auto"
      />
    </div>
  );
};

export default Logo;
