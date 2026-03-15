# 🏆 Sports Management System

A fully functional static sports management website with modern glassmorphism UI, 4K responsive design, and role-based access control. Built with pure HTML/CSS/JavaScript and localStorage - no backend or build process required!

## ⚡ Quick Start with Live Server

### Method 1: VS Code Live Server (Recommended)

1. **Install Live Server Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install by Ritwick Dey

2. **Run the Application**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Browser opens automatically at `http://127.0.0.1:5500`

### Method 2: Any Live Server

Simply serve the folder with any static file server:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🔑 Default Login

- **Email**: admin@sports.com
- **Password**: admin123

## ✨ Features

### 🎨 Modern UI/UX
- Glassmorphism design with blur effects
- 4K responsive (mobile to 4K displays)
- Dark/Light mode toggle
- Smooth animations
- Abstract gradient background

### 🔐 Authentication
- Sign Up/Sign In with validation
- Role-based access (Admin, Team Leader, Player)
- Social login UI (Google, Apple)
- Persistent sessions

### 👥 User Roles

**Admin Dashboard**
- Manage sports, teams, tournaments, users
- Full CRUD operations
- View statistics

**Team Leader Dashboard**
- Manage assigned teams
- Approve/reject join requests
- Add/remove members

**Player Dashboard**
- Join teams
- Apply to tournaments
- View personal stats

### 💾 Data Storage
- localStorage only (no backend)
- Cross-tab sync
- Pre-populated sample data

## 📁 Project Structure

```
Sports Management/
├── index.html          # Main HTML file
├── style.css           # All styles (glassmorphism)
├── app.js              # All JavaScript (no dependencies)
└── README.md           # This file
```

## 🎯 How to Use

### For Players
1. Sign up with your details
2. Browse and join teams
3. Apply to tournaments
4. Track your memberships

### For Team Leaders
1. Sign up as Team Leader
2. Wait for admin to assign a team
3. Approve/reject join requests
4. Manage team members

### For Admins
1. Login with admin credentials
2. Create sports, teams, tournaments
3. Manage all users
4. View system statistics

## 🎨 Features Included

✅ Glassmorphism UI design
✅ Dark/Light theme toggle
✅ Fully responsive (mobile to 4K)
✅ Role-based dashboards
✅ Team management system
✅ Tournament system with deadlines
✅ Join request workflow
✅ Real-time notifications
✅ Form validation
✅ localStorage persistence
✅ Cross-tab synchronization
✅ No build process needed
✅ No dependencies required

## 🌐 Deployment

### GitHub Pages
1. Create a GitHub repository
2. Upload all files
3. Go to Settings > Pages
4. Select main branch
5. Your site is live!

### Netlify
1. Drag and drop the folder to Netlify
2. Site is live instantly!

### Any Static Host
Upload the 3 files (index.html, style.css, app.js) to any static hosting service.

## 🔒 Security Note

This is a demo application using localStorage. For production:
- Implement proper backend authentication
- Use encrypted password storage
- Add HTTPS
- Implement rate limiting

## 🐛 Troubleshooting

**Issue**: Blank screen
- Check browser console (F12)
- Ensure localStorage is enabled
- Try incognito mode

**Issue**: Data not persisting
- Check localStorage settings
- Clear cache and reload

**Issue**: Styles not loading
- Ensure all 3 files are in same folder
- Check file paths
- Hard refresh (Ctrl+Shift+R)

## 📱 Browser Support

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers

## 👨‍💻 Developers

**Developed by ABID MEHMOOD & Yasir Hameed**

## 📄 License

Open source - Free for educational and personal use

---

**🎉 That's it! Just open index.html with Live Server and start using the app!**

No npm install, no build process, no dependencies - just pure HTML/CSS/JavaScript!
