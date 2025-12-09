# Developer Reflection - Assignment Tracker Project

**Student**: Margaux Lawrence  
**Course**: COMM 221 - Project Zed  
**Date**: December 2025  
**Word Count**: ~1000 words

---

## What Did I Build and Why?

I built a homework assignment tracker with automatic syllabus parsing capabilities. As a college student, I'm constantly juggling assignments across multiple classes, and I wanted a tool that could help me stay organized without manual data entry for every single assignment. The core idea was ambitious: upload your syllabus, and let the app automatically extract due dates and assignment names, then manage everything in one place with visual organization by course.

The final app allows users to either upload a text file containing their course syllabus—which is then parsed using pattern recognition and regular expressions—or manually add assignments with full details including course name, due date, and notes. I implemented a course management system where users set up their courses first, then select from those courses when adding assignments. Each course gets a unique color for visual organization. All data persists in the browser's localStorage, so nothing is lost when you close the tab. Users can filter by status (pending, completed, overdue), sort by various criteria, choose from six color themes, toggle between light and dark themes, and see real-time statistics about their assignment load.

I chose this project because it solved a real problem I face every semester, and it pushed me to learn several advanced techniques I'd never used before: file upload processing, text parsing with regular expressions, modular JavaScript architecture, complex state management across multiple interacting components, and dynamic theming systems. Most importantly, I wanted to challenge myself beyond what we'd done in Projects 1-3.

---

## What Skills from Projects 1-3 Did I Upskill? How?

From **Project 1 (HTML/CSS)**, I took basic styling and responsive design much further. Instead of just using a few media queries, I implemented a complete design system with CSS custom properties (variables) for theming—over 50 variables controlling colors, spacing, typography, shadows, and transitions. I created a dark mode that users can toggle, with the preference saved across sessions. My responsive design uses four breakpoints (desktop, tablet landscape, tablet portrait, and mobile) with CSS Grid and Flexbox layouts that adapt seamlessly. I also implemented advanced CSS animations including keyframe animations for cards sliding in, smooth transitions on all interactive elements, and even a pulsing animation for overdue assignments.

From **Project 2 (JavaScript Fundamentals)**, I evolved from simple scripts to a modular architecture with four separate JavaScript files, each handling distinct responsibilities. The Storage module manages all localStorage operations with error handling and data validation. The UI module handles DOM manipulation and rendering. The Parser module processes text files. The main App module coordinates everything. I implemented event delegation patterns for efficiently handling clicks on dynamically-created assignment cards, form validation with user-friendly error messages, and complex data structures for filtering and sorting assignments by multiple criteria simultaneously.

From **Project 3 (APIs & Advanced JS)**, I built upon basic async work by implementing the FileReader API with async/await patterns to handle file uploads smoothly. I created a state management system that keeps track of filter preferences, sort order, and theme selection across page reloads. Error handling is robust throughout—every function that touches localStorage or processes user input includes try-catch blocks with graceful failure modes. If parsing fails, users can still add assignments manually. If localStorage is corrupted, the app starts fresh without crashing.

---

## How Did AI Change My Development Process?

Working with AI fundamentally changed how I approach coding challenges. Instead of getting stuck and giving up on features that seemed too complex, I could break problems into smaller pieces with AI's help and tackle each one systematically. For example, the syllabus parsing feature seemed impossible at first—how do you extract dates from unstructured text in dozens of different formats? AI taught me about regular expressions, showed me patterns for matching dates, and explained how to validate and normalize the extracted data.

But AI wasn't a magic solution. I learned quickly that I couldn't just copy-paste code without understanding it. When things broke (and they broke often), I needed to understand the logic to debug effectively. My process evolved from "AI, write this for me" in the first week to "AI, help me understand how this works" and eventually to "Here's what I wrote—what did I miss?"

The most valuable conversations weren't about code at all. They were about concepts: "Explain asynchronous programming," "Why use modules instead of one big file?", "What's the difference between let and const?" These conversations built my understanding in ways that just copying code never could.

---

## What Surprised Me About Working with AI?

I was genuinely surprised by how often AI was *wrong*—or at least, wrong for my specific situation. When I asked about PDF parsing, AI suggested a complex library that would have added weeks to my timeline and complexity I couldn't manage. I learned to evaluate AI suggestions critically and sometimes say "no, that's too much."

I was also surprised by how much I still needed to struggle and debug on my own. AI can explain concepts and suggest solutions, but it can't run my code in the browser, see the actual errors, or understand the full context of my project. The debugging process—reading console errors, adding console.log statements, testing edge cases—that was all on me. And honestly, that's where I learned the most.

The biggest surprise? **Teaching concepts back to AI helped me learn.** When I could explain localStorage or event delegation in my own words and have AI confirm my understanding, that's when I knew I'd really learned something.

---

## What Would I Do Differently Next Time?

I would start with a clearer MVP (Minimum Viable Product) scope. I initially wanted PDF parsing, email reminders, calendar integration, and more. I eventually scaled back to text files only, which was the right decision, but I wasted time early on exploring features I couldn't realistically implement.

I would also keep this reflection log from day one instead of trying to remember everything at the end. The most valuable learning moments happened in the middle of debugging or when AI explained a tricky concept, and those are hard to reconstruct later.

Testing is another area I'd approach differently. I tested by clicking around the interface, but I should have written actual test cases: "What happens if someone uploads an empty file? What if a date is in the year 2030?" Systematic testing would have caught bugs earlier.

Finally, I'd get peer feedback earlier. I showed my project to classmates only near the end, and they pointed out usability issues I'd never noticed because I was too close to the code.

---

## What Am I Most Proud Of?

I'm incredibly proud of the syllabus parsing feature—not because it works perfectly (it doesn't!), but because I built something that seemed completely impossible at the start. When I first thought "what if you could just upload a syllabus and have assignments automatically added," I had no idea where to even begin. The idea of writing code that could read text and understand "January 15, 2025" vs "1/15/25" vs "Jan 15" felt like magic.

Working with AI, I learned about regular expressions—these cryptic patterns that can match text in powerful ways. The breakthrough moment was when I tested my parser on a real syllabus from one of my classes and it actually found 8 out of 10 assignments correctly. Those two it missed? I debugged why (the date format was "Week 3" instead of an actual date) and understood the limitation. That's what I'm proud of—not perfection, but understanding.

I'm also proud of the course management system with color-coding. This wasn't in my original plan, but as I developed the app, I realized it needed better visual organization. Implementing the algorithm that assigns consistent colors to courses based on their names felt like real problem-solving, not just following a tutorial.

## What Challenged Me Most?

The biggest challenge was **asynchronous JavaScript** for file reading. I spent hours trying to figure out why `file.text()` wasn't working the way I expected. The file would upload, but my code would try to use the content before it was actually loaded. AI explained promises and async/await, but understanding it required me to break down the code step by step, add console.log statements everywhere, and test repeatedly.

Another major struggle was **localStorage data persistence**. My app kept crashing when I refreshed the page because I was trying to save Date objects directly, which don't convert to JSON properly. The error messages weren't helpful initially—they just said "undefined" errors. Through debugging with AI's help, I learned that I needed to convert dates to ISO strings before saving and back to Date objects when loading. This taught me that data storage requires more thought than just "save everything."

The **regex patterns for date parsing** were also incredibly challenging. Writing patterns that could match "January 15, 2025" and "1/15/25" and "Jan 15" required understanding special characters, optional groups, and case-insensitive matching. I spent an entire evening testing patterns on regex101.com before I got something that worked reliably. Even now, some date formats don't work, and that's okay—I learned where the limits are.

## What Didn't Work (And What I Learned From It)

**PDF Parsing:** I originally wanted to parse PDF syllabi, not just text files. AI suggested using PDF.js library, and I spent two days trying to implement it before realizing it was way too complex for my skill level and timeline. The library was 200KB, required understanding web workers, and had minimal documentation I could understand. 

**What I learned:** Sometimes the ambitious idea isn't feasible, and that's a valuable lesson too. I made the hard decision to scope down to text files only, document it as a future enhancement, and move on. This was actually good project management—knowing when to pivot.

**Priority System:** I initially built a full priority system (high/medium/low) with color-coding and sorting. But as I tested it, I realized it made the interface too cluttered and the color-coding by course was more useful. I had to delete code I'd spent hours on. 

**What I learned:** Features that seem good in theory don't always work in practice. Being willing to remove things is part of good design. The course color-coding replaced priority as the visual organization system, and it works better.

**First-Time Welcome Modal:** Getting the modal to show only on the first visit required understanding localStorage flags and state management. My first version showed the welcome modal every single time, even after setup. I had to debug the logic for checking if a user had visited before.

**What I learned:** State management is complex. You have to think about all the conditions: What happens on first visit? Second visit? After clearing localStorage? Testing edge cases is crucial.

## How Has My Confidence as a Developer Changed?

At the start of this project, I felt overwhelmed. Parsing text files? Regex? Modular architecture? These felt like "advanced developer" skills I wasn't ready for. But I built them anyway, piece by piece, with AI as my teaching assistant.

Now I feel confident tackling problems I would have avoided before. I know that even if I don't understand something initially, I can break it down, research it, ask smart questions, and figure it out. I'm not afraid of documentation anymore—AI taught me how to read it effectively.

I also understand my own code now. Every line in this project either came from me directly or came from AI but I modified and understood it. I can explain what every function does and why I structured things the way I did. That's a completely different feeling from Projects 1-2, where I sometimes copied code I didn't fully grasp.

**The biggest confidence boost?** I'm no longer intimidated by bugs. In the past, an error message would make me panic. Now, I see errors as information. "Uncaught TypeError: Cannot read property 'value' of null" tells me I'm trying to access an element that doesn't exist yet. I check the DOM, verify my IDs, test when the code runs. Debugging has become a logical process instead of random guessing.

Most importantly, I learned that struggling is part of learning. The features that took the longest—async file reading, date parsing, modular structure—are the ones I understand best now. AI helped me through the struggle, but it didn't eliminate it. And that struggle made me a better developer.

## What Are My "Aha!" Moments?

**Moment 1: Understanding Promises**  
When AI explained that `async/await` is just "cleaner promises," something clicked. I realized that JavaScript needs ways to handle things that take time (like reading files), and promises are the solution. This opened up understanding APIs, fetch requests, and asynchronous patterns everywhere in modern web development.

**Moment 2: Regex is Pattern Matching**  
I was terrified of regex until I understood it's just describing patterns: "a month name, followed by space(s), followed by 1-2 digits." Breaking patterns into plain English first, then translating to regex symbols, made it approachable.

**Moment 3: Modules are About Organization**  
I initially thought modular code was about showing off. Then I needed to debug the storage system and realized having all storage logic in one file made it SO much easier. Modules aren't fancy—they're practical organization that makes debugging and maintenance possible.

**Moment 4: CSS Variables are Powerful**  
When I implemented the color theme switcher, I realized I could change 50+ colors throughout the app by updating just 6 variables. This taught me that good CSS architecture isn't about knowing every property—it's about setting up systems that are maintainable.

## Critical Evaluation of My AI Collaboration

**What I Did Well:**
- Asked "why" questions, not just "how" questions
- Tested AI code immediately instead of assuming it worked
- Researched concepts AI introduced (regex101.com, MDN docs)
- Documented when AI was wrong or gave overly complex solutions

**What I Could Improve:**
- In the beginning, I accepted AI's first answer without questioning if there was a simpler way
- Sometimes I asked AI to write entire functions instead of just explaining the approach
- I should have used multiple AI tools for comparison (I mostly used Claude)
- Better prompting: Instead of "this doesn't work," I learned to say "Here's my code, here's the error, here's what I've tried"

**Where AI Excelled:**
- Explaining concepts (async/await, promises, regex)
- Catching security issues (XSS prevention, HTML escaping)
- Suggesting accessibility improvements (ARIA labels, keyboard navigation)
- Code review and pointing out edge cases

**Where AI Failed:**
- PDF parsing suggestion was too complex for my level
- Sometimes generated overly complicated solutions when simple ones existed
- Can't actually run and test code, so runtime bugs still required my debugging

## Evidence of Technical Growth

**Before this project, I could:**
- Write basic HTML/CSS
- Use simple JavaScript variables and functions
- Make fetch requests to APIs (barely)
- Use basic event listeners

**Now I can:**
- Architect multi-module JavaScript applications
- Work with asynchronous patterns (async/await, Promises, FileReader)
- Parse text with regular expressions
- Implement complex state management across modules
- Create theming systems with CSS custom properties
- Handle localStorage CRUD operations with validation
- Debug systematically using console, breakpoints, and error analysis
- Make design decisions (when to add features, when to remove them)
- Read documentation and understand technical concepts

**Specific New Techniques I Can Use Again:**
1. FileReader API for client-side file processing
2. Regular expressions for text pattern matching
3. Modular JavaScript architecture (separation of concerns)
4. CSS custom properties for theming systems
5. Hash functions for consistent data-driven styling (course colors)
6. LocalStorage data validation and error handling
7. Async/await patterns for asynchronous operations
8. Event delegation for dynamic content

## What I Would Do Differently Next Time

1. **Start with a clearer MVP:** I should have built the manual entry system completely before attempting syllabus parsing. Having a working foundation would have made the advanced feature less stressful.

2. **Write test cases:** I tested by clicking around, but I should have written down specific test scenarios: "What if someone uploads an empty file? What if all dates are invalid? What if a course name has special characters?"

3. **Commit more frequently:** I sometimes worked for hours before committing. Smaller, focused commits with clear messages would have helped me track my progress better.

4. **Document as I go:** Writing the AI_COLLABORATION_LOG at the end meant I forgot some valuable learning moments. I should have kept notes throughout.

5. **Ask for peer feedback earlier:** I showed classmates near the end. Earlier feedback would have caught usability issues sooner.

6. **Time management:** I underestimated how long regex and file parsing would take. Better time estimation comes with experience, but I should have set deadlines for each feature.

## Final Reflection: What This Project Taught Me About Learning

This project taught me that **learning to code isn't about memorizing syntax—it's about building problem-solving skills**. When I encountered the async file reading problem, I didn't know the solution, but I knew how to find it: read error messages, search documentation, ask specific questions, test small pieces, iterate until it works.

**The value of this project isn't that everything works perfectly.** Some date formats don't parse, the UI could be more polished, and the code could be more optimized. But I understand WHY those limitations exist and HOW I would improve them. That understanding is worth more than perfect code I copied without comprehension.

**Working with AI taught me that collaboration doesn't mean letting someone else do the work.** AI is a teaching assistant, not a shortcut. The best conversations were when I said "I tried this, here's what happened, I think the problem is X, am I on the right track?" That's active learning, not passive code consumption.

Most importantly, this project proved I can tackle ambitious challenges. Three weeks ago, building a file upload system with text parsing felt impossible. Now I've built it, debugged it, refined it, and can explain every piece. **That's growth.**

---

**Words**: ~1000  
**Completed**: December 9, 2025  
**Final Thought**: This project proved I can build something ambitious and useful, even when starting from a place of not knowing. The partially working features taught me more than perfect ones would have. That's the whole point of upskilling.
