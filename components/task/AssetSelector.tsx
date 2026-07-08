"use client";

interface Asset {
  asset_id: string;
  name: string;
  type: string;
  duration: number | null;
  thumbnail_url: string | null;
}

interface Props {
  assets: Asset[];
  selected: Asset | null;
  onSelect: (asset: Asset) => void;
}

export function AssetSelector({ assets, selected, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">选择素材</h2>
        <p className="text-sm text-[#888] mt-1">从素材库中选择要编辑的素材</p>
      </div>

      {assets.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1E1E3A] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="text-[#888]">暂无可选素材</p>
          <p className="text-sm text-[#555] mt-1">请先在 Memento-Sol 手机端上传素材</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <button
              key={asset.asset_id}
              onClick={() => onSelect(asset)}
              className={`p-4 rounded-xl border text-left transition-all hover:border-[#6C5CE7] ${
                selected?.asset_id === asset.asset_id
                  ? "border-[#6C5CE7] bg-[#6C5CE7]/10"
                  : "border-[#1E1E3A] bg-[#12121F]"
              }`}
            >
              <div className="w-full aspect-video bg-[#0A0A0F] rounded-lg mb-3 flex items-center justify-center">
                {asset.thumbnail_url ? (
                  <img src={asset.thumbnail_url} alt={asset.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-white font-medium truncate">{asset.name}</p>
              <p className="text-xs text-[#888] mt-1">
                {asset.type === "video" ? "视频" : "图片"}
                {asset.duration ? ` · ${asset.duration.toFixed(1)}s` : ""}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}