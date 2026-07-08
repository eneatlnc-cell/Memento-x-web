"use client";

interface Asset { asset_id: string; name: string; type: string; }

interface Props {
  asset: Asset;
  selected: "person" | "background" | "object" | null;
  onSelect: (target: "person" | "background" | "object") => void;
  onBack: () => void;
  onExecute: () => void;
}

const targets: { key: "person" | "background" | "object"; label: string; desc: string }[] = [
  { key: "person", label: "替换人物", desc: "提取画面中的人物并替换为新素材" },
  { key: "background", label: "替换背景", desc: "提取画面背景并替换为新素材" },
  { key: "object", label: "替换物体", desc: "提取画面中的物体并替换为新素材" },
];

export function TargetSelector({ asset, selected, onSelect, onBack, onExecute }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-[#888] hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-semibold text-white">选择目标</h2>
          <p className="text-sm text-[#888] mt-1">已选素材：{asset.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {targets.map((t) => (
          <button
            key={t.key}
            onClick={() => onSelect(t.key)}
            className={`p-6 rounded-xl border text-center transition-all hover:border-[#6C5CE7] ${
              selected === t.key
                ? "border-[#6C5CE7] bg-[#6C5CE7]/10"
                : "border-[#1E1E3A] bg-[#12121F]"
            }`}
          >
            <p className="text-white font-medium">{t.label}</p>
            <p className="text-xs text-[#888] mt-2">{t.desc}</p>
          </button>
        ))}
      </div>

      <button
        onClick={onExecute}
        disabled={!selected}
        className="w-full py-3 bg-[#6C5CE7] hover:bg-[#5A4BD1] disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        执行
      </button>
    </div>
  );
}