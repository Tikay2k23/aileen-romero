"use client";

import { Check, Copy, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TerminalCommand {
  id: string;
  prompt?: string;
  command: string;
  output?: string;
  outputDelay?: number;
}

interface Terminal1Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: React.ReactNode;
  description?: string;
  terminal?: {
    title?: string;
    commands: TerminalCommand[];
    typeSpeed?: number;
    delayBetweenCommands?: number;
    showLineNumbers?: boolean;
  };
  showCopyButton?: boolean;
  glowEffect?: boolean;
  className?: string;
}

// One moment of the session: how much of which command has been typed, and how much of its output printed
interface Frame {
  commandIndex: number;
  typed: number;
  printed: number;
  // How long this moment lasts before the next one
  duration: number;
}

// The whole session laid out in advance, one frame per character: for each command the prompt waits, the
// command is typed, there is a pause, then the output prints
function buildTimeline(
  commands: TerminalCommand[],
  typeSpeed: number,
  outputTypeSpeed: number,
  delayBetweenCommands: number,
) {
  const frames: Frame[] = [];

  commands.forEach((command, commandIndex) => {
    for (let typed = 0; typed <= command.command.length; typed++) {
      const isWaitingPrompt = typed === 0 && commandIndex > 0;
      frames.push({
        commandIndex,
        typed,
        printed: 0,
        duration: isWaitingPrompt ? delayBetweenCommands : typeSpeed,
      });
    }
    // Command finished, start output after delay
    frames[frames.length - 1].duration = command.outputDelay ?? 500;

    const outputLength = command.output?.length ?? 0;
    for (let printed = 1; printed <= outputLength; printed++) {
      frames.push({
        commandIndex,
        typed: command.command.length,
        printed,
        duration: outputTypeSpeed,
      });
    }
  });

  return frames;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useTerminalTypewriter(
  commands: TerminalCommand[],
  typeSpeed = 50,
  outputTypeSpeed = 10,
  delayBetweenCommands = 1000,
  isInView = true,
) {
  const timeline = useMemo(
    () => buildTimeline(commands, typeSpeed, outputTypeSpeed, delayBetweenCommands),
    [commands, typeSpeed, outputTypeSpeed, delayBetweenCommands],
  );
  const [step, setStep] = useState(0);
  // The server render assumes motion is fine; the browser corrects it on hydration
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  const lastStep = timeline.length - 1;
  // Visitors who prefer reduced motion get the finished session straight away
  const currentStep = prefersReducedMotion ? lastStep : Math.min(step, lastStep);

  useEffect(() => {
    if (!isInView || prefersReducedMotion || step >= lastStep) return;

    const timeout = setTimeout(() => setStep((prev) => prev + 1), timeline[step].duration);
    return () => clearTimeout(timeout);
  }, [isInView, prefersReducedMotion, step, lastStep, timeline]);

  const reset = useCallback(() => setStep(0), []);

  return {
    // Undefined only when there are no commands
    frame: timeline[currentStep] as Frame | undefined,
    finalFrame: timeline[lastStep] as Frame | undefined,
    isComplete: timeline.length > 0 && currentStep >= lastStep,
    canRestart: !prefersReducedMotion,
    reset,
  };
}

const terminalTheme = {
  bg: "#09090b", // zinc-950
  border: "#3f3f46", // zinc-700
  header: "#27272a", // zinc-800
  headerText: "#a1a1aa", // zinc-400
  text: "#f4f4f5", // zinc-100
  prompt: "#34d399", // emerald-400
  output: "#a1a1aa", // zinc-400
  glow: "0 0 50px rgba(0,0,0,0.5)",
};

// The session as it stands at one frame: earlier commands whole, the frame's own command as far as it has got
function TerminalSession({
  commands,
  frame,
  showCursor = false,
  showLineNumbers,
}: {
  commands: TerminalCommand[];
  frame: Frame;
  showCursor?: boolean;
  showLineNumbers?: boolean;
}) {
  return commands.slice(0, frame.commandIndex + 1).map((command, index) => {
    const isCurrentCommand = index === frame.commandIndex;
    const typed = isCurrentCommand ? command.command.slice(0, frame.typed) : command.command;
    const output = command.output ?? "";
    const printed = isCurrentCommand ? output.slice(0, frame.printed) : output;
    const cursor = showCursor && isCurrentCommand && <span className="animate-pulse">|</span>;

    return (
      <div key={command.id} className="mb-3 last:mb-0">
        <div className="flex items-start gap-2">
          {showLineNumbers && (
            <span className="select-none w-6 text-right" style={{ color: terminalTheme.output }}>
              {index + 1}
            </span>
          )}
          <span className="font-semibold" style={{ color: terminalTheme.prompt }}>
            {command.prompt || "$ "}
          </span>
          <span style={{ color: terminalTheme.text }}>
            {typed}
            {!printed && cursor}
          </span>
        </div>
        {printed && (
          <div
            className={cn("mt-1 whitespace-pre-wrap", showLineNumbers && "ml-8")}
            style={{ color: terminalTheme.output }}
          >
            {printed}
            {cursor}
          </div>
        )}
      </div>
    );
  });
}

export function Terminal1({
  badge,
  heading,
  description,
  terminal,
  showCopyButton = true,
  glowEffect = true,
  className,
}: Terminal1Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [copied, setCopied] = useState(false);

  const commands = terminal?.commands;
  const { frame, finalFrame, isComplete, canRestart, reset } = useTerminalTypewriter(
    commands ?? [],
    terminal?.typeSpeed || 50,
    15,
    terminal?.delayBetweenCommands || 1000,
    isInView,
  );

  const handleCopy = useCallback(() => {
    const allCommands = commands?.map((cmd) => `${cmd.prompt || "$ "}${cmd.command}`).join("\n");

    if (allCommands) {
      navigator.clipboard.writeText(allCommands);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [commands]);

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex gap-4 items-center justify-center flex-col">
          {badge && (
            <div>
              <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
            </div>
          )}

          {/* Sized as the page's headline: on this site the terminal is a work page's hero */}
          {heading && (
            <h1 className="text-4xl md:text-6xl text-center font-bold tracking-tight">{heading}</h1>
          )}

          {description && (
            <p className="text-base md:text-lg text-balance text-center max-w-3xl text-muted-foreground">
              {description}
            </p>
          )}

          <div ref={containerRef} className="w-full mt-8">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: terminalTheme.bg,
                border: `1px solid ${terminalTheme.border}`,
                boxShadow: glowEffect ? terminalTheme.glow : undefined,
              }}
            >
              {/* Header with 3-column grid for centered title */}
              <div
                className="grid grid-cols-3 items-center px-4 py-3"
                style={{ backgroundColor: terminalTheme.header }}
              >
                {/* Left: Window controls */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>

                {/* Center: Title (always centered) */}
                <span
                  className="text-sm font-medium text-center"
                  style={{ color: terminalTheme.headerText }}
                >
                  {terminal?.title || "Terminal"}
                </span>

                {/* Right: Action buttons (as tall as a button even when empty, so the header keeps its height
                    when the restart button appears) */}
                <div className="flex h-6 items-center gap-2 justify-end">
                  {showCopyButton && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleCopy}
                      className="rounded-md transition-colors hover:bg-white/10"
                      style={{ color: terminalTheme.headerText }}
                      title="Copy commands"
                    >
                      {copied ? (
                        <Check className="size-4 text-emerald-400" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  )}
                  {isComplete && canRestart && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={reset}
                      className="rounded-md transition-colors hover:bg-white/10"
                      style={{ color: terminalTheme.headerText }}
                      title="Restart animation"
                    >
                      <RotateCcw className="size-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="relative p-4 md:p-6 font-mono text-sm md:text-base min-h-[200px]">
                {commands && frame && finalFrame ? (
                  <>
                    {/* The finished session, unseen: it holds the window at its final height, so the page
                        below stays put while the lines are typed, and it is what screen readers read */}
                    <div className="opacity-0 select-none">
                      <TerminalSession
                        commands={commands}
                        frame={finalFrame}
                        showLineNumbers={terminal?.showLineNumbers}
                      />
                    </div>
                    <div aria-hidden className="absolute inset-0 p-4 md:p-6">
                      <TerminalSession
                        commands={commands}
                        frame={frame}
                        showCursor={!isComplete}
                        showLineNumbers={terminal?.showLineNumbers}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" style={{ color: terminalTheme.prompt }}>
                      $
                    </span>
                    <span className="animate-pulse" style={{ color: terminalTheme.text }}>
                      |
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Terminal1;
