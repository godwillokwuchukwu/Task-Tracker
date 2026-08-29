// src/utils/taskUtils.test.js
import { describe, it, expect } from "vitest";
import {
  filterActiveTasks,
  formatDueDate,
  countActiveTasks,
  findTaskById,
  groupTasksByCategory,
  calculateAverageCompletionTime,
  searchTasksByName,
  sortTasksByDueDate,
  paginateTasks,
} from "./taskUtils";

const tasks = [
  { id: 1, name: "Alpha", category: "Work", status: "active", priority: "high", dueDate: "2026-09-10", createdAt: "2026-09-01", completedAt: null },
  { id: 2, name: "Beta", category: "Work", status: "completed", priority: "low", dueDate: "2026-08-01", createdAt: "2026-07-20", completedAt: "2026-07-30" },
  { id: 3, name: "Gamma task", category: "Personal", status: "active", priority: "medium", dueDate: "2026-09-01", createdAt: "2026-08-15", completedAt: null },
];

describe("filterActiveTasks", () => {
  it("keeps only active tasks", () => {
    expect(filterActiveTasks(tasks).map((t) => t.id)).toEqual([1, 3]);
  });
});

describe("formatDueDate", () => {
  it("formats as MMM DD, YYYY", () => {
    expect(formatDueDate("2026-09-05")).toBe("Sep 05, 2026");
  });

  it("handles missing dates gracefully", () => {
    expect(formatDueDate(null)).toBe("No due date");
    expect(formatDueDate("")).toBe("No due date");
  });
});

describe("countActiveTasks", () => {
  it("counts only active tasks", () => {
    expect(countActiveTasks(tasks)).toBe(2);
  });
});

describe("findTaskById", () => {
  it("finds an existing task", () => {
    expect(findTaskById(tasks, 2)?.name).toBe("Beta");
  });

  it("returns undefined for a missing id", () => {
    expect(findTaskById(tasks, 999)).toBeUndefined();
  });
});

describe("groupTasksByCategory", () => {
  it("groups tasks under their category key", () => {
    const grouped = groupTasksByCategory(tasks);
    expect(grouped.Work.map((t) => t.id)).toEqual([1, 2]);
    expect(grouped.Personal.map((t) => t.id)).toEqual([3]);
  });
});

describe("calculateAverageCompletionTime", () => {
  it("averages days between createdAt and completedAt", () => {
    expect(calculateAverageCompletionTime(tasks)).toBe(10);
  });

  it("returns 0 when nothing is completed", () => {
    expect(calculateAverageCompletionTime(filterActiveTasks(tasks))).toBe(0);
  });
});

describe("searchTasksByName", () => {
  it("matches case-insensitively", () => {
    expect(searchTasksByName(tasks, "gamma").map((t) => t.id)).toEqual([3]);
  });

  it("returns all tasks for an empty query", () => {
    expect(searchTasksByName(tasks, "  ")).toHaveLength(3);
  });
});

describe("sortTasksByDueDate", () => {
  it("sorts ascending by default", () => {
    const sorted = sortTasksByDueDate(tasks, "asc");
    expect(sorted.map((t) => t.id)).toEqual([2, 3, 1]);
  });

  it("sorts descending when asked", () => {
    const sorted = sortTasksByDueDate(tasks, "desc");
    expect(sorted.map((t) => t.id)).toEqual([1, 3, 2]);
  });
});

describe("paginateTasks", () => {
  it("slices the correct page", () => {
    expect(paginateTasks(tasks, 1, 2).map((t) => t.id)).toEqual([1, 2]);
    expect(paginateTasks(tasks, 2, 2).map((t) => t.id)).toEqual([3]);
  });
});
