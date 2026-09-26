import { cn } from "@/lib/utils";

// The hero's soft sky → amber glow: the shared background placed behind every section and the intro.
// Callers set the positioning (absolute, plus where it sits vertically in their section).
export default function PageGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none inset-x-0 -z-10 h-[28rem] rounded-full bg-linear-to-r from-sky-100 via-white to-amber-100 blur-3xl dark:from-slate-800 dark:via-black dark:to-stone-700",
        className
      )}
    />
  );
}
