"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface WorkflowPreviewProps {
  workflow: {
    version: string;
    workflow_id: string;
    steps: Array<{ id: string; action: string; params: Record<string, unknown> }>;
  } | null;
}

export function WorkflowPreview({ workflow }: WorkflowPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  if (!workflow) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary font-mono">工作流预览</span>
          <span className="text-xs text-muted-foreground font-mono">{workflow.workflow_id}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-7 text-xs">
          {expanded ? <ChevronUpIcon className="w-4 h-4 mr-1" /> : <ChevronDownIcon className="w-4 h-4 mr-1" />}
          {expanded ? "收起" : "展开"} JSON
        </Button>
      </div>

      {/* 步骤概览 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {workflow.steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-xs text-muted-foreground">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
              {i + 1}
            </span>
            {step.action}
          </div>
        ))}
      </div>

      {/* JSON 展开 */}
      {expanded && (
        <ScrollArea className="h-48 rounded-lg bg-background border border-border p-4">
          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
            {JSON.stringify(workflow, null, 2)}
          </pre>
        </ScrollArea>
      )}
    </div>
  );
}