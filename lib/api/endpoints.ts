// API 端点常量
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export const ENDPOINTS = {
  // 意图理解
  INTENT_UNDERSTAND: `${API_BASE}/intent/understand`,
  // 任务派发
  WORKFLOW_DISPATCH: `${API_BASE}/workflow/dispatch`,
  // 任务状态
  TASK_STATUS: (taskId: string) => `${API_BASE}/workflow/status/${taskId}`,
  // 素材列表
  ASSET_LIST: `${API_BASE}/asset/list`,
  // 素材上传
  ASSET_UPLOAD: `${API_BASE}/asset/upload`,
  // 成片下载
  RESULT_DOWNLOAD: (taskId: string) => `${API_BASE}/result/download/${taskId}`,
  // 账户
  ACCOUNT_LOGIN: `${API_BASE}/account/login`,
} as const;