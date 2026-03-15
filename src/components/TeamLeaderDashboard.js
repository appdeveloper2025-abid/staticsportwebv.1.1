import React, { useState, useEffect } from 'react';
import { getTeams, updateTeam, getUsers } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

const TeamLeaderDashboard = ({ showNotification }) => {
  const { user } = useAuth();
  const [myTeams, setMyTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    loadTeams();
  }, [user]);

  const loadTeams = () => {
    const allTeams = getTeams();
    const leaderTeams = allTeams.filter(t => t.leader === user.id);
    setMyTeams(leaderTeams);
  };

  const handleApproveRequest = (teamId, userId) => {
    const team = myTeams.find(t => t.id === teamId);
    if (team) {
      const updatedMembers = [...(team.members || []), userId];
      const updatedRequests = (team.requests || []).filter(id => id !== userId);
      updateTeam(teamId, { members: updatedMembers, requests: updatedRequests });
      showNotification('Member approved', 'success');
      loadTeams();
    }
  };

  const handleRejectRequest = (teamId, userId) => {
    const team = myTeams.find(t => t.id === teamId);
    if (team) {
      const updatedRequests = (team.requests || []).filter(id => id !== userId);
      updateTeam(teamId, { requests: updatedRequests });
      showNotification('Request rejected', 'success');
      loadTeams();
    }
  };

  const handleRemoveMember = (teamId, userId) => {
    if (window.confirm('Remove this member?')) {
      const team = myTeams.find(t => t.id === teamId);
      if (team) {
        const updatedMembers = (team.members || []).filter(id => id !== userId);
        updateTeam(teamId, { members: updatedMembers });
        showNotification('Member removed', 'success');
        loadTeams();
      }
    }
  };

  const getUserById = (userId) => {
    const users = getUsers();
    return users.find(u => u.id === userId);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>Team Leader Dashboard</h2>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{myTeams.length}</h3>
          <p style={{ opacity: '0.7' }}>My Teams</p>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
            {myTeams.reduce((acc, team) => acc + (team.members?.length || 0), 0)}
          </h3>
          <p style={{ opacity: '0.7' }}>Total Members</p>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
          <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
            {myTeams.reduce((acc, team) => acc + (team.requests?.length || 0), 0)}
          </h3>
          <p style={{ opacity: '0.7' }}>Pending Requests</p>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>My Teams</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {myTeams.map(team => (
            <div key={team.id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>{team.name}</h4>
                  <span className="badge badge-primary">{team.sport}</span>
                </div>
                <button className="btn btn-secondary" onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}>
                  {selectedTeam === team.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {selectedTeam === team.id && (
                <>
                  {team.requests && team.requests.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Pending Requests</h5>
                      {team.requests.map(userId => {
                        const requestUser = getUserById(userId);
                        return requestUser ? (
                          <div key={userId} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div>
                              <p style={{ fontWeight: '600' }}>{requestUser.firstName} {requestUser.lastName}</p>
                              <p style={{ fontSize: '12px', opacity: '0.7' }}>{requestUser.email}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn btn-success" onClick={() => handleApproveRequest(team.id, userId)}>Approve</button>
                              <button className="btn btn-danger" onClick={() => handleRejectRequest(team.id, userId)}>Reject</button>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  <div>
                    <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Team Members ({team.members?.length || 0})</h5>
                    {team.members && team.members.length > 0 ? (
                      team.members.map(userId => {
                        const member = getUserById(userId);
                        return member ? (
                          <div key={userId} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div>
                              <p style={{ fontWeight: '600' }}>{member.firstName} {member.lastName}</p>
                              <p style={{ fontSize: '12px', opacity: '0.7' }}>{member.email} • {member.skillLevel}</p>
                            </div>
                            <button className="btn btn-danger" onClick={() => handleRemoveMember(team.id, userId)}>Remove</button>
                          </div>
                        ) : null;
                      })
                    ) : (
                      <p style={{ opacity: '0.7', fontSize: '14px' }}>No members yet</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
          {myTeams.length === 0 && (
            <p style={{ textAlign: 'center', opacity: '0.7', padding: '32px' }}>No teams assigned yet. Contact admin to create a team for you.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;
