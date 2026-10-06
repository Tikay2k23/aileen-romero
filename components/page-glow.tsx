import { cn } from "@/lib/utils";

// The hero's soft sky → purple glow: the shared background placed behind every section and the intro.
// Callers set the positioning (absolute, plus where it sits vertically in their section).
export default function PageGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none inset-x-0 -z-10 h-[28rem] rounded-full bg-linear-to-r from-sky-100 via-white to-purple-100 blur-3xl dark:from-slate-800 dark:via-black dark:to-stone-700",
        className
      )}
    />
  );
}

// PageGlow for a section with other sections right above and below it: centred in it, and faded out toward its top
// and bottom so its tint never stops in a line where the section ends or the next one is drawn over it. Place it in
// a positioned, isolated section (relative isolate).
export function EdgeFadedGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 mask-y-from-70%">
      <PageGlow className="absolute top-1/2 -translate-y-1/2" />
    </div>
  );
}
