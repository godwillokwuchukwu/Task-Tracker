// src/components/TaskDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
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
} from "../utils/taskUtils";
import "./TaskDashboard.css";

const PAGE_SIZE = 5;
const STORAGE_KEY = "task-tracker:tasks";
const ALL_CATEGORIES = "All";

const TaskDashboard = ({ tasks: initialTasks }) => {
  // Load from localStorage on first render if a saved copy exists,
  // otherwise fall back to the sample data passed in as a prop.
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Persist whenever the task list itself changes (not the filters).
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // localStorage can fail (private mode, quota); the app still
      // works in-memory for the session, so we just skip persisting.
    }
  }, [tasks]);

  const activeTasks = useMemo(() => filterActiveTasks(tasks), [tasks]);
  const totalActive = useMemo(() => countActiveTasks(tasks), [tasks]);
  const groupedByCategory = useMemo(
    () => groupTasksByCategory(activeTasks),
    [activeTasks]
  );
  const avgCompletionDays = useMemo(
    () => calculateAverageCompletionTime(tasks),
    [tasks]
  );

  const categories = useMemo(
    () => [ALL_CATEGORIES, ...Object.keys(groupTasksByCategory(activeTasks))],
    [activeTasks]
  );

  // search -> category filter -> sort, in that order
  const visibleTasks = useMemo(() => {
    let result = searchTasksByName(activeTasks, searchQuery);
    if (categoryFilter !== ALL_CATEGORIES) {
      result = result.filter((task) => task.category === categoryFilter);
    }
    return sortTasksByDueDate(result, sortDirection);
  }, [activeTasks, searchQuery, categoryFilter, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(visibleTasks.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedTasks = useMemo(
    () => paginateTasks(visibleTasks, safePage, PAGE_SIZE),
    [visibleTasks, safePage]
  );

  const selectedTask = selectedTaskId
    ? findTaskById(tasks, selectedTaskId)
    : null;

  // Reset to page 1 whenever the filtered set changes underneath the user.
  useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryFilter, sortDirection]);

  return (
    <div className="task-dashboard">
      <header className="dashboard-header">
        <div className="header-eyebrow">Ledger</div>
        <h1>Active Tasks</h1>
        <p className="header-sub">
          Everything still open, sorted, searchable, one click from its
          detail.
        </p>
      </header>

      <section className="summary-row">
        <div className="summary-card">
          <span className="summary-value">{totalActive}</span>
          <span className="summary-label">active tasks</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">
            {Object.keys(groupedByCategory).length}
          </span>
          <span className="summary-label">categories in play</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">
            {avgCompletionDays > 0 ? avgCompletionDays : "—"}
          </span>
          <span className="summary-label">avg. days to complete</span>
        </div>
      </section>

      <section className="controls-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search active tasks by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tasks by name"
        />

        <div className="category-tabs" role="tablist" aria-label="Filter by category">
          {categories.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={categoryFilter === category}
              className={
                "category-tab" +
                (categoryFilter === category ? " category-tab--active" : "")
              }
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <button
          className="sort-toggle"
          onClick={() =>
            setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"))
          }
          aria-label="Toggle sort direction by due date"
        >
          Due date {sortDirection === "asc" ? "↑" : "↓"}
        </button>
      </section>

      <section className="task-list">
        {pagedTasks.length === 0 ? (
          <div className="empty-state">
            Nothing matches that search or filter. Try clearing one of them.
          </div>
        ) : (
          <ul>
            {pagedTasks.map((task) => (
              <li
                key={task.id}
                className={
                  "task-row task-row--" + task.priority +
                  (selectedTaskId === task.id ? " task-row--selected" : "")
                }
                onClick={() => setSelectedTaskId(task.id)}
              >
                <span className="task-id">#{String(task.id).padStart(3, "0")}</span>
                <span className="task-name">{task.name}</span>
                <span className="task-category">{task.category}</span>
                <span className="task-due">{formatDueDate(task.dueDate)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {visibleTasks.length > PAGE_SIZE && (
        <nav className="pagination" aria-label="Pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            Prev
          </button>
          <span className="pagination-status">
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            Next
          </button>
        </nav>
      )}

      {selectedTask && (
        <aside className="task-detail" aria-live="polite">
          <button
            className="task-detail-close"
            onClick={() => setSelectedTaskId(null)}
            aria-label="Close task detail"
          >
            ×
          </button>
          <div className="header-eyebrow">Task #{selectedTask.id}</div>
          <h2>{selectedTask.name}</h2>
          <dl>
            <dt>Category</dt>
            <dd>{selectedTask.category}</dd>
            <dt>Priority</dt>
            <dd>{selectedTask.priority}</dd>
            <dt>Status</dt>
            <dd>{selectedTask.status}</dd>
            <dt>Due</dt>
            <dd>{formatDueDate(selectedTask.dueDate)}</dd>
          </dl>
        </aside>
      )}
    </div>
  );
};

export default TaskDashboard;
