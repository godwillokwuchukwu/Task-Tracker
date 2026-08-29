// src/App.jsx
import React, { useState } from "react";
import TaskDashboard from "./components/TaskDashboard";
import ProductDashboard from "./components/ProductDashboard";
import { sampleTasks } from "./data/sampleTasks";
import { sampleProducts } from "./data/sampleProducts";
import "./App.css";

const VIEWS = {
  TASKS: "tasks",
  PRODUCTS: "products",
};

function App() {
  const [view, setView] = useState(VIEWS.TASKS);

  return (
    <div className="app">
      <nav className="app-nav">
        <button
          className={"app-nav-tab" + (view === VIEWS.TASKS ? " app-nav-tab--active" : "")}
          onClick={() => setView(VIEWS.TASKS)}
        >
          Tasks
        </button>
        <button
          className={"app-nav-tab" + (view === VIEWS.PRODUCTS ? " app-nav-tab--active" : "")}
          onClick={() => setView(VIEWS.PRODUCTS)}
        >
          Inventory
        </button>
      </nav>

      {view === VIEWS.TASKS ? (
        <TaskDashboard tasks={sampleTasks} />
      ) : (
        <ProductDashboard products={sampleProducts} />
      )}
    </div>
  );
}

export default App;
