# Task Tracker Dashboard

A small React dashboard with two views — Tasks and Inventory — built
as a practical exercise in `Array.filter` / `map` / `reduce` / `find`,
not just for looks. Switch between them with the tabs at the top.

## Features

**Core**
- Displays only active tasks (`filter`)
- Formats due dates as `MMM DD, YYYY` (`map` inside render + a pure formatter)
- Shows total active task count (`reduce`)
- Click a task to see its details (`find`)

**Advanced**
- Groups active tasks by category (`reduce`)
- Calculates average completion time, in days, across completed tasks
- Search bar that filters tasks by name as you type
- Pagination (5 tasks per page) once results exceed one page
- Category tabs to narrow the list further
- Sortable by due date (ascending/descending)
- Tasks persist to `localStorage`, so edits survive a refresh

**Inventory tab**
- Displays only in-stock products (`filter` + `map` → display-ready shape)
- Total in-stock inventory value (`reduce`)
- Click a product to see its detail, found by id (`find`)

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Project structure

```
task-tracker/
├── src/
│   ├── components/
│   │   ├── TaskDashboard.jsx      # Task dashboard UI
│   │   ├── TaskDashboard.css
│   │   ├── ProductDashboard.jsx   # Inventory dashboard UI
│   │   └── ProductDashboard.css
│   ├── utils/
│   │   ├── taskUtils.js           # filter/map/reduce/find helpers for tasks
│   │   ├── taskUtils.test.js
│   │   ├── productUtils.js        # filter/map/reduce/find helpers for products
│   │   └── productUtils.test.js
│   ├── data/
│   │   ├── sampleTasks.js
│   │   └── sampleProducts.js
│   ├── App.jsx                    # Tab switcher between the two dashboards
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Design notes

The visual language is a "ledger" aesthetic — warm paper background,
serif display type for headings, monospace for IDs/dates/labels — to
make the dashboard read like a working log rather than a generic admin
panel. Priority is shown as a colored rail on the left edge of each row
rather than a badge, so the list stays scannable at a glance.

## Extending it further

Ideas that would be natural next additions:
- Swap `sampleTasks.js` for a real API call (the utils already expect
  the same shape, so only the data source changes)
- Add a form to create/edit tasks, writing back into the same `tasks`
  state that already persists to `localStorage`
- Multi-select category filtering instead of one tab at a time
- Unit tests for each function in `taskUtils.js` (they're pure, so this
  is mostly a matter of adding cases — see `taskUtils.test.js`)
