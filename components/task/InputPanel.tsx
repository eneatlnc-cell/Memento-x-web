"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlayIcon } from "lucide-react";

interface InputPanelProps {
  onSubmit: (input: string) => Promise<void>;
  isLoading: boolean;
}

export function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    await onSubmit(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <PlayIcon className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">指令输入</h2>
      </div>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={'输入你的编辑需求，例如：\n"把画面中的人物换成钢铁侠，背景改成火星"'}
        className="min-h-[100px] bg-background border-border text-foreground placeholder:text-muted-foreground resize-none mb-4"
        disabled={isLoading}
      />

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              理解中...
            </>
          ) : (
            <>
              <PlayIcon className="w-4 h-4" />
              执行
            </>
          )}
        </Button>
      </div>
    </div>
  );
}