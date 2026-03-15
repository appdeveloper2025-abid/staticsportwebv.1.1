import React, { useState } from 'react';
import { saveUser, getUsers } from '../utils/storage';

const AuthModal = ({ onClose, onLogin, showNotification }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    sport: '',
    skillLevel: '',
    preferredRole: 'player'
  });

  const sports = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Volleyball', 'Badminton'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?[\d\s-()]+$/.test(phone);

  const handleSignUp = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      showNotification('Please fill all required fields', 'error');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      showNotification('Invalid email format', 'error');
      setLoading(false);
      return;
    }

    if (!validatePhone(formData.phone)) {
      showNotification('Invalid phone number', 'error');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    // Check if user exists
    const users = getUsers();
    if (users.find(u => u.email === formData.email || u.phone === formData.phone)) {
      showNotification('User already exists', 'error');
      setLoading(false);
      return;
    }

    // Save user
    const newUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      sport: formData.sport,
      skillLevel: formData.skillLevel,
      preferredRole: formData.preferredRole,
      role: formData.preferredRole === 'teamleader' ? 'teamleader' : 'player'
    };

    saveUser(newUser);
    showNotification('Account created successfully! Please sign in.', 'success');
    setActiveTab('signin');
    setLoading(false);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      showNotification('Please enter email/phone and password', 'error');
      setLoading(false);
      return;
    }

    const result = onLogin(formData.email, formData.password);
    if (result.success) {
      showNotification('Welcome back!', 'success');
      onClose();
    } else {
      showNotification(result.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'inherit', fontSize: '24px', cursor: 'pointer' }}>×</button>
        
        <h2 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '700', textAlign: 'center' }}>
          {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>

        <div className="tabs">
          <button className={`tab ${activeTab === 'signin' ? 'active' : ''}`} onClick={() => setActiveTab('signin')}>
            Sign In
          </button>
          <button className={`tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>
            Sign Up
          </button>
        </div>

        {activeTab === 'signin' ? (
          <form onSubmit={handleSignIn}>
            <div className="input-group">
              <span className="icon">📧</span>
              <input type="text" name="email" placeholder=" " value={formData.email} onChange={handleChange} />
              <label>Email or Phone</label>
            </div>

            <div className="input-group">
              <span className="icon">🔒</span>
              <input type="password" name="password" placeholder=" " value={formData.password} onChange={handleChange} />
              <label>Password</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }} disabled={loading}>
              {loading ? <span className="loading"></span> : 'Sign In'}
            </button>

            <div className="divider">OR SIGN IN WITH</div>

            <button type="button" className="social-btn">
              <span style={{ fontSize: '20px' }}>🔍</span> Continue with Google
            </button>
            <button type="button" className="social-btn">
              <span style={{ fontSize: '20px' }}></span> Continue with Apple
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <span className="icon">👤</span>
                <input type="text" name="firstName" placeholder=" " value={formData.firstName} onChange={handleChange} />
                <label>First Name</label>
              </div>

              <div className="input-group">
                <span className="icon">👤</span>
                <input type="text" name="lastName" placeholder=" " value={formData.lastName} onChange={handleChange} />
                <label>Last Name</label>
              </div>
            </div>

            <div className="input-group">
              <span className="icon">📧</span>
              <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} />
              <label>Email Address</label>
            </div>

            <div className="input-group">
              <span className="icon">📱</span>
              <input type="tel" name="phone" placeholder=" " value={formData.phone} onChange={handleChange} />
              <label>Phone Number</label>
            </div>

            <div className="input-group">
              <span className="icon">🔒</span>
              <input type="password" name="password" placeholder=" " value={formData.password} onChange={handleChange} />
              <label>Password</label>
            </div>

            <div className="input-group">
              <span className="icon">🔒</span>
              <input type="password" name="confirmPassword" placeholder=" " value={formData.confirmPassword} onChange={handleChange} />
              <label>Confirm Password</label>
            </div>

            <div className="input-group">
              <span className="icon">⚽</span>
              <select name="sport" value={formData.sport} onChange={handleChange}>
                <option value="">Select Sport</option>
                {sports.map(sport => <option key={sport} value={sport}>{sport}</option>)}
              </select>
              <label>Select Sport</label>
            </div>

            <div className="input-group">
              <span className="icon">📊</span>
              <select name="skillLevel" value={formData.skillLevel} onChange={handleChange}>
                <option value="">Select Skill Level</option>
                {skillLevels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
              <label>Skill Level</label>
            </div>

            <div className="input-group">
              <span className="icon">🎯</span>
              <select name="preferredRole" value={formData.preferredRole} onChange={handleChange}>
                <option value="player">Player</option>
                <option value="teamleader">Team Leader</option>
              </select>
              <label>Preferred Role</label>
            </div>

            <p style={{ fontSize: '12px', opacity: '0.7', marginBottom: '16px', textAlign: 'center' }}>
              By signing up, you agree to our Terms & Conditions
            </p>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }} disabled={loading}>
              {loading ? <span className="loading"></span> : 'Create Account'}
            </button>

            <div className="divider">OR SIGN UP WITH</div>

            <button type="button" className="social-btn">
              <span style={{ fontSize: '20px' }}>🔍</span> Continue with Google
            </button>
            <button type="button" className="social-btn">
              <span style={{ fontSize: '20px' }}></span> Continue with Apple
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
