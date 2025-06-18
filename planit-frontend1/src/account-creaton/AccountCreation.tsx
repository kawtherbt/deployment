import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import './AccountCreation.css'
import Sidebar from '../sidebar/Sidebar';
import { URLS } from '../URLS';
export default function AccountCreation() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    password: '',
    type: '',
    event: '',
    startTime: '',
    finishTime: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/api/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to create account');
      await response.json();
      setFormData({ name: '', role: '', email: '', password: '', type: '', event: '', startTime: '', finishTime: '' });
      alert('Account created successfully!');
    } catch (error: any) {
      alert('Failed to create account: ' + error.message);
    }
  };

  return (
    <div className="aacct-dashboard-container">
      <Sidebar />
      <div className="aacct-main-content">
        <h1 className="aacct-page-title">Create New Account</h1>
        <div className="aacct-form-card">
          <form onSubmit={handleSubmit}>
            <div className="aacct-form-grid">
              <div>
                <div className="aacct-form-group">
                  <label className="aacct-form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    className="aacct-form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="aacct-form-group">
                  <label className="aacct-form-label">Role</label>
                  <div className="aacct-select-wrapper">
                    <select
                      name="role"
                      className="aacct-form-select"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select role</option>
                      <option value="admin">Admin</option>
                      <option value="eventmaster">Event Master</option>
                      <option value="user">User</option>
                    </select>

                  </div>
                </div>
                <div className="aacct-form-group">
                  <label className="aacct-form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    className="aacct-form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="aacct-form-group">
                  <label className="aacct-form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    className="aacct-form-input"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <div className="aacct-form-group">
                  <label className="aacct-form-label">Type</label>
                  <div className="aacct-select-wrapper">
                    <select
                      name="type"
                      className="aacct-form-select"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select type</option>
                      <option value="internal">Internal</option>
                      <option value="external">External</option>
                    </select>

                  </div>
                </div>
                {formData.role === 'eventmaster' && (
                  <div className="aacct-form-group">
                    <label className="aacct-form-label">Event</label>
                    <div className="aacct-select-wrapper">
                      <select
                        name="event"
                        className="aacct-form-select"
                        value={formData.event}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select event</option>
                        <option value="event1">Event 1</option>
                        <option value="event2">Event 2</option>
                        <option value="event3">Event 3</option>
                      </select>
                      <div className="aacct-select-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                <div className="aacct-form-group">
                  <label className="aacct-form-label">Start Time</label>
                  <input
                    type="date"
                    name="startTime"
                    className="aacct-form-input"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="aacct-form-group">
                  <label className="aacct-form-label">Finish Time</label>
                  <input
                    type="date"
                    name="finishTime"
                    className="aacct-form-input"
                    value={formData.finishTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="aacct-buttons-container">
              <button type="submit" className="aacct-submit-button">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 