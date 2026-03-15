// Storage keys
const KEYS = {
  USERS: 'sms_users',
  TEAMS: 'sms_teams',
  SPORTS: 'sms_sports',
  TOURNAMENTS: 'sms_tournaments',
  CURRENT_USER: 'sms_current_user',
  THEME: 'sms_theme'
};

// Initialize default data
export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    const adminUser = {
      id: 'user_1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@sports.com',
      phone: '+1234567890',
      password: 'admin123',
      role: 'admin',
      sport: 'All Sports',
      skillLevel: 'Advanced',
      preferredRole: 'Admin',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(KEYS.USERS, JSON.stringify([adminUser]));
  }

  if (!localStorage.getItem(KEYS.SPORTS)) {
    const defaultSports = [
      { id: 'sport_1', name: 'Cricket', icon: '🏏', createdAt: new Date().toISOString() },
      { id: 'sport_2', name: 'Football', icon: '⚽', createdAt: new Date().toISOString() },
      { id: 'sport_3', name: 'Basketball', icon: '🏀', createdAt: new Date().toISOString() },
      { id: 'sport_4', name: 'Tennis', icon: '🎾', createdAt: new Date().toISOString() },
      { id: 'sport_5', name: 'Volleyball', icon: '🏐', createdAt: new Date().toISOString() }
    ];
    localStorage.setItem(KEYS.SPORTS, JSON.stringify(defaultSports));
  }

  if (!localStorage.getItem(KEYS.TEAMS)) {
    localStorage.setItem(KEYS.TEAMS, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.TOURNAMENTS)) {
    localStorage.setItem(KEYS.TOURNAMENTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.THEME)) {
    localStorage.setItem(KEYS.THEME, 'dark');
  }
};

// User operations
export const getUsers = () => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
export const saveUser = (user) => {
  const users = getUsers();
  users.push({ ...user, id: `user_${Date.now()}`, createdAt: new Date().toISOString() });
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return users[users.length - 1];
};

export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }
};

export const deleteUser = (userId) => {
  const users = getUsers().filter(u => u.id !== userId);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

// Auth operations
export const getCurrentUser = () => JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null');
export const setCurrentUser = (user) => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
export const logout = () => localStorage.removeItem(KEYS.CURRENT_USER);

export const login = (emailOrPhone, password) => {
  const users = getUsers();
  const user = users.find(u => 
    (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
  );
  if (user) {
    setCurrentUser(user);
    return { success: true, user };
  }
  return { success: false, message: 'Invalid credentials' };
};

// Sports operations
export const getSports = () => JSON.parse(localStorage.getItem(KEYS.SPORTS) || '[]');
export const saveSport = (sport) => {
  const sports = getSports();
  sports.push({ ...sport, id: `sport_${Date.now()}`, createdAt: new Date().toISOString() });
  localStorage.setItem(KEYS.SPORTS, JSON.stringify(sports));
};

export const updateSport = (sportId, updates) => {
  const sports = getSports();
  const index = sports.findIndex(s => s.id === sportId);
  if (index !== -1) {
    sports[index] = { ...sports[index], ...updates };
    localStorage.setItem(KEYS.SPORTS, JSON.stringify(sports));
  }
};

export const deleteSport = (sportId) => {
  const sports = getSports().filter(s => s.id !== sportId);
  localStorage.setItem(KEYS.SPORTS, JSON.stringify(sports));
};

// Teams operations
export const getTeams = () => JSON.parse(localStorage.getItem(KEYS.TEAMS) || '[]');
export const saveTeam = (team) => {
  const teams = getTeams();
  teams.push({ ...team, id: `team_${Date.now()}`, createdAt: new Date().toISOString() });
  localStorage.setItem(KEYS.TEAMS, JSON.stringify(teams));
  return teams[teams.length - 1];
};

export const updateTeam = (teamId, updates) => {
  const teams = getTeams();
  const index = teams.findIndex(t => t.id === teamId);
  if (index !== -1) {
    teams[index] = { ...teams[index], ...updates };
    localStorage.setItem(KEYS.TEAMS, JSON.stringify(teams));
  }
};

export const deleteTeam = (teamId) => {
  const teams = getTeams().filter(t => t.id !== teamId);
  localStorage.setItem(KEYS.TEAMS, JSON.stringify(teams));
};

// Tournaments operations
export const getTournaments = () => JSON.parse(localStorage.getItem(KEYS.TOURNAMENTS) || '[]');
export const saveTournament = (tournament) => {
  const tournaments = getTournaments();
  tournaments.push({ ...tournament, id: `tournament_${Date.now()}`, createdAt: new Date().toISOString(), applications: [] });
  localStorage.setItem(KEYS.TOURNAMENTS, JSON.stringify(tournaments));
};

export const updateTournament = (tournamentId, updates) => {
  const tournaments = getTournaments();
  const index = tournaments.findIndex(t => t.id === tournamentId);
  if (index !== -1) {
    tournaments[index] = { ...tournaments[index], ...updates };
    localStorage.setItem(KEYS.TOURNAMENTS, JSON.stringify(tournaments));
  }
};

export const deleteTournament = (tournamentId) => {
  const tournaments = getTournaments().filter(t => t.id !== tournamentId);
  localStorage.setItem(KEYS.TOURNAMENTS, JSON.stringify(tournaments));
};

export const applyToTournament = (tournamentId, userId) => {
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  if (tournament && new Date(tournament.deadline) > new Date()) {
    if (!tournament.applications.includes(userId)) {
      tournament.applications.push(userId);
      localStorage.setItem(KEYS.TOURNAMENTS, JSON.stringify(tournaments));
      return { success: true };
    }
    return { success: false, message: 'Already applied' };
  }
  return { success: false, message: 'Deadline passed' };
};

// Theme operations
export const getTheme = () => localStorage.getItem(KEYS.THEME) || 'dark';
export const setTheme = (theme) => {
  localStorage.setItem(KEYS.THEME, theme);
  document.body.className = theme;
};

// Storage event listener for cross-tab sync
export const setupStorageListener = (callback) => {
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('sms_')) {
      callback(e);
    }
  });
};
