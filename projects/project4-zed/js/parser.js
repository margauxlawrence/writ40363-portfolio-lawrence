// parser.js - Syllabus parsing module
// New Technique: Text parsing and pattern recognition with AI assistance

/**
 * Parser Module
 * Handles parsing of syllabus text files to extract assignment information
 * Uses regular expressions and pattern matching
 */

const Parser = {
    
    /**
     * Common date patterns in syllabi
     * Supports various formats: MM/DD/YYYY, Month DD, DD Month, etc.
     */
    datePatterns: [
        // MM/DD/YYYY, MM-DD-YYYY, MM.DD.YYYY
        /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/g,
        // Month DD, YYYY or Month DD
        /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+(\d{1,2})(?:,?\s+(\d{4}))?/gi,
        // DD Month YYYY
        /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s*(\d{4})?/gi
    ],

    /**
     * Assignment keywords to look for
     */
    assignmentKeywords: [
        'assignment', 'homework', 'hw', 'essay', 'paper', 'project', 
        'quiz', 'exam', 'test', 'midterm', 'final', 'presentation',
        'lab', 'report', 'discussion', 'reading', 'review', 'exercise',
        'problem set', 'case study', 'portfolio'
    ],

    /**
     * Due date keywords
     */
    dueKeywords: [
        'due', 'deadline', 'submit', 'submission', 'turn in', 'hand in'
    ],

    /**
     * Parse syllabus text file content
     * @param {string} text - Raw text content from syllabus
     * @param {string} courseName - Optional course name override
     * @returns {Array} Array of parsed assignment objects
     */
    parseSyllabus(text, courseName = 'Imported Course') {
        try {
            const lines = text.split('\n');
            const assignments = [];
            
            // Try to extract course name from first few lines
            const detectedCourseName = this.extractCourseName(lines) || courseName;
            
            // Process each line
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                // Skip empty lines and very short lines
                if (line.length < 5) continue;
                
                // Check if line contains assignment keywords
                const hasAssignmentKeyword = this.containsAssignmentKeyword(line);
                
                if (hasAssignmentKeyword) {
                    // Try to extract assignment from this line and nearby lines
                    const assignment = this.extractAssignment(
                        line, 
                        lines.slice(i, i + 5), // Context: current + next 4 lines
                        detectedCourseName
                    );
                    
                    if (assignment && assignment.dueDate) {
                        assignments.push(assignment);
                    }
                }
            }
            
            // Remove duplicates based on name and date
            return this.removeDuplicates(assignments);
            
        } catch (error) {
            console.error('Error parsing syllabus:', error);
            return [];
        }
    },

    /**
     * Extract course name from syllabus
     * @param {Array} lines - Array of text lines
     * @returns {string|null} Course name or null
     */
    extractCourseName(lines) {
        // Look in first 10 lines for course name
        for (let i = 0; i < Math.min(10, lines.length); i++) {
            const line = lines[i].trim();
            
            // Common patterns: "COURSE: Name" or "CS101: Name" or just "Course Name"
            const coursePattern = /^(?:course[:\s]+)?([A-Z]{2,4}\s*\d{3}[A-Z]?)[:\s]*(.+)/i;
            const match = line.match(coursePattern);
            
            if (match) {
                return match[1] + (match[2] ? ' ' + match[2].substring(0, 30) : '');
            }
            
            // Check for standalone course codes
            const codePattern = /^[A-Z]{2,4}\s*\d{3}[A-Z]?/;
            if (codePattern.test(line)) {
                return line.substring(0, 50);
            }
        }
        
        return null;
    },

    /**
     * Check if line contains assignment keywords
     * @param {string} line - Line of text
     * @returns {boolean} True if contains keywords
     */
    containsAssignmentKeyword(line) {
        const lowerLine = line.toLowerCase();
        return this.assignmentKeywords.some(keyword => 
            lowerLine.includes(keyword.toLowerCase())
        );
    },

    /**
     * Extract assignment from line(s)
     * @param {string} mainLine - Main line with assignment keyword
     * @param {Array} contextLines - Array of lines for context
     * @param {string} courseName - Course name
     * @returns {Object|null} Assignment object or null
     */
    extractAssignment(mainLine, contextLines, courseName) {
        const allText = contextLines.join(' ');
        
        // Extract assignment name
        const name = this.extractAssignmentName(mainLine);
        if (!name) return null;
        
        // Extract due date
        const dueDate = this.extractDueDate(allText);
        if (!dueDate) return null;
        
        // Extract priority (based on keywords)
        const priority = this.extractPriority(allText);
        
        // Extract notes
        const notes = this.extractNotes(contextLines);
        
        return {
            name,
            course: courseName,
            dueDate,
            priority,
            notes: notes || 'Imported from syllabus'
        };
    },

    /**
     * Extract assignment name from line
     * @param {string} line - Line of text
     * @returns {string|null} Assignment name or null
     */
    extractAssignmentName(line) {
        // Remove common prefixes and clean up
        let name = line
            .replace(/^[-•*\d.)\s]+/, '') // Remove bullets, numbers
            .replace(/\([^)]*\)/g, '') // Remove parenthetical content
            .trim();
        
        // Truncate at common separators
        const separators = [' - due', ' due', ' (', ' –', ' —'];
        for (const sep of separators) {
            const idx = name.toLowerCase().indexOf(sep);
            if (idx > 0) {
                name = name.substring(0, idx).trim();
            }
        }
        
        // Limit length
        if (name.length > 100) {
            name = name.substring(0, 100).trim() + '...';
        }
        
        return name.length >= 3 ? name : null;
    },

    /**
     * Extract due date from text
     * @param {string} text - Text to search
     * @returns {Date|null} Date object or null
     */
    extractDueDate(text) {
        for (const pattern of this.datePatterns) {
            const matches = text.matchAll(pattern);
            
            for (const match of matches) {
                const date = this.parseDate(match);
                if (date && this.isValidDate(date)) {
                    return date;
                }
            }
        }
        
        return null;
    },

    /**
     * Parse date from regex match
     * @param {Array} match - Regex match array
     * @returns {Date|null} Date object or null
     */
    parseDate(match) {
        try {
            const fullMatch = match[0];
            const groups = match.slice(1);
            
            // Try different parsing strategies
            let date;
            
            // Strategy 1: Numeric dates (MM/DD/YYYY)
            if (groups.length === 3 && !isNaN(groups[0])) {
                let [month, day, year] = groups.map(g => parseInt(g));
                
                // Handle 2-digit years
                if (year < 100) {
                    year += 2000;
                }
                
                // If no year, use current or next year
                if (!year) {
                    year = new Date().getFullYear();
                }
                
                date = new Date(year, month - 1, day);
            }
            // Strategy 2: Month name formats
            else if (groups.length >= 2) {
                const monthStr = groups[0];
                const day = parseInt(groups[1]);
                let year = groups[2] ? parseInt(groups[2]) : new Date().getFullYear();
                
                const month = this.parseMonth(monthStr);
                if (month !== null) {
                    date = new Date(year, month, day);
                }
            }
            
            return date;
            
        } catch (error) {
            return null;
        }
    },

    /**
     * Parse month name to number
     * @param {string} monthStr - Month name or abbreviation
     * @returns {number|null} Month number (0-11) or null
     */
    parseMonth(monthStr) {
        const months = {
            'january': 0, 'jan': 0,
            'february': 1, 'feb': 1,
            'march': 2, 'mar': 2,
            'april': 3, 'apr': 3,
            'may': 4,
            'june': 5, 'jun': 5,
            'july': 6, 'jul': 6,
            'august': 7, 'aug': 7,
            'september': 8, 'sep': 8, 'sept': 8,
            'october': 9, 'oct': 9,
            'november': 10, 'nov': 10,
            'december': 11, 'dec': 11
        };
        
        return months[monthStr.toLowerCase()] ?? null;
    },

    /**
     * Check if date is valid and reasonable
     * @param {Date} date - Date to check
     * @returns {boolean} True if valid
     */
    isValidDate(date) {
        if (!(date instanceof Date) || isNaN(date)) {
            return false;
        }
        
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const twoYearsAhead = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());
        
        // Date should be within reasonable range
        return date >= oneYearAgo && date <= twoYearsAhead;
    },

    /**
     * Extract priority level from text
     * @param {string} text - Text to analyze
     * @returns {string} Priority level
     */
    extractPriority(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('exam') || lowerText.includes('final') || 
            lowerText.includes('midterm') || lowerText.includes('test')) {
            return 'high';
        }
        
        if (lowerText.includes('quiz') || lowerText.includes('presentation') || 
            lowerText.includes('project')) {
            return 'medium';
        }
        
        return 'medium'; // Default
    },

    /**
     * Extract notes from context lines
     * @param {Array} lines - Array of lines
     * @returns {string|null} Notes or null
     */
    extractNotes(lines) {
        // Look for description in subsequent lines
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip if it looks like another assignment
            if (this.containsAssignmentKeyword(line)) {
                break;
            }
            
            // If line has reasonable content, use it as notes
            if (line.length > 20 && line.length < 200) {
                return line;
            }
        }
        
        return null;
    },

    /**
     * Remove duplicate assignments
     * @param {Array} assignments - Array of assignments
     * @returns {Array} Deduplicated array
     */
    removeDuplicates(assignments) {
        const seen = new Set();
        
        return assignments.filter(assignment => {
            const key = `${assignment.name}_${assignment.dueDate.toDateString()}`;
            
            if (seen.has(key)) {
                return false;
            }
            
            seen.add(key);
            return true;
        });
    },

    /**
     * Parse a simple list format
     * Format: "Assignment name - MM/DD/YYYY"
     * @param {string} text - Text to parse
     * @param {string} courseName - Course name
     * @returns {Array} Array of assignments
     */
    parseSimpleList(text, courseName = 'Imported Course') {
        const lines = text.split('\n');
        const assignments = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length < 5) continue;
            
            // Try to split by common separators
            const parts = trimmed.split(/[-–—]/);
            
            if (parts.length >= 2) {
                const name = parts[0].trim();
                const dateStr = parts[1].trim();
                const dueDate = this.extractDueDate(dateStr);
                
                if (dueDate && name.length >= 3) {
                    assignments.push({
                        name,
                        course: courseName,
                        dueDate,
                        priority: 'medium',
                        notes: 'Imported from file'
                    });
                }
            }
        }
        
        return assignments;
    },

    /**
     * Get parsing statistics
     * @param {string} text - Text that was parsed
     * @param {Array} assignments - Parsed assignments
     * @returns {Object} Statistics
     */
    getParsingStats(text, assignments) {
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        
        return {
            totalLines: lines.length,
            assignmentsFound: assignments.length,
            successRate: assignments.length > 0 ? 
                ((assignments.length / lines.length) * 100).toFixed(1) + '%' : '0%'
        };
    }
};

// Make Parser available globally
window.Parser = Parser;
