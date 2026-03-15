import React, { useState, useEffect } from 'react';
import { getSports, saveSport, deleteSport, getTeams, saveTeam, deleteTeam, getTournaments, saveTournament, deleteTournament, getUsers, deleteUser } from '../utils/storage';

const AdminDashboard = ({ showNotification }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSports(getSports());
    setTeams(getTeams());
    setTournaments(getTournaments());
    setUsers(getUsers());
  };

  const handleAddSport = (e) => {
    e.preventDefault();
    saveSport({ name: formData.name, icon: formData.icon || '⚽' });
    showNotification('Sport added successfully', 'success');
    setShowModal(false);
    loadData();
  };

  const handleDeleteSport = (id) => {
    if (window.confirm('Delete this sport?')) {
      deleteSport(id);
      showNotification('Sport deleted', 'success');
      loadData();
    }
  };

  const handleAddTeam = (e) => {
    e.preventDefault();
    saveTeam({ 
      name: formData.name, 
      sport: formData.sport, 
      leader: formData.leader,
      members: [],
      requests: []
    });
    showNotification('Team created successfully', 'success');
    setShowModal(false);
    loadData();
  };

  const handleDeleteTeam = (id) => {
    if (window.confirm('Delete this team?')) {
      deleteTeam(id);
      showNotification('Team deleted', 'success');
      loadData();
    }
  };

  const handleAddTournament = (e) => {
    e.preventDefault();
    saveTournament({
      name: formData.name,
      sport: formData.sport,
      date: formData.date,
      time: formData.time,
      deadline: formData.deadline,
      venue: formData.venue
    });
    showNotification('Tournament created successfully', 'success');
    setShowModal(false);
    loadData();
  };

  const handleDeleteTournament = (id) => {
    if (window.confirm('Delete this tournament?')) {
      deleteTournament(id);
      showNotification('Tournament deleted', 'success');
      loadData();
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Delete this user?')) {
      deleteUser(id);
      showNotification('User deleted', 'success');
      loadData();
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>Admin Dashboard</h2>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{users.length}</h3>
          <p style={{ opacity: '0.7' }}>Total Users</p>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚽</div>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{sports.length}</h3>
          <p style={{ opacity: '0.7' }}>Sports</p>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{teams.length}</h3>
          <p style={{ opacity: '0.7' }}>Teams</p>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{tournaments.length}</h3>
          <p style={{ opacity: '0.7' }}>Tournaments</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button className={`btn ${activeSection === 'overview' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveSection('overview')}>Overview</button>
        <button className={`btn ${activeSection === 'sports' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveSection('sports')}>Sports</button>
        <button className={`btn ${activeSection === 'teams' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveSection('teams')}>Teams</button>
        <button className={`btn ${activeSection === 'tournaments' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveSection('tournaments')}>Tournaments</button>
        <button className={`btn ${activeSection === 'users' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveSection('users')}>Users</button>
      </div>

      {activeSection === 'sports' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600' }}>Manage Sports</h3>
            <button className="btn btn-primary" onClick={() => openModal('sport')}>+ Add Sport</button>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            {sports.map(sport => (
              <div key={sport.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{sport.icon}</span>
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>{sport.name}</span>
                </div>
                <button className="btn btn-danger" onClick={() => handleDeleteSport(sport.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'teams' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600' }}>Manage Teams</h3>
            <button className="btn btn-primary" onClick={() => openModal('team')}>+ Create Team</button>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            {teams.map(team => (
              <div key={team.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{team.name}</h4>
                  <p style={{ opacity: '0.7', fontSize: '14px' }}>{team.sport} • {team.members?.length || 0} members</p>
                </div>
                <button className="btn btn-danger" onClick={() => handleDeleteTeam(team.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'tournaments' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600' }}>Manage Tournaments</h3>
            <button className="btn btn-primary" onClick={() => openModal('tournament')}>+ Create Tournament</button>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            {tournaments.map(tournament => (
              <div key={tournament.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{tournament.name}</h4>
                  <p style={{ opacity: '0.7', fontSize: '14px' }}>{tournament.sport} • {new Date(tournament.date).toLocaleDateString()}</p>
                  <p style={{ opacity: '0.7', fontSize: '12px' }}>Applications: {tournament.applications?.length || 0}</p>
                </div>
                <button className="btn btn-danger" onClick={() => handleDeleteTournament(tournament.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'users' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Manage Users</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {users.map(user => (
              <div key={user.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{user.firstName} {user.lastName}</h4>
                  <p style={{ opacity: '0.7', fontSize: '14px' }}>{user.email} • {user.phone}</p>
                  <div style={{ marginTop: '8px' }}>
                    <span className="badge badge-primary">{user.role}</span>
                    <span className="badge badge-success" style={{ marginLeft: '8px' }}>{user.sport}</span>
                  </div>
                </div>
                {user.role !== 'admin' && (
                  <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'inherit', fontSize: '24px', cursor: 'pointer' }}>×</button>
            
            {modalType === 'sport' && (
              <form onSubmit={handleAddSport}>
                <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>Add New Sport</h3>
                <div className="input-group">
                  <span className="icon">⚽</span>
                  <input type="text" placeholder=" " required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <label>Sport Name</label>
                </div>
                <div className="input-group">
                  <span className="icon">🎨</span>
                  <input type="text" placeholder=" " onChange={(e) => setFormData({...formData, icon: e.target.value})} />
                  <label>Icon (emoji)</label>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Sport</button>
              </form>
            )}

            {modalType === 'team' && (
              <form onSubmit={handleAddTeam}>
                <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>Create New Team</h3>
                <div className="input-group">
                  <span className="icon">🏆</span>
                  <input type="text" placeholder=" " required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <label>Team Name</label>
                </div>
                <div className="input-group">
                  <span className="icon">⚽</span>
                  <select required onChange={(e) => setFormData({...formData, sport: e.target.value})}>
                    <option value="">Select Sport</option>
                    {sports.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                  <label>Sport</label>
                </div>
                <div className="input-group">
                  <span className="icon">👤</span>
                  <select required onChange={(e) => setFormData({...formData, leader: e.target.value})}>
                    <option value="">Select Leader</option>
                    {users.filter(u => u.role === 'teamleader').map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                  </select>
                  <label>Team Leader</label>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Team</button>
              </form>
            )}

            {modalType === 'tournament' && (
              <form onSubmit={handleAddTournament}>
                <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>Create Tournament</h3>
                <div className="input-group">
                  <span className="icon">🎯</span>
                  <input type="text" placeholder=" " required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <label>Tournament Name</label>
                </div>
                <div className="input-group">
                  <span className="icon">⚽</span>
                  <select required onChange={(e) => setFormData({...formData, sport: e.target.value})}>
                    <option value="">Select Sport</option>
                    {sports.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                  <label>Sport</label>
                </div>
                <div className="input-group">
                  <span className="icon">📅</span>
                  <input type="date" required onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  <label>Date</label>
                </div>
                <div className="input-group">
                  <span className="icon">⏰</span>
                  <input type="time" required onChange={(e) => setFormData({...formData, time: e.target.value})} />
                  <label>Time</label>
                </div>
                <div className="input-group">
                  <span className="icon">⏳</span>
                  <input type="datetime-local" required onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
                  <label>Application Deadline</label>
                </div>
                <div className="input-group">
                  <span className="icon">📍</span>
                  <input type="text" placeholder=" " required onChange={(e) => setFormData({...formData, venue: e.target.value})} />
                  <label>Venue</label>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Tournament</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
