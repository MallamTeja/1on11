# SkillSync Education Platform

SkillSync is a modern education platform built with HTML, CSS, and JavaScript that provides an interactive learning experience for coding skills, mentorship, and collaborative study groups.
figma UIUX = https://www.figma.com/make/4dfxqQalPFqUnMfN49vI2z/Mentorship---Coding-Platform?node-id=0-1&p=f&t=E5w7CaNygCIcFMjN-0

## Project Structure

```
.
├── index.html          # Landing page
├── login.html          # User login page
├── signup.html         # User registration page
├── dashboard.html      # User dashboard
├── search.html         # Course browsing and search
├── app.js             # Main JavaScript functionality
├── styles.css         # Custom CSS styles and variables
├── package.json       # Project dependencies and scripts
└── backend/           # Backend services (Node.js)
```

## Features

- **Modern UI Design**: Beautiful gradient backgrounds with glassmorphism effects
- **Responsive Layout**: Mobile-first design using Tailwind CSS
- **User Authentication**: Login and signup functionality with form validation
- **Interactive Dashboard**: Personal learning progress tracking
- **Course Discovery**: Browse and search educational content
- **Real-time Feedback**: Loading states and success/error notifications
- **Local Storage**: Session management for user data
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm start` - Start the development server on port 3000
- `npm run serve` - Start the server on port 8080
- `npm run dev` - Start with live-server for auto-reload

## Features Overview

### Landing Page (index.html)
- Hero section with call-to-action buttons
- Feature highlights with icons
- Responsive navigation
- Modern gradient design

### Authentication System
- **Login Page**: Email/password authentication with remember me option
- **Signup Page**: User registration with password confirmation
- **Form Validation**: Client-side validation with error messages
- **Session Management**: Local storage for user sessions

### Dashboard (dashboard.html)
- **Progress Tracking**: Course completion statistics
- **Learning Streak**: Daily learning streak counter
- **Quick Actions**: Easy access to common features
- **Recent Activity**: Timeline of learning activities
- **Upcoming Events**: Scheduled workshops and study groups

### Course Browser (search.html)
- **Course Catalog**: Grid layout of available courses
- **Search Functionality**: Real-time course search
- **Filtering Options**: Filter by category, level, and duration
- **Course Cards**: Detailed course information with ratings

## Technologies Used

- **HTML5**: Semantic markup and accessibility
- **CSS3**: Custom properties, flexbox, and grid
- **JavaScript (ES6+)**: Modern JavaScript features
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Font Awesome**: Icon library for UI elements
- **HTTP Server**: Local development server

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

The application uses vanilla JavaScript with modern ES6+ features:

- **Modular Code**: Organized into reusable functions
- **Event Handling**: Proper event delegation and cleanup
- **Form Validation**: Client-side validation with user feedback
- **Local Storage**: Persistent user sessions
- **Responsive Design**: Mobile-first approach

## Customization

### Styling
- Modify CSS variables in `styles.css` for theme customization
- Update Tailwind configuration in HTML files
- Add custom components in the CSS file

### Functionality
- Extend `app.js` with new features
- Add new pages following the existing structure
- Integrate with backend APIs as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.
