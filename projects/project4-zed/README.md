# Assignment Tracker - Project Zed

A powerful homework assignment tracker with automatic syllabus parsing capabilities. Upload your syllabus and let the app automatically extract assignments, or add them manually with full CRUD functionality.

![Assignment Tracker](https://img.shields.io/badge/Status-Active-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎯 Features

### Core Functionality
- ✅ **Manual Assignment Entry** - Add assignments with name, course, due date, priority, and notes
- 📄 **Syllabus Upload & Parsing** - Automatically extract assignments from text files
- 🔄 **Full CRUD Operations** - Create, Read, Update, Delete assignments
- 💾 **Persistent Storage** - All data saved in localStorage
- 🌓 **Dark/Light Theme** - Toggle between themes with preference saving
- 📊 **Real-Time Statistics** - Track total, pending, completed, and overdue assignments

### Advanced Features
- 🎨 **Drag & Drop Upload** - Intuitive file upload interface
- 🔍 **Smart Filtering** - Filter by status, course, or search term
- 📋 **Multiple Sort Options** - Sort by due date, priority, course, or name
- ⚡ **Priority System** - Mark assignments as high, medium, or low priority
- 🎯 **Status Tracking** - Visual indicators for completed and overdue assignments
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ♿ **Accessibility** - ARIA labels, keyboard navigation, screen reader support

## 🚀 Demo

[View Live Demo](https://margauxlawrence.github.io/40363-ZED/) *(Update this link after deployment)*

## 🛠️ Technologies Used

### HTML5
- Semantic HTML structure
- Form validation
- File upload API
- Modal dialogs

### CSS3
- CSS Custom Properties (CSS Variables) for theming
- CSS Grid & Flexbox for responsive layouts
- Advanced animations and transitions
- Multiple media query breakpoints
- Container-based responsive design

### JavaScript (Vanilla)
- ES6+ modern syntax
- Modular architecture (4 separate modules)
- Async/await for file operations
- LocalStorage API for data persistence
- FileReader API for file processing
- Regular expressions for text parsing
- Event delegation patterns
- Complex state management

## 📦 Installation & Setup

### Option 1: Direct Download
1. Clone or download this repository
```bash
git clone https://github.com/margauxlawrence/40363-ZED.git
cd 40363-ZED
```

2. Open `index.html` in your browser
   - No build process required!
   - Works completely client-side

### Option 2: Local Server (Recommended)
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 📖 How to Use

### Adding Assignments Manually
1. Fill out the "Add Assignment Manually" form
2. Enter assignment name, course, due date, and priority
3. Optionally add notes
4. Click "Add Assignment"

### Uploading a Syllabus
1. Prepare a `.txt` file with your syllabus
2. Drag and drop it onto the upload area, or click to select
3. The app will automatically parse and extract assignments
4. Review and edit extracted assignments as needed

#### Syllabus Format Examples
The parser recognizes multiple formats:

```
Assignment 1 - Due: 1/15/2025
Essay on Climate Change - Due January 20, 2025
Midterm Exam - 2/14/2025
Final Project Presentation - March 15
```

### Managing Assignments
- **Complete**: Click the ✅ button to mark as complete
- **Edit**: Click the ✏️ button to modify details
- **Delete**: Click the 🗑️ button to remove
- **Filter**: Use the filter dropdowns to view specific assignments
- **Sort**: Choose how to order your assignments

### Theme Toggle
Click the 🌙/☀️ button in the header to switch themes

## 🎓 Upskilled Techniques Demonstrated

This project demonstrates significant upskilling from Projects 1-3:

### From Project 1 (HTML/CSS) - Upskilled
✅ **Advanced CSS Custom Properties** - Complete theming system with 50+ variables  
✅ **CSS Grid & Flexbox** - Complex responsive layouts with multiple breakpoints  
✅ **Advanced Animations** - Keyframe animations, transitions, transforms  
✅ **Responsive Design** - 4 breakpoints (desktop, tablet landscape, tablet, mobile)  
✅ **Design System** - Consistent spacing, typography, and color systems

### From Project 2 (JavaScript) - Upskilled
✅ **Complex DOM Manipulation** - Dynamic card creation and updates  
✅ **Event Delegation** - Efficient event handling for dynamic content  
✅ **Modular JavaScript** - 4 separate modules with clear separation of concerns  
✅ **Form Validation** - Client-side validation with error handling  
✅ **Advanced Data Structures** - Complex filtering and sorting algorithms

### From Project 3 (APIs & Advanced JS) - Upskilled
✅ **Async Patterns** - Promise-based file reading with async/await  
✅ **Complex State Management** - Coordinated state across multiple modules  
✅ **Error Handling** - Try-catch blocks with graceful error recovery  
✅ **LocalStorage Management** - Advanced CRUD operations with data validation

### New Techniques (AI-Learned)
✅ **File Upload & Processing** - FileReader API for client-side file handling  
✅ **Text Parsing** - Regular expressions for syllabus parsing  
✅ **Pattern Recognition** - Multi-format date and assignment extraction  
✅ **Accessibility Features** - ARIA attributes, keyboard navigation, focus management  
✅ **Performance Optimization** - DOM caching, efficient re-rendering

## 🗂️ Project Structure

```
40363-ZED/
├── index.html              # Main HTML structure
├── css/
│   └── style.css          # Complete styling with theming
├── js/
│   ├── app.js             # Main application controller
│   ├── storage.js         # LocalStorage management
│   ├── parser.js          # Syllabus parsing logic
│   └── ui.js              # UI rendering and updates
├── images/                # Project images/screenshots
├── AI_COLLABORATION_LOG.md # AI partnership documentation
├── REFLECTION.md          # Developer reflection
├── README.md              # This file
└── LICENSE                # Project license
```

## 🤖 AI Collaboration

This project was built in partnership with AI assistants. See [AI_COLLABORATION_LOG.md](./AI_COLLABORATION_LOG.md) for:
- Detailed collaboration process
- Key learning moments
- Challenges and solutions
- Sample conversations
- Process evolution

## 📝 Reflection

For insights into the development process and learning journey, see [REFLECTION.md](./REFLECTION.md).

## 🎯 Future Enhancements

Potential features for future development:
- [ ] PDF syllabus parsing support
- [ ] Calendar view with date picker
- [ ] Email/SMS reminders for due dates
- [ ] Export to iCalendar format
- [ ] Course template system
- [ ] Collaboration features (shared assignments)
- [ ] Mobile app version (PWA)
- [ ] Integration with Canvas/Blackboard APIs
- [ ] Grade tracking
- [ ] Study time estimation

## 🐛 Known Issues

- PDF parsing not yet implemented (text files only)
- Some syllabus formats may not parse perfectly (manual entry fallback available)
- Theme preference resets if localStorage is cleared

## 🤝 Contributing

This is a student project, but feedback and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Margaux Lawrence**
- GitHub: [@margauxlawrence](https://github.com/margauxlawrence)
- Project: COMM 221 - Project Zed (Fall 2025)

## 🙏 Acknowledgments

- **AI Tools Used**: Claude (Anthropic), GitHub Copilot
- **Course**: COMM 221 - Web Development
- **Instructor**: [Your Instructor's Name]
- **Fonts**: Inter from Google Fonts
- **Inspiration**: Real student needs for assignment tracking

## 📚 Resources Used

- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript reference
- [CSS-Tricks](https://css-tricks.com/) - CSS techniques
- [Web.dev](https://web.dev/) - Best practices
- [A11y Project](https://www.a11yproject.com/) - Accessibility guidelines

---

**Built with 💙 and AI assistance for COMM 221 Project Zed**
