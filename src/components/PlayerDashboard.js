import React, { useState, useEffect } from 'react';
import { getTeams, updateTeam, getTournaments, applyToTournament, getUsers } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

const PlayerDashboard = ({ showNotification }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [myTeams, setMyTeams] = useState([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const allTeams = getTeams();
    const allTournaments = getTournaments();
    
    setTeams(allTeams);
    setTournaments(allTournaments);
    setMyTeams(allTeams.filter(t => t.members?.includes(user.id)));
  };

  const handleJoinTeam = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      if (team.members?.includes(user.id)) {
        showNotification('Already a member', 'error');
        return;
      }
      if (team.requests?.includes(user.id)) {
        showNotification('Request already sent', 'error');
        return;
      }
      
      const updatedRequests = [...(team.requests || []), user.id];
      updateTeam(teamId, { requests: updatedRequests });
      showNotification('Join request sent', 'success');
      loadData();
    }
  };

  const handleApplyTournament = (tournamentId) => {
    const result = applyToTournament(tournamentId, user.id);
    if (result.success) {
      showNotification('Application submitted successfully', 'success');
      loadData();
    } else {
      showNotification(result.message, 'error');
    }
  };

  const isDeadlinePassed = (deadline) => new Date(deadline) < new Date();

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>Player Dashboard</h2>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{myTeams.length}</h3>
          <p style={{ opacity: '0.7' }}>My Teams</p>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚽</div>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{user.sport}</h3>
          <p style={{ opacity: '0.7' }}>Preferred Sport</p>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{user.skillLevel}</h3>
          <p style={{ opacity: '0.7' }}>Skill Level</p>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '32px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>My Teams</h3>
        {myTeams.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {myTeams.map(team => (
              <div key={team.id} className="glass-card">
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{team.name}</h4>
                <p style={{ opacity: '0.7', fontSize: '14px' }}>{team.sport} • {team.members?.length || 0} members</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', opacity: '0.7', padding: '32px' }}>You haven't joined any teams yet</p>
        )}
      </div>

      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Available Teams</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {teams.filter(t => !t.members?.includes(user.id)).map(team => {
            const leader = getUsers().find(u => u.id === team.leader);
            return (
              <div key={team.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{team.name}</h4>
                  <p style={{ opacity: '0.7', fontSize: '14px' }}>{team.sport} • Leader: {leader ? `${leader.firstName} ${leader.lastName}` : 'Unknown'}</p>
                  <p style={{ opacity: '0.7', fontSize: '12px' }}>{team.members?.length || 0} members</p>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleJoinTeam(team.id)}
                  disabled={team.requests?.includes(user.id)}
                >
                  {team.requests?.includes(user.id) ? 'Request Sent' : 'Join Team'}
                </button>
              </div>
            );
          })}
          {teams.filter(t => !t.members?.includes(user.id)).length === 0 && (
            <p style={{ textAlign: 'center', opacity: '0.7', padding: '32px' }}>No available teams</p>
          )}
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Tournaments</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {tournaments.map(tournament => {
            const deadlinePassed = isDeadlinePassed(tournament.deadline);
            const hasApplied = tournament.applications?.includes(user.id);
            
            return (
              <div key={tournament.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{tournament.name}</h4>
                  <p style={{ opacity: '0.7', fontSize: '14px' }}>
                    {tournament.sport} • {new Date(tournament.date).toLocaleDateString()} at {tournament.time}
                  </p>
                  <p style={{ opacity: '0.7', fontSize: '12px' }}>Venue: {tournament.venue}</p>
                  <p style={{ opacity: '0.7', fontSize: '12px' }}>
                    Deadline: {new Date(tournament.deadline).toLocaleString()}
                    {deadlinePassed && <span className="badge badge-danger" style={{ marginLeft: '8px' }}>Closed</span>}
                  </p>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleApplyTournament(tournament.id)}
                  disabled={deadlinePassed || hasApplied}
                >
                  {hasApplied ? 'Applied' : deadlinePassed ? 'Closed' : 'Apply'}
                </button>
              </div>
            );
          })}
          {tournaments.length === 0 && (
            <p style={{ textAlign: 'center', opacity: '0.7', padding: '32px' }}>No tournaments available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
