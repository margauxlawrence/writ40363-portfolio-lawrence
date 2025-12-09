// ui.js - UI Management Module
// Project 2 Upskilled: Complex DOM manipulation and event delegation

/**
 * UI Module
 * Handles all user interface updates and DOM manipulation
 */

const UI = {
    
    /**
     * Initialize UI elements and cache DOM references
     */
    elements: {
        assignmentsList: null,
        statsCards: {},
        filterStatus: null,
        filterCourse: null,
        sortBy: null,
        toast: null,
        modal: null,
        editForm: null
    },

    /**
     * Initialize UI
     */
    init() {
        // Cache DOM elements
        this.elements.assignmentsList = document.getElementById('assignmentsList');
        this.elements.statsCards = {
            total: document.getElementById('totalCount'),
            pending: document.getElementById('pendingCount'),
            completed: document.getElementById('completedCount'),
            overdue: document.getElementById('overdueCount')
        };
        this.elements.filterStatus = document.getElementById('filterStatus');
        this.elements.filterCourse = document.getElementById('filterCourse');
        this.elements.sortBy = document.getElementById('sortBy');
        this.elements.toast = document.getElementById('toast');
        this.elements.modal = document.getElementById('editModal');
        this.elements.editForm = document.getElementById('editForm');
    },

    /**
     * Render all assignments
     * @param {Array} assignments - Assignments to render
     */
    renderAssignments(assignments) {
        const container = this.elements.assignmentsList;
        
        if (!assignments || assignments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No assignments yet</h3>
                    <p>Upload a syllabus or add an assignment manually to get started</p>
                </div>
            `;
            return;
        }

        // Clear container
        container.innerHTML = '';

        // Render each assignment
        assignments.forEach(assignment => {
            const card = this.createAssignmentCard(assignment);
            container.appendChild(card);
        });
    },

    /**
     * Create assignment card element
     * @param {Object} assignment - Assignment object
     * @returns {HTMLElement} Assignment card element
     */
    createAssignmentCard(assignment) {
        const card = document.createElement('div');
        card.className = 'assignment-card';
        card.dataset.id = assignment.id;
        
        // Add status classes
        if (assignment.completed) {
            card.classList.add('completed');
        }
        
        const isOverdue = Storage.isOverdue(assignment);
        if (isOverdue && !assignment.completed) {
            card.classList.add('overdue');
        }
        
        card.classList.add(`priority-${assignment.priority}`);
        
        // Add course color
        const courseColor = this.getCourseColor(assignment.course);
        card.style.borderLeftColor = courseColor;

        // Format due date
        const dueDate = new Date(assignment.dueDate);
        const formattedDate = this.formatDate(dueDate);
        const daysUntil = this.getDaysUntil(dueDate);
        
        // Create card HTML
        card.innerHTML = `
            <div class="assignment-header">
                <h3 class="assignment-title">${this.escapeHtml(assignment.name)}</h3>
                <div class="assignment-actions">
                    <button class="icon-btn" onclick="app.toggleComplete('${assignment.id}')" 
                            aria-label="${assignment.completed ? 'Mark as incomplete' : 'Mark as complete'}" 
                            title="${assignment.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                        ${assignment.completed ? '↩️' : '✅'}
                    </button>
                    <button class="icon-btn" onclick="app.editAssignment('${assignment.id}')" 
                            aria-label="Edit assignment" title="Edit">
                        ✏️
                    </button>
                    <button class="icon-btn" onclick="app.deleteAssignment('${assignment.id}')" 
                            aria-label="Delete assignment" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
            
            <div class="assignment-meta">
                <div class="meta-item course-indicator">
                    <span class="course-color-dot" style="background-color: ${courseColor}"></span>
                    <span>${this.escapeHtml(assignment.course)}</span>
                </div>
                <div class="meta-item">
                    <span>📅</span>
                    <span>${formattedDate}</span>
                    ${daysUntil ? `<span>(${daysUntil})</span>` : ''}
                </div>
                ${assignment.completed ? 
                    '<span class="badge badge-status">Completed</span>' : 
                    (isOverdue ? '<span class="badge badge-overdue">Overdue</span>' : '')
                }
            </div>
            
            ${assignment.notes ? `
                <div class="assignment-notes">
                    <strong>Notes:</strong> ${this.escapeHtml(assignment.notes)}
                </div>
            ` : ''}
        `;

        return card;
    },

    /**
     * Update statistics display
     * @param {Object} stats - Statistics object
     */
    updateStatistics(stats) {
        this.elements.statsCards.total.textContent = stats.total;
        this.elements.statsCards.pending.textContent = stats.pending;
        this.elements.statsCards.completed.textContent = stats.completed;
        this.elements.statsCards.overdue.textContent = stats.overdue;

        // Add animation
        Object.values(this.elements.statsCards).forEach(card => {
            card.style.transform = 'scale(1.1)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        });
    },

    /**
     * Update course filter dropdown
     * @param {Array} courses - Array of course names
     */
    updateCourseFilter(courses) {
        const select = this.elements.filterCourse;
        const currentValue = select.value;
        
        // Keep "All Courses" option
        select.innerHTML = '<option value="all">All Courses</option>';
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            select.appendChild(option);
        });
        
        // Restore selection if still valid
        if (courses.includes(currentValue)) {
            select.value = currentValue;
        }
    },

    /**
     * Update course dropdowns in forms
     * @param {Array} courses - Array of course names
     */
    updateCourseDropdowns(courses) {
        const courseNameSelect = document.getElementById('courseName');
        const editCourseSelect = document.getElementById('editCourse');
        
        // Update add form dropdown
        if (courseNameSelect) {
            const currentValue = courseNameSelect.value;
            courseNameSelect.innerHTML = '<option value="">Select a course...</option>';
            
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                courseNameSelect.appendChild(option);
            });
            
            if (courses.includes(currentValue)) {
                courseNameSelect.value = currentValue;
            }
        }
        
        // Update edit form dropdown
        if (editCourseSelect) {
            const currentValue = editCourseSelect.value;
            editCourseSelect.innerHTML = '<option value="">Select a course...</option>';
            
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                editCourseSelect.appendChild(option);
            });
            
            if (courses.includes(currentValue)) {
                editCourseSelect.value = currentValue;
            }
        }
    },

    /**
     * Show welcome modal
     */
    showWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('courseInput').focus();
    },

    /**
     * Hide welcome modal
     */
    hideWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    },

    /**
     * Show manage courses modal
     */
    showManageCoursesModal() {
        const modal = document.getElementById('manageCoursesModal');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('manageCourseInput').focus();
    },

    /**
     * Hide manage courses modal
     */
    hideManageCoursesModal() {
        const modal = document.getElementById('manageCoursesModal');
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    },

    /**
     * Render courses list in welcome modal
     * @param {Array} courses - Array of course names
     */
    renderCoursesList(courses) {
        const container = document.getElementById('coursesList');
        container.innerHTML = '';
        
        if (courses.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-tertiary); padding: var(--spacing-lg);">No courses added yet. Add at least one course to continue.</p>';
            return;
        }
        
        courses.forEach(course => {
            const item = document.createElement('div');
            item.className = 'course-item';
            item.innerHTML = `
                <span class="course-name">${this.escapeHtml(course)}</span>
                <button class="remove-course" onclick="app.removeCourseFromSetup('${this.escapeHtml(course)}')" 
                        aria-label="Remove ${this.escapeHtml(course)}">×</button>
            `;
            container.appendChild(item);
        });
    },

    /**
     * Render courses list in manage modal
     * @param {Array} courses - Array of course names
     */
    renderManageCoursesList(courses) {
        const container = document.getElementById('manageCoursesListContainer');
        container.innerHTML = '';
        
        if (courses.length === 0) {
            return; // CSS will show the empty message
        }
        
        courses.forEach(course => {
            const item = document.createElement('div');
            item.className = 'course-item';
            item.innerHTML = `
                <span class="course-name">${this.escapeHtml(course)}</span>
                <button class="remove-course" onclick="app.removeCourseFromManage('${this.escapeHtml(course)}')" 
                        aria-label="Remove ${this.escapeHtml(course)}">×</button>
            `;
            container.appendChild(item);
        });
    },

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Toast type ('success', 'error', 'warning')
     */
    showToast(message, type = 'success') {
        const toast = this.elements.toast;
        
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    /**
     * Show edit modal
     * @param {Object} assignment - Assignment to edit
     */
    showEditModal(assignment) {
        const modal = this.elements.modal;
        const form = this.elements.editForm;
        
        // Populate form
        document.getElementById('editId').value = assignment.id;
        document.getElementById('editName').value = assignment.name;
        document.getElementById('editCourse').value = assignment.course;
        document.getElementById('editDueDate').value = this.formatDateForInput(assignment.dueDate);
        document.getElementById('editNotes').value = assignment.notes || '';
        
        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus first input
        document.getElementById('editName').focus();
    },

    /**
     * Hide edit modal
     */
    hideEditModal() {
        const modal = this.elements.modal;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    },

    /**
     * Format date for display
     * @param {Date} date - Date to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return new Date(date).toLocaleDateString('en-US', options);
    },

    /**
     * Format date for input field (YYYY-MM-DD)
     * @param {Date} date - Date to format
     * @returns {string} Formatted date string
     */
    formatDateForInput(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Get days until due date
     * @param {Date} dueDate - Due date
     * @returns {string|null} Formatted string or null
     */
    getDaysUntil(dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return `${Math.abs(diffDays)} days overdue`;
        } else if (diffDays === 0) {
            return 'Due today!';
        } else if (diffDays === 1) {
            return 'Due tomorrow';
        } else if (diffDays <= 7) {
            return `${diffDays} days left`;
        }
        
        return null;
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Show upload status
     * @param {string} message - Status message
     * @param {string} type - Status type ('success' or 'error')
     */
    showUploadStatus(message, type) {
        const statusDiv = document.getElementById('uploadStatus');
        statusDiv.textContent = message;
        statusDiv.className = `upload-status ${type}`;
        
        // Clear after 5 seconds
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = 'upload-status';
        }, 5000);
    },

    /**
     * Animate element
     * @param {HTMLElement} element - Element to animate
     * @param {string} animation - Animation class
     */
    animate(element, animation) {
        element.style.animation = `${animation} 0.3s ease-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
    },

    /**
     * Show loading state
     * @param {HTMLElement} element - Element to show loading on
     * @param {boolean} loading - Loading state
     */
    setLoading(element, loading) {
        if (loading) {
            element.disabled = true;
            element.classList.add('loading');
            element.dataset.originalText = element.textContent;
            element.textContent = 'Loading...';
        } else {
            element.disabled = false;
            element.classList.remove('loading');
            if (element.dataset.originalText) {
                element.textContent = element.dataset.originalText;
            }
        }
    },

    /**
     * Confirm action with user
     * @param {string} message - Confirmation message
     * @returns {boolean} True if confirmed
     */
    confirm(message) {
        return window.confirm(message);
    },

    /**
     * Set minimum date for date inputs (today)
     */
    setMinDate() {
        const today = this.formatDateForInput(new Date());
        document.getElementById('dueDate').setAttribute('min', today);
        document.getElementById('editDueDate').setAttribute('min', today);
    },

    /**
     * Get a consistent color for a course
     * @param {string} courseName - Name of the course
     * @returns {string} Hex color code
     */
    getCourseColor(courseName) {
        // Color palette for courses
        const colors = [
            '#8b5cf6', // Violet
            '#06b6d4', // Cyan
            '#10b981', // Green
            '#f59e0b', // Amber
            '#ef4444', // Red
            '#ec4899', // Pink
            '#6366f1', // Indigo
            '#14b8a6', // Teal
            '#f97316', // Orange
            '#84cc16', // Lime
            '#a855f7', // Purple
            '#3b82f6', // Blue
            '#eab308', // Yellow
            '#22c55e', // Green
            '#f43f5e', // Rose
            '#0ea5e9', // Sky
        ];

        // Generate a consistent index based on course name
        let hash = 0;
        for (let i = 0; i < courseName.length; i++) {
            hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    },

    /**
     * Render course color legend
     * @param {Array} courses - Array of course names
     */
    renderCourseLegend(courses) {
        // Only render if there are multiple courses
        if (courses.length <= 1) return;

        const legendContainer = document.getElementById('courseLegend');
        if (!legendContainer) return;

        legendContainer.innerHTML = '';

        courses.forEach(course => {
            const color = this.getCourseColor(course);
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <span class="legend-color" style="background-color: ${color}"></span>
                <span class="legend-label">${this.escapeHtml(course)}</span>
            `;
            legendContainer.appendChild(legendItem);
        });
    }
};

// Make UI available globally
window.UI = UI;
