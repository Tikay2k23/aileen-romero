"use client";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

export function AboutBento() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="sm:col-span-2 xl:row-span-2 bg-card rounded-xl p-8 md:p-12 flex flex-col justify-between border border-border relative overflow-hidden group">
            <svg
              width="377"
              height="368"
              className="w-105 fill-neutral-100 absolute -bottom-16 group-hover:rotate-180 duration-2000 ease-in -right-16"
              viewBox="0 0 377 368"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M179.692 5.79814C182.635 -1.93287 193.572 -1.93285 196.515 5.79816L229.505 92.466C231.206 96.9342 236.103 99.2928 240.657 97.8366L328.986 69.5929C336.865 67.0735 343.684 75.6242 339.474 82.7452L292.284 162.574C289.851 166.69 291.061 171.99 295.038 174.642L372.192 226.091C379.075 230.68 376.641 241.343 368.449 242.491L276.613 255.369C271.878 256.033 268.489 260.283 268.895 265.047L276.776 357.445C277.479 365.688 267.625 370.433 261.619 364.744L194.293 300.973C190.821 297.686 185.386 297.686 181.914 300.973L114.588 364.744C108.582 370.433 98.7281 365.688 99.4311 357.445L107.312 265.047C107.718 260.283 104.329 256.033 99.5941 255.369L7.7582 242.491C-0.433812 241.343 -2.86746 230.68 4.01488 226.091L81.1687 174.642C85.1465 171.99 86.3561 166.69 83.9231 162.574L36.7325 82.7452C32.523 75.6242 39.342 67.0735 47.2212 69.5929L135.55 97.8366C140.104 99.2928 145.001 96.9342 146.702 92.4659L179.692 5.79814Z" />
            </svg>
            <div className="space-y-6 relative z-10">
              <div className="inline-flex px-4 py-2 rounded-full bg-orange-500 text-foreground text-[10px] font-black uppercase tracking-widest">
                What I Do
              </div>
              <h2 className="text-4xl md:text-5xl xl:text-[44px] font-black text-foreground tracking-tighter leading-tight">
                CONNECTED SYSTEMS.
                <br />
                AUTOMATED GROWTH.
              </h2>
            </div>
            <div className="mt-12 relative z-10">
              <p className="text-xl text-muted-foreground leading-relaxed max-w-sm">
                I build scalable digital systems that connect marketing, CRM,
                automation, AI, and customer workflows.
              </p>
            </div>
          </Card>

          <Card className="bg-primary rounded-xl p-8 lg:p-10 text-primary-foreground flex flex-col gap-8 border-none justify-between">
            <span className="text-xs font-black uppercase tracking-widest opacity-80">
              Automation Systems
            </span>
            <div className="space-y-1">
              <span className="text-6xl font-black tracking-tighter">50+</span>
              <div className="h-1.5 w-full bg-white/20 rounded-full">
                <div className="h-full w-4/5 bg-orange-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
              </div>
              <p className="pt-2 text-sm text-primary-foreground/60">
                Workflows &amp; systems created
              </p>
            </div>
          </Card>

          <Card className="bg-card rounded-xl p-8 lg:p-10 border border-border text-foreground flex flex-col justify-center gap-4">
            <div className="size-10 rounded-lg bg-orange-500 flex items-center justify-center">
              <div className="size-4 bg-white rounded-full" />
            </div>
            <h3 className="text-xl font-bold leading-tight">GoHighLevel CRM Systems</h3>
            <p className="text-xs text-muted-foreground font-mono">
              Workflows • Pipelines • Integrations
            </p>
          </Card>

          <Card className="sm:col-span-2 rounded-xl p-6 border-none flex-row flex items-center justify-between gap-6 cursor-pointer bg-orange-500 transition-all duration-500 overflow-hidden">
            <div className="space-y-2 relative z-10 transition-colors text-foreground">
              <h3 className="text-3xl font-black uppercase tracking-tighter">
                Build Your System
              </h3>
              <p className="text-foreground/70">
                Turn manual processes into automated workflows.
              </p>
            </div>
            <div className="size-20 shrink-0 rounded-full flex items-center justify-center bg-primary text-primary-foreground transition-all duration-500 relative z-10">
              <ArrowUpRight className="size-8" />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default AboutBento;
