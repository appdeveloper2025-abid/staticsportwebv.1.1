// Storage utilities
const Storage = {
  init() {
    if (!localStorage.getItem('sms_users')) {
      localStorage.setItem('sms_users', JSON.stringify([{
        id: 'user_1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@sports.com',
        phone: '+1234567890',
        password: 'admin123',
        role: 'admin',
        sport: 'All Sports',
        skillLevel: 'Advanced'
      }]));
    }
    if (!localStorage.getItem('sms_sports')) {
      localStorage.setItem('sms_sports', JSON.stringify([
        { id: 'sport_1', name: 'Cricket', icon: '🏏' },
        { id: 'sport_2', name: 'Football', icon: '⚽' },
        { id: 'sport_3', name: 'Basketball', icon: '🏀' },
        { id: 'sport_4', name: 'Tennis', icon: '🎾' },
        { id: 'sport_5', name: 'Volleyball', icon: '🏐' }
      ]));
    }
    if (!localStorage.getItem('sms_teams')) localStorage.setItem('sms_teams', JSON.stringify([]));
    if (!localStorage.getItem('sms_tournaments')) localStorage.setItem('sms_tournaments', JSON.stringify([]));
    if (!localStorage.getItem('sms_theme')) localStorage.setItem('sms_theme', 'dark');
  },
  getUsers: () => JSON.parse(localStorage.getItem('sms_users') || '[]'),
  getSports: () => JSON.parse(localStorage.getItem('sms_sports') || '[]'),
  getTeams: () => JSON.parse(localStorage.getItem('sms_teams') || '[]'),
  getTournaments: () => JSON.parse(localStorage.getItem('sms_tournaments') || '[]'),
  getCurrentUser: () => JSON.parse(localStorage.getItem('sms_current_user') || 'null'),
  setCurrentUser: (user) => localStorage.setItem('sms_current_user', JSON.stringify(user)),
  saveUser: (user) => {
    const users = Storage.getUsers();
    users.push({ ...user, id: `user_${Date.now()}` });
    localStorage.setItem('sms_users', JSON.stringify(users));
  },
  saveSport: (sport) => {
    const sports = Storage.getSports();
    sports.push({ ...sport, id: `sport_${Date.now()}` });
    localStorage.setItem('sms_sports', JSON.stringify(sports));
  },
  saveTeam: (team) => {
    const teams = Storage.getTeams();
    teams.push({ ...team, id: `team_${Date.now()}`, members: [], requests: [] });
    localStorage.setItem('sms_teams', JSON.stringify(teams));
  },
  saveTournament: (tournament) => {
    const tournaments = Storage.getTournaments();
    tournaments.push({ ...tournament, id: `tournament_${Date.now()}`, applications: [] });
    localStorage.setItem('sms_tournaments', JSON.stringify(tournaments));
  },
  updateTeam: (id, updates) => {
    const teams = Storage.getTeams();
    const index = teams.findIndex(t => t.id === id);
    if (index !== -1) {
      teams[index] = { ...teams[index], ...updates };
      localStorage.setItem('sms_teams', JSON.stringify(teams));
    }
  },
  applyTournament: (tournamentId, userId) => {
    const tournaments = Storage.getTournaments();
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament && new Date(tournament.deadline) > new Date()) {
      if (!tournament.applications.includes(userId)) {
        tournament.applications.push(userId);
        localStorage.setItem('sms_tournaments', JSON.stringify(tournaments));
        return true;
      }
    }
    return false;
  },
  deleteSport: (id) => {
    const sports = Storage.getSports().filter(s => s.id !== id);
    localStorage.setItem('sms_sports', JSON.stringify(sports));
  },
  deleteTeam: (id) => {
    const teams = Storage.getTeams().filter(t => t.id !== id);
    localStorage.setItem('sms_teams', JSON.stringify(teams));
  },
  deleteTournament: (id) => {
    const tournaments = Storage.getTournaments().filter(t => t.id !== id);
    localStorage.setItem('sms_tournaments', JSON.stringify(tournaments));
  },
  deleteUser: (id) => {
    const users = Storage.getUsers().filter(u => u.id !== id);
    localStorage.setItem('sms_users', JSON.stringify(users));
  }
};


// App state
let currentUser = null;
let currentView = 'home';
let currentSection = 'overview';

// Initialize
Storage.init();
currentUser = Storage.getCurrentUser();
document.body.className = localStorage.getItem('sms_theme') || 'dark';

// Notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `<span style="font-size:20px">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${message}</span>`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Render functions
function renderHeader() {
  const theme = document.body.className;
  return `
    <header>
      <div class="logo">
        <span>🏆</span>
        <h1>Sports Management</h1>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" onclick="toggleTheme()">${theme === 'dark' ? '☀️' : '🌙'}</button>
        ${currentUser ? `
          <span>${currentUser.firstName} ${currentUser.lastName} <span class="badge badge-primary">${currentUser.role}</span></span>
          <button class="btn btn-danger" onclick="logout()">Logout</button>
        ` : `
          <button class="btn btn-primary" onclick="showAuthModal()">Sign In</button>
        `}
      </div>
    </header>
  `;
}

function renderHero() {
  return `
    <div class="hero">
      <div class="hero-icon">🏆</div>
      <h2>Welcome to Sports Management</h2>
      <p>Join teams, participate in tournaments, and manage your sports activities all in one place.</p>
      <button class="btn btn-primary" style="font-size:18px;padding:16px 48px" onclick="showAuthModal()">Get Started</button>
      <div class="dashboard-grid" style="margin-top:64px;max-width:1200px">
        <div class="glass-card" style="text-align:center">
          <div style="font-size:48px;margin-bottom:16px">👥</div>
          <h3 style="font-size:20px;font-weight:600;margin-bottom:8px">Join Teams</h3>
          <p style="opacity:0.7;font-size:14px">Connect with players and join your favorite sports teams</p>
        </div>
        <div class="glass-card" style="text-align:center">
          <div style="font-size:48px;margin-bottom:16px">🎯</div>
          <h3 style="font-size:20px;font-weight:600;margin-bottom:8px">Tournaments</h3>
          <p style="opacity:0.7;font-size:14px">Participate in exciting tournaments and competitions</p>
        </div>
        <div class="glass-card" style="text-align:center">
          <div style="font-size:48px;margin-bottom:16px">📊</div>
          <h3 style="font-size:20px;font-weight:600;margin-bottom:8px">Track Progress</h3>
          <p style="opacity:0.7;font-size:14px">Monitor your performance and skill development</p>
        </div>
      </div>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer>
      <p style="font-size:14px;opacity:0.8">Developed by <strong style="color:var(--primary)">ABID MEHMOOD</strong> & <strong style="color:var(--secondary)">Yasir Hameed</strong></p>
      <p style="font-size:12px;opacity:0.6;margin-top:8px">© ${new Date().getFullYear()} Sports Management System. All rights reserved.</p>
    </footer>
  `;
}


function renderAdminDashboard() {
  const users = Storage.getUsers();
  const sports = Storage.getSports();
  const teams = Storage.getTeams();
  const tournaments = Storage.getTournaments();
  
  let content = `
    <h2 style="font-size:32px;font-weight:700;margin-bottom:32px">Admin Dashboard</h2>
    <div class="dashboard-grid">
      <div class="stat-card"><div class="icon">👥</div><h3>${users.length}</h3><p>Total Users</p></div>
      <div class="stat-card"><div class="icon">⚽</div><h3>${sports.length}</h3><p>Sports</p></div>
      <div class="stat-card"><div class="icon">🏆</div><h3>${teams.length}</h3><p>Teams</p></div>
      <div class="stat-card"><div class="icon">🎯</div><h3>${tournaments.length}</h3><p>Tournaments</p></div>
    </div>
    <div class="section-tabs">
      <button class="btn ${currentSection === 'overview' ? 'btn-primary' : 'btn-secondary'}" onclick="changeSection('overview')">Overview</button>
      <button class="btn ${currentSection === 'sports' ? 'btn-primary' : 'btn-secondary'}" onclick="changeSection('sports')">Sports</button>
      <button class="btn ${currentSection === 'teams' ? 'btn-primary' : 'btn-secondary'}" onclick="changeSection('teams')">Teams</button>
      <button class="btn ${currentSection === 'tournaments' ? 'btn-primary' : 'btn-secondary'}" onclick="changeSection('tournaments')">Tournaments</button>
      <button class="btn ${currentSection === 'users' ? 'btn-primary' : 'btn-secondary'}" onclick="changeSection('users')">Users</button>
    </div>
  `;

  if (currentSection === 'sports') {
    content += `<div class="glass-card">
      <div class="section-header">
        <h3 style="font-size:24px;font-weight:600">Manage Sports</h3>
        <button class="btn btn-primary" onclick="showAddSportModal()">+ Add Sport</button>
      </div>
      <div style="display:grid;gap:16px">
        ${sports.map(s => `
          <div class="glass-card" style="display:flex;justify-content:space-between;align-items:center">
            <div style="display:flex;align-items:center;gap:12px">
              <span style="font-size:32px">${s.icon}</span>
              <span style="font-size:18px;font-weight:600">${s.name}</span>
            </div>
            <button class="btn btn-danger" onclick="deleteSport('${s.id}')">Delete</button>
          </div>
        `).join('')}
      </div>
    </div>`;
  } else if (currentSection === 'teams') {
    content += `<div class="glass-card">
      <div class="section-header">
        <h3 style="font-size:24px;font-weight:600">Manage Teams</h3>
        <button class="btn btn-primary" onclick="showAddTeamModal()">+ Create Team</button>
      </div>
      <div style="display:grid;gap:16px">
        ${teams.map(t => `
          <div class="glass-card" style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <h4 style="font-size:18px;font-weight:600;margin-bottom:4px">${t.name}</h4>
              <p style="opacity:0.7;font-size:14px">${t.sport} • ${t.members?.length || 0} members</p>
            </div>
            <button class="btn btn-danger" onclick="deleteTeam('${t.id}')">Delete</button>
          </div>
        `).join('')}
      </div>
    </div>`;
  } else if (currentSection === 'tournaments') {
    content += `<div class="glass-card">
      <div class="section-header">
        <h3 style="font-size:24px;font-weight:600">Manage Tournaments</h3>
        <button class="btn btn-primary" onclick="showAddTournamentModal()">+ Create Tournament</button>
      </div>
      <div style="display:grid;gap:16px">
        ${tournaments.map(t => `
          <div class="glass-card" style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <h4 style="font-size:18px;font-weight:600;margin-bottom:4px">${t.name}</h4>
              <p style="opacity:0.7;font-size:14px">${t.sport} • ${new Date(t.date).toLocaleDateString()}</p>
              <p style="opacity:0.7;font-size:12px">Applications: ${t.applications?.length || 0}</p>
            </div>
            <button class="btn btn-danger" onclick="deleteTournament('${t.id}')">Delete</button>
          </div>
        `).join('')}
      </div>
    </div>`;
  } else if (currentSection === 'users') {
    content += `<div class="glass-card">
      <h3 style="font-size:24px;font-weight:600;margin-bottom:24px">Manage Users</h3>
      <div style="display:grid;gap:16px">
        ${users.map(u => `
          <div class="glass-card" style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <h4 style="font-size:18px;font-weight:600;margin-bottom:4px">${u.firstName} ${u.lastName}</h4>
              <p style="opacity:0.7;font-size:14px">${u.email} • ${u.phone}</p>
              <div style="margin-top:8px">
                <span class="badge badge-primary">${u.role}</span>
                <span class="badge badge-success">${u.sport}</span>
              </div>
            </div>
            ${u.role !== 'admin' ? `<button class="btn btn-danger" onclick="deleteUser('${u.id}')">Delete</button>` : ''}
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  return content;
}


function renderTeamLeaderDashboard() {
  const teams = Storage.getTeams().filter(t => t.leader === currentUser.id);
  const users = Storage.getUsers();
  
  return `
    <h2 style="font-size:32px;font-weight:700;margin-bottom:32px">Team Leader Dashboard</h2>
    <div class="dashboard-grid">
      <div class="stat-card"><div class="icon">🏆</div><h3>${teams.length}</h3><p>My Teams</p></div>
      <div class="stat-card"><div class="icon">👥</div><h3>${teams.reduce((acc, t) => acc + (t.members?.length || 0), 0)}</h3><p>Total Members</p></div>
      <div class="stat-card"><div class="icon">📋</div><h3>${teams.reduce((acc, t) => acc + (t.requests?.length || 0), 0)}</h3><p>Pending Requests</p></div>
    </div>
    <div class="glass-card" style="margin-top:32px">
      <h3 style="font-size:24px;font-weight:600;margin-bottom:24px">My Teams</h3>
      <div style="display:grid;gap:16px">
        ${teams.length > 0 ? teams.map(team => `
          <div class="glass-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
              <div>
                <h4 style="font-size:20px;font-weight:600;margin-bottom:4px">${team.name}</h4>
                <span class="badge badge-primary">${team.sport}</span>
              </div>
            </div>
            ${team.requests && team.requests.length > 0 ? `
              <div style="margin-bottom:24px">
                <h5 style="font-size:16px;font-weight:600;margin-bottom:12px">Pending Requests</h5>
                ${team.requests.map(userId => {
                  const user = users.find(u => u.id === userId);
                  return user ? `
                    <div class="glass-card" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                      <div>
                        <p style="font-weight:600">${user.firstName} ${user.lastName}</p>
                        <p style="font-size:12px;opacity:0.7">${user.email}</p>
                      </div>
                      <div style="display:flex;gap:8px">
                        <button class="btn btn-success" onclick="approveRequest('${team.id}', '${userId}')">Approve</button>
                        <button class="btn btn-danger" onclick="rejectRequest('${team.id}', '${userId}')">Reject</button>
                      </div>
                    </div>
                  ` : '';
                }).join('')}
              </div>
            ` : ''}
            <div>
              <h5 style="font-size:16px;font-weight:600;margin-bottom:12px">Team Members (${team.members?.length || 0})</h5>
              ${team.members && team.members.length > 0 ? team.members.map(userId => {
                const member = users.find(u => u.id === userId);
                return member ? `
                  <div class="glass-card" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                    <div>
                      <p style="font-weight:600">${member.firstName} ${member.lastName}</p>
                      <p style="font-size:12px;opacity:0.7">${member.email} • ${member.skillLevel}</p>
                    </div>
                    <button class="btn btn-danger" onclick="removeMember('${team.id}', '${userId}')">Remove</button>
                  </div>
                ` : '';
              }).join('') : '<p style="opacity:0.7;font-size:14px">No members yet</p>'}
            </div>
          </div>
        `).join('') : '<p style="text-align:center;opacity:0.7;padding:32px">No teams assigned yet. Contact admin to create a team for you.</p>'}
      </div>
    </div>
  `;
}

function renderPlayerDashboard() {
  const teams = Storage.getTeams();
  const tournaments = Storage.getTournaments();
  const myTeams = teams.filter(t => t.members?.includes(currentUser.id));
  const users = Storage.getUsers();
  
  return `
    <h2 style="font-size:32px;font-weight:700;margin-bottom:32px">Player Dashboard</h2>
    <div class="dashboard-grid">
      <div class="stat-card"><div class="icon">🏆</div><h3>${myTeams.length}</h3><p>My Teams</p></div>
      <div class="stat-card"><div class="icon">⚽</div><h3>${currentUser.sport}</h3><p>Preferred Sport</p></div>
      <div class="stat-card"><div class="icon">📊</div><h3>${currentUser.skillLevel}</h3><p>Skill Level</p></div>
    </div>
    <div class="glass-card" style="margin-top:32px;margin-bottom:32px">
      <h3 style="font-size:24px;font-weight:600;margin-bottom:24px">My Teams</h3>
      ${myTeams.length > 0 ? `
        <div style="display:grid;gap:16px">
          ${myTeams.map(t => `
            <div class="glass-card">
              <h4 style="font-size:18px;font-weight:600;margin-bottom:4px">${t.name}</h4>
              <p style="opacity:0.7;font-size:14px">${t.sport} • ${t.members?.length || 0} members</p>
            </div>
          `).join('')}
        </div>
      ` : '<p style="text-align:center;opacity:0.7;padding:32px">You haven\'t joined any teams yet</p>'}
    </div>
    <div class="glass-card" style="margin-bottom:32px">
      <h3 style="font-size:24px;font-weight:600;margin-bottom:24px">Available Teams</h3>
      <div style="display:grid;gap:16px">
        ${teams.filter(t => !t.members?.includes(currentUser.id)).map(team => {
          const leader = users.find(u => u.id === team.leader);
          return `
            <div class="glass-card" style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <h4 style="font-size:18px;font-weight:600;margin-bottom:4px">${team.name}</h4>
                <p style="opacity:0.7;font-size:14px">${team.sport} • Leader: ${leader ? `${leader.firstName} ${leader.lastName}` : 'Unknown'}</p>
                <p style="opacity:0.7;font-size:12px">${team.members?.length || 0} members</p>
              </div>
              <button class="btn btn-primary" onclick="joinTeam('${team.id}')" ${team.requests?.includes(currentUser.id) ? 'disabled' : ''}>
                ${team.requests?.includes(currentUser.id) ? 'Request Sent' : 'Join Team'}
              </button>
            </div>
          `;
        }).join('') || '<p style="text-align:center;opacity:0.7;padding:32px">No available teams</p>'}
      </div>
    </div>
    <div class="glass-card">
      <h3 style="font-size:24px;font-weight:600;margin-bottom:24px">Tournaments</h3>
      <div style="display:grid;gap:16px">
        ${tournaments.map(tournament => {
          const deadlinePassed = new Date(tournament.deadline) < new Date();
          const hasApplied = tournament.applications?.includes(currentUser.id);
          return `
            <div class="glass-card" style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <h4 style="font-size:18px;font-weight:600;margin-bottom:4px">${tournament.name}</h4>
                <p style="opacity:0.7;font-size:14px">${tournament.sport} • ${new Date(tournament.date).toLocaleDateString()} at ${tournament.time}</p>
                <p style="opacity:0.7;font-size:12px">Venue: ${tournament.venue}</p>
                <p style="opacity:0.7;font-size:12px">Deadline: ${new Date(tournament.deadline).toLocaleString()} ${deadlinePassed ? '<span class="badge badge-danger">Closed</span>' : ''}</p>
              </div>
              <button class="btn btn-primary" onclick="applyTournament('${tournament.id}')" ${deadlinePassed || hasApplied ? 'disabled' : ''}>
                ${hasApplied ? 'Applied' : deadlinePassed ? 'Closed' : 'Apply'}
              </button>
            </div>
          `;
        }).join('') || '<p style="text-align:center;opacity:0.7;padding:32px">No tournaments available</p>'}
      </div>
    </div>
  `;
}


// Auth Modal
function showAuthModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      <h2 style="margin-bottom:24px;font-size:28px;font-weight:700;text-align:center">Welcome Back</h2>
      <div class="tabs">
        <button class="tab active" onclick="switchTab('signin')">Sign In</button>
        <button class="tab" onclick="switchTab('signup')">Sign Up</button>
      </div>
      <div id="auth-form"></div>
    </div>
  `;
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
  renderSignInForm();
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  if (tab === 'signin') renderSignInForm();
  else renderSignUpForm();
}

function renderSignInForm() {
  document.getElementById('auth-form').innerHTML = `
    <form onsubmit="handleSignIn(event)">
      <div class="input-group">
        <span class="icon">📧</span>
        <input type="text" name="email" placeholder="Email or Phone" required>
      </div>
      <div class="input-group">
        <span class="icon">🔒</span>
        <input type="password" name="password" placeholder="Password" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;margin-bottom:16px">Sign In</button>
      <div class="divider">OR SIGN IN WITH</div>
      <button type="button" class="social-btn"><span style="font-size:20px">🔍</span> Continue with Google</button>
      <button type="button" class="social-btn"><span style="font-size:20px"></span> Continue with Apple</button>
    </form>
  `;
}

function renderSignUpForm() {
  const sports = Storage.getSports();
  document.getElementById('auth-form').innerHTML = `
    <form onsubmit="handleSignUp(event)">
      <div class="grid-2">
        <div class="input-group">
          <span class="icon">👤</span>
          <input type="text" name="firstName" placeholder="First Name" required>
        </div>
        <div class="input-group">
          <span class="icon">👤</span>
          <input type="text" name="lastName" placeholder="Last Name" required>
        </div>
      </div>
      <div class="input-group">
        <span class="icon">📧</span>
        <input type="email" name="email" placeholder="Email Address" required>
      </div>
      <div class="input-group">
        <span class="icon">📱</span>
        <input type="tel" name="phone" placeholder="Phone Number" required>
      </div>
      <div class="input-group">
        <span class="icon">🔒</span>
        <input type="password" name="password" placeholder="Password" minlength="6" required>
      </div>
      <div class="input-group">
        <span class="icon">🔒</span>
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required>
      </div>
      <div class="input-group">
        <span class="icon">⚽</span>
        <select name="sport" required>
          <option value="">Select Sport</option>
          ${sports.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
        </select>
      </div>
      <div class="input-group">
        <span class="icon">📊</span>
        <select name="skillLevel" required>
          <option value="">Select Skill Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
      <div class="input-group">
        <span class="icon">🎯</span>
        <select name="role" required>
          <option value="player">Player</option>
          <option value="teamleader">Team Leader</option>
        </select>
      </div>
      <p style="font-size:12px;opacity:0.7;margin-bottom:16px;text-align:center">By signing up, you agree to our Terms & Conditions</p>
      <button type="submit" class="btn btn-primary" style="width:100%;margin-bottom:16px">Create Account</button>
      <div class="divider">OR SIGN UP WITH</div>
      <button type="button" class="social-btn"><span style="font-size:20px">🔍</span> Continue with Google</button>
      <button type="button" class="social-btn"><span style="font-size:20px"></span> Continue with Apple</button>
    </form>
  `;
}

function handleSignIn(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');
  
  const users = Storage.getUsers();
  const user = users.find(u => (u.email === email || u.phone === email) && u.password === password);
  
  if (user) {
    Storage.setCurrentUser(user);
    currentUser = user;
    showNotification('Welcome back!', 'success');
    document.querySelector('.modal-overlay').remove();
    render();
  } else {
    showNotification('Invalid credentials', 'error');
  }
}

function handleSignUp(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');
  
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }
  
  const users = Storage.getUsers();
  if (users.find(u => u.email === formData.get('email'))) {
    showNotification('User already exists', 'error');
    return;
  }
  
  Storage.saveUser({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: password,
    sport: formData.get('sport'),
    skillLevel: formData.get('skillLevel'),
    role: formData.get('role')
  });
  
  showNotification('Account created! Please sign in.', 'success');
  switchTab('signin');
}


// Action handlers
function toggleTheme() {
  const newTheme = document.body.className === 'dark' ? 'light' : 'dark';
  document.body.className = newTheme;
  localStorage.setItem('sms_theme', newTheme);
  render();
}

function logout() {
  localStorage.removeItem('sms_current_user');
  currentUser = null;
  showNotification('Logged out successfully', 'info');
  render();
}

function changeSection(section) {
  currentSection = section;
  render();
}

function deleteSport(id) {
  if (confirm('Delete this sport?')) {
    Storage.deleteSport(id);
    showNotification('Sport deleted', 'success');
    render();
  }
}

function deleteTeam(id) {
  if (confirm('Delete this team?')) {
    Storage.deleteTeam(id);
    showNotification('Team deleted', 'success');
    render();
  }
}

function deleteTournament(id) {
  if (confirm('Delete this tournament?')) {
    Storage.deleteTournament(id);
    showNotification('Tournament deleted', 'success');
    render();
  }
}

function deleteUser(id) {
  if (confirm('Delete this user?')) {
    Storage.deleteUser(id);
    showNotification('User deleted', 'success');
    render();
  }
}

function approveRequest(teamId, userId) {
  const teams = Storage.getTeams();
  const team = teams.find(t => t.id === teamId);
  if (team) {
    team.members = [...(team.members || []), userId];
    team.requests = (team.requests || []).filter(id => id !== userId);
    Storage.updateTeam(teamId, team);
    showNotification('Member approved', 'success');
    render();
  }
}

function rejectRequest(teamId, userId) {
  const teams = Storage.getTeams();
  const team = teams.find(t => t.id === teamId);
  if (team) {
    team.requests = (team.requests || []).filter(id => id !== userId);
    Storage.updateTeam(teamId, team);
    showNotification('Request rejected', 'success');
    render();
  }
}

function removeMember(teamId, userId) {
  if (confirm('Remove this member?')) {
    const teams = Storage.getTeams();
    const team = teams.find(t => t.id === teamId);
    if (team) {
      team.members = (team.members || []).filter(id => id !== userId);
      Storage.updateTeam(teamId, team);
      showNotification('Member removed', 'success');
      render();
    }
  }
}

function joinTeam(teamId) {
  const teams = Storage.getTeams();
  const team = teams.find(t => t.id === teamId);
  if (team) {
    if (team.requests?.includes(currentUser.id)) {
      showNotification('Request already sent', 'error');
      return;
    }
    team.requests = [...(team.requests || []), currentUser.id];
    Storage.updateTeam(teamId, team);
    showNotification('Join request sent', 'success');
    render();
  }
}

function applyTournament(tournamentId) {
  if (Storage.applyTournament(tournamentId, currentUser.id)) {
    showNotification('Application submitted', 'success');
    render();
  } else {
    showNotification('Deadline passed or already applied', 'error');
  }
}

function showAddSportModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      <h3 style="margin-bottom:24px;font-size:24px">Add New Sport</h3>
      <form onsubmit="handleAddSport(event)">
        <div class="input-group">
          <span class="icon">⚽</span>
          <input type="text" name="name" placeholder="Sport Name" required>
        </div>
        <div class="input-group">
          <span class="icon">🎨</span>
          <input type="text" name="icon" placeholder="Icon (emoji)" value="⚽">
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%">Add Sport</button>
      </form>
    </div>
  `;
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
}

function handleAddSport(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  Storage.saveSport({
    name: formData.get('name'),
    icon: formData.get('icon') || '⚽'
  });
  showNotification('Sport added', 'success');
  document.querySelector('.modal-overlay').remove();
  render();
}

function showAddTeamModal() {
  const sports = Storage.getSports();
  const leaders = Storage.getUsers().filter(u => u.role === 'teamleader');
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      <h3 style="margin-bottom:24px;font-size:24px">Create New Team</h3>
      <form onsubmit="handleAddTeam(event)">
        <div class="input-group">
          <span class="icon">🏆</span>
          <input type="text" name="name" placeholder="Team Name" required>
        </div>
        <div class="input-group">
          <span class="icon">⚽</span>
          <select name="sport" required>
            <option value="">Select Sport</option>
            ${sports.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="input-group">
          <span class="icon">👤</span>
          <select name="leader" required>
            <option value="">Select Leader</option>
            ${leaders.map(l => `<option value="${l.id}">${l.firstName} ${l.lastName}</option>`).join('')}
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%">Create Team</button>
      </form>
    </div>
  `;
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
}

function handleAddTeam(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  Storage.saveTeam({
    name: formData.get('name'),
    sport: formData.get('sport'),
    leader: formData.get('leader')
  });
  showNotification('Team created', 'success');
  document.querySelector('.modal-overlay').remove();
  render();
}

function showAddTournamentModal() {
  const sports = Storage.getSports();
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      <h3 style="margin-bottom:24px;font-size:24px">Create Tournament</h3>
      <form onsubmit="handleAddTournament(event)">
        <div class="input-group">
          <span class="icon">🎯</span>
          <input type="text" name="name" placeholder="Tournament Name" required>
        </div>
        <div class="input-group">
          <span class="icon">⚽</span>
          <select name="sport" required>
            <option value="">Select Sport</option>
            ${sports.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="input-group">
          <span class="icon">📅</span>
          <input type="date" name="date" required>
        </div>
        <div class="input-group">
          <span class="icon">⏰</span>
          <input type="time" name="time" required>
        </div>
        <div class="input-group">
          <span class="icon">⏳</span>
          <input type="datetime-local" name="deadline" required>
        </div>
        <div class="input-group">
          <span class="icon">📍</span>
          <input type="text" name="venue" placeholder="Venue" required>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%">Create Tournament</button>
      </form>
    </div>
  `;
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
}

function handleAddTournament(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  Storage.saveTournament({
    name: formData.get('name'),
    sport: formData.get('sport'),
    date: formData.get('date'),
    time: formData.get('time'),
    deadline: formData.get('deadline'),
    venue: formData.get('venue')
  });
  showNotification('Tournament created', 'success');
  document.querySelector('.modal-overlay').remove();
  render();
}

// Main render
function render() {
  const app = document.getElementById('app');
  let content = renderHeader() + '<main>';
  
  if (!currentUser) {
    content += renderHero();
  } else if (currentUser.role === 'admin') {
    content += renderAdminDashboard();
  } else if (currentUser.role === 'teamleader') {
    content += renderTeamLeaderDashboard();
  } else {
    content += renderPlayerDashboard();
  }
  
  content += '</main>' + renderFooter();
  app.innerHTML = content;
}

// Initialize app
render();
