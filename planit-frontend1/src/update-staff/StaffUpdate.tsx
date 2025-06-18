import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './StaffUpdate.css';
import Sidebar from '../sidebar/Sidebar';
import { URLS } from '../URLS';
import { toast } from 'react-toastify';
export default function StaffUpdate() {
  const location = useLocation();
  const receivedData = useRef<any>(location.state);
  const [formData, setFormData] = useState({
    ID: receivedData.current.ID,
    nom: receivedData.current.nom,
    prenom: receivedData.current.prenom,
    num_tel: receivedData.current.num_tel,
    email: receivedData.current.email,
    departement: receivedData.current.departement,
    team: receivedData.current.team,
    role: receivedData.current.role
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/updateStaff`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',},
        credentials:'include',
        body: JSON.stringify(formData)
      });

      

      const result = await response.json();
      if(!result.success){
        throw({status: response.status,message:result.message});
      }
      
      console.log('Staff member updated successfully:', result);
      
      // Clear form
      setFormData({
        ID: '',
        nom: '',
        prenom: '',
        num_tel: '',
        email: '',
        departement: '',
        team: '',
        role: ''
      });

      toast.success('Staff member updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update staff member');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar/>
      <div className="main-content">
        <h1 className="page-title">Update Staff</h1>
        
        <div className="form-card">
          <h2 className="form-title">Update Staff Member</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Left Column */}
              <div>
                <div className="form-group">
                  <label className="form-label">Staff ID</label>
                  <input
                    type="text"
                    name="ID"
                    placeholder="Enter staff ID"
                    className="form-input"
                    value={formData.ID}
                    onChange={handleInputChange}
                    onBlur={(e) => e.target.value}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Enter first name"
                    className="form-input"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Enter last name"
                    className="form-input"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact</label>
                  <input
                    type="tel"
                    name="num_tel"
                    placeholder="Enter phone number"
                    className="form-input"
                    value={formData.num_tel}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <div className="select-wrapper">
                    <select
                      name="departement"
                      className="form-select"
                      value={formData.departement}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select department</option>
                      <option value="technical">Technical</option>
                      <option value="operations">Operations</option>
                      <option value="management">Management</option>
                      <option value="logistics">Logistics</option>
                    </select>
                    <div className="select-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Team</label>
                  <div className="select-wrapper">
                    <select
                      name="team"
                      className="form-select"
                      value={formData.team}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select team</option>
                      <option value="audio">Audio Team</option>
                      <option value="video">Video Team</option>
                      <option value="lighting">Lighting Team</option>
                      <option value="staging">Staging Team</option>
                    </select>
                    <div className="select-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <div className="select-wrapper">
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select role</option>
                      <option value="manager">Manager</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="technician">Technician</option>
                      <option value="operator">Operator</option>
                    </select>
                    <div className="select-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="button-container">
              <button
                type="submit"
                className="submit-button"
              >
                Update Staff Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 