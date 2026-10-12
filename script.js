/**
 * ============================================================================
 * STUDENT TASK MANAGER - APPLICATION LOGIC
 * ============================================================================
 * 
 * Technology: Vanilla JavaScript (ES6+)
 * Storage: HTML5 localStorage
 * Features:
 *  - Full CRUD: Add, View, Edit, Delete tasks
 *  - Toggle completion status with instant dynamic progress bar
 *  - Multi-criteria filtering (Status: All/Pending/Completed, Priority: High/Medium/Low, Overdue)
 *  - Real-time case-insensitive search by task title
 *  - Automatic overdue detection based on calendar dates
 *  - Dynamic dashboard statistics calculation
 *  - Light / Dark mode theme toggle with preference persistence
 *  - Responsive mobile drawer navigation
 *  - Accessible custom modal dialogs & toast notifications
 *  - Safe DOM rendering to prevent XSS
 */

// Strict mode for cleaner code and catching common mistakes
'use strict';

/* --------------------------------------------------------------------------
   1. State Management & Storage Keys
   -------------------------------------------------------------------------- */
const STORAGE_KEY = 'student_task_manager_data_v1';
const THEME_STORAGE_KEY = 'student_task_manager_theme_v1';

// Global application state
let tasks = [];
let currentFilters = {
  status: 'all',      // 'all' | 'pending' | 'completed' | 'overdue'
  priority: 'all',    // 'all' | 'High' | 'Medium' | 'Low'
  searchQuery: '',    // string
  sortBy: 'dueDateAsc'// 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'newest' | 'oldest'
};

// ID of task currently selected for deletion
let pendingDeleteTaskId = null;

/* --------------------------------------------------------------------------
   2. DOM Element Selectors
   -------------------------------------------------------------------------- */
const elements = {
  // Main Layout & Header
  appLayout: document.getElementById('appLayout'),
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  menuToggleBtn: document.getElementById('menuToggleBtn'),
  mobileCloseBtn: document.getElementById('mobileCloseBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeLabel: document.getElementById('themeLabel'),
  welcomeGreeting: document.getElementById('welcomeGreeting'),

  // Header Actions
  openAddTaskBtn: document.getElementById('openAddTaskBtn'),

  // Dashboard Statistics Cards
  statTotalTasks: document.getElementById('statTotalTasks'),
  statPendingTasks: document.getElementById('statPendingTasks'),
  statCompletedTasks: document.getElementById('statCompletedTasks'),
  statHighPriority: document.getElementById('statHighPriority'),

  // Sidebar Badges
  navBadgeTotal: document.getElementById('navBadgeTotal'),
  navBadgePending: document.getElementById('navBadgePending'),
  navBadgeCompleted: document.getElementById('navBadgeCompleted'),
  navBadgeHigh: document.getElementById('navBadgeHigh'),
  navBadgeOverdue: document.getElementById('navBadgeOverdue'),
  navLinks: document.querySelectorAll('.sidebar-nav .nav-link'),

  // Progress Section
  progressPercent: document.getElementById('progressPercent'),
  progressBarFill: document.getElementById('progressBarFill'),
  progressSubtitle: document.getElementById('progressSubtitle'),
  progressBarContainer: document.getElementById('progressBarContainer'),

  // Search & Filter Controls
  searchInput: document.getElementById('searchInput'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  statusFilter: document.getElementById('statusFilter'),
  priorityFilter: document.getElementById('priorityFilter'),
  sortBy: document.getElementById('sortBy'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  resultsCount: document.getElementById('resultsCount'),
  visibleCount: document.getElementById('visibleCount'),
  totalCountDisplay: document.getElementById('totalCountDisplay'),
  activeFilterTags: document.getElementById('activeFilterTags'),

  // Task Grid & Empty State
  taskList: document.getElementById('taskList'),
  emptyState: document.getElementById('emptyState'),
  emptyStateTitle: document.getElementById('emptyStateTitle'),
  emptyStateText: document.getElementById('emptyStateText'),
  emptyStateAddBtn: document.getElementById('emptyStateAddBtn'),
  emptyStateResetBtn: document.getElementById('emptyStateResetBtn'),

  // Task Add/Edit Modal
  taskModalBackdrop: document.getElementById('taskModalBackdrop'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalCancelBtn: document.getElementById('modalCancelBtn'),
  taskForm: document.getElementById('taskForm'),
  modalTitle: document.getElementById('modalTitle'),
  modalSubtitle: document.getElementById('modalSubtitle'),
  modalSubmitText: document.getElementById('modalSubmitText'),
  editTaskId: document.getElementById('editTaskId'),
  taskTitle: document.getElementById('taskTitle'),
  taskDescription: document.getElementById('taskDescription'),
  taskDueDate: document.getElementById('taskDueDate'),
  titleError: document.getElementById('titleError'),

  // Delete Confirmation Modal
  deleteModalBackdrop: document.getElementById('deleteModalBackdrop'),
  deleteTaskTitleDisplay: document.getElementById('deleteTaskTitleDisplay'),
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer')
};

/* --------------------------------------------------------------------------
   3. Sample Initial Tasks (Seed Data)
   -------------------------------------------------------------------------- */
/**
 * Returns a set of realistic starter tasks for a student to demonstrate
 * all core features (pending, completed, high priority, and overdue).
 */
function getSampleTasks() {
  const today = new Date();
  
  // Format helper: YYYY-MM-DD
  const formatOffsetDate = (offsetDays) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return [
    {
      id: 'task_sample_1',
      title: 'CS301: Algorithms & Data Structures Problem Set 4',
      description: 'Implement Dijkstra shortest-path algorithm and write complexity proof for the graph traversal exercise.',
      dueDate: formatOffsetDate(2), // Due in 2 days (Pending, High Priority)
      priority: 'High',
      completed: false,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'task_sample_2',
      title: 'MATH204: Linear Algebra Assignment - Eigenvalues',
      description: 'Calculate eigenvectors and diagonalize matrices from textbook chapter 5. Submit solutions on course portal.',
      dueDate: formatOffsetDate(-1), // Due yesterday (Overdue!)
      priority: 'High',
      completed: false,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'task_sample_3',
      title: 'Read Biology Chapter 8: Cellular Respiration',
      description: 'Annotate key pathways (Glycolysis, Krebs Cycle) and prepare flashcards for the upcoming mid-term exam.',
      dueDate: formatOffsetDate(5), // Due in 5 days
      priority: 'Medium',
      completed: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'task_sample_4',
      title: 'Submit English Essay First Draft',
      description: '1,500-word essay discussing themes of isolation and individualism in 20th century American literature.',
      dueDate: formatOffsetDate(-3),
      priority: 'Low',
      completed: true, // Completed
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: 'task_sample_5',
      title: 'Physics Lab Report: Pendulum Harmonic Motion',
      description: 'Analyze experimental timing data, calculate error margins, and generate graph plots in spreadsheet.',
      dueDate: formatOffsetDate(1), // Tomorrow
      priority: 'Medium',
      completed: true, // Completed
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ];
}

/* --------------------------------------------------------------------------
   4. LocalStorage Functions
   -------------------------------------------------------------------------- */

/**
 * Loads tasks from localStorage. If no tasks exist or data is corrupted,
 * initializes with realistic sample starter tasks.
 */
function loadTasks() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // First visit: initialize with starter student tasks
      tasks = getSampleTasks();
      saveTasks();
    } else {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        tasks = parsed;
      } else {
        console.warn('Invalid data format in localStorage. Resetting to defaults.');
        tasks = getSampleTasks();
        saveTasks();
      }
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    tasks = getSampleTasks();
  }
}

/**
 * Saves current task array to localStorage.
 */
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
    showToast('Failed to save changes to local storage.', 'danger');
  }
}

/* --------------------------------------------------------------------------
   5. Helper Utilities
   -------------------------------------------------------------------------- */

/**
 * Generates a collision-resistant unique ID for tasks.
 */
function generateTaskId() {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Escapes unsafe HTML characters to prevent XSS vulnerabilities
 * when rendering user-submitted text.
 * @param {string} str - Raw input text
 * @returns {string} - Escaped string safe for DOM insertion
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Checks whether an incomplete task's due date has passed today's date.
 * @param {Object} task - The task object
 * @returns {boolean} - True if task is overdue
 */
function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;

  // Compare date strings directly (YYYY-MM-DD)
  const todayStr = getTodayDateString();
  return task.dueDate < todayStr;
}

/**
 * Checks if a task is due today.
 * @param {Object} task
 * @returns {boolean}
 */
function isDueToday(task) {
  if (!task.dueDate || task.completed) return false;
  return task.dueDate === getTodayDateString();
}

/**
 * Returns today's date formatted as YYYY-MM-DD.
 */
function getTodayDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Formats a YYYY-MM-DD date string into human-friendly text.
 * e.g., "Oct 14, 2026", "Today", or "Tomorrow"
 * @param {string} dateStr
 * @returns {string}
 */
function formatDateDisplay(dateStr) {
  if (!dateStr) return 'No due date';

  const todayStr = getTodayDateString();
  
  // Quick checks for Today and Tomorrow
  if (dateStr === todayStr) {
    return 'Due Today';
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  
  if (dateStr === tomorrowStr) {
    return 'Due Tomorrow';
  }

  // Parse date components safely to avoid timezone offset shifts
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, monthIndex, day);

    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return dateStr;
}

/**
 * Formats task creation timestamp into human-readable relative/short date.
 * @param {string} isoString
 * @returns {string}
 */
function formatCreatedTime(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return `Created ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  } catch {
    return '';
  }
}

/* --------------------------------------------------------------------------
   6. Task CRUD Operations
   -------------------------------------------------------------------------- */

/**
 * Handles the task creation / editing form submission.
 * @param {Event} event
 */
function handleTaskFormSubmit(event) {
  event.preventDefault();

  const titleVal = elements.taskTitle.value.trim();
  const descVal = elements.taskDescription.value.trim();
  const dueDateVal = elements.taskDueDate.value;
  const priorityRadio = document.querySelector('input[name="taskPriority"]:checked');
  const priorityVal = priorityRadio ? priorityRadio.value : 'Medium';
  const editId = elements.editTaskId.value;

  // Form Validation: Title is mandatory
  if (!titleVal) {
    elements.taskTitle.classList.add('is-invalid');
    elements.titleError.style.display = 'block';
    elements.taskTitle.focus();
    return;
  } else {
    elements.taskTitle.classList.remove('is-invalid');
    elements.titleError.style.display = 'none';
  }

  if (editId) {
    // Updating existing task
    updateTask(editId, {
      title: titleVal,
      description: descVal,
      dueDate: dueDateVal,
      priority: priorityVal
    });
  } else {
    // Creating brand new task
    const newTask = {
      id: generateTaskId(),
      title: titleVal,
      description: descVal,
      dueDate: dueDateVal,
      priority: priorityVal,
      completed: false, // Default to pending
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask); // Add to beginning of array
    saveTasks();
    showToast('Task created successfully!', 'success');
  }

  closeTaskModal();
  updateStatistics();
  renderTasks();
}

/**
 * Populates and opens the task modal for editing an existing task.
 * @param {string} taskId
 */
function editTask(taskId) {
  const taskToEdit = tasks.find(t => t.id === taskId);
  if (!taskToEdit) {
    showToast('Task not found.', 'danger');
    return;
  }

  // Populate form fields
  elements.editTaskId.value = taskToEdit.id;
  elements.taskTitle.value = taskToEdit.title;
  elements.taskDescription.value = taskToEdit.description || '';
  elements.taskDueDate.value = taskToEdit.dueDate || '';

  // Select appropriate priority radio
  const radio = document.querySelector(`input[name="taskPriority"][value="${taskToEdit.priority}"]`);
  if (radio) {
    radio.checked = true;
  }

  // Update modal header UI for editing mode
  elements.modalTitle.textContent = 'Edit Task';
  elements.modalSubtitle.textContent = 'Modify your assignment details below.';
  elements.modalSubmitText.textContent = 'Update Task';

  // Clear any existing validation errors
  elements.taskTitle.classList.remove('is-invalid');
  elements.titleError.style.display = 'none';

  // Open modal
  openTaskModal();
}

/**
 * Updates an existing task with new data.
 * @param {string} taskId
 * @param {Object} updatedData
 */
function updateTask(taskId, updatedData) {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: updatedData.title,
    description: updatedData.description,
    dueDate: updatedData.dueDate,
    priority: updatedData.priority
  };

  saveTasks();
  showToast('Task updated successfully!', 'info');
}

/**
 * Prompts user for deletion confirmation via styled modal.
 * @param {string} taskId
 */
function promptDeleteTask(taskId) {
  const taskToDelete = tasks.find(t => t.id === taskId);
  if (!taskToDelete) return;

  pendingDeleteTaskId = taskId;
  elements.deleteTaskTitleDisplay.textContent = `"${taskToDelete.title}"`;
  
  // Show confirmation modal
  elements.deleteModalBackdrop.classList.add('active');
  elements.deleteModalBackdrop.setAttribute('aria-hidden', 'false');
  elements.confirmDeleteBtn.focus();
}

/**
 * Permanently removes the selected task from the application.
 */
function confirmDeleteTask() {
  if (!pendingDeleteTaskId) return;

  const taskTitle = tasks.find(t => t.id === pendingDeleteTaskId)?.title || 'Task';
  tasks = tasks.filter(t => t.id !== pendingDeleteTaskId);
  saveTasks();

  closeDeleteModal();
  updateStatistics();
  renderTasks();
  showToast(`Deleted ${taskTitle}`, 'danger');
}

/**
 * Toggles a task's completion status between pending and completed.
 * @param {string} taskId
 */
function toggleTaskStatus(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();

  const msg = task.completed
    ? 'Great job! Task marked as completed. 🎉'
    : 'Task moved back to pending.';
  showToast(msg, task.completed ? 'success' : 'info');

  updateStatistics();
  renderTasks();
}

/* --------------------------------------------------------------------------
   7. Filtering, Searching & Sorting Logic
   -------------------------------------------------------------------------- */

/**
 * Filters tasks based on status, priority, overdue state, and search query.
 * @returns {Array} Filtered list of task objects
 */
function filterTasks() {
  return tasks.filter(task => {
    // 1. Status Filter
    if (currentFilters.status === 'pending' && task.completed) return false;
    if (currentFilters.status === 'completed' && !task.completed) return false;
    if (currentFilters.status === 'overdue' && !isOverdue(task)) return false;

    // 2. Priority Filter
    if (currentFilters.priority !== 'all' && task.priority !== currentFilters.priority) {
      return false;
    }

    // 3. Search Filter (Case-insensitive match against title or description)
    if (currentFilters.searchQuery) {
      const q = currentFilters.searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(q);
      const descMatch = (task.description || '').toLowerCase().includes(q);
      if (!titleMatch && !descMatch) return false;
    }

    return true;
  });
}

/**
 * Sorts an array of task objects according to current sort choice.
 * @param {Array} taskList
 * @returns {Array}
 */
function sortTasks(taskList) {
  const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };

  return [...taskList].sort((a, b) => {
    switch (currentFilters.sortBy) {
      case 'dueDateAsc':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);

      case 'dueDateDesc':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return b.dueDate.localeCompare(a.dueDate);

      case 'priority':
        return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);

      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      default:
        return 0;
    }
  });
}

/**
 * Updates UI chips and counts reflecting current active filters.
 * @param {number} visibleCount
 * @param {number} totalCount
 */
function updateActiveFilterUI(visibleCount, totalCount) {
  elements.visibleCount.textContent = visibleCount;
  elements.totalCountDisplay.textContent = totalCount;

  // Render tag pills
  elements.activeFilterTags.innerHTML = '';
  
  if (currentFilters.status !== 'all') {
    createFilterTag(`Status: ${capitalize(currentFilters.status)}`, () => {
      currentFilters.status = 'all';
      elements.statusFilter.value = 'all';
      syncSidebarNavActive();
      renderTasks();
    });
  }

  if (currentFilters.priority !== 'all') {
    createFilterTag(`Priority: ${currentFilters.priority}`, () => {
      currentFilters.priority = 'all';
      elements.priorityFilter.value = 'all';
      syncSidebarNavActive();
      renderTasks();
    });
  }

  if (currentFilters.searchQuery) {
    createFilterTag(`Search: "${currentFilters.searchQuery}"`, () => {
      currentFilters.searchQuery = '';
      elements.searchInput.value = '';
      elements.searchClearBtn.style.display = 'none';
      renderTasks();
    });
  }
}

/**
 * Creates an active filter tag pill with an 'x' remove button.
 */
function createFilterTag(label, onRemove) {
  const tag = document.createElement('span');
  tag.className = 'filter-tag';
  tag.innerHTML = `
    ${escapeHTML(label)}
    <span class="filter-tag-remove" role="button" aria-label="Remove filter">&times;</span>
  `;
  tag.querySelector('.filter-tag-remove').addEventListener('click', onRemove);
  elements.activeFilterTags.appendChild(tag);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* --------------------------------------------------------------------------
   8. Rendering Engine
   -------------------------------------------------------------------------- */

/**
 * Renders all task cards in the grid according to active filters and sorting.
 */
function renderTasks() {
  const filtered = filterTasks();
  const sorted = sortTasks(filtered);

  // Update counts
  updateActiveFilterUI(sorted.length, tasks.length);

  // Handle empty state
  if (sorted.length === 0) {
    elements.taskList.innerHTML = '';
    elements.emptyState.style.display = 'block';

    if (tasks.length === 0) {
      elements.emptyStateTitle.textContent = 'No tasks yet!';
      elements.emptyStateText.textContent = 'Your schedule is clear. Click below to add your first coursework assignment or exam goal.';
      elements.emptyStateAddBtn.style.display = 'inline-flex';
      elements.emptyStateResetBtn.style.display = 'none';
    } else {
      elements.emptyStateTitle.textContent = 'No matching tasks found';
      elements.emptyStateText.textContent = 'Try adjusting your search query, status filters, or priority options to see more tasks.';
      elements.emptyStateAddBtn.style.display = 'none';
      elements.emptyStateResetBtn.style.display = 'inline-flex';
    }
    return;
  }

  elements.emptyState.style.display = 'none';

  // Build task cards safely
  const fragment = document.createDocumentFragment();

  sorted.forEach(task => {
    const card = document.createElement('article');
    const overdueFlag = isOverdue(task);
    const dueTodayFlag = isDueToday(task);

    card.className = `task-card ${task.completed ? 'is-completed' : ''} ${overdueFlag ? 'is-overdue' : ''}`;
    card.setAttribute('data-task-id', task.id);

    // Badges HTML logic
    let dueDateBadgeClass = 'badge-due-date';
    let dueDateLabel = formatDateDisplay(task.dueDate);

    if (overdueFlag) {
      dueDateBadgeClass += ' is-overdue-badge';
      dueDateLabel = `⚠️ Overdue (${formatDateDisplay(task.dueDate)})`;
    } else if (dueTodayFlag) {
      dueDateBadgeClass += ' badge-due-today';
      dueDateLabel = '🔥 Due Today';
    }

    const priorityBadgeClass = `badge-priority-${task.priority.toLowerCase()}`;
    const priorityDotClass = `dot-${task.priority.toLowerCase()}`;

    // Construct Card HTML with safe escaping for user strings
    card.innerHTML = `
      <div class="task-card-header">
        <button 
          class="task-checkbox-btn ${task.completed ? 'checked' : ''}" 
          type="button"
          aria-label="${task.completed ? 'Mark task as pending' : 'Mark task as completed'}"
          title="${task.completed ? 'Mark as pending' : 'Mark as completed'}"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>

        <div class="task-content">
          <h3 class="task-title">${escapeHTML(task.title)}</h3>
          ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ''}
        </div>
      </div>

      <div class="task-badges-row">
        <!-- Priority Badge -->
        <span class="badge ${priorityBadgeClass}">
          <span class="priority-dot ${priorityDotClass}"></span>
          ${escapeHTML(task.priority)} Priority
        </span>

        <!-- Due Date Badge -->
        ${task.dueDate ? `
          <span class="badge ${dueDateBadgeClass}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${escapeHTML(dueDateLabel)}
          </span>
        ` : ''}

        <!-- Status Badge -->
        <span class="badge badge-status ${task.completed ? 'status-completed' : ''}">
          ${task.completed ? 'Completed' : 'Pending'}
        </span>
      </div>

      <div class="task-card-footer">
        <span class="task-created-time">${formatCreatedTime(task.createdAt)}</span>
        
        <div class="task-actions">
          <button class="action-btn edit-btn" type="button" aria-label="Edit task '${escapeHTML(task.title)}'" title="Edit Task">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          
          <button class="action-btn delete-btn" type="button" aria-label="Delete task '${escapeHTML(task.title)}'" title="Delete Task">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Attach event listeners directly to interactive buttons inside the card
    card.querySelector('.task-checkbox-btn').addEventListener('click', () => {
      toggleTaskStatus(task.id);
    });

    card.querySelector('.edit-btn').addEventListener('click', () => {
      editTask(task.id);
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
      promptDeleteTask(task.id);
    });

    fragment.appendChild(card);
  });

  elements.taskList.innerHTML = '';
  elements.taskList.appendChild(fragment);
}

/* --------------------------------------------------------------------------
   9. Statistics & Progress Calculation
   -------------------------------------------------------------------------- */

/**
 * Calculates task counts across all categories and updates summary cards.
 */
function updateStatistics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(t => t.priority === 'High' && !t.completed).length;
  const overdueCount = tasks.filter(t => isOverdue(t)).length;

  // Update Summary Cards
  elements.statTotalTasks.textContent = total;
  elements.statPendingTasks.textContent = pending;
  elements.statCompletedTasks.textContent = completed;
  elements.statHighPriority.textContent = highPriority;

  // Update Sidebar Navigation Badges
  elements.navBadgeTotal.textContent = total;
  elements.navBadgePending.textContent = pending;
  elements.navBadgeCompleted.textContent = completed;
  elements.navBadgeHigh.textContent = highPriority;
  elements.navBadgeOverdue.textContent = overdueCount;

  // Calculate and update overall completion percentage
  calculateProgress(total, completed);
}

/**
 * Calculates completion percentage and updates animated progress bar.
 * @param {number} total
 * @param {number} completed
 */
function calculateProgress(total, completed) {
  let percent = 0;
  if (total > 0) {
    percent = Math.round((completed / total) * 100);
  }

  // Update UI Elements
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressBarFill.style.width = `${percent}%`;
  elements.progressBarContainer.setAttribute('aria-valuenow', percent);

  // Dynamic encouraging subtitle based on completion percentage
  if (total === 0) {
    elements.progressSubtitle.textContent = 'Add your first task to start tracking your academic progress!';
  } else if (percent === 100) {
    elements.progressSubtitle.textContent = '🎉 Incredible work! All your coursework tasks are complete!';
  } else if (percent >= 75) {
    elements.progressSubtitle.textContent = '🚀 Almost at the finish line! Only a few tasks remaining.';
  } else if (percent >= 50) {
    elements.progressSubtitle.textContent = '⚡ Halfway there! Keep up the great study momentum.';
  } else if (percent > 0) {
    elements.progressSubtitle.textContent = '📚 Good start! Stay focused on your upcoming deadlines.';
  } else {
    elements.progressSubtitle.textContent = '🎯 Get started by checking off your first task today.';
  }
}

/* --------------------------------------------------------------------------
   10. Modal Dialog Handlers
   -------------------------------------------------------------------------- */

/**
 * Opens the task creation/editing modal.
 */
function openTaskModal() {
  elements.taskModalBackdrop.classList.add('active');
  elements.taskModalBackdrop.setAttribute('aria-hidden', 'false');
  // Set default due date to tomorrow if empty
  if (!elements.taskDueDate.value) {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    const tmrwStr = `${tmrw.getFullYear()}-${String(tmrw.getMonth() + 1).padStart(2, '0')}-${String(tmrw.getDate()).padStart(2, '0')}`;
    elements.taskDueDate.value = tmrwStr;
  }
  elements.taskTitle.focus();
}

/**
 * Closes and resets the task creation/editing modal.
 */
function closeTaskModal() {
  elements.taskModalBackdrop.classList.remove('active');
  elements.taskModalBackdrop.setAttribute('aria-hidden', 'true');
  resetForm();
}

/**
 * Resets task form inputs and errors back to default creation state.
 */
function resetForm() {
  elements.taskForm.reset();
  elements.editTaskId.value = '';
  elements.modalTitle.textContent = 'Add New Task';
  elements.modalSubtitle.textContent = 'Fill in the details for your assignment or coursework.';
  elements.modalSubmitText.textContent = 'Save Task';
  elements.taskTitle.classList.remove('is-invalid');
  elements.titleError.style.display = 'none';

  // Reset priority radio to Medium
  const defaultRadio = document.getElementById('priorityMedium');
  if (defaultRadio) defaultRadio.checked = true;
}

/**
 * Closes the delete confirmation modal.
 */
function closeDeleteModal() {
  elements.deleteModalBackdrop.classList.remove('active');
  elements.deleteModalBackdrop.setAttribute('aria-hidden', 'true');
  pendingDeleteTaskId = null;
}

/* --------------------------------------------------------------------------
   11. Toast Notification System
   -------------------------------------------------------------------------- */

/**
 * Displays a toast notification in the bottom right corner.
 * @param {string} message - Message text
 * @param {string} type - 'success' | 'info' | 'danger'
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  } else if (type === 'danger') {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;
  } else {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;
  }

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-message">${escapeHTML(message)}</span>
  `;

  elements.toastContainer.appendChild(toast);

  // Auto-dismiss after 3.2 seconds
  setTimeout(() => {
    toast.classList.add('toast-hiding');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 3200);
}

/* --------------------------------------------------------------------------
   12. Theme Management (Light / Dark Mode)
   -------------------------------------------------------------------------- */

/**
 * Initializes and applies the theme from localStorage or system preference.
 */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
}

/**
 * Toggles between light and dark theme.
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
}

/**
 * Applies the specified theme and saves to localStorage.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (theme === 'dark') {
    elements.themeLabel.textContent = 'Dark Mode';
  } else {
    elements.themeLabel.textContent = 'Light Mode';
  }
}

/* --------------------------------------------------------------------------
   13. Navigation & Sidebar Active State Sync
   -------------------------------------------------------------------------- */

/**
 * Synchronizes the active highlight in the sidebar navigation links.
 */
function syncSidebarNavActive() {
  elements.navLinks.forEach(btn => {
    const filterType = btn.getAttribute('data-filter-type');
    const filterValue = btn.getAttribute('data-filter-value');

    let isActive = false;
    if (filterType === 'status') {
      isActive = currentFilters.status === filterValue && currentFilters.priority === 'all';
    } else if (filterType === 'priority') {
      isActive = currentFilters.priority === filterValue;
    } else if (filterType === 'special' && filterValue === 'overdue') {
      isActive = currentFilters.status === 'overdue';
    }

    if (isActive) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * Sets welcome greeting with current day and date.
 */
function initWelcomeGreeting() {
  const now = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('en-US', options);
  elements.welcomeGreeting.textContent = `Happy ${formattedDate}! Track your coursework and keep study goals on schedule.`;
}

/* --------------------------------------------------------------------------
   14. Event Listeners Setup
   -------------------------------------------------------------------------- */
function setupEventListeners() {
  // 1. Task Modal Triggers
  elements.openAddTaskBtn.addEventListener('click', () => {
    resetForm();
    openTaskModal();
  });
  elements.emptyStateAddBtn.addEventListener('click', () => {
    resetForm();
    openTaskModal();
  });
  elements.modalCloseBtn.addEventListener('click', closeTaskModal);
  elements.modalCancelBtn.addEventListener('click', closeTaskModal);

  // Close modal when clicking backdrop outside container
  elements.taskModalBackdrop.addEventListener('click', (e) => {
    if (e.target === elements.taskModalBackdrop) {
      closeTaskModal();
    }
  });

  // 2. Task Form Submission
  elements.taskForm.addEventListener('submit', handleTaskFormSubmit);

  // Clear title validation error upon typing
  elements.taskTitle.addEventListener('input', () => {
    if (elements.taskTitle.value.trim()) {
      elements.taskTitle.classList.remove('is-invalid');
      elements.titleError.style.display = 'none';
    }
  });

  // 3. Delete Confirmation Modal
  elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  elements.confirmDeleteBtn.addEventListener('click', confirmDeleteTask);
  elements.deleteModalBackdrop.addEventListener('click', (e) => {
    if (e.target === elements.deleteModalBackdrop) {
      closeDeleteModal();
    }
  });

  // 4. Search Bar
  elements.searchInput.addEventListener('input', (e) => {
    currentFilters.searchQuery = e.target.value.trim();
    if (currentFilters.searchQuery) {
      elements.searchClearBtn.style.display = 'flex';
    } else {
      elements.searchClearBtn.style.display = 'none';
    }
    renderTasks();
  });

  elements.searchClearBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    currentFilters.searchQuery = '';
    elements.searchClearBtn.style.display = 'none';
    elements.searchInput.focus();
    renderTasks();
  });

  // 5. Filter Dropdowns
  elements.statusFilter.addEventListener('change', (e) => {
    currentFilters.status = e.target.value;
    syncSidebarNavActive();
    renderTasks();
  });

  elements.priorityFilter.addEventListener('change', (e) => {
    currentFilters.priority = e.target.value;
    syncSidebarNavActive();
    renderTasks();
  });

  elements.sortBy.addEventListener('change', (e) => {
    currentFilters.sortBy = e.target.value;
    renderTasks();
  });

  // 6. Reset Filters
  const resetAllFilters = () => {
    currentFilters.status = 'all';
    currentFilters.priority = 'all';
    currentFilters.searchQuery = '';
    currentFilters.sortBy = 'dueDateAsc';

    elements.statusFilter.value = 'all';
    elements.priorityFilter.value = 'all';
    elements.sortBy.value = 'dueDateAsc';
    elements.searchInput.value = '';
    elements.searchClearBtn.style.display = 'none';

    syncSidebarNavActive();
    renderTasks();
  };

  elements.resetFiltersBtn.addEventListener('click', resetAllFilters);
  elements.emptyStateResetBtn.addEventListener('click', resetAllFilters);

  // 7. Sidebar Navigation Links Click
  elements.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const type = link.getAttribute('data-filter-type');
      const val = link.getAttribute('data-filter-value');

      if (type === 'status') {
        currentFilters.status = val;
        currentFilters.priority = 'all';
        elements.statusFilter.value = val;
        elements.priorityFilter.value = 'all';
      } else if (type === 'priority') {
        currentFilters.status = 'all';
        currentFilters.priority = val;
        elements.statusFilter.value = 'all';
        elements.priorityFilter.value = val;
      } else if (type === 'special' && val === 'overdue') {
        currentFilters.status = 'overdue';
        currentFilters.priority = 'all';
        elements.statusFilter.value = 'all';
        elements.priorityFilter.value = 'all';
      }

      syncSidebarNavActive();
      renderTasks();

      // Auto close mobile drawer if open
      closeMobileSidebar();
    });
  });

  // 8. Mobile Sidebar Navigation Drawer
  const openMobileSidebar = () => {
    elements.sidebar.classList.add('mobile-open');
    elements.sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileSidebar = () => {
    elements.sidebar.classList.remove('mobile-open');
    elements.sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  elements.menuToggleBtn.addEventListener('click', openMobileSidebar);
  elements.mobileCloseBtn.addEventListener('click', closeMobileSidebar);
  elements.sidebarOverlay.addEventListener('click', closeMobileSidebar);

  // 9. Theme Toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // 10. Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // ESC key closes any open modal
    if (e.key === 'Escape') {
      if (elements.taskModalBackdrop.classList.contains('active')) {
        closeTaskModal();
      }
      if (elements.deleteModalBackdrop.classList.contains('active')) {
        closeDeleteModal();
      }
    }
  });
}

/* --------------------------------------------------------------------------
   15. Application Bootstrapper
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme
  initTheme();

  // 2. Setup dynamic welcome greeting
  initWelcomeGreeting();

  // 3. Load tasks from localStorage (or populate sample seed data)
  loadTasks();

  // 4. Attach event listeners
  setupEventListeners();

  // 5. Initial stats calculation and render
  updateStatistics();
  renderTasks();

  console.log('Student Task Manager initialized successfully.');
});
