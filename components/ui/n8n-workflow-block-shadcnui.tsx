"use client";

import { motion, type PanInfo } from "framer-motion";
import type React from "react";
import { useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  Database,
  Mail,
  Plus,
  Split,
  SquareKanban,
  Star,
  Users,
  Webhook,
} from "lucide-react";

// Interfaces
interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  from: string;
  to: string;
}

// Constants
const NODE_WIDTH = 200;
const NODE_HEIGHT = 130;
// From one node's left edge to the next one's
const NODE_SPACING = 250;
// Empty space kept around the workflow
const CANVAS_MARGIN = 24;

// The starting layout: four columns, with the fork's two outcomes stacked in the last one and everything
// before it level with the middle of the pair
const column = (index: number) => CANVAS_MARGIN + index * NODE_SPACING;
const TOP_ROW = CANVAS_MARGIN;
const BOTTOM_ROW = TOP_ROW + NODE_HEIGHT + 24; // 24px between the pair
const MIDDLE_ROW = (TOP_ROW + BOTTOM_ROW) / 2;
// Tall enough for that layout plus a sideways scrollbar, so the canvas only scrolls downwards once a node
// has been dragged there
const CANVAS_HEIGHT = BOTTOM_ROW + NODE_HEIGHT + CANVAS_MARGIN + 20;

// The workflow on show: what happens to a new lead. "Add Node" carries on from the last node listed here.
const initialNodes: WorkflowNode[] = [
  {
    id: "lead",
    type: "trigger",
    title: "New Lead",
    description: "A form, ad or missed call comes in",
    icon: Webhook,
    color: "emerald",
    position: { x: column(0), y: MIDDLE_ROW },
  },
  {
    id: "crm",
    type: "action",
    title: "Add to CRM",
    description: "Create the contact and tag the source",
    icon: Database,
    color: "blue",
    position: { x: column(1), y: MIDDLE_ROW },
  },
  {
    id: "qualified",
    type: "condition",
    title: "Qualified?",
    description: "Check budget, service and location",
    icon: Split,
    color: "purple",
    position: { x: column(2), y: MIDDLE_ROW },
  },
  {
    id: "nurture",
    type: "action",
    title: "Nurture Sequence",
    description: "Follow up by email until they are ready",
    icon: Mail,
    color: "indigo",
    position: { x: column(3), y: BOTTOM_ROW },
  },
  {
    id: "book",
    type: "action",
    title: "Book Appointment",
    description: "Offer open calendar slots by text",
    icon: CalendarCheck,
    color: "purple",
    position: { x: column(3), y: TOP_ROW },
  },
];

const initialConnections: WorkflowConnection[] = [
  { from: "lead", to: "crm" },
  { from: "crm", to: "qualified" },
  { from: "qualified", to: "book" },
  { from: "qualified", to: "nurture" },
];

// What "Add Node" adds, in order: the rest of the journey after the appointment is booked
const nextNodes: Omit<WorkflowNode, "position">[] = [
  {
    id: "notify",
    type: "action",
    title: "Notify Team",
    description: "Alert the owner as soon as it is booked",
    icon: Users,
    color: "blue",
  },
  {
    id: "reminder",
    type: "action",
    title: "Send Reminder",
    description: "Text the client the day before",
    icon: BellRing,
    color: "emerald",
  },
  {
    id: "pipeline",
    type: "action",
    title: "Update Pipeline",
    description: "Move the deal to the next stage",
    icon: SquareKanban,
    color: "purple",
  },
  {
    id: "review",
    type: "action",
    title: "Request Review",
    description: "Ask for feedback after the job",
    icon: Star,
    color: "purple",
  },
];

// Border and icon color per node (the node's own background stays the page's)
const colorClasses: Record<string, string> = {
  emerald: "border-emerald-500/40 text-emerald-600",
  blue: "border-blue-500/40 text-blue-600",
  purple: "border-purple-500/40 text-purple-600",
  indigo: "border-indigo-500/40 text-indigo-600",
};

const FINE_POINTER = "(pointer: fine)";

function subscribeToPointer(onChange: () => void) {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Connection Line Component
function WorkflowConnectionLine({
  from,
  to,
  nodes,
}: {
  from: string;
  to: string;
  nodes: WorkflowNode[];
}) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;

  const startX = fromNode.position.x + NODE_WIDTH;
  const startY = fromNode.position.y + NODE_HEIGHT / 2;
  const endX = toNode.position.x;
  const endY = toNode.position.y + NODE_HEIGHT / 2;

  const cp1X = startX + (endX - startX) * 0.5;
  const cp2X = endX - (endX - startX) * 0.5;

  const path = `M${startX},${startY} C${cp1X},${startY} ${cp2X},${endY} ${endX},${endY}`;

  return (
    <path
      d={path}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeDasharray="8,6"
      strokeLinecap="round"
      opacity={0.35}
      className="text-foreground"
    />
  );
}

// Main Component
export function N8nWorkflowBlock() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [connections, setConnections] =
    useState<WorkflowConnection[]>(initialConnections);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [contentSize, setContentSize] = useState(() => {
    const maxX = Math.max(
      ...initialNodes.map((n) => n.position.x + NODE_WIDTH)
    );
    const maxY = Math.max(
      ...initialNodes.map((n) => n.position.y + NODE_HEIGHT)
    );
    return { width: maxX + CANVAS_MARGIN, height: maxY + CANVAS_MARGIN };
  });
  // Dragging is for mice and trackpads: on a touch screen it would swallow the swipe that scrolls the page.
  // The server render assumes a mouse; the browser corrects it on hydration.
  const canDrag = useSyncExternalStore(
    subscribeToPointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => true
  );

  // Drag Handlers
  const handleDragStart = (nodeId: string) => {
    setDraggingNodeId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      dragStartPosition.current = { x: node.position.x, y: node.position.y };
    }
  };

  const handleDrag = (nodeId: string, { offset }: PanInfo) => {
    if (draggingNodeId !== nodeId || !dragStartPosition.current) return;

    const newX = dragStartPosition.current.x + offset.x;
    const newY = dragStartPosition.current.y + offset.y;

    const constrainedX = Math.max(0, newX);
    const constrainedY = Math.max(0, newY);

    flushSync(() => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? { ...node, position: { x: constrainedX, y: constrainedY } }
            : node
        )
      );
    });

    setContentSize((prev) => ({
      width: Math.max(prev.width, constrainedX + NODE_WIDTH + CANVAS_MARGIN),
      height: Math.max(prev.height, constrainedY + NODE_HEIGHT + CANVAS_MARGIN),
    }));
  };

  const handleDragEnd = () => {
    setDraggingNodeId(null);
    dragStartPosition.current = null;
  };

  // Add Node Handler
  const nextNode = nextNodes[nodes.length - initialNodes.length];

  const addNode = () => {
    if (!nextNode) return;

    const lastNode = nodes[nodes.length - 1];
    const newPosition = {
      x: lastNode.position.x + NODE_SPACING,
      y: lastNode.position.y,
    };
    const newNode: WorkflowNode = { ...nextNode, position: newPosition };

    flushSync(() => {
      setNodes((prev) => [...prev, newNode]);
      setConnections((prev) => [
        ...prev,
        { from: lastNode.id, to: newNode.id },
      ]);
      setContentSize((prev) => ({
        width: Math.max(prev.width, newPosition.x + NODE_WIDTH + CANVAS_MARGIN),
        height: Math.max(prev.height, newPosition.y + NODE_HEIGHT + CANVAS_MARGIN),
      }));
    });

    // Scroll to new node
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.scrollTo({
        left: newPosition.x + NODE_WIDTH - canvas.clientWidth + 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="h-auto rounded-full border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600"
          >
            Active
          </Badge>
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-foreground/50">
            Lead follow-up
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addNode}
          // Nothing left to add once the whole journey is on the canvas
          disabled={!nextNode}
          className="h-8 gap-2 rounded-lg text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground"
          aria-label="Add new node"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Add Node</span>
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full overflow-auto rounded-xl border border-border/30 bg-background/40 [scrollbar-width:thin]"
        style={{ height: CANVAS_HEIGHT }}
        role="region"
        aria-label="Workflow canvas"
        tabIndex={0}
      >
        {/* Content Wrapper */}
        <div
          className="relative"
          style={{
            minWidth: contentSize.width,
            minHeight: contentSize.height,
          }}
        >
          {/* SVG Connections */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={contentSize.width}
            height={contentSize.height}
            style={{ overflow: "visible" }}
            aria-hidden="true"
          >
            {connections.map((c) => (
              <WorkflowConnectionLine
                key={`${c.from}-${c.to}`}
                from={c.from}
                to={c.to}
                nodes={nodes}
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const Icon = node.icon;
            const isDragging = draggingNodeId === node.id;

            return (
              <motion.div
                key={node.id}
                drag={canDrag}
                dragMomentum={false}
                dragConstraints={{
                  left: 0,
                  top: 0,
                  right: 100000,
                  bottom: 100000,
                }}
                onDragStart={() => handleDragStart(node.id)}
                onDrag={(_, info) => handleDrag(node.id, info)}
                onDragEnd={handleDragEnd}
                style={{
                  x: node.position.x,
                  y: node.position.y,
                  width: NODE_WIDTH,
                  // Fixed, so the connection lines meet every node at its middle
                  height: NODE_HEIGHT,
                  transformOrigin: "0 0",
                }}
                className={`absolute ${canDrag ? "cursor-grab" : ""}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
                aria-grabbed={isDragging}
              >
                <Card
                  className={`group/node relative h-full w-full overflow-hidden rounded-xl border ${colorClasses[node.color]} bg-background/70 p-3 backdrop-blur transition-all hover:shadow-lg ${isDragging ? "shadow-xl ring-2 ring-primary/50" : ""}`}
                  role="article"
                  aria-label={`${node.type} node: ${node.title}`}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/node:opacity-100" />

                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colorClasses[node.color]} bg-background/80 backdrop-blur`}
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className="mb-0.5 h-4 rounded-full border-border/40 bg-background/80 px-1.5 py-0 text-[9px] uppercase tracking-[0.15em] text-foreground/60"
                        >
                          {node.type}
                        </Badge>
                        <h3 className="truncate text-xs font-semibold tracking-tight text-foreground">
                          {node.title}
                        </h3>
                      </div>
                    </div>
                    <p className="line-clamp-2 min-h-[2lh] text-[10px] leading-relaxed text-foreground/70">
                      {node.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-foreground/50">
                      <ArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
                      <span className="uppercase tracking-[0.1em]">
                        Connected
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div
        className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/30 bg-background/40 px-4 py-2.5 backdrop-blur-sm"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/60">
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <span className="uppercase tracking-[0.15em]">
              {nodes.length} {nodes.length === 1 ? "Node" : "Nodes"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 w-1.5 rounded-full bg-primary"
              aria-hidden="true"
            />
            <span className="uppercase tracking-[0.15em]">
              {connections.length}{" "}
              {connections.length === 1 ? "Connection" : "Connections"}
            </span>
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
          {canDrag ? "Drag nodes to reposition" : "Swipe to follow the workflow"}
        </p>
      </div>
    </div>
  );
}
