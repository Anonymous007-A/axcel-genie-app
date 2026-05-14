// 1. Generic API Wrapper - For type-safe data fetching
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
  message?: string; // <-- ye line add karo
}
// 2. User & Plan Management - Enforcing Uppercase Consistency
export type PlanTier = 'BASIC' | 'PRO' | 'ADVANCE';
export type UserRole = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: PlanTier;
  role: UserRole;
}

// 3. Data Entities - Keeping them flat for API consistency
export interface WorkspaceFile {
  id: string;
  name: string;
  type: 'csv' | 'xlsx' | 'json'; // Pro-tip applied
  size: number;
  rows: number;         
  locked: boolean;      
  storageKey?: string;  
  contentUrl?: string;  
  projectId: string;
  createdAt: string;    
  updatedAt: string;    
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: 'active' | 'archived' | 'deleted'; // Pro-tip applied
  userId: string;
  files?: WorkspaceFile[];
  createdAt: string;    
  updatedAt: string;    
}

// 4. Tool Registry Types - For 14+ Tools
export type ToolContextType = 'none' | 'single-file' | 'multi-file' | 'project';

export interface Tool {
  id: string;
  label: string;
  description: string;
  iconName: string;
  category: string; // essential for filtering
  contextType: ToolContextType;
  minPlan: PlanTier;
}

// 5. Simplified Workspace Settings
export interface WorkspaceSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  dateFormat: string;
  timeFormat: string;
}

// 6. Store context (used in hooks)
export interface AppContextState {
  projectId: string | null;
  fileId: string | null;
  fileName: string | null;
}