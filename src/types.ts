export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar: string | null;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  hex_color: string;
  identifier: string;
  is_archived: boolean;
  is_favorite: boolean;
  parent_project_id: number | null;
  position: number;
  created: string;
  updated: string;
  max_permission: number;
}

export interface Label {
  id: number;
  title: string;
  description: string;
  hex_color: string;
  created: string;
  updated: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  due_date: string | null;
  start_date: string | null;
  end_date: string | null;
  hex_color: string;
  priority: number;
  percent_done: number;
  project_id: number;
  repeat_after: number;
  repeat_mode: number;
  position: number;
  created: string;
  updated: string;
  labels: Label[];
  assignees: User[];
}

export interface TaskComment {
  id: number;
  task_id: number;
  comment: string;
  author: User;
  created: string;
  updated: string;
}

export interface FileInfo {
  id: number;
  name: string;
  size: number;
  mime: string;
  created: string;
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  file: FileInfo;
  created: string;
  created_by: User;
}

export type RelationKind =
  | "unknown"
  | "subtask"
  | "parenttask"
  | "related"
  | "duplicateof"
  | "duplicates"
  | "blocking"
  | "blocked"
  | "precedes"
  | "follows"
  | "copiedfrom"
  | "copiedto";

export interface TaskRelation {
  task_id: number;
  other_task_id: number;
  relation_kind: RelationKind;
}

export interface VikunjaError {
  code: number;
  message: string;
}

export interface ListResponse<T> {
  data: T[];
  headers: {
    "x-total-count": string;
    link?: string;
  };
}
