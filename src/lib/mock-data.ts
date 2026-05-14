import { Project, WorkspaceFile } from "@/types";

export const mockProjects: Omit<Project, 'files'>[] = [
  {
    id: "p1",
    name: "Q3 Financial Analysis",
    description: "Financial data cleanup and prediction.",
    status: "active",
    userId: "u1", // FIXED: Matches Prisma seed user
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Employee Directory Sync",
    description: "HR employee records normalization.",
    status: "active",
    userId: "u1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockFiles: WorkspaceFile[] = [
  {
    id: "f1",
    name: "Q3_Data_Raw.csv",
    type: "csv",
    size: 1500000, // FIXED: Number format (bytes)
    rows: 450,
    locked: false,
    projectId: "p1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "f2",
    name: "Employee_Records.xlsx",
    type: "xlsx",
    size: 2300000, // FIXED: Number format (bytes)
    rows: 1200,
    locked: true,
    projectId: "p1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "f3",
    name: "HR_Export_Jan.csv",
    type: "csv",
    size: 850000, // FIXED: Number format (bytes)
    rows: 320,
    locked: false,
    projectId: "p2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];