"use client";

import { Component, useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import BackToHome from "@/components/back-to-home";
import PageGlow from "@/components/page-glow";
import { RobotSpeechBubble } from "@/components/ui/robot-chat";
import { RobotIllustration } from "@/components/ui/robot-illustration";
import { openGhlChat } from "@/lib/ghl-chat";

// three.js is only downloaded in the browser, and only by pages that render this hero
const RobotScene = dynamic(() => import("@/components/ui/robot-hero-scene"), {
  ssr: false,
  loading: () => null,
});

// Browsers without WebGL (hardware acceleration turned off, a blocklisted GPU, some older devices) can't create
// the 3D scene. Check up front, so those visitors get the fallback without three.js failing first.
let webglSupport: boolean | undefined;
function supportsWebGL() {
  if (webglSupport === undefined) {
    const gl = document.createElement("canvas").getContext("webgl2") ?? document.createElement("canvas").getContext("webgl");
    webglSupport = gl !== null;
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // hand the test context back straight away
  }
  return webglSupport;
}
const noSubscription = () => () => {};

// And if three.js still can't start (it asks for more than the check above), show the same fallback so the rest
// of the page, and the chat, keep working.
class WithoutWebGLFallback extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export interface RobotHeroProps {
  backgroundText?: string;
  color?: string;
  scale?: number;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
}

// Fixed rather than sticky so the back button stays reachable down the whole page, like on the
// other work pages. The robot badge and dotted rule belong to the hero and fade out on scroll.
function AntennaNavbar() {
  const { scrollY } = useScroll();
  const lineOpacity = useTransform(scrollY, [0, 50], [1, 0]);
  // Once faded out, the badge must stop catching the pointer over the content below it
  const badgePointerEvents = useTransform(scrollY, (y) => (y < 50 ? "auto" : "none"));

  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full pt-5 px-4 md:px-8 pointer-events-none">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col relative">
        <div className="flex items-center justify-between relative">
          <BackToHome className="pointer-events-auto" />

          <motion.div
            style={{ opacity: lineOpacity, pointerEvents: badgePointerEvents }}
            className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center cursor-pointer group z-10"
          >
            <div className="relative flex items-center justify-center h-12 w-16">
              <div className="absolute left-2 w-1.5 h-4 bg-zinc-300 rounded-l-md transition-transform duration-300 group-hover:-translate-x-1" />
              <div className="absolute right-2 w-1.5 h-4 bg-zinc-300 rounded-r-md transition-transform duration-300 group-hover:translate-x-1" />

              <div className="z-10 w-10 h-10 bg-background/60 border-2 border-foreground/10 backdrop-blur-md rounded-[12px] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:bg-background">
                <div className="w-[70%] h-[60%] bg-[#0a0a0a] rounded-lg flex items-center justify-center gap-1.5 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                  <div className="w-1.5 h-3 bg-[#00ffc6] rounded-[2px] shadow-[0_0_8px_#00ffc6] transition-transform duration-200 group-hover:scale-y-[0.2]" />
                  <div className="w-1.5 h-3 bg-[#00ffc6] rounded-[2px] shadow-[0_0_8px_#00ffc6] transition-transform duration-200 group-hover:scale-y-[0.2]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: lineOpacity }}
          className="w-full mt-6 border-b-2 border-dotted border-foreground/15"
        />
      </div>
    </nav>
  );
}

export function RobotHero({
  backgroundText = "UITHEFACTORY",
  color = "#c4c4c4",
  scale = 1,
  pantallaColor = "#00ffc6",
  pantallaBrillo = 1.2,
  blinkCycle = 3.0,
  metalness = 0.0,
}: RobotHeroProps = {}) {
  const containerRef = useRef<HTMLElement>(null);
  // Pause the WebGL render loop while the hero is scrolled out of view
  const inView = useInView(containerRef);

  // The robot's chat is GoHighLevel's floating Conversation AI chat (components/ghl-chat-widget.tsx)
  const bubble = <RobotSpeechBubble onOpen={openGhlChat} />;
  // The server render assumes WebGL; the browser corrects it on hydration
  const canRender3D = useSyncExternalStore(noSubscription, supportsWebGL, () => true);
  // Without WebGL, a flat drawing of the same robot stands in, speech bubble and all
  const withoutRobot = <RobotIllustration bubble={bubble} />;

  return (
    <>
      <AntennaNavbar />

      {/* The site's base background: white with the shared sky → purple glow */}
      <section
        ref={containerRef}
        className="relative isolate w-full h-dvh min-h-[600px] overflow-hidden bg-background"
      >
        <PageGlow className="absolute top-1/2 -translate-y-1/2" />

        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <h1
            className="font-sans font-black select-none whitespace-nowrap"
            style={{
              color: "#000000",
              opacity: 0.13,
              letterSpacing: "-0.05em",
              // 15vw sets a 12-letter word edge to edge; a lower floor than 4rem keeps it whole on phones
              fontSize: "clamp(2.5rem, 15vw, 14rem)",
              lineHeight: 1,
              transform: `translate(0px, 40px) rotate(0deg)`,
            }}
          >
            {backgroundText}
          </h1>
        </div>

        <div className="absolute inset-0 z-10">
          {canRender3D ? (
            <WithoutWebGLFallback fallback={withoutRobot}>
              <RobotScene
                color={color}
                scale={scale}
                pantallaColor={pantallaColor}
                pantallaBrillo={pantallaBrillo}
                blinkCycle={blinkCycle}
                metalness={metalness}
                frameloop={inView ? "always" : "never"}
                bubble={bubble}
              />
            </WithoutWebGLFallback>
          ) : (
            withoutRobot
          )}
        </div>
      </section>
    </>
  );
}

export default RobotHero;
