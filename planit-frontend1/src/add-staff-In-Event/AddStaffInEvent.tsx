import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AddStaffInEvent.css';
import { toast } from 'react-toastify';
import { URLS } from '../URLS';

interface Staff {
  ID: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

interface Event {
  ID: number;
  nom: string;
}

interface Agency {
  ID: number;
  nom: string;
  address: string;
  description: string;
  entreprise_id: number;
}

interface FormData {
  prenom: string;
  nom: string;
  num_tel: string;
  email: string;
  agence_id: string;
  role: string;
  startDate: string;
  endDate: string;
  count?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

function AddStaffInEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventIdRef = useRef<number | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isMultiple, setIsMultiple] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    prenom: '',
    nom: '',
    num_tel: '',
    email: '',
    agence_id: '',
    role: '',
    startDate: '',
    endDate: '',
    count: ''
  });

  useEffect(() => {
    getStaff();
    getEvents();
    getAgencies();
    
    // Get event ID from location state
    if (location.state?.eventId) {
      eventIdRef.current = location.state.eventId;
      console.log('Event ID set:', eventIdRef.current);
    } else {
      console.error('No event ID found in location state');
      toast.error('Event ID is missing');
      navigate('/event-staff');
    }
  }, [location.state]);

  const getStaff = async () => {
    try {
      const response = await axios.get<{ success: boolean; data: Staff[] }>('${URLS.ServerIpAddress}/api/staff');
      if (response.data.success) {
        setStaff(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const getEvents = async () => {
    try {
      const response = await axios.get<{ success: boolean; data: Event[] }>('${URLS.ServerIpAddress}/api/events');
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getAgencies = async () => {
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/api/getAllAgencies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch agencies');
      }

      setAgencies(result.data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      toast.error('Failed to load agencies');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Form data:', formData);
    console.log('Event ID:', eventIdRef.current);
    
    try {
      if (!eventIdRef.current) {
        toast.error('Event ID is missing');
        return;
      }

      // Handle staff submission
      const requestBody = {
        prenom: formData.prenom,
        nom: formData.nom,
        num_tel: parseInt(formData.num_tel),
        email: formData.email,
        agence_id: parseInt(formData.agence_id),
        role: formData.role,
        start_date: formData.startDate,
        end_date: formData.endDate,
        departement: null,
        team_id: null,
        available: false,
        evenement_id: eventIdRef.current
      };

      console.log('Submitting staff data:', requestBody);

      const response = await fetch(`${URLS.ServerIpAddress}/api/addStaffWithAgence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to add staff');
      }

      toast.success('Staff added successfully');
      navigate('/agency-staff-in-event', { state: { eventId: eventIdRef.current } });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to add staff');
    }
  };

  const handleStaffSelect = (staffId: number) => {
    setSelectedStaff(prev => {
      if (prev.includes(staffId)) {
        return prev.filter(id => id !== staffId);
      } else {
        return [...prev, staffId];
      }
    });
  };

  return (
    <div className="asie-dashboard-container">
      <div className="asie-main-content">
        <h1 className="asie-page-title">Add Staff to Event</h1>
        <div className="asie-form-card">
          <form onSubmit={handleSubmit}>
            <div className="asie-form-grid">
              {!isMultiple && (
                <>
                  <div className="asie-form-group">
                    <label className="asie-form-label">First Name</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="asie-form-input"
                      required
                    />
                  </div>
                  <div className="asie-form-group">
                    <label className="asie-form-label">Last Name</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="asie-form-input"
                      required
                    />
                  </div>
                  <div className="asie-form-group">
                    <label className="asie-form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="num_tel"
                      value={formData.num_tel}
                      onChange={handleInputChange}
                      className="asie-form-input"
                      required
                    />
                  </div>
                  <div className="asie-form-group">
                    <label className="asie-form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="asie-form-input"
                      required
                    />
                  </div>
                  <div className="asie-form-group">
                    <label className="asie-form-label">Agency</label>
                    <select
                      name="agence_id"
                      value={formData.agence_id}
                      onChange={handleInputChange}
                      className="asie-form-input"
                      required
                    >
                      <option value="">Select an agency</option>
                      {agencies.map(agency => (
                        <option key={agency.ID} value={agency.ID}>
                          {agency.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="asie-form-group">
                <label className="asie-form-label">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="asie-form-input"
                  required
                />
              </div>
              <div className="asie-form-group">
                <label className="asie-form-label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="asie-form-input"
                  required
                />
              </div>
              <div className="asie-form-group">
                <label className="asie-form-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="asie-form-input"
                  required
                />
              </div>
              {isMultiple && (
                <div className="asie-form-group">
                  <label className="asie-form-label">Count</label>
                  <input
                    type="number"
                    name="count"
                    value={formData.count}
                    onChange={handleInputChange}
                    className="asie-form-input"
                    required
                    min="1"
                  />
                </div>
              )}
            </div>

            

            <div className="asie-form-actions">
            <div className="asie-multiple-checkbox">
                <input
                  type="checkbox"
                  id="multiple"
                  checked={isMultiple}
                  onChange={(e) => setIsMultiple(e.target.checked)}
                  className="asie-checkbox-input"
                />
                <label htmlFor="multiple" className="asie-checkbox-label"></label>
                <span>Add Multiple Staff</span>
              </div>
              <div className="asie-button-group">
                <button type="submit" className="asie-submit-button">
                  Add Staff
                </button>
                <button 
                  type="button" 
                  className="asie-back-button"
                  onClick={() => navigate('/event-staff')}
                >
                  Go Back
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStaffInEvent; 