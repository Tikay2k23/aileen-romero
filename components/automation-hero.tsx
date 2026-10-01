import PageGlow from "@/components/page-glow";
import { Badge } from "@/components/ui/badge";
import { N8nWorkflowBlock } from "@/components/ui/n8n-workflow-block-shadcnui";

// Hero for the Automation work page: a headline over a small workflow builder visitors can play with
export default function AutomationHero() {
  return (
    <div className="relative isolate">
      <PageGlow className="absolute top-1/2 -translate-y-1/2" />
      {/* Room at the top for the back button; only a little at the bottom, because the cards below bring
          their own lead-in */}
      <section className="w-full pt-20 pb-10 md:pt-32">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 md:px-6">
          <Badge variant="secondary">CRM &amp; workflow automation</Badge>

          <h1 className="text-center text-4xl font-bold tracking-tight md:text-6xl">
            {/* Kept whole, so a narrow screen breaks the line before the phrase instead of inside it */}
            Your business, <span className="inline-block text-purple-500">on autopilot</span>
          </h1>

          <p className="max-w-3xl text-balance text-center text-base text-muted-foreground md:text-lg">
            Every lead gets captured, qualified and followed up the moment it comes in. Here is one of those
            workflows: add the next step and watch it grow.
          </p>

          <div className="mt-8 w-full">
            <N8nWorkflowBlock />
          </div>
        </div>
      </section>
    </div>
  );
}
