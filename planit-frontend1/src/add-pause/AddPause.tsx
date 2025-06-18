import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './AddPause.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { URLS } from '../URLS';

export default function AddPause() {
  const location = useLocation();
  const navigate = useNavigate();
  const evenement_id = useRef<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPauseId, setEditingPauseId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    start_time: '',
    end_time: '',
    prixPersonne: '',
    description: ''
  });

  useEffect(() => {
    if (location.state && location.state.evenement_id) {
      console.log('Location state:', location.state);
      evenement_id.current = Number(location.state.evenement_id);
      // Store the event ID in localStorage
      localStorage.setItem('current_event_id', evenement_id.current.toString());
      console.log('Set event ID to:', evenement_id.current);
    } else {
      // Try to get event ID from localStorage
      const storedEventId = localStorage.getItem('current_event_id');
      if (storedEventId) {
        console.log('Retrieved event ID from localStorage:', storedEventId);
        evenement_id.current = Number(storedEventId);
      } else {
        console.error('No event ID found in location state or localStorage');
        toast.error('No event ID provided. Please return to the event details page.');
        // Redirect to the event details page after a short delay
        setTimeout(() => {
          navigate('/add-details');
        }, 2000);
      }
    }
  }, [location.state, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      start_time: '',
      end_time: '',
      prixPersonne: '',
      description: ''
    });
    setIsEditing(false);
    setEditingPauseId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields including evenement_id
      if (!formData.name || !formData.start_time || !formData.end_time || !formData.prixPersonne || !evenement_id.current) {
        toast.error('Please fill in all required fields and ensure event ID is present');
        return;
      }

      // Format time to HH:mm format (without seconds)
      const formatTime = (time: string) => {
        return time.split(':').slice(0, 2).join(':'); // Keep only hours and minutes
      };

      const submitData = {
        name: formData.name.trim(),
        start_time: formatTime(formData.start_time),
        end_time: formatTime(formData.end_time),
        price_per_person: Number(formData.prixPersonne),
        description: formData.description?.trim() || '',
        evenement_id: Number(evenement_id.current)
      };

      // Log the exact data being sent
      console.log('Form data before submission:', formData);
      console.log('Event ID:', evenement_id.current);
      console.log('Submit data being sent:', submitData);

      const url = isEditing 
        ? `${URLS.ServerIpAddress}/api/updatePause`
        : `${URLS.ServerIpAddress}/api/addPause`;

      const method = isEditing ? 'PUT' : 'POST';
      console.log(`Making ${method} request to:`, url);

      // Log the request body
      const requestBody = JSON.stringify(isEditing ? { ...submitData, id: editingPauseId } : submitData);
      console.log('Request body:', requestBody);

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody,
        credentials: 'include'
      });

      const result = await response.json();
      console.log('Submit response:', result);

      if (!result.success) {
        // Log the full error response
        console.error('Full error response:', result);
        console.error('Response status:', response.status);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Try to get more detailed error information
        const errorDetails = result.errors?.[0];
        console.error('Error details:', errorDetails);
        
        const errorMessage = errorDetails?.message || result.message || 'Failed to submit pause';
        console.error('Error message:', errorMessage);
        
        throw { 
          status: response.status, 
          message: errorMessage,
          details: errorDetails
        };
      }
      
      resetForm();
      toast.success(`Break ${isEditing ? 'updated' : 'added'} successfully!`);
      // Navigate to the pauses list page after successful submission
      navigate('/in-pauses');
    } catch (error: any) {
      console.error('Error submitting pause:', error);
      toast.error(error.message || 'An error occurred while submitting the pause');
    }
  };

  return (
    <div className="ap-dashboard-container">
      <Sidebar />
      <div className="ap-main-content">
        <h1 className="ap-page-title">{isEditing ? 'Edit Break' : 'Add New Break'}</h1>
        <div className="ap-form-card">
          <form onSubmit={handleSubmit}>
            <div className="ap-form-grid">
              <div>
                <div className="ap-form-group">
                  <label className="ap-form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter break name"
                    className="ap-form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="ap-form-group">
                  <label className="ap-form-label">Start Time</label>
                  <input
                    type="time"
                    name="start_time"
                    className="ap-form-input"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <div className="ap-form-group">
                  <label className="ap-form-label">Price Per Person</label>
                  <input
                    type="number"
                    name="prixPersonne"
                    placeholder="Enter price per person"
                    className="ap-form-input"
                    value={formData.prixPersonne}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="ap-form-group">
                  <label className="ap-form-label">End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    className="ap-form-input"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="ap-form-group details-center">
              <label className="ap-form-label">Description</label>
              <textarea
                name="description"
                placeholder="Enter description for the break"
                rows={4}
                className="ap-form-input"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="ap-buttons-container">
              <button type="submit" className="ap-submit-button">
                {isEditing ? 'Update Break' : 'Add Break'}
              </button>
              {isEditing && (
                <button type="button" className="ap-secondary-button" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
              <button type="button" className="ap-check-button" onClick={() => navigate('/in-pauses')}>
                Check Pauses
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