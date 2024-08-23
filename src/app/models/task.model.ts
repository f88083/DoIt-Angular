export interface Task {
  taskId: number;
  title: string;
  description: string;
  status: number;
  dueDate: string;
  updateDate: string;
  completed: boolean;
  showDescription?: boolean;
}

export interface TaskCreateRequest {
  title: string;
  description: string;
  status: number;
  dueDate: string;
}