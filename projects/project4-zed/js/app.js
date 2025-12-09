// app.js - Main Application Controller
// Project 2 & 3 Upskilled: Event delegation, async patterns, state management

/**
 * Main Application
 * Coordinates between Storage, Parser, and UI modules
 */

const app = {
    
    // Current filter and sort state
    currentFilters: {
        status: 'all',
        course: 'all',
        search: ''
    },
    currentSort: 'dueDate',

    /**
     * Initialize the application
     */
    init() {
        console.log('Initializing Assignment Tracker...');
        
        // Initialize UI module
        UI.init();
        
        // Load theme and color preferences
        this.loadTheme();
        this.loadColor();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set minimum date for date inputs
        UI.setMinDate();
        
        // Check if first visit
        if (Storage.isFirstVisit()) {
            UI.showWelcomeModal();
        } else {
            // Load existing courses and render
            this.updateCourseDropdowns();
        }
        
        // Initial render
        this.refreshDisplay();
        
        console.log('Application initialized successfully!');
    },

    /**
     * Set up all event listeners
     * Uses event delegation where appropriate - Project 2 Upskilled
     */
    setupEventListeners() {
        // Assignment form submission
        document.getElementById('assignmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddAssignment();
        });

        // File upload - drag and drop
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        // Filter and sort controls
        document.getElementById('filterStatus').addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.refreshDisplay();
        });

        document.getElementById('filterCourse').addEventListener('change', (e) => {
            this.currentFilters.course = e.target.value;
            this.refreshDisplay();
        });

        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.refreshDisplay();
        });

        // Clear all button
        document.getElementById('clearAll').addEventListener('click', () => {
            this.handleClearAll();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Color picker
        document.getElementById('colorPicker').addEventListener('click', () => {
            this.openColorPicker();
        });

        document.getElementById('colorPickerClose').addEventListener('click', () => {
            this.closeColorPicker();
        });

        // Close color picker on background click
        document.getElementById('colorPickerModal').addEventListener('click', (e) => {
            if (e.target.id === 'colorPickerModal') {
                this.closeColorPicker();
            }
        });

        // Color option buttons
        document.querySelectorAll('.color-option').forEach(button => {
            button.addEventListener('click', (e) => {
                const color = e.currentTarget.dataset.color;
                this.changeColor(color);
            });
        });

        // Edit modal
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditSubmit();
        });

        document.getElementById('modalClose').addEventListener('click', () => {
            UI.hideEditModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            UI.hideEditModal();
        });

        // Close modal on background click
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                UI.hideEditModal();
            }
        });

        // Manage courses button
        document.getElementById('manageCourses').addEventListener('click', () => {
            this.openManageCourses();
        });

        // Welcome modal - Add course
        document.getElementById('addCourseBtn').addEventListener('click', () => {
            this.addCourseInSetup();
        });

        document.getElementById('courseInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addCourseInSetup();
            }
        });

        // Welcome modal - Finish setup
        document.getElementById('finishSetup').addEventListener('click', () => {
            this.finishSetup();
        });

        // Manage courses modal - Add course
        document.getElementById('addManageCourseBtn').addEventListener('click', () => {
            this.addCourseInManage();
        });

        document.getElementById('manageCourseInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addCourseInManage();
            }
        });

        // Manage courses modal - Close
        document.getElementById('manageCoursesClose').addEventListener('click', () => {
            UI.hideManageCoursesModal();
        });

        document.getElementById('closeManageCourses').addEventListener('click', () => {
            UI.hideManageCoursesModal();
        });

        // Close manage courses modal on background click
        document.getElementById('manageCoursesModal').addEventListener('click', (e) => {
            if (e.target.id === 'manageCoursesModal') {
                UI.hideManageCoursesModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                UI.hideEditModal();
                UI.hideManageCoursesModal();
                this.closeColorPicker();
            }
        });
    },

    /**
     * Handle adding a new assignment
     */
    handleAddAssignment() {
        // Get form values
        const name = document.getElementById('assignmentName').value.trim();
        const course = document.getElementById('courseName').value.trim();
        const dueDate = document.getElementById('dueDate').value;
        const notes = document.getElementById('notes').value.trim();

        // Validate
        if (!name || !course || !dueDate) {
            UI.showToast('Please fill in all required fields', 'error');
            return;
        }

        // Create assignment object
        const assignment = {
            name,
            course,
            dueDate: new Date(dueDate),
            priority: 'medium', // Default priority for storage
            notes
        };

        // Add to storage
        const added = Storage.addAssignment(assignment);

        if (added) {
            UI.showToast('Assignment added successfully!', 'success');
            
            // Reset form
            document.getElementById('assignmentForm').reset();
            
            // Refresh display
            this.refreshDisplay();
        } else {
            UI.showToast('Error adding assignment', 'error');
        }
    },

    /**
     * Handle file upload
     * Async file reading - Project 3 Upskilled
     * @param {File} file - Uploaded file
     */
    async handleFileUpload(file) {
        console.log('Processing file:', file.name);

        // Validate file type
        const validTypes = ['.txt', 'text/plain'];
        const isValid = validTypes.some(type => 
            file.name.endsWith(type) || file.type === type
        );

        if (!isValid) {
            UI.showUploadStatus('Please upload a .txt file', 'error');
            return;
        }

        try {
            // Show loading state
            UI.showUploadStatus('Reading file...', 'success');

            // Read file content - Async pattern
            const text = await this.readFileAsync(file);
            
            UI.showUploadStatus('Parsing assignments...', 'success');

            // Parse syllabus
            const assignments = Parser.parseSyllabus(text);

            if (assignments.length === 0) {
                UI.showUploadStatus(
                    'No assignments found. Try the simple list format: "Assignment name - MM/DD/YYYY"', 
                    'error'
                );
                return;
            }

            // Add all parsed assignments
            let addedCount = 0;
            assignments.forEach(assignment => {
                if (Storage.addAssignment(assignment)) {
                    addedCount++;
                }
            });

            // Show success message
            UI.showUploadStatus(
                `Successfully imported ${addedCount} assignment${addedCount !== 1 ? 's' : ''}!`, 
                'success'
            );
            UI.showToast(`Added ${addedCount} assignments from syllabus`, 'success');

            // Refresh display
            this.refreshDisplay();

            // Reset file input
            document.getElementById('fileInput').value = '';

        } catch (error) {
            console.error('Error processing file:', error);
            UI.showUploadStatus('Error reading file. Please try again.', 'error');
        }
    },

    /**
     * Read file asynchronously using FileReader
     * @param {File} file - File to read
     * @returns {Promise<string>} File content
     */
    readFileAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = (e) => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    },

    /**
     * Toggle assignment completion status
     * @param {string} id - Assignment ID
     */
    toggleComplete(id) {
        const success = Storage.toggleComplete(id);
        
        if (success) {
            const assignment = Storage.getAssignments().find(a => a.id === id);
            const message = assignment.completed ? 
                'Assignment marked as complete! 🎉' : 
                'Assignment marked as incomplete';
            
            UI.showToast(message, 'success');
            this.refreshDisplay();
        } else {
            UI.showToast('Error updating assignment', 'error');
        }
    },

    /**
     * Edit an assignment
     * @param {string} id - Assignment ID
     */
    editAssignment(id) {
        const assignments = Storage.getAssignments();
        const assignment = assignments.find(a => a.id === id);
        
        if (assignment) {
            UI.showEditModal(assignment);
        }
    },

    /**
     * Handle edit form submission
     */
    handleEditSubmit() {
        const id = document.getElementById('editId').value;
        const name = document.getElementById('editName').value.trim();
        const course = document.getElementById('editCourse').value.trim();
        const dueDate = document.getElementById('editDueDate').value;
        const notes = document.getElementById('editNotes').value.trim();

        // Validate
        if (!name || !course || !dueDate) {
            UI.showToast('Please fill in all required fields', 'error');
            return;
        }

        // Update assignment
        const success = Storage.updateAssignment(id, {
            name,
            course,
            dueDate: new Date(dueDate),
            notes
        });

        if (success) {
            UI.showToast('Assignment updated successfully!', 'success');
            UI.hideEditModal();
            this.refreshDisplay();
        } else {
            UI.showToast('Error updating assignment', 'error');
        }
    },

    /**
     * Delete an assignment
     * @param {string} id - Assignment ID
     */
    deleteAssignment(id) {
        const confirmed = UI.confirm('Are you sure you want to delete this assignment?');
        
        if (!confirmed) return;

        const success = Storage.deleteAssignment(id);
        
        if (success) {
            UI.showToast('Assignment deleted', 'success');
            this.refreshDisplay();
        } else {
            UI.showToast('Error deleting assignment', 'error');
        }
    },

    /**
     * Clear all assignments
     */
    handleClearAll() {
        const confirmed = UI.confirm(
            'Are you sure you want to delete ALL assignments? This cannot be undone!'
        );
        
        if (!confirmed) return;

        const success = Storage.clearAll();
        
        if (success) {
            UI.showToast('All assignments cleared', 'success');
            this.refreshDisplay();
        } else {
            UI.showToast('Error clearing assignments', 'error');
        }
    },

    /**
     * Refresh the entire display
     * Complex state management - Project 3 Upskilled
     */
    refreshDisplay() {
        // Get filtered assignments
        let assignments = Storage.filterAssignments(this.currentFilters);
        
        // Sort assignments
        assignments = Storage.sortAssignments(assignments, this.currentSort);
        
        // Render assignments
        UI.renderAssignments(assignments);
        
        // Update statistics
        const stats = Storage.getStatistics();
        UI.updateStatistics(stats);
        
        // Update course filter and legend
        const courses = Storage.getCourses();
        UI.updateCourseFilter(courses);
        UI.renderCourseLegend(courses);
    },

    /**
     * Update all course dropdowns
     */
    updateCourseDropdowns() {
        const courses = Storage.getSavedCourses();
        UI.updateCourseDropdowns(courses);
        UI.updateCourseFilter(courses);
    },

    /**
     * Add course in welcome setup
     */
    addCourseInSetup() {
        const input = document.getElementById('courseInput');
        const courseName = input.value.trim();
        
        if (!courseName) {
            UI.showToast('Please enter a course name', 'error');
            return;
        }
        
        const success = Storage.addCourse(courseName);
        
        if (success) {
            input.value = '';
            const courses = Storage.getSavedCourses();
            UI.renderCoursesList(courses);
            input.focus();
        } else {
            UI.showToast('Course already exists or invalid', 'error');
        }
    },

    /**
     * Remove course from welcome setup
     * @param {string} courseName - Course to remove
     */
    removeCourseFromSetup(courseName) {
        Storage.removeCourse(courseName);
        const courses = Storage.getSavedCourses();
        UI.renderCoursesList(courses);
    },

    /**
     * Finish welcome setup
     */
    finishSetup() {
        const courses = Storage.getSavedCourses();
        
        if (courses.length === 0) {
            UI.showToast('Please add at least one course', 'error');
            return;
        }
        
        Storage.markVisited();
        UI.hideWelcomeModal();
        this.updateCourseDropdowns();
        UI.showToast('Welcome! Start adding your assignments', 'success');
    },

    /**
     * Open manage courses modal
     */
    openManageCourses() {
        const courses = Storage.getSavedCourses();
        UI.renderManageCoursesList(courses);
        UI.showManageCoursesModal();
    },

    /**
     * Add course in manage modal
     */
    addCourseInManage() {
        const input = document.getElementById('manageCourseInput');
        const courseName = input.value.trim();
        
        if (!courseName) {
            UI.showToast('Please enter a course name', 'error');
            return;
        }
        
        const success = Storage.addCourse(courseName);
        
        if (success) {
            input.value = '';
            const courses = Storage.getSavedCourses();
            UI.renderManageCoursesList(courses);
            this.updateCourseDropdowns();
            UI.showToast('Course added!', 'success');
            input.focus();
        } else {
            UI.showToast('Course already exists', 'error');
        }
    },

    /**
     * Remove course from manage modal
     * @param {string} courseName - Course to remove
     */
    removeCourseFromManage(courseName) {
        const confirmed = UI.confirm(`Remove "${courseName}"? Existing assignments with this course will not be affected.`);
        
        if (!confirmed) return;
        
        Storage.removeCourse(courseName);
        const courses = Storage.getSavedCourses();
        UI.renderManageCoursesList(courses);
        this.updateCourseDropdowns();
        UI.showToast('Course removed', 'success');
    },

    /**
     * Toggle theme between light and dark
     * CSS custom properties - Project 1 Upskilled
     */
    toggleTheme() {
        const currentTheme = Storage.getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        Storage.saveTheme(newTheme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    },

    /**
     * Load theme preference
     */
    loadTheme() {
        const theme = Storage.getTheme();
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    },

    /**
     * Load color preference
     */
    loadColor() {
        const color = Storage.getColor();
        document.documentElement.setAttribute('data-color', color);
        this.updateColorActiveState(color);
    },

    /**
     * Change color theme
     * @param {string} color - Color to apply
     */
    changeColor(color) {
        document.documentElement.setAttribute('data-color', color);
        Storage.saveColor(color);
        this.updateColorActiveState(color);
        UI.showToast(`Color theme changed to ${color}!`, 'success');
    },

    /**
     * Update active state of color buttons
     * @param {string} activeColor - Currently active color
     */
    updateColorActiveState(activeColor) {
        document.querySelectorAll('.color-option').forEach(button => {
            if (button.dataset.color === activeColor) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    },

    /**
     * Open color picker modal
     */
    openColorPicker() {
        const modal = document.getElementById('colorPickerModal');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        this.updateColorActiveState(Storage.getColor());
    },

    /**
     * Close color picker modal
     */
    closeColorPicker() {
        const modal = document.getElementById('colorPickerModal');
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    },

    /**
     * Export assignments data
     */
    exportData() {
        const data = Storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `assignments_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        UI.showToast('Assignments exported!', 'success');
    },

    /**
     * Import assignments data
     * @param {string} jsonData - JSON string of assignments
     */
    importData(jsonData) {
        const success = Storage.importData(jsonData);
        
        if (success) {
            UI.showToast('Assignments imported successfully!', 'success');
            this.refreshDisplay();
        } else {
            UI.showToast('Error importing data', 'error');
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Make app available globally for onclick handlers
window.app = app;
