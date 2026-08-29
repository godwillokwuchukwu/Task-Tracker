// src/utils/taskUtils.js
//
// Pure, side-effect-free helpers for the Task Tracker Dashboard.
// Every function takes a tasks array in, returns a new value out —
// none of them mutate the array they're given.

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Returns only tasks whose status is "active".
 * @param {Array} tasks
 * @returns {Array}
 */
export const filterActiveTasks = (tasks) => {
  return tasks.filter((task) => task.status === "active");
};

/**
 * Formats an ISO date string ("2026-09-05") as "Sep 05, 2026".
 * Returns "No due date" for missing/invalid input instead of throwing,
 * since due dates are optional on a task.
 * @param {string} dateString
 * @returns {string}
 */
export const formatDueDate = (dateString) => {
  if (!dateString) return "No due date";

  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "No due date";

  const month = MONTH_NAMES[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

/**
 * Counts active tasks in a single reduce pass.
 * @param {Array} tasks
 * @returns {number}
 */
export const countActiveTasks = (tasks) => {
  return tasks.reduce((total, task) => {
    return task.status === "active" ? total + 1 : total;
  }, 0);
};

/**
 * Finds a single task by id.
 * @param {Array} tasks
 * @param {number} taskId
 * @returns {Object|undefined}
 */
export const findTaskById = (tasks, taskId) => {
  return tasks.find((task) => task.id === taskId);
};

/**
 * Groups tasks by category into { categoryName: [tasks] }.
 * @param {Array} tasks
 * @returns {Object}
 */
export const groupTasksByCategory = (tasks) => {
  return tasks.reduce((groups, task) => {
    const key = task.category || "Uncategorized";
    if (!groups[key]) groups[key] = [];
    groups[key].push(task);
    return groups;
  }, {});
};

/**
 * Average number of days between createdAt and completedAt for
 * completed tasks. Tasks without a completedAt are ignored rather
 * than treated as zero, so they don't skew the average down.
 * @param {Array} tasks
 * @returns {number} average days, rounded to 1 decimal (0 if none completed)
 */
export const calculateAverageCompletionTime = (tasks) => {
  const completed = tasks.filter(
    (task) => task.status === "completed" && task.completedAt && task.createdAt
  );

  if (completed.length === 0) return 0;

  const totalDays = completed.reduce((sum, task) => {
    const created = new Date(`${task.createdAt}T00:00:00`);
    const done = new Date(`${task.completedAt}T00:00:00`);
    const days = (done - created) / (1000 * 60 * 60 * 24);
    return sum + days;
  }, 0);

  return Math.round((totalDays / completed.length) * 10) / 10;
};

/**
 * Case-insensitive substring search by task name.
 * @param {Array} tasks
 * @param {string} query
 * @returns {Array}
 */
export const searchTasksByName = (tasks, query) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return tasks;
  return tasks.filter((task) => task.name.toLowerCase().includes(normalized));
};

/**
 * Returns a NEW array sorted by due date ascending. Tasks with no
 * due date sort to the end regardless of direction.
 * @param {Array} tasks
 * @param {"asc"|"desc"} direction
 * @returns {Array}
 */
export const sortTasksByDueDate = (tasks, direction = "asc") => {
  const withDate = tasks.filter((task) => task.dueDate);
  const withoutDate = tasks.filter((task) => !task.dueDate);

  const sorted = [...withDate].sort((a, b) => {
    const diff = new Date(a.dueDate) - new Date(b.dueDate);
    return direction === "asc" ? diff : -diff;
  });

  return [...sorted, ...withoutDate];
};

/**
 * Slices a tasks array into a single page.
 * @param {Array} tasks
 * @param {number} page - 1-indexed
 * @param {number} pageSize
 * @returns {Array}
 */
export const paginateTasks = (tasks, page = 1, pageSize = 5) => {
  const start = (page - 1) * pageSize;
  return tasks.slice(start, start + pageSize);
};
