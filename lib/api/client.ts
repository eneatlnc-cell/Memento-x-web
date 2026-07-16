// API 客户端 — 基于 fetch 封装，支持 JWT 认证
import { ENDPOINTS } from "./endpoints";
import { useAuthStore } from "@/lib/store/authStore";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return useAuthStore.getState().token;
  }

  private async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const token = this.getToken();

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (response.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("认证已过期，请重新登录");
    }

    if (!response.ok) {
      const error = await response.text().catch(() => "Unknown error");
      throw new Error(`API Error ${response.status}: ${error}`);
    }

    return response.json();
  }

  // ── 账号 ──
  async register(email: string, password: string) {
    return this.request<{ access_token: string; token_type: string }>(
      ENDPOINTS.ACCOUNT_REGISTER,
      { method: "POST", body: { email, password } },
    );
  }

  async login(email: string, password: string) {
    return this.request<{ access_token: string; token_type: string }>(
      ENDPOINTS.ACCOUNT_LOGIN,
      { method: "POST", body: { email, password } },
    );
  }

  // ── 意图理解 + 派发 ──
  async understandIntent(
    userInput: string,
    projectId?: string,
    assets?: Array<{ id: string; name: string; type: string }>,
  ) {
    return this.request<{
      success: boolean;
      workflow: { version: string; workflow_id: string; steps: Array<{ id: string; action: string; params: Record<string, unknown> }> };
      task_id: string;
    }>(ENDPOINTS.INTENT_UNDERSTAND, {
      method: "POST",
      body: { input: userInput, project_id: projectId || "default", assets: assets || [] },
    });
  }

  async dispatchWorkflow(userInput: string, assets?: Array<{ id: string; name: string; type: string }>, localUrl?: string) {
    return this.request<{ success: boolean; task_id: string; local_status: string }>(
      ENDPOINTS.WORKFLOW_DISPATCH,
      {
        method: "POST",
        body: {
          user_input: userInput,
          assets: assets || [],
          local_url: localUrl || `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"}/local/execute`,
        },
      },
    );
  }

  // ── 任务状态 ──
  async getTaskStatus(taskId: string) {
    return this.request<{
      task_id: string;
      status: string;
      current_step: string;
      progress: number;
      steps: Array<{ id: string; action: string; status: string }>;
      result_url: string | null;
    }>(ENDPOINTS.TASK_STATUS(taskId));
  }

  // ── 素材列表 ──
  async getAssetList() {
    return this.request<Array<{
      asset_id: string;
      name: string;
      type: string;
      duration: number | null;
      thumbnail_url: string | null;
      status: string;
      is_result: boolean;
      uploaded_at: number;
    }>>(ENDPOINTS.ASSET_LIST);
  }

  // ── 成片结果 ──
  async getWorkflowResult(taskId: string) {
    return this.request<{
      task_id: string;
      status: string;
      result: { video_url: string; thumbnail_url: string } | null;
      error: string | null;
    }>(ENDPOINTS.WORKFLOW_RESULT(taskId));
  }
}

export const apiClient = new ApiClient();