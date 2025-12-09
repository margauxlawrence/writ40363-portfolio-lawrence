# AI Collaboration Log - Assignment Tracker Project

## Project Overview
**Project Name**: Assignment Tracker with Syllabus Parsing  
**Student**: Margaux Lawrence  
**Course**: Project Zed  
**Date**: December 2025  

---

## 🤖 AI Tools Used

### Primary AI Assistant
- **Claude (Anthropic)** - Main development partner
  - Used for: Initial architecture design, code generation, debugging, concept explanation
  - Interaction style: Conversational, iterative development
  - Strengths: Detailed explanations, modular code structure, best practices

### Additional Tools
- **GitHub Copilot** (if used) - Code completion and suggestions
- **ChatGPT** (if used) - Alternative perspectives and problem-solving

---

## 💡 Key Learning Moments

### 1. **Modular JavaScript Architecture**
**What I Learned**: How to properly separate concerns in JavaScript using modules

**Before AI**: I would have put all JavaScript in one file, making it hard to maintain and understand.

**With AI**: Claude helped me structure the code into 4 distinct modules:
- `storage.js` - All data persistence logic
- `parser.js` - Text parsing and pattern recognition
- `ui.js` - DOM manipulation and rendering
- `app.js` - Main controller coordinating everything

**Impact**: This made my code much more organized and easier to debug. I can now find specific functionality quickly instead of scrolling through hundreds of lines.

**Code Example**:
```javascript
// Instead of everything in one file, I learned to create focused modules
const Storage = {
    getAssignments() { /* ... */ },
    addAssignment() { /* ... */ }
};
window.Storage = Storage; // Make available globally
```

### 2. **Regular Expressions for Text Parsing**
**What I Learned**: How to use regex patterns to extract dates and assignments from unstructured text

**The Challenge**: Syllabi come in many different formats. How do you extract "January 15, 2025" and "01/15/2025" and "Jan 15" with the same code?

**AI's Explanation**: Claude taught me about regex patterns and the `matchAll()` method:
```javascript
// Multiple date patterns to catch different formats
/(January|February|...|December)\s+(\d{1,2})(?:,?\s+(\d{4}))?/gi
```

**What Surprised Me**: Regex is like a mini programming language inside JavaScript! The patterns look cryptic at first but are incredibly powerful.

**Application**: I can now parse multiple date formats and extract assignment names automatically. This is the "magic" behind the syllabus upload feature.

### 3. **Async/Await for File Reading**
**What I Learned**: How to work with asynchronous operations using modern JavaScript patterns

**Before**: I didn't understand callbacks, promises, or async/await.

**AI Conversation That Helped**:
```
Me: "Why does my file content show as undefined?"
Claude: "The FileReader API is asynchronous. You need to wait for it to finish..."
```

**The Solution**:
```javascript
async handleFileUpload(file) {
    const text = await this.readFileAsync(file);
    // Now I can use text!
}

readFileAsync(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
    });
}
```

**Impact**: This pattern is used everywhere in modern web development. Understanding it opens up API work, database operations, and more.

### 4. **CSS Custom Properties (Variables) for Theming**
**What I Learned**: How to create a complete theming system using CSS variables

**The Concept**:
```css
:root {
    --color-primary: #6366f1;
    --color-bg-main: #f8fafc;
}

[data-theme="dark"] {
    --color-bg-main: #0f172a;
}

body {
    background-color: var(--color-bg-main);
}
```

**Why It's Cool**: Change one variable, and the entire theme updates! Much better than find-and-replace for every color.

**AI's Teaching Method**: Claude showed me real-world examples, then helped me build my own system with 50+ variables for colors, spacing, fonts, etc.

### 5. **Event Delegation Pattern**
**What I Learned**: How to efficiently handle events on dynamically created elements

**The Problem**: My assignment cards are created dynamically. How do I add click handlers to buttons that don't exist yet?

**Wrong Approach** (what I tried first):
```javascript
// This doesn't work for dynamic elements
document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', ...);
});
```

**Right Approach** (what AI taught me):
```javascript
// Event delegation - attach to parent that always exists
assignmentsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('icon-btn')) {
        // Handle click
    }
});
```

**Note**: I actually used onclick attributes in HTML for simplicity, but Claude explained both approaches and why each is used.

---

## 🚧 Challenges & Solutions

### Challenge 1: Date Parsing Complexity
**Problem**: Syllabi have dates in dozens of different formats. My initial parser only worked for one format.

**What Went Wrong**: First attempt:
```javascript
// Too simplistic
const date = new Date(dateString);
```
This failed for anything like "January 15" or "1/15/25".

**How AI Helped**: Claude explained I needed:
1. Multiple regex patterns for different formats
2. A parsing strategy for each format
3. Validation to ensure dates are reasonable

**Solution**: Created an array of patterns and tried each one:
```javascript
datePatterns: [
    /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/g,
    /(January|February|...)\s+(\d{1,2})(?:,?\s+(\d{4}))?/gi,
    // ... more patterns
]
```

**Lesson Learned**: Complex problems need multiple strategies. Don't expect one solution to handle everything.

### Challenge 2: LocalStorage Data Corruption
**Problem**: My app crashed when I tried to load saved assignments.

**The Bug**: I was saving Date objects directly to localStorage, but they don't stringify properly:
```javascript
// BUG: Dates become strings like "2025-01-15T00:00:00.000Z"
localStorage.setItem('assignments', JSON.stringify(assignments));
```

**AI Debugging Process**:
1. Claude asked to see my storage code
2. Explained that localStorage only stores strings
3. Showed me how to convert dates before saving:

```javascript
// Solution: Convert dates to ISO strings before saving
const assignmentsToStore = assignments.map(a => ({
    ...a,
    dueDate: a.dueDate.toISOString()
}));

// And convert back when loading
const assignments = JSON.parse(data).map(a => ({
    ...a,
    dueDate: new Date(a.dueDate)
}));
```

**What I Learned**: Always test data persistence! What works in memory might not work in storage.

### Challenge 3: CSS Layout Issues on Mobile
**Problem**: My three-column upload section looked terrible on mobile phones.

**Initial Attempt**: Just made everything smaller with one media query.

**AI's Feedback**: "You need multiple breakpoints for different screen sizes."

**Solution**: Created 4 breakpoints:
```css
/* Desktop: 3 columns */
.upload-section {
    grid-template-columns: 1fr auto 1fr;
}

/* Tablet: Stack vertically */
@media (max-width: 1024px) {
    .upload-section {
        grid-template-columns: 1fr;
    }
}

/* More breakpoints for 768px and 480px... */
```

**Lesson**: Responsive design isn't just about "mobile vs desktop". There are many screen sizes in between!

### Challenge 4: When AI Was Wrong
**The Situation**: I asked Claude to help with PDF parsing.

**AI's Suggestion**: "Use the PDF.js library..."

**The Problem**: 
- PDF.js is complex and heavy (200KB+)
- Added way too much complexity for my project timeline
- Debugging PDF parsing issues was beyond my skill level

**My Decision**: Stuck with text files only, documented as a future enhancement.

**Lesson**: AI suggestions aren't always right for YOUR situation. Consider:
- Your skill level
- Project timeline
- Actual user needs
- Complexity vs. benefit

Don't be afraid to push back or simplify!


## 📝 Sample Conversations

### Conversation 1: Understanding Modular Code Structure

**Me**: "I want to create a homework tracker with syllabus upload. Where do I start?"

**Claude**: "Let's break this into modules:
1. Storage module - handles saving/loading data
2. Parser module - reads and extracts assignments from text
3. UI module - displays everything to the user
4. Main app - coordinates the others

This separation makes your code easier to understand and debug."

**Me**: "How do I make them talk to each other?"

**Claude**: "Each module exposes specific functions through an object. For example, your storage module might expose `addAssignment()`, `getAssignments()`, etc. The app module calls these functions as needed."

**My Reflection**: This conversation changed how I think about code organization. Instead of one giant file, I now think in terms of "What does this module do?" and "What do other modules need from it?"

**What I Modified**: Claude's initial suggestion had even more modules, but I simplified to 4 based on what made sense for my project size.

---

### Conversation 2: Debugging File Upload

**Me**: "My file upload isn't working. I click the button but nothing happens."

**Claude**: "Can you show me your event listener code?"

**Me**: 
```javascript
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    this.handleFileUpload(file);
});
```

**Claude**: "That looks correct. What happens in `handleFileUpload()`? Are you seeing any errors in the console?"

**Me**: "Oh! I see 'reader is not defined' in the console."

**Claude**: "Ah! You're calling `reader.readAsText()` but haven't created the FileReader object. You need:
```javascript
const reader = new FileReader();
reader.onload = ...
reader.readAsText(file);
```"

**My Reflection**: This taught me to ALWAYS check the browser console. Half my bugs would have been obvious if I'd looked there first!

**What I Learned**: Debugging is a skill. Claude taught me to:
1. Read error messages carefully
2. Check the console
3. Add console.log() statements to track data flow
4. Test one piece at a time

---

### Conversation 3: Learning Regular Expressions

**Me**: "I need to find dates in text like 'Due: January 15, 2025'. How?"

**Claude**: "Regular expressions are perfect for this. Let's build the pattern step by step:
- `January|February|...` - matches month names
- `\s+` - matches spaces
- `(\d{1,2})` - matches 1 or 2 digits for the day
- `(?:,?\s+(\d{4}))?` - optionally matches comma, space, and year

Together: `/(January|...|December)\s+(\d{1,2})(?:,?\s+(\d{4}))?/gi`"

**Me**: "What's the `?:` and `?` mean?"

**Claude**: "
- `?:` makes a non-capturing group (match but don't save separately)
- `?` makes the whole year part optional (for dates like 'January 15')
- `g` flag finds all matches, not just the first
- `i` flag makes it case-insensitive"

**Me**: "Can you explain with examples?"

**Claude**: [Provided 5 different date formats and showed how the regex matches each]

**My Reflection**: This conversation took 30 minutes but I learned something I'll use forever. Regular expressions are like a superpower for text processing.

**What I Did Next**: I took Claude's regex and tested it on https://regex101.com with real syllabus text to see how it worked.

---

### Conversation 4: Code Review Session

**Me**: "I've written the assignment card rendering code. Can you review it?"

**Claude**: [Reviews code] "This works, but I see some opportunities for improvement:

1. **Security**: You're using `innerHTML` with user input. This could allow XSS attacks. Use a helper function to escape HTML:
```javascript
escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

2. **Accessibility**: Add aria-labels to your icon buttons so screen readers know what they do:
```html
<button aria-label='Mark as complete'>✅</button>
```

3. **Performance**: You're recalculating `isOverdue` every render. Consider caching this value."

**My Reflection**: This is where AI really shines - catching things I never would have thought about. Security and accessibility weren't on my radar at all.

**What I Implemented**: All three suggestions. The escapeHtml function is now in my ui.js module, and I added aria-labels to every interactive element.

---

### Conversation 5: Explaining Concepts Back to AI

**Me**: "Let me explain localStorage back to you to make sure I understand:

localStorage is like a tiny database in the browser. It only stores strings, so I need to JSON.stringify() my JavaScript objects before saving, and JSON.parse() when loading. The data persists even after closing the browser, but gets cleared if the user clears their browsing data.

Is that right?"

**Claude**: "Perfect explanation! You've got it. One small addition: localStorage is specific to the domain (website), so data from site A can't be accessed by site B. This is a security feature."

**My Reflection**: Teaching back to the AI is the best way to confirm I actually understand something. If I can't explain it, I don't really get it.

---

## 🔄 Process Evolution

### Week 1: Dependency and Copy-Paste
**My Approach**: 
- Asked AI to write entire functions
- Copied code without fully understanding it
- Got stuck when things didn't work
- Felt overwhelmed by all the code

**Example**: "Write me a function to add assignments to localStorage"
→ Got a working function but couldn't debug when it failed

### Week 2: Learning to Ask Better Questions
**My Approach**:
- Started asking "How does X work?" before "Write X for me"
- Asked for explanations of code patterns
- Tested small pieces individually
- Googled unfamiliar terms

**Example**: "Can you explain how Promises work?" 
→ Got understanding, then wrote my own async code

### Week 3: Collaborative Development
**My Approach**:
- Wrote code first, then asked AI to review
- Asked for alternatives: "Is there a better way to do this?"
- Used AI as a debugging partner, not just a code writer
- Modified AI suggestions to fit my needs

**Example**: "I wrote this parsing function. What edge cases am I missing?"
→ AI pointed out issues I'd never have found

### Week 4 (Final): Confident and Independent
**My Approach**:
- Write most code myself
- Use AI for:
  - Explaining unfamiliar concepts
  - Reviewing complex code
  - Suggesting best practices
  - Brainstorming solutions
- Can read and modify AI-generated code confidently
- Know when to ignore AI suggestions

**Example**: "I want to add export functionality. What format should I use?"
→ AI suggested JSON, I implemented it myself with minor help

---

## 🎯 Prompting Strategies That Worked

### ✅ Effective Prompts

**1. "Explain [concept] like I'm a beginner, with examples"**
- Gets simple explanations without jargon
- Includes practical examples I can run

**2. "Here's my code [paste]. What could go wrong?"**
- Catches bugs and edge cases
- Teaches defensive programming

**3. "Show me two different ways to do [task] with pros/cons"**
- Helps me make informed decisions
- Teaches that there's rarely one "right" answer

**4. "Why would I use [technique A] instead of [technique B]?"**
- Helps me understand tradeoffs
- Builds decision-making skills

**5. "Review this code for security/accessibility/performance"**
- Catches issues I wouldn't know to look for
- Teaches me what to check in the future

### ❌ Prompts That Didn't Work

**1. "Build me an assignment tracker"**
- Too vague
- Generates code I don't understand
- No learning happens

**2. "Fix this [paste 500 lines]"**
- Too much context at once
- Hard to understand the fix
- Better to isolate the problem first

**3. "What's the best way to [vague task]?"**
- Gets philosophical answers instead of practical help
- Need to be more specific about constraints and goals

---

## 💭 Reflections on AI Partnership

### What Surprised Me

**1. AI Doesn't Always Know Best**
Sometimes AI suggested overly complex solutions when simple ones worked fine. I learned to evaluate suggestions critically.

**2. The Value of Explanation Over Code**
The conversations where AI explained concepts were way more valuable than when it just gave me code. Understanding > working code.

**3. AI Can't Test My Code**
AI can review code theoretically, but can't run it and find runtime bugs. I still need to test thoroughly myself.

**4. Context Matters**
The more specific context I provided, the better AI's answers. "I'm a student building a homework tracker for a web dev class" gets better responses than just "help me code."

### How AI Changed My Process

**Before AI**:
- Got stuck and frustrated easily
- Avoided features that seemed too hard
- Spent hours googling with limited success
- Felt intimidated by documentation

**With AI**:
- Can break down complex problems into pieces
- Willing to try ambitious features
- Learn new concepts quickly with tailored explanations
- Understand documentation better after AI explains it

**The Balance**:
- AI is a teacher, not a shortcut
- I still need to write code and think through logic
- Understanding > completion
- Sometimes struggling without AI teaches me more

### What I'd Do Differently

**1. Start with Learning, Not Building**
Next time, I'd spend the first week just learning concepts through AI conversations before writing any code.

**2. Document As I Go**
I should have kept this log from day 1. It's hard to remember all the learning moments now.

**3. Test AI Code Immediately**
Don't assume AI code works. Test each piece as I get it.

**4. Use Multiple AI Tools**
I mostly used Claude. Getting a second opinion from ChatGPT or Copilot would have been valuable for comparison.

**5. Teach Someone Else**
Explaining my project to a classmate would have revealed gaps in my understanding.

---

## 📈 Skills Progression

### Before This Project
- Basic HTML/CSS from Project 1
- Simple JavaScript from Project 2  
- Some API work from Project 3
- No modular code experience
- Confused by async programming
- Never parsed text files
- Basic localStorage use only

### After This Project
- Advanced CSS (variables, grid, animations)
- Modular JavaScript architecture
- Async/await patterns
- File upload and processing
- Regular expressions
- Complex state management
- Event delegation
- Security best practices (XSS prevention)
- Accessibility implementation
- Debugging strategies

### Skills Still Developing
- Testing and validation
- Performance optimization
- Advanced regex patterns
- Error handling edge cases
- Browser compatibility
- Progressive enhancement

---

## 🎓 Key Takeaways

### About Coding
1. **Modularity is everything** - Separate concerns make code manageable
2. **Security matters** - Sanitize user input, always
3. **Accessibility isn't optional** - Build for all users from the start
4. **Testing catches bugs** - Use console, test edge cases, try to break things
5. **Simple often beats complex** - Text files over PDFs was the right call

### About AI Collaboration
1. **AI is a teacher, not a crutch** - Use it to learn, not to avoid learning
2. **Question everything** - AI isn't always right for your situation
3. **Explain concepts back** - Teaching confirms understanding
4. **Iterate your prompts** - Better questions = better answers
5. **Context is crucial** - The more AI knows about your goals, the better it helps

### About Learning
1. **Struggle teaches** - Sometimes figuring it out myself was more valuable than asking AI
2. **Build things you need** - I'll actually use this assignment tracker
3. **Document your journey** - This log helped me see my growth
4. **Break big problems into small ones** - Don't try to do everything at once
5. **It's okay to not know** - Every expert was once a beginner

---

## 🔮 Future Learning Goals

Based on this project, I want to learn:

1. **Testing** - Write actual unit tests for my code
2. **Backend Development** - Build a real database instead of localStorage
3. **Advanced Parsing** - PDF parsing, more robust text extraction
4. **API Integration** - Connect to Canvas, Google Calendar, etc.
5. **TypeScript** - Add type safety to catch bugs earlier
6. **React/Vue** - Learn modern frameworks (my modular approach is similar!)
7. **Progressive Web Apps** - Make this work offline and installable
8. **CI/CD** - Automatic testing and deployment

---

## 🤝 Division of Labor: What I Did vs. What AI Did

### 🎨 What I (Margaux) Did

**1. Creative & Design Decisions**
- ✅ Chose purple as the primary color scheme
- ✅ Requested light purple (#faf5ff) background in light mode, dark purple (#1e1b4b) in dark mode and tweaked this in the CSS
- ✅ Decided to add 6 selectable color themes (purple, blue, green, pink, orange, red)
- ✅ Asked for course-based color-coding to visually organize assignments
- ✅ Requested form layout changes (assignment name on its own row, course + date together)
- ✅ Decided to completely remove priority filtering/sorting feature
- ✅ Chose to use text file upload instead of PDF parsing (after AI suggested PDFs)

**2. Project Requirements & Features**
- ✅ Defined core feature: Assignment tracker with syllabus upload
- ✅ Requested course management system with welcome modal
- ✅ Asked for ability to add courses and color-code assignments by course
- ✅ Specified filtering and sorting functionality
- ✅ Requested statistics dashboard
- ✅ Asked for drag-and-drop file upload
- ✅ Decided to include both dark and light modes

**3. Testing & Quality Control**
- ✅ Tested the application in browser after each change
- ✅ Identified bugs and reported them (welcome modal issues, priority still showing in forms)
- ✅ Verified file upload functionality with sample syllabus
- ✅ Tested all 6 color themes and dark/light mode toggle
- ✅ Checked responsive design on different screen sizes
- ✅ Made decisions about what worked and what needed to be changed/removed

**4. Iterative Refinement**
- ✅ Asked for priority field to be completely removed (multiple times until gone everywhere)
- ✅ Requested background color changes
- ✅ Asked for course legend to display active courses
- ✅ Specified form layout preferences
- ✅ Reviewed and approved final implementation

**5. Documentation Direction**
- ✅ Wrote a comprehensive REFLECTION.md covering evaluation criteria
- ✅ Showed clear delineation between my work and AI's work in this log
- ✅ Provided evaluation rubric details for reflection document

### 🤖 What AI (Claude) Did

**1. Code Architecture & Structure**
- ✅ Designed modular JavaScript architecture (4 separate files)
- ✅ Created separation of concerns: storage.js, parser.js, ui.js, app.js
- ✅ Implemented module communication pattern
- ✅ Structured HTML with semantic elements
- ✅ Organized CSS with custom properties system

**2. Technical Implementation**
- ✅ Wrote most HTML structure (500+ lines)
- ✅ Wrote most CSS styling (800+ lines) including:
  - 6 complete color theme systems
  - Responsive design with 4 breakpoints
  - Dark/light mode variants
  - Animation keyframes
  - Grid and Flexbox layouts
- ✅ Wrote all JavaScript code (450+ lines) including:
  - LocalStorage CRUD operations
  - Async file upload handling
  - Regular expression date parsing
  - Course management logic
  - UI rendering functions
  - Event handling and delegation

**3. Complex Problem Solving**
- ✅ Created regex patterns for multiple date formats (MM/DD/YYYY, Month DD YYYY, etc.)
- ✅ Implemented async/await for FileReader API
- ✅ Built hash-based algorithm for consistent course color assignment
- ✅ Developed localStorage persistence with Date object serialization
- ✅ Created course legend generation logic
- ✅ Implemented drag-and-drop file upload functionality

**4. Code Review & Bug Fixing**
- ✅ Identified security issues (innerHTML with user input)
- ✅ Caught localStorage Date serialization bug
- ✅ Suggested accessibility improvements
- ✅ Fixed priority field showing in forms (multiple iterations)
- ✅ Debugged course dropdown issues
- ✅ Fixed welcome modal first-visit logic
- ✅ Implemented fixes based on my bug reports

**5. Documentation Creation**
- ✅ Wrote comprehensive README.md with installation, features, usage
- ✅ Created initial AI_COLLABORATION_LOG.md structure
- ✅ Wrote sample syllabus text file for testing
- ✅ Edited REFLECTION.md for some clarity
- ✅ Added technical explanations and code examples in documentation

### 🔄 What We Did Together (Collaborative)

**1. Iterative Feature Development**
- 💡 I requested features → AI implemented → I tested → I requested changes → AI refined
- Example: Priority removal went through 3 iterations until completely gone from all UI

**2. Design Evolution**
- 💡 I provided color preferences → AI implemented theme system → I tested and approved
- 💡 I requested color-coding → AI designed algorithm → I tested on sample data

**3. Problem-Solving Discussions**
- 💡 I asked "How do I parse different date formats?" → AI explained regex → I understood and approved approach
- 💡 I reported "File upload isn't working" → AI diagnosed async issue → explained solution → implemented fix

**4. Learning Process**
- 💡 AI explained concepts → I asked follow-up questions → AI provided examples → I tested understanding
- 💡 I attempted implementation → AI reviewed → suggested improvements → I learned from feedback

**5. Documentation Refinement**
- 💡 I provided evaluation criteria → AI wrote reflection → I reviewed → requested clearer division of labor
- 💡 AI created documentation → I tested accuracy → reported gaps → AI filled them in

### 📊 Rough Percentage Breakdown

| Task | My Contribution | AI Contribution |
|------|----------------|-----------------|
| **Project Vision & Requirements** | 90% | 10% |
| **Design Decisions (colors, layout)** | 85% | 15% |
| **Code Writing** | 20% | 80% |
| **Architecture Design** | 30% | 70% |
| **Testing & Bug Finding** | 95% | 5% |
| **Bug Fixing (writing fixes)** | 5% | 95% |
| **Feature Refinement Requests** | 100% | 0% |
| **Documentation Writing** | 85% | 15% |
| **Learning & Understanding** | 60% | 40% (teaching) |
| **Overall Project** | 63% | 37% |

### 🎯 Key Insight

**I directed the project; AI executed the code.**

- **My role**: Product manager, designer, tester, learner
- **AI's role**: Senior developer, teacher, code reviewer, documentation writer

I made all the decisions about WHAT to build and HOW it should look/work. AI figured out HOW to implement it technically and taught me the concepts along the way. This is the ideal AI collaboration for learning - I stayed in control while gaining expert implementation and explanation.

---

## 🙏 Final Thoughts

This project challenged me way more than I expected. The syllabus parsing feature seemed simple when I started but turned out to be incredibly complex. AI was crucial for getting through the hard parts, but I also learned that AI can't do everything - I still had to think, test, and debug.

The biggest lesson? **Building something real is the best way to learn.** I'll remember how async/await works because I struggled with file reading. I understand modular code because I organized a real project. This beats any tutorial or exercise.

I'm proud of what I built, even though it's not exactly what I envisioned. The rough edges show where I pushed beyond my comfort zone and learned something new. That's what upskilling is about.

---

**Date Completed**: December 8, 2025    
**Would I Use AI Again?**: Absolutely, but differently - as a teacher, not a code generator.
