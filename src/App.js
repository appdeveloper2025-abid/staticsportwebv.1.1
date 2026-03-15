import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeStorage, getTheme, setTheme } from './utils/storage';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Notification from './components/Notification';
import AdminDashboard from './components/AdminDashboard';
import TeamLeaderDashboard from './components/TeamLeaderDashboard';
import PlayerDashboard from './components/PlayerDashboard';
import './styles/App.css';

const AppContent = () => {
  const { user, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    initializeStorage();
    const theme = getTheme();
    document.body.className = theme;
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const renderDashboard = () => {
    if (!user) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh',
          textAlign: 'center',
          padding: '32px'
        }}>
          <div style={{ fontSize: '120px', marginBottom: '24px' }}>🏆</div>
          <h2 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px' }}>
            Welcome to Sports Management
          </h2>
          <p style={{ fontSize: '18px', opacity: '0.7', marginBottom: '32px', maxWidth: '600px' }}>
            Join teams, participate in tournaments, and manage your sports activities all in one place.
          </p>
          <button className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 48px' }} onClick={() => setShowAuthModal(true)}>
            Get Started
          </button>

          <div className="dashboard-grid" style={{ marginTop: '64px', maxWidth: '1200px' }}>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Join Teams</h3>
              <p style={{ opacity: '0.7', fontSize: '14px' }}>Connect with players and join your favorite sports teams</p>
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Tournaments</h3>
              <p style={{ opacity: '0.7', fontSize: '14px' }}>Participate in exciting tournaments and competitions</p>
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Track Progress</h3>
              <p style={{ opacity: '0.7', fontSize: '14px' }}>Monitor your performance and skill development</p>
            </div>
          </div>
        </div>
      );
    }

    switch (user.role) {
      case 'admin':
        return <AdminDashboard showNotification={showNotification} />;
      case 'teamleader':
        return <TeamLeaderDashboard showNotification={showNotification} />;
      case 'player':
        return <PlayerDashboard showNotification={showNotification} />;
      default:
        return <PlayerDashboard showNotification={showNotification} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <Header onAuthClick={() => setShowAuthModal(true)} />
      <main style={{ flex: 1 }}>
        {renderDashboard()}
      </main>
      <Footer />

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLogin={login}
          showNotification={showNotification}
        />
      )}

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
