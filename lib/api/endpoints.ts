// API 端点常量
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export const ENDPOINTS = {
  // 账号
  ACCOUNT_REGISTER: `${API_BASE}/account/register`,
  ACCOUNT_LOGIN: `${API_BASE}/account/login`,
  ACCOUNT_REFRESH: `${API_BASE}/account/refresh`,
  // 意图理解
  INTENT_UNDERSTAND: `${API_BASE}/workflow/generate`,
  // 任务派发
  WORKFLOW_DISPATCH: `${API_BASE}/workflow/dispatch`,
  // 任务状态
  TASK_STATUS: (taskId: string) => `${API_BASE}/workflow/status/${taskId}`,
  // 素材列表
  ASSET_LIST: `${API_BASE}/asset/list`,
  // 成片结果
  WORKFLOW_RESULT: (taskId: string) => `${API_BASE}/workflow/result/${taskId}`,
  // 通知
  NOTIFICATION_PUSH: `${API_BASE}/notification/push`,
} as const;