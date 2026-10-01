import PageGlow from "@/components/page-glow";
import { Terminal1 } from "@/components/ui/terminal1";

// What the terminal types out: a project going from build to live, the way this service delivers one
const SESSION = [
  {
    id: "build",
    command: "npm run build",
    output: "Compiling interface, API and database...\n✓ Built with 0 errors",
    outputDelay: 800,
  },
  {
    id: "test",
    command: "npm test",
    output: "Running unit and integration tests...\n✓ All tests passed",
    outputDelay: 600,
  },
  {
    id: "deploy",
    command: "npm run deploy",
    output: "Shipping to the cloud...\n✓ Live in production",
    outputDelay: 500,
  },
];

// Hero for the Engineering work page: a terminal that types its way from build to deployment
export default function EngineeringHero() {
  return (
    <div className="relative isolate">
      <PageGlow className="absolute top-1/2 -translate-y-1/2" />
      <Terminal1
        // Room at the top for the back button; only a little at the bottom, because the cards below bring
        // their own lead-in
        className="pt-20 pb-10 md:pt-32 md:pb-10"
        badge={{ label: "Full-stack development", variant: "secondary" }}
        heading={
          <>
            {/* Kept whole, so a narrow screen breaks the line before the phrase instead of inside it */}
            Your idea, <span className="inline-block text-purple-500">in production</span>
          </>
        }
        description="From the first commit to a live release, I build the whole thing: interface, API, database and deployment."
        terminal={{ title: "~/your-idea", commands: SESSION }}
        // The commands tell a story rather than being something to run, so there is nothing to copy
        showCopyButton={false}
      />
    </div>
  );
}
