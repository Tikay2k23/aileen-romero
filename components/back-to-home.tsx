import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// The pill every work page uses to return home. Callers set the positioning.
export default function BackToHome({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-4 py-2 text-sm font-medium shadow-2xl shadow-primary/5 backdrop-blur-lg transition hover:bg-background",
        className
      )}
    >
      <ArrowLeft className="size-4" />
      Back to home
    </Link>
  );
}
