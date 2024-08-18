export interface Task {
    id: number;
    title: string;
    description: string;
    status: number;
    dueDate: Date;
    completed: boolean;
    showDescription?: boolean;
}

export interface TaskCreateRequest {
    title: string;
    description: string;
    status: number;
    dueDate: string;
}