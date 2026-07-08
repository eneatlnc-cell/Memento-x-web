"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api/client";
import { formatRelativeTime } from "@/lib/utils";
import { ImageIcon, VideoIcon, Loader2 } from "lucide-react";

interface AssetItem {
  asset_id: string;
  name: string;
  type: string;
  url: string;
  thumbnail_url: string | null;
  status: string;
  is_result: boolean;
  uploaded_at: number;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.getAssetList().then(setAssets).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">素材库</h1>
          <p className="text-sm text-muted-foreground mt-1">手机端采集的素材同步显示在这里</p>
        </div>
        <Badge variant="outline" className="text-xs">{assets.length} 个素材</Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>
      ) : assets.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">素材库为空</p>
          <p className="text-xs text-muted-foreground mt-1">在 Memento-Sol 手机端拍摄素材后，会自动同步到这里</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div key={asset.asset_id} className="rounded-xl border border-border bg-card overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="aspect-square bg-secondary flex items-center justify-center">
                {asset.thumbnail_url ? (
                  <img src={asset.thumbnail_url} alt={asset.name} className="w-full h-full object-cover" />
                ) : (
                  <VideoIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm text-foreground truncate">{asset.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <Badge variant="outline" className="text-[10px]">{asset.type === "video" ? "视频" : "图片"}</Badge>
                  {asset.is_result && <Badge className="text-[10px] bg-primary/20 text-primary border-0">成片</Badge>}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">{formatRelativeTime(new Date(asset.uploaded_at * 1000))}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}