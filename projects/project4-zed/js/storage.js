// storage.js - LocalStorage management module
// Project 3 Upskilled: Advanced state management and data persistence

/**
 * Storage Module
 * Handles all localStorage operations for assignments
 * Includes error handling and data validation
 */

const Storage = {
    // Keys for localStorage
    KEYS: {
        ASSIGNMENTS: 'assignmentTracker_assignments',
        THEME: 'assignmentTracker_theme',
        SETTINGS: 'assignmentTracker_settings',
        COURSES: 'assignmentTracker_courses',
        FIRST_VISIT: 'assignmentTracker_firstVisit'
    },

    /**
     * Get all assignments from localStorage
     * @returns {Array} Array of assignment objects
     */
    getAssignments() {
        try {
            const data = localStorage.getItem(this.KEYS.ASSIGNMENTS);
            if (!data) return [];
            
            const assignments = JSON.parse(data);
            
            // Validate and parse dates
            return assignments.map(assignment => ({
                ...assignment,
                dueDate: new Date(assignment.dueDate),
                createdAt: new Date(assignment.createdAt)
            }));
        } catch (error) {
            console.error('Error reading assignments from storage:', error);
            return [];
        }
    },

    /**
     * Save all assignments to localStorage
     * @param {Array} assignments - Array of assignment objects
     * @returns {boolean} Success status
     */
    saveAssignments(assignments) {
        try {
            // Validate input
            if (!Array.isArray(assignments)) {
                throw new Error('Assignments must be an array');
            }

            // Convert dates to ISO strings for storage
            const assignmentsToStore = assignments.map(assignment => ({
                ...assignment,
                dueDate: assignment.dueDate instanceof Date 
                    ? assignment.dueDate.toISOString() 
                    : assignment.dueDate,
                createdAt: assignment.createdAt instanceof Date 
                    ? assignment.createdAt.toISOString() 
                    : assignment.createdAt
            }));

            localStorage.setItem(
                this.KEYS.ASSIGNMENTS, 
                JSON.stringify(assignmentsToStore)
            );
            
            return true;
        } catch (error) {
            console.error('Error saving assignments to storage:', error);
            return false;
        }
    },

    /**
     * Add a new assignment
     * @param {Object} assignment - Assignment object to add
     * @returns {Object|null} Added assignment with ID or null on error
     */
    addAssignment(assignment) {
        try {
            const assignments = this.getAssignments();
            
            // Generate unique ID
            const newAssignment = {
                id: this.generateId(),
                ...assignment,
                completed: false,
                createdAt: new Date()
            };

            assignments.push(newAssignment);
            this.saveAssignments(assignments);
            
            return newAssignment;
        } catch (error) {
            console.error('Error adding assignment:', error);
            return null;
        }
    },

    /**
     * Update an existing assignment
     * @param {string} id - Assignment ID
     * @param {Object} updates - Object with fields to update
     * @returns {boolean} Success status
     */
    updateAssignment(id, updates) {
        try {
            const assignments = this.getAssignments();
            const index = assignments.findIndex(a => a.id === id);
            
            if (index === -1) {
                throw new Error(`Assignment with id ${id} not found`);
            }

            // Merge updates with existing assignment
            assignments[index] = {
                ...assignments[index],
                ...updates
            };

            this.saveAssignments(assignments);
            return true;
        } catch (error) {
            console.error('Error updating assignment:', error);
            return false;
        }
    },

    /**
     * Delete an assignment
     * @param {string} id - Assignment ID
     * @returns {boolean} Success status
     */
    deleteAssignment(id) {
        try {
            const assignments = this.getAssignments();
            const filtered = assignments.filter(a => a.id !== id);
            
            if (filtered.length === assignments.length) {
                throw new Error(`Assignment with id ${id} not found`);
            }

            this.saveAssignments(filtered);
            return true;
        } catch (error) {
            console.error('Error deleting assignment:', error);
            return false;
        }
    },

    /**
     * Toggle assignment completion status
     * @param {string} id - Assignment ID
     * @returns {boolean} Success status
     */
    toggleComplete(id) {
        try {
            const assignments = this.getAssignments();
            const assignment = assignments.find(a => a.id === id);
            
            if (!assignment) {
                throw new Error(`Assignment with id ${id} not found`);
            }

            assignment.completed = !assignment.completed;
            this.saveAssignments(assignments);
            
            return true;
        } catch (error) {
            console.error('Error toggling completion:', error);
            return false;
        }
    },

    /**
     * Get assignments filtered by criteria
     * @param {Object} criteria - Filter criteria
     * @returns {Array} Filtered assignments
     */
    filterAssignments(criteria = {}) {
        const assignments = this.getAssignments();
        const { status, course, search } = criteria;
        
        return assignments.filter(assignment => {
            // Filter by status
            if (status && status !== 'all') {
                const isOverdue = this.isOverdue(assignment);
                
                if (status === 'completed' && !assignment.completed) return false;
                if (status === 'pending' && (assignment.completed || isOverdue)) return false;
                if (status === 'overdue' && (!isOverdue || assignment.completed)) return false;
            }

            // Filter by course
            if (course && course !== 'all') {
                if (assignment.course.toLowerCase() !== course.toLowerCase()) return false;
            }

            // Filter by search term
            if (search) {
                const searchLower = search.toLowerCase();
                const matchesName = assignment.name.toLowerCase().includes(searchLower);
                const matchesCourse = assignment.course.toLowerCase().includes(searchLower);
                const matchesNotes = assignment.notes?.toLowerCase().includes(searchLower);
                
                if (!matchesName && !matchesCourse && !matchesNotes) return false;
            }

            return true;
        });
    },

    /**
     * Sort assignments by specified field
     * @param {Array} assignments - Assignments to sort
     * @param {string} sortBy - Field to sort by
     * @returns {Array} Sorted assignments
     */
    sortAssignments(assignments, sortBy = 'dueDate') {
        const sorted = [...assignments];
        
        switch (sortBy) {
            case 'dueDate':
                sorted.sort((a, b) => a.dueDate - b.dueDate);
                break;
            case 'course':
                sorted.sort((a, b) => a.course.localeCompare(b.course));
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        return sorted;
    },

    /**
     * Get unique courses from all assignments
     * @returns {Array} Array of course names
     */
    getCourses() {
        const assignments = this.getAssignments();
        const courses = [...new Set(assignments.map(a => a.course))];
        return courses.sort();
    },

    /**
     * Get saved course list
     * @returns {Array} Array of course names
     */
    getSavedCourses() {
        try {
            const data = localStorage.getItem(this.KEYS.COURSES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading courses:', error);
            return [];
        }
    },

    /**
     * Save course list
     * @param {Array} courses - Array of course names
     * @returns {boolean} Success status
     */
    saveCourses(courses) {
        try {
            localStorage.setItem(this.KEYS.COURSES, JSON.stringify(courses));
            return true;
        } catch (error) {
            console.error('Error saving courses:', error);
            return false;
        }
    },

    /**
     * Add a course
     * @param {string} courseName - Course name to add
     * @returns {boolean} Success status
     */
    addCourse(courseName) {
        try {
            const courses = this.getSavedCourses();
            const trimmed = courseName.trim();
            
            if (!trimmed) return false;
            if (courses.includes(trimmed)) return false; // Already exists
            
            courses.push(trimmed);
            courses.sort();
            return this.saveCourses(courses);
        } catch (error) {
            console.error('Error adding course:', error);
            return false;
        }
    },

    /**
     * Remove a course
     * @param {string} courseName - Course name to remove
     * @returns {boolean} Success status
     */
    removeCourse(courseName) {
        try {
            const courses = this.getSavedCourses();
            const filtered = courses.filter(c => c !== courseName);
            return this.saveCourses(filtered);
        } catch (error) {
            console.error('Error removing course:', error);
            return false;
        }
    },

    /**
     * Check if this is the first visit
     * @returns {boolean} True if first visit
     */
    isFirstVisit() {
        return !localStorage.getItem(this.KEYS.FIRST_VISIT);
    },

    /**
     * Mark that the user has visited
     */
    markVisited() {
        localStorage.setItem(this.KEYS.FIRST_VISIT, 'true');
    },

    /**
     * Calculate statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const assignments = this.getAssignments();
        
        return {
            total: assignments.length,
            completed: assignments.filter(a => a.completed).length,
            pending: assignments.filter(a => !a.completed && !this.isOverdue(a)).length,
            overdue: assignments.filter(a => this.isOverdue(a) && !a.completed).length
        };
    },

    /**
     * Check if assignment is overdue
     * @param {Object} assignment - Assignment object
     * @returns {boolean} True if overdue
     */
    isOverdue(assignment) {
        if (assignment.completed) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(assignment.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    },

    /**
     * Clear all assignments (with confirmation)
     * @returns {boolean} Success status
     */
    clearAll() {
        try {
            localStorage.removeItem(this.KEYS.ASSIGNMENTS);
            return true;
        } catch (error) {
            console.error('Error clearing assignments:', error);
            return false;
        }
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Get theme preference
     * @returns {string} Theme ('light' or 'dark')
     */
    getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    },

    /**
     * Save theme preference
     * @param {string} theme - Theme to save
     */
    saveTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
    },

    /**
     * Get color preference
     * @returns {string} Color ('purple', 'blue', 'green', 'pink', 'orange', 'red')
     */
    getColor() {
        return localStorage.getItem('assignmentTracker_color') || 'purple';
    },

    /**
     * Save color preference
     * @param {string} color - Color to save
     */
    saveColor(color) {
        localStorage.setItem('assignmentTracker_color', color);
    },

    /**
     * Export assignments as JSON
     * @returns {string} JSON string of assignments
     */
    exportData() {
        const assignments = this.getAssignments();
        return JSON.stringify(assignments, null, 2);
    },

    /**
     * Import assignments from JSON
     * @param {string} jsonData - JSON string of assignments
     * @returns {boolean} Success status
     */
    importData(jsonData) {
        try {
            const assignments = JSON.parse(jsonData);
            if (!Array.isArray(assignments)) {
                throw new Error('Invalid data format');
            }
            this.saveAssignments(assignments);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};

// Make Storage available globally
window.Storage = Storage;
