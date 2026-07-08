import { WrenchIcon } from "lucide-react";

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">工具库</h1>
        <p className="text-sm text-muted-foreground mt-1">查看本地工具状态（后续迭代）</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <WrenchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">工具库功能开发中</p>
        <p className="text-xs text-muted-foreground mt-1">此功能将在后续版本中提供</p>
      </div>
    </div>
  );
}