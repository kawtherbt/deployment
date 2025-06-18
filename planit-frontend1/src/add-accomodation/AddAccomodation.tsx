import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './AddAccomodation.css';
import { URLS } from '../URLS';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AccommodationFormData {
  nom: string;
  address: string;
  type: 'single' | 'double' | 'suite';
  description: string;
  prix: number;
  date_debut: string;
  date_fin: string;
  number: number;
  evenement_id: number;
}

// Add date formatting utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const parseDate = (dateString: string) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

export default function AddAccomodation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AccommodationFormData>({
    nom: '',
    address: '',
    type: 'single',
    description: '',
    prix: 0,
    date_debut: '',
    date_fin: '',
    number: 1,
    evenement_id: 0
  });

  useEffect(() => {
    const stateEventId = location.state?.evenement_id;
    if (!stateEventId) {
      toast.error('No event ID found. Please return to event details.');
      setTimeout(() => navigate('/add-details'), 2000);
      return;
    }

    const numericId = Number(stateEventId);
    if (isNaN(numericId)) {
      toast.error('Invalid event ID format');
      return;
    }

    setFormData(prev => ({ ...prev, evenement_id: numericId }));
  }, [location.state, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (name === 'prix' || name === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;
      
      // Additional validation for number field
      if (name === 'number' && numValue <= 0) return;
      
      // Additional validation for prix field
      if (name === 'prix' && numValue < 0) return;
      
      setFormData(prev => ({ ...prev, [name]: numValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.nom.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Address is required');
      return false;
    }
    if (!formData.type) {
      toast.error('Type is required');
      return false;
    }
    if (formData.prix < 0) {
      toast.error('Price must be greater than or equal to 0');
      return false;
    }
    if (formData.number <= 0) {
      toast.error('Number must be greater than 0');
      return false;
    }
    if (!formData.date_debut) {
      toast.error('Start date is required');
      return false;
    }
    if (!formData.date_fin) {
      toast.error('End date is required');
      return false;
    }
    if (new Date(formData.date_fin) <= new Date(formData.date_debut)) {
      toast.error('End date must be after start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        date_debut: new Date(formData.date_debut).toISOString(),
        date_fin: new Date(formData.date_fin).toISOString(),
      };

      console.log('Submitting accommodation data:', submitData);

      const response = await fetch(`${URLS.ServerIpAddress}/addAccomodation`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed response:', result);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add accommodation');
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to add accommodation');
      }

      toast.success('Accommodation added successfully!');
      setFormData({
        nom: '',
        address: '',
        type: 'single',
        description: '',
        prix: 0,
        date_debut: '',
        date_fin: '',
        number: 1,
        evenement_id: formData.evenement_id
      });
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      toast.error('Failed to add accommodation: ' + error.message);
    }
  };

  return (
    <div className="aac-dashboard-container">
      <Sidebar />
      <div className="aac-main-content">
        <h1 className="aac-page-title">Add New Accommodation</h1>
        <div className="aac-form-card">
          <form onSubmit={handleSubmit}>
            <div className="aac-form-grid">
              <div>
                <div className="aac-form-group">
                  <label className="aac-form-label">Name</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Enter accommodation name"
                    className="aac-form-input"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="aac-form-group">
                  <label className="aac-form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter accommodation address"
                    className="aac-form-input"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <div className="aac-form-group">
                  <label className="aac-form-label">Type</label>
                  <select
                    name="type"
                    className="aac-form-input"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
                <div className="aac-form-group">
                  <label className="aac-form-label">Price</label>
                  <input
                    type="number"
                    name="prix"
                    placeholder="Enter price"
                    className="aac-form-input"
                    value={formData.prix}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <div className="aac-form-group">
                  <label className="aac-form-label">Number of Rooms</label>
                  <input
                    type="number"
                    name="number"
                    placeholder="Enter number of rooms"
                    className="aac-form-input"
                    value={formData.number}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="aac-form-group">
                  <label className="aac-form-label">Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter accommodation description"
                    className="aac-form-input"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
              <div>
                <div className="aac-form-group">
                  <label className="aac-form-label">Start Date</label>
                  <input
                    type="datetime-local"
                    name="date_debut"
                    className="aac-form-input"
                    value={formData.date_debut}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="aac-form-group">
                  <label className="aac-form-label">End Date</label>
                  <input
                    type="datetime-local"
                    name="date_fin"
                    className="aac-form-input"
                    value={formData.date_fin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="aac-buttons-container">
              <button type="submit" className="aac-submit-button">
                Add Accommodation
              </button>
              <button
                type="button"
                className="aac-add-btn"
                onClick={() => navigate('/in-accomodation', { state: { evenement_id: formData.evenement_id } })}
              >
                Check Accommodation
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