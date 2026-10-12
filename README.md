# 📚 Student Task Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Storage](https://img.shields.io/badge/Storage-localStorage-success)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

> A modern, responsive, client-side academic task and coursework manager designed specifically for students. Built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)**, featuring offline data persistence via **`localStorage`**.

---

## 📖 Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Features and Functionality](#2-features-and-functionality)
- [3. Technologies Used](#3-technologies-used)
- [4. Project Screenshots](#4-project-screenshots)
- [5. Project Folder Structure](#5-project-folder-structure)
- [6. Instructions for Running Locally](#6-instructions-for-running-locally)
- [7. Explanation of `localStorage`](#7-explanation-of-localstorage)
- [8. Key JavaScript Concepts & Methods Used](#8-key-javascript-concepts--methods-used)
- [9. Deployment Instructions for Vercel](#9-deployment-instructions-for-vercel)
- [10. Lecturer Demonstration Guide](#10-lecturer-demonstration-guide)
- [11. Future Improvements](#11-future-improvements)
- [12. License](#12-license)

---

## 1. Project Overview

The **Student Task Manager** is a lightweight, single-page application (SPA) created to help university and college students manage academic workloads, track assignment deadlines, and monitor study progress without the clutter of complex software.

Unlike heavy web applications that require external databases, Node.js runtimes, or backend servers, this application operates **100% in the client browser**. All state—including coursework assignments, completion records, filter states, and theme preferences—persists across sessions using the browser's native `localStorage` API.

### Core Objectives:
* **Academic Productivity**: Keep coursework, problem sets, exam dates, and lab reports organized in one unified view.
* **Deadline Awareness**: Proactively alert students to overdue coursework and impending deadlines.
* **Progress Motivation**: Dynamically calculate and visualize academic completion percentages in real time.
* **Accessibility & Portability**: Lightweight, responsive on all devices, and requires zero installation or build steps.

---

## 2. Features and Functionality

| Category | Feature | Description |
| :--- | :--- | :--- |
| **Task Operations (CRUD)** | **Create Task** | Modal form to add tasks with title (mandatory), description, due date, and priority (*High*, *Medium*, *Low*). |
| | **Read / View Tasks** | Responsive task cards displaying full coursework metadata, date tags, and status chips. |
| | **Update / Edit Task** | In-place modal editing that pre-populates existing data and updates records without duplicates. |
| | **Delete Task** | Removes tasks with an accessible, custom-styled confirmation dialog to prevent accidental loss. |
| | **Completion Toggle** | One-click checkbox toggling with instant visual strike-through styling and badge updates. |
| **Dashboard Analytics** | **Summary Metrics** | Real-time counters for **Total Tasks**, **Pending Tasks**, **Completed Tasks**, and **High-Priority Tasks**. |
| | **Progress Indicator** | Animated gradient progress bar tracking completion percentage with dynamic motivational tips. |
| | **Sidebar Badge Counts** | Live count badges next to each category in the sidebar navigation. |
| **Deadlines & Alerts** | **Overdue Detection** | Compares due dates against current calendar dates to display prominent `⚠️ Overdue` badges. |
| | **Urgency Chips** | Contextual badges highlighting tasks that are `🔥 Due Today` or `Due Tomorrow`. |
| **Search & Organization** | **Instant Search** | Real-time, case-insensitive search by task title or description as the user types. |
| | **Multi-Criteria Filters** | Filter by status (*All, Pending, Completed*), priority (*High, Medium, Low*), or *Overdue*. |
| | **Multi-Sorting** | Sort by due date (earliest/latest), priority level (High to Low), or creation date (newest/oldest). |
| | **Active Filter Tags** | Interactive removable tag chips showing active filter criteria with a one-click reset button. |
| **User Experience (UX)** | **Dark / Light Theme** | Smooth theme toggle persisted in `localStorage` based on user preference or OS setting. |
| | **Toast Notifications** | Non-blocking status toasts confirming actions (*task created, updated, completed, deleted*). |
| | **Contextual Empty States** | Friendly illustrations and call-to-action buttons when no tasks match current filters. |
| | **Mobile Responsive** | Off-canvas drawer menu and fluid grid adapting to phones, tablets, and desktops. |

---

## 3. Technologies Used

### Front-End Core
* **HTML5**:
  * Semantic layout: `<aside>`, `<main>`, `<header>`, `<section>`, `<article>`, and `<nav>`.
  * Accessibility: ARIA roles (`role="dialog"`, `role="progressbar"`, `aria-live="polite"`), descriptive `aria-label` tags, and keyboard focus states.
* **CSS3**:
  * **Design System**: Modular CSS Custom Properties (`--color-primary`, `--bg-app`, `--shadow-md`, etc.) for theme tokens.
  * **Layout**: CSS Grid for dashboard summary cards and task lists; Flexbox for toolbars, headers, and navigation rows.
  * **Themes**: Full support for Light and Dark modes via `[data-theme="dark"]` attribute switching.
  * **Micro-interactions**: Smooth transitions, backdrop blurs (`backdrop-filter`), modal zoom entrances, and animated progress bars.
* **Vanilla JavaScript (ES6+)**:
  * Pure client-side logic with zero external dependencies, libraries, or frameworks.
  * Event-driven architecture with modular, single-responsibility functions.
  * Input sanitization via an `escapeHTML()` utility to prevent Cross-Site Scripting (XSS).

### Storage & Typography
* **Browser Storage API**: `Window.localStorage` for synchronous, client-side persistent storage.
* **Typography**: Google Fonts ([Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) for headings, [Inter](https://fonts.google.com/specimen/Inter) for body copy).

---

## 4. Project Screenshots

### Desktop Dashboard (Light Mode)
```
+----------------------------------------------------------------------------------------------------+
| [Logo] Studently           |  Student Task Manager                [+ Add New Task]                 |
| [Avatar] Alex Johnson      |  Welcome back! Track your coursework and keep study goals on schedule|
|                            +-----------------------------------------------------------------------+
|  TASKS NAVIGATION          |  [Total Tasks: 5]  [Pending: 3]  [Completed: 2]  [High-Priority: 2]   |
|  [x] All Tasks        (5)  +-----------------------------------------------------------------------+
|  [ ] Pending          (3)  |  Academic Progress Indicator                                     40%  |
|  [ ] Completed        (2)  |  [==========================----------------------------------------] |
|  [ ] High Priority    (2)  +-----------------------------------------------------------------------+
|  [ ] Overdue          (1)  |  [Search tasks...]   Status: [All v]  Priority: [All v]  Sort: [Due v] |
|                            +-----------------------------------------------------------------------+
|  [Study Tip Box]           |  +--------------------+  +--------------------+  +--------------------+
|                            |  | [ ] CS301 Problem  |  | [ ] MATH204 Alg    |  | [x] English Essay |
|  [Theme Toggle: Light/Dark]|  | High | Due in 2d   |  | High | OVERDUE    |  | Low  | Completed   |
|                            |  +--------------------+  +--------------------+  +--------------------+
+----------------------------------------------------------------------------------------------------+
```

> **Note**: To display custom screenshots on GitHub, capture images of your running project, save them inside an `assets/` or `screenshots/` directory, and link them as shown below:
>
> ```markdown
> ![Dashboard View](screenshots/dashboard-light.png)
> ![Dark Mode View](screenshots/dashboard-dark.png)
> ![Task Modal](screenshots/task-modal.png)
> ```

---

## 5. Project Folder Structure

```text
student-task-manager/
├── index.html       # Semantic HTML5 layout, modals, headers, and dashboard structure
├── style.css        # CSS3 design system, themes (Light/Dark), responsive layouts, and animations
├── script.js        # Vanilla JavaScript application logic, CRUD handlers, filters, and localStorage
└── README.md        # Comprehensive project documentation and presentation guide
```

### File Responsibilities:
* **`index.html`**: Defines semantic DOM markup, accessible modal dialogs, search and filter control bars, and data containers.
* **`style.css`**: Manages all visual tokens (colors, shadows, typography, radii), theme declarations, animations, and responsive breakpoints (`1200px`, `992px`, `640px`).
* **`script.js`**: Controls application state, DOM event listeners, data validation, mathematical statistics calculation, date comparison, and `localStorage` synchronization.

---

## 6. Instructions for Running Locally

No installation of Node.js, npm, or compilers is required. Choose any of the following methods:

### Method 1: Direct Browser Launch (Easiest)
1. Clone or download this repository to your local computer:
   ```bash
   git clone https://github.com/your-username/student-task-manager.git
   ```
2. Navigate into the folder:
   ```bash
   cd student-task-manager
   ```
3. Double-click **`index.html`** or right-click and choose **Open With $\rightarrow$ Google Chrome** (or Edge, Safari, Firefox).

---

### Method 2: VS Code Live Server (Recommended for Development)
1. Open the project folder in **Visual Studio Code**:
   ```bash
   code .
   ```
2. Open the Extensions marketplace (`Ctrl+Shift+X` on Windows/Linux or `Cmd+Shift+X` on macOS).
3. Search for and install **Live Server** (by *Ritwick Dey*).
4. Right-click on `index.html` in the file tree and select **Open with Live Server**.
5. The application will launch in your browser at `http://127.0.0.1:5500/index.html` with automatic hot-reloading on save.

---

### Method 3: Python Built-In HTTP Server
If Python 3 is installed on your computer:
```bash
# In the project directory:
python3 -m http.server 8000
```
Open your browser and navigate to:
```text
http://localhost:8000
```

---

### Method 4: Node.js `npx serve`
If you have Node.js installed:
```bash
npx serve .
```

---

## 7. Explanation of `localStorage`

### What is `localStorage`?
The **Web Storage API** provides `localStorage`, an in-browser key-value data storage mechanism. Unlike cookies, `localStorage` data is not sent with every HTTP request and provides a generous storage limit (~5MB per origin).

### Key Characteristics:
1. **Persistent**: Data does not disappear when a tab is closed, refreshed, or when the browser restarts.
2. **Synchronous**: Read and write operations execute sequentially on the main thread.
3. **Strings Only**: `localStorage` exclusively stores strings. Complex JavaScript data types (such as arrays of task objects) must be serialized to JSON strings when writing and deserialized when reading.

### Implementation in this Project:

#### 1. Saving Tasks (`saveTasks`)
Whenever tasks are created, edited, toggled, or deleted, the in-memory array is converted to a string using `JSON.stringify()`:
```javascript
function saveTasks() {
  try {
    localStorage.setItem('student_task_manager_data_v1', JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
    showToast('Failed to save changes to local storage.', 'danger');
  }
}
```

#### 2. Loading Tasks (`loadTasks`)
When the page loads, `localStorage.getItem()` retrieves the raw JSON string. If data exists, `JSON.parse()` restores the JavaScript array. If the user is visiting for the first time, realistic starter tasks are automatically seeded:
```javascript
function loadTasks() {
  try {
    const rawData = localStorage.getItem('student_task_manager_data_v1');
    if (!rawData) {
      tasks = getSampleTasks(); // Seed starter student tasks
      saveTasks();
    } else {
      const parsed = JSON.parse(rawData);
      tasks = Array.isArray(parsed) ? parsed : getSampleTasks();
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    tasks = getSampleTasks();
  }
}
```

#### 3. Theme Persistence
User interface theme preferences (`light` or `dark`) are stored under an independent key:
```javascript
localStorage.setItem('student_task_manager_theme_v1', theme);
```

---

## 8. Key JavaScript Concepts & Methods Used

This project adheres to modern ES6+ coding standards and demonstrates core software development practices:

### 1. Modern Syntax & Language Features
* **Block-Scoped Variables**: `const` for immutables and `let` for reassignable state variables (avoiding `var`).
* **Arrow Functions**: Concise syntax and lexical `this` binding (`t => t.completed`).
* **Template Literals**: Multiline strings and variable interpolation for dynamic card generation.
* **Destructuring & Object Spread**: Immutable cloning and property updates (`{ ...tasks[index], ...updatedData }`).

### 2. Array Manipulation Methods
* **`filter()`**: Applies combined filter conditions (status, priority, search keywords, overdue state).
* **`find()` & `findIndex()`**: Locates task records by unique ID for editing, toggling, or deletion.
* **`unshift()`**: Adds new tasks to the beginning of the list for immediate visibility.
* **`sort()`**: Multi-mode sorting handling due dates, priority weight rankings, and timestamps.

### 3. DOM Manipulation & Event Handling
* **`DocumentFragment`**: Batches task cards into an off-screen fragment before inserting into the DOM, minimizing browser layout reflows.
* **Event Delegation & Listeners**: Discrete click and input handlers attached to controls.
* **Keyboard Accessibility**: Global `keydown` listener listening for `Escape` to close modals.

### 4. Input Sanitization & Security (XSS Prevention)
User-supplied titles and descriptions are sanitized through an `escapeHTML` function before rendering into HTML templates:
```javascript
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

### 5. Date Arithmetic & Overdue Logic
Compares ISO string components (`YYYY-MM-DD`) against current calendar dates to determine whether incomplete coursework is past due:
```javascript
function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const todayStr = getTodayDateString();
  return task.dueDate < todayStr;
}
```

---

## 9. Deployment Instructions for Vercel

Since this project consists of static files (`index.html`, `style.css`, `script.js`), it can be deployed to [Vercel](https://vercel.com/) in seconds for free:

### Method A: Deploy via GitHub & Vercel Dashboard (Recommended)
1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Student Task Manager"
   git branch -M main
   git remote add origin https://github.com/your-username/student-task-manager.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com/) with your GitHub account.
3. Click **"Add New..."** $\rightarrow$ **"Project"**.
4. Import your `student-task-manager` repository.
5. In the configuration screen:
   * **Framework Preset**: Select **Other** (or leave default).
   * **Root Directory**: `./`
   * **Build and Output Settings**: Leave empty (no build step needed).
6. Click **"Deploy"**.
7. Vercel will provide a live URL (e.g., `https://student-task-manager-xyz.vercel.app`). Any future `git push` to `main` will automatically trigger a live update!

---

### Method B: Deploy via Vercel CLI
1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. In your project terminal directory, run:
   ```bash
   vercel
   ```
3. Follow the interactive prompts:
   * Set up and deploy? **Yes**
   * Which scope? **Your Account**
   * Link to existing project? **No**
   * What’s your project’s name? **student-task-manager**
   * In which directory is your code located? `./`
4. For production deployment, run:
   ```bash
   vercel --prod
   ```

---

## 10. Lecturer Demonstration Guide

Use this concise walkthrough when presenting your coursework project to a lecturer or examiner:

```text
[Step 1: Introduction] (30 seconds)
  "Good morning. This is my Student Task Manager web application. It is a client-side
   academic productivity dashboard built with pure HTML5, CSS3, and JavaScript,
   using localStorage for persistent offline data management."

[Step 2: Dashboard Overview & Theme] (45 seconds)
  1. Point out the dynamic greeting and date header.
  2. Explain the 4 metric cards: Total, Pending, Completed, and High-Priority tasks.
  3. Highlight the Academic Progress Bar and dynamic completion percentage.
  4. Toggle between Light Mode and Dark Mode in the bottom-left sidebar.

[Step 3: Validation & Task Creation] (1 minute)
  1. Click "+ Add New Task".
  2. Click "Save Task" with an empty title to demonstrate validation ("Task title is required.").
  3. Fill in:
     - Title: "CS450: Machine Learning Assignment 3"
     - Description: "Implement decision trees and write evaluation report."
     - Due Date: (Pick a date 3 days ahead)
     - Priority: High
  4. Submit and observe the success toast, incremented stats, and immediate card rendering.

[Step 4: Completion Tracking] (45 seconds)
  1. Click the circular checkbox on the newly created card.
  2. Note the visual strikethrough, checkmark icon, and green badge.
  3. Point to the progress bar animating forward and metric counters updating instantly.

[Step 5: Editing & Confirmation Deletion] (45 seconds)
  1. Click the edit pencil icon on a card. Change priority from Medium to High.
  2. Click "Update Task" and verify that it updates in-place without creating duplicates.
  3. Click the delete trash icon on any card to showcase the custom confirmation modal.
  4. Confirm deletion and point out updated dashboard totals.

[Step 6: Searching & Filter Combination] (1 minute)
  1. Type "CS" into the search bar to demonstrate real-time, case-insensitive filtering.
  2. Combine search with the "High Priority" filter.
  3. Show the active filter tags and click "Reset" to restore all tasks.
  4. Point to the "⚠️ Overdue" badge on past-due items and click "Overdue" in the sidebar.

[Step 7: Data Persistence Verification] (30 seconds)
  1. Refresh the browser page (F5 / Cmd+R).
  2. Show that all created, edited, and toggled tasks remain preserved.
  3. Open DevTools (F12 -> Application -> Local Storage) to display the serialized JSON.
```

---

## 11. Future Improvements

The current version fulfills all requirements for a standalone client-side web application. Potential enhancements for future iterations include:

1. **Data Export & Import**:
   * Add functionality to download task data as a `.json` or `.csv` backup file, allowing students to migrate tasks between devices.
2. **Custom Coursework Tags / Subject Categories**:
   * Allow students to tag tasks by academic subject (e.g., `#Mathematics`, `#Biology`, `#ComputerScience`) with color-coded custom chips.
3. **Calendar View Integration**:
   * Supplement the card grid with a monthly/weekly calendar grid displaying tasks mapped to their deadline dates.
4. **Pomodoro Study Timer**:
   * Embed a 25-minute Pomodoro focus timer linked directly to an active task card.
5. **Browser Notification API**:
   * Request browser notification permissions to send deadline reminder alerts 24 hours prior to due dates.
6. **Drag-and-Drop Kanban Board**:
   * Provide an alternative view mode with draggable columns (*To Do*, *In Progress*, *Completed*).

---

## 12. License

This project is licensed under the **MIT License**. It is open-source and free to use, modify, and distribute for academic and personal learning purposes.

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```
