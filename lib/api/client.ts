// API 客户端 — 基于 fetch 封装
import { ENDPOINTS } from "./endpoints";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.text().catch(() => "Unknown error");
      throw new Error(`API Error ${response.status}: ${error}`);
    }

    return response.json();
  }

  // ── 意图理解 ──
  async understandIntent(userInput: string, projectId?: string, assets?: Array<{ id: string; name: string; type: string }>) {
    return this.request<{
      success: boolean;
      workflow: { version: string; workflow_id: string; steps: Array<{ id: string; action: string; params: Record<string, unknown> }> };
      task_id: string;
    }>(ENDPOINTS.INTENT_UNDERSTAND, {
      method: "POST",
      body: { user_input: userInput, project_id: projectId || "default", assets: assets || [] },
    });
  }

  // ── 任务派发 ──
  async dispatchWorkflow(workflow: unknown, localUrl?: string) {
    return this.request<{ success: boolean; task_id: string; local_status: string }>(
      ENDPOINTS.WORKFLOW_DISPATCH,
      {
        method: "POST",
        body: { workflow, local_url: localUrl || "http://localhost:8000/api/v1/local/execute" },
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
      url: string;
      thumbnail_url: string | null;
      status: string;
      is_result: boolean;
      uploaded_at: number;
    }>>(ENDPOINTS.ASSET_LIST);
  }
}

export const apiClient = new ApiClient();