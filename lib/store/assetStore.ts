// 素材状态管理 — Zustand
import { create } from "zustand";

export interface Asset {
  asset_id: string;
  name: string;
  type: string;
  url: string;
  thumbnail_url: string | null;
  status: string;
  is_result: boolean;
  uploaded_at: number;
}

interface AssetState {
  assets: Asset[];
  isLoading: boolean;
  setAssets: (assets: Asset[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  assets: [],
  isLoading: false,
  setAssets: (assets) => set({ assets, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));