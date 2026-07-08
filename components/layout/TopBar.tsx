"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BellIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">AI 视频编辑工作台</span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
            MX
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}