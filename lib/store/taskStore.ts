// 任务状态管理 — Zustand
import { create } from "zustand";

export interface TaskStep {
  id: string;
  action: string;
  status: "pending" | "running" | "completed" | "failed";
}

export interface Task {
  id: string;
  userInput: string;
  status: "idle" | "understanding" | "preview" | "dispatched" | "running" | "completed" | "failed";
  progress: number;
  currentStep: string;
  steps: TaskStep[];
  resultUrl: string | null;
  createdAt: Date;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  setCurrentTask: (task: Task | null) => void;
  updateTaskProgress: (id: string, progress: number, currentStep: string, steps: TaskStep[]) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  currentTask: null,

  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks], currentTask: task })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      currentTask: state.currentTask?.id === id ? { ...state.currentTask, ...updates } : state.currentTask,
    })),

  setCurrentTask: (task) => set({ currentTask: task }),

  updateTaskProgress: (id, progress, currentStep, steps) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: "running" as const, progress, currentStep, steps } : t,
      ),
      currentTask:
        state.currentTask?.id === id
          ? { ...state.currentTask, status: "running" as const, progress, currentStep, steps }
          : state.currentTask,
    })),
}));