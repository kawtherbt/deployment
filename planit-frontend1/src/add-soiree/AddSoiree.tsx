import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './AddSoiree.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { URLS } from '../URLS';

export default function AddSoiree() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    address: '',
    prix: 0,
    nombreMax: 0,
    startDate: '',
    startTime: '',
    description: ''
  });

  // Get event ID from location state or localStorage
  const evenement_id = location.state?.evenement_id || localStorage.getItem('current_event_id');
  console.log('Raw evenement_id:', evenement_id);

  // Convert to number and validate
  const numericEventId = evenement_id ? Number(evenement_id) : null;
  console.log('Converted numericEventId:', numericEventId);

  useEffect(() => {
    if (!numericEventId || isNaN(numericEventId)) {
      console.error('Invalid event ID');
      toast.error('Invalid event ID. Please return to event details.');
      setTimeout(() => navigate('/add-details'), 2000);
    }
  }, [numericEventId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for nombreMax to ensure it's a valid integer >= 1
    if (name === 'nombreMax') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 1 || !Number.isInteger(numValue)) {
        return; // Don't update if invalid
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!numericEventId || isNaN(numericEventId)) {
        throw new Error('Invalid event ID');
      }

      // Validate nombreMax before submission
      const nombreMax = parseInt(formData.nombreMax.toString());
      if (isNaN(nombreMax) || nombreMax < 1 || !Number.isInteger(nombreMax)) {
        throw new Error('Maximum guests must be a positive integer');
      }

      // Combine date and time into a string
      const dateTime = formData.startDate && formData.startTime 
        ? `${formData.startDate}T${formData.startTime}`
        : '';

      const submitData = {
        nom: formData.nom,
        address: formData.address,
        date: dateTime,
        prix: Number(formData.prix),
        max_guests: nombreMax,
        description: formData.description,
        evenement_id: numericEventId
      };

      console.log('Submitting soiree data:', submitData);

      const response = await fetch(`${URLS.ServerIpAddress}/addSoiree`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submitData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add soiree: ${errorText}`);
      }

      const result = await response.json();
      console.log('Add soiree response:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to add soiree');
      }

      toast.success('Soiree added successfully!');
      setFormData({ nom: '', address: '', prix: 0, nombreMax: 0, startDate: '', startTime: '', description: '' });
      navigate('/in-soiree', { state: { evenement_id: numericEventId } });
    } catch (error: any) {
      console.error('Error adding soiree:', error);
      toast.error(error.message || 'Failed to add soiree');
    }
  };

  return (
    <div className="as-dashboard-container">
      <Sidebar />
      <div className="as-main-content">
        <h1 className="as-page-title">Add New Soiree</h1>
        <div className="as-form-card">
          <form onSubmit={handleSubmit}>
            <div className="as-form-grid">
              <div>
                <div className="as-form-group">
                  <label className="as-form-label">Nom de soiree</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Enter soiree name"
                    className="as-form-input"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="as-form-group">
                  <label className="as-form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    className="as-form-input"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="as-form-group">
                  <label className="as-form-label">Prix</label>
                  <input
                    type="number"
                    name="prix"
                    placeholder="Enter price"
                    className="as-form-input"
                    value={formData.prix}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="as-form-group">
                  <label className="as-form-label">Nombre max d'invites</label>
                  <input
                    type="number"
                    name="nombreMax"
                    placeholder="Enter max guests"
                    className="as-form-input"
                    value={formData.nombreMax}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
              </div>
              <div>
                <div className="as-form-group">
                  <label className="as-form-label">Date debut</label>
                  <input
                    type="date"
                    name="startDate"
                    className="as-form-input"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="as-form-group">
                  <label className="as-form-label">Time debut</label>
                  <input
                    type="time"
                    name="startTime"
                    className="as-form-input"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="as-form-group">
                  <label className="as-form-label">Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    className="as-form-input"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="as-buttons-container">
              <button type="submit" className="as-submit-button">
                Add Soiree
              </button>
              <button 
                type="button" 
                className="as-submit-button" 
                onClick={() => navigate('/in-soiree', { state: { evenement_id: numericEventId } })}
              >
                Check Soiree
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}