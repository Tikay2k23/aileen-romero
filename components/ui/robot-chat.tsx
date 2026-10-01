"use client";

import { MessageCircle } from "lucide-react";

// Shown above the robot's head (placed there by the 3D scene, so it follows the robot around)
export function RobotSpeechBubble({ onOpen }: { onOpen: () => void }) {
  return (
    // Anchored by its bottom-centre to the point above the robot's head. Pointer events stop here so a
    // tap on the button doesn't also reach the robot (which would switch it to heart eyes).
    <div className="-translate-x-1/2 -translate-y-full pb-3" onPointerDown={(event) => event.stopPropagation()}>
      <div className="relative w-max max-w-[15rem] animate-in fade-in-0 zoom-in-95 rounded-2xl border border-border/60 bg-background/90 px-4 py-3 text-center shadow-xl shadow-primary/10 backdrop-blur-md duration-300">
        <p className="text-sm font-medium">Want to ask me something?</p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background transition hover:bg-foreground/85"
        >
          <MessageCircle className="size-3.5" />
          Chat with me
        </button>

        {/* The bubble's tail */}
        <span
          aria-hidden
          className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b border-border/60 bg-background/90"
        />
      </div>
    </div>
  );
}
