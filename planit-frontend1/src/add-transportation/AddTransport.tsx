import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './AddTransport.css';
import { URLS } from '../URLS';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Agency {
  ID: number;
  nom: string;
  address: string;
  description: string;
  entreprise_id: number;
}

interface StaffElement {
  ID: number;
  nom: string;
  prenom: string;
  num_tel: number;
  email: string;
  departement: string;
  role: string;
  team_id: number | null;
  entreprise_id: number;
  available: number;
  agence_id: number;
}

interface Car {
  ID: number;
  marque: string;
  modele: string;
  matricule: string;
  nbr_place: number;
  disponible: boolean;
  categorie: string;
}

interface TransportFormData {
  adress_depart: string;
  adress_arrive: string;
  temps_depart: string;
  description: string;
  prix: string;
  agence_id?: number;
  selfDone: boolean;
  selectedStaff?: number[];
  selectedCar?: number;
}

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  label: string;
}

const InternalTransportToggle: React.FC<CustomCheckboxProps> = ({ checked, onChange, id, label }) => (
  <div className="internal-transport-toggle">
    <input
      type="checkbox"
      id={id}
      name="selfDone"
      checked={checked}
      onChange={onChange}
      className="internal-transport-checkbox"
    />
    <label htmlFor={id} className="internal-transport-label">
      <span className="toggle-icon"></span>
      <span className="toggle-text">{label}</span>
    </label>
  </div>
);

export default function AddTransport() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = location.state?.evenement_id || localStorage.getItem('current_event_id');
  console.log('Location state:', location.state);
  console.log('Event ID from state:', eventId);
  
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [staff, setStaff] = useState<StaffElement[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [status, setStatus] = useState<string>('idle');

  // State for form inputs with initial values from localStorage if available
  const [formData, setFormData] = useState<TransportFormData>(() => {
    // Try to get saved data from localStorage
    const savedData = localStorage.getItem('transportFormData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Default initial state
    return {
      adress_depart: '',
      adress_arrive: '',
      temps_depart: '',
      description: '',
      prix: '',
      agence_id: undefined,
      selfDone: false,
      selectedStaff: [],
      selectedCar: undefined
    };
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('transportFormData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (eventId) {
      getAgencies();
      getStaff();
      getCars();
    } else {
      console.error('No event ID found in location state or localStorage');
      toast.error('No event ID found. Please return to event details.');
      setTimeout(() => navigate('/add-details'), 2000);
    }
  }, [eventId]);

  const getAgencies = async () => {
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/getAllAgencies`, {
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
    }
  };

  const getStaff = async () => {
    try {
      if (!eventId) {
        console.error('No event ID available');
        toast.error('Event ID is missing. Please return to event details.');
        return;
      }

      setStatus('loading');
      console.log('Fetching staff for event ID:', eventId);
      console.log('API URL:', `${URLS.ServerIpAddress}/getStaffByEvent/${eventId}`);
      
      const response = await fetch(`${URLS.ServerIpAddress}/getStaffByEvent/${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('API Response:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch staff');
      }

      console.log('Staff data:', result.data);
      setStaff(result.data);
      setStatus('success');
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStatus('error');
      toast.error('Failed to fetch staff. Please try again.');
    }
  };

  const getCars = async () => {
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/getAllCars`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch cars');
      }

      setCars(result.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to fetch cars. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      if (name === 'selfDone') {
        if (target.checked) {
          // If turning on internal management, clear agency selection
          setFormData((prev: TransportFormData) => ({
            ...prev,
            [name]: target.checked,
            agence_id: undefined,
            selectedStaff: [],
            selectedCar: undefined
          }));
        } else {
          // If turning off internal management, clear staff and car selections
          setFormData((prev: TransportFormData) => ({
            ...prev,
            [name]: target.checked,
            selectedStaff: [],
            selectedCar: undefined
          }));
        }
      } else {
        setFormData((prev: TransportFormData) => ({ ...prev, [name]: target.checked }));
      }
    } else if (name === 'agence_id') {
      // If selecting an agency, turn off internal management
      setFormData((prev: TransportFormData) => ({
        ...prev,
        [name]: value ? Number(value) : undefined,
        selfDone: false,
        selectedStaff: [],
        selectedCar: undefined
      }));
    } else if (name === 'durationHours' || name === 'durationMinutes') {
      // Ensure only numbers are entered for duration
      let numericValue = value.replace(/[^0-9]/g, '');
      
      // Enforce maximum of 59 for minutes
      if (name === 'durationMinutes' && numericValue !== '') {
        const minutesValue = parseInt(numericValue);
        if (minutesValue > 59) {
          numericValue = '59';
        }
      }
      
      setFormData((prev: TransportFormData) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev: TransportFormData) => ({ ...prev, [name]: value }));
    }
  };

  const handleStaffSelect = (staffId: number, isSelected: boolean) => {
    setFormData((prev: TransportFormData) => ({
      ...prev,
      selectedStaff: prev.selectedStaff?.includes(staffId) ? prev.selectedStaff.filter((id) => id !== staffId) : [...(prev.selectedStaff || []), staffId]
    }));
  };

  const handleSelectAllStaff = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    const newSelectedStaff: number[] = [];
    staff.forEach(staffMember => {
      if (isSelected) {
        newSelectedStaff.push(staffMember.ID);
      }
    });
    setFormData((prev: TransportFormData) => ({ ...prev, selectedStaff: newSelectedStaff }));
  };

  const formatPhoneNumber = (num: number) => {
    return `+216 ${num}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Starting transport submission process...');
    console.log('Form Data:', formData);
    
    try {
      // Validate that we're not trying to use both agency and internal management
      if (formData.agence_id && formData.selfDone) {
        console.warn('Validation failed: Cannot use both agency and internal management');
        toast.error('Please choose either an agency or internal management, not both');
        return;
      }

      // Validate that if internal management is selected, we have staff and car selected
      if (formData.selfDone) {
        console.log('Internal management selected, validating staff and car selections...');
        if (!formData.selectedStaff?.length) {
          console.warn('Validation failed: No staff selected for internal management');
          toast.error('Please select at least one staff member for internal management');
          return;
        }
        if (!formData.selectedCar) {
          console.warn('Validation failed: No car selected for internal management');
          toast.error('Please select a car for internal management');
          return;
        }
        console.log('Internal management validation passed');
      }

      // Create the base transport data
      const submitData: any = {
        adress_depart: formData.adress_depart,
        adress_arrive: formData.adress_arrive,
        temps_depart: formData.temps_depart,
        description: formData.description,
        prix: Number(formData.prix),
        evenement_id: Number(eventId),
        car_id: formData.selectedCar
      };

      // Add agency_id if provided and internal management is not selected
      if (formData.agence_id && !formData.selfDone) {
        console.log('Adding agency ID to submission:', formData.agence_id);
        submitData.agence_id = formData.agence_id;
      }

      // Add staff_id if internal management is selected
      if (formData.selfDone && formData.selectedStaff?.length) {
        console.log('Adding staff ID to submission:', formData.selectedStaff[0]);
        submitData.staff_id = formData.selectedStaff[0]; // Using the first selected staff member
      }

      console.log('Prepared submission data:', submitData);
      console.log('Sending request to:', `${URLS.ServerIpAddress}/addTransport`);

      const response = await fetch(`${URLS.ServerIpAddress}/addTransport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(submitData),
        credentials: 'include'
      });
  
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const responseText = await response.text();
        console.error('Error response:', responseText);
        let errorMessage = 'Failed to add transportation';
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          if (response.status === 404) {
            errorMessage = 'Transportation endpoint not found';
          } else if (response.status === 400) {
            errorMessage = 'Invalid transportation data';
          }
        }
        throw new Error(errorMessage);
      }
  
      const result = await response.json();
      console.log('Transportation added successfully. Full response:', result);
      
      // If internal management is selected and there are multiple staff members,
      // make additional API calls for each staff member after the first one
      if (formData.selfDone && formData.selectedStaff && formData.selectedStaff.length > 1) {
        console.log('=== ADDITIONAL STAFF MEMBERS PROCESSING STARTED ===');
        console.log('Selected staff members:', formData.selectedStaff);
        console.log('First staff member (already handled):', formData.selectedStaff[0]);
        
        // Extract transport ID from the nested response structure
        const transportId = result.data?.transport?.ID;
        console.log('Transport data from response:', result.data?.transport);
        console.log('Extracted transport ID:', transportId);
        
        if (!transportId || transportId <= 0) {
          console.error('Invalid transport ID:', transportId);
          console.error('Full response data:', result.data);
          toast.error('Invalid transport ID received from server');
          return;
        }
        
        // Process additional staff members (skip the first one as it's already handled)
        const additionalStaff = formData.selectedStaff.slice(1);
        console.log('Additional staff members to process:', additionalStaff);
        
        for (const staffId of additionalStaff) {
          try {
            if (!staffId || staffId <= 0) {
              console.error('Invalid staff ID:', staffId);
              toast.error(`Invalid staff ID: ${staffId}`);
              continue;
            }

            console.log(`\n=== Processing Staff Member ${staffId} ===`);
            const endpoint = 'http://localhost:5000/api/transport/addTransportStaff';
            console.log('Request URL:', endpoint);
            console.log('Request payload:', {
              transport_id: Number(transportId),
              staff_id: Number(staffId)
            });

            const staffResponse = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                transport_id: Number(transportId),
                staff_id: Number(staffId)
              }),
              credentials: 'include'
            });

            console.log('Response status:', staffResponse.status);
            console.log('Response headers:', Object.fromEntries(staffResponse.headers.entries()));

            if (!staffResponse.ok) {
              const responseText = await staffResponse.text();
              console.error('Error response text:', responseText);
              let errorMessage = `Failed to add staff member ${staffId}`;
              
              try {
                const errorData = JSON.parse(responseText);
                console.error('Parsed error data:', errorData);
                errorMessage = errorData.message || errorMessage;
              } catch (e) {
                console.error('Error parsing response:', e);
                if (staffResponse.status === 404) {
                  errorMessage = `Transport staff endpoint not found at ${endpoint}`;
                } else if (staffResponse.status === 400) {
                  errorMessage = 'Invalid staff data';
                }
              }
              throw new Error(errorMessage);
            }

            const staffResult = await staffResponse.json();
            console.log('Staff member addition response:', staffResult);
            console.log(`=== Staff Member ${staffId} Processing Completed ===\n`);
          } catch (error: any) {
            console.error(`Error processing staff member ${staffId}:`, error);
            console.error('Error stack:', error.stack);
            toast.error(`Failed to add staff member ${staffId}: ${error.message}`);
            // Continue with other staff members even if one fails
          }
        }
        console.log('=== ADDITIONAL STAFF MEMBERS PROCESSING COMPLETED ===');
      }
      
      // Clear form but preserve selfDone state
      const selfDoneValue = formData.selfDone;
      console.log('Clearing form data, preserving selfDone state:', selfDoneValue);
      
      setFormData({
        adress_depart: '',
        adress_arrive: '',
        temps_depart: '',
        description: '',
        prix: '',
        agence_id: undefined,
        selfDone: selfDoneValue,
        selectedStaff: [],
        selectedCar: undefined
      });
  
      toast.success('Transportation added successfully!');
      console.log('Transport submission process completed successfully');
    } catch (error: any) {
      console.error('Error in transport submission:', error);
      console.error('Error stack:', error.stack);
      toast.error(error.message || 'Failed to add transportation');
    }
  };

  // Functions for the additional buttons with localStorage preservation
  const handleAddParticipant = () => {
    console.log("Add participant clicked");
    // Navigate while preserving state in localStorage
  };

  const handleCheckParticipants = () => {
    console.log("Check participants clicked");
    // Navigate while preserving state in localStorage
  };

  const handleAddStaff = () => {
    console.log("Add staff clicked");
    // Form data is already saved in localStorage before navigation
    navigate('/in-staff');
  };

  const handleCheckStaff = () => {
    console.log("Check staff clicked");
    // Navigate while preserving state in localStorage
  };

  const handleAddCar = () => {
    console.log("Add car clicked");
    // Form data is already saved in localStorage before navigation
    navigate('/in-car');
  };

  const handleCheckCar = () => {
    console.log("Check car clicked");
    // Navigate while preserving state in localStorage
  };

  const handleCheckTransportations = () => {
    console.log("Check transportations clicked");
    // Navigate to the transport list page with event ID
    navigate('/transport-list', { state: { evenement_id: eventId } });
  };

  return (
    <div className="transport-container">
      <Sidebar />
      <div className="transport-content">
        <h1 className="transport-title">Transportation Management</h1>
        
        <div className="transport-form-container">
          <h2 className="form-title">Add Transportation</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="transport-form-grid">
              {/* Left Column */}
              <div className="transport-form-column">
                <div className="transport-form-group">
                  <label>Start Address</label>
                  <input
                    type="text"
                    name="adress_depart"
                    placeholder="Enter starting location"
                    value={formData.adress_depart}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="transport-form-group">
                  <label>Departure Time</label>
                  <input
                    type="datetime-local"
                    name="temps_depart"
                    value={formData.temps_depart}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="transport-form-group description-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter transportation details"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="transport-form-column">
                <div className="transport-form-group">
                  <label>Arrival Address</label>
                  <input
                    type="text"
                    name="adress_arrive"
                    placeholder="Enter destination address"
                    value={formData.adress_arrive}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="transport-form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="prix"
                    placeholder="Enter price"
                    value={formData.prix}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="transport-form-group">
                  <label>Agency (Optional)</label>
                  <select
                    name="agence_id"
                    value={formData.agence_id || ''}
                    onChange={handleInputChange}
                    className="transport-form-select"
                  >
                    <option value="">Select an agency</option>
                    {agencies.map(agency => (
                      <option key={agency.ID} value={agency.ID}>
                        {agency.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <InternalTransportToggle
                  checked={formData.selfDone}
                  onChange={handleInputChange}
                  id="selfDoneCheck"
                  label="Internal Transport Management"
                />

                {formData.selfDone && (
                  <div className="transport-action-buttons">
                    <div className="transport-form-group">
                      <label>Select Staff</label>
                      <div className="staff-checkbox-list">
                        {status === 'loading' ? (
                          <div className="loading-message">Loading staff...</div>
                        ) : staff.length > 0 ? (
                          staff.map(staffMember => (
                            <div key={staffMember.ID} className="staff-checkbox-item">
                              <input
                                type="checkbox"
                                id={`staff-${staffMember.ID}`}
                                checked={formData.selectedStaff?.includes(staffMember.ID) || false}
                                onChange={(e) => {
                                  const newSelectedStaff = e.target.checked
                                    ? [...(formData.selectedStaff || []), staffMember.ID]
                                    : (formData.selectedStaff || []).filter(id => id !== staffMember.ID);
                                  setFormData(prev => ({ ...prev, selectedStaff: newSelectedStaff }));
                                }}
                              />
                              <label htmlFor={`staff-${staffMember.ID}`}>
                                {staffMember.prenom} {staffMember.nom} - {staffMember.role}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="empty-message">No staff assigned to this event</div>
                        )}
                      </div>
                    </div>

                    <div className="transport-form-group">
                      <label>Select Car</label>
                      <select
                        name="selectedCar"
                        value={formData.selectedCar || ''}
                        onChange={(e) => {
                          setFormData(prev => ({ 
                            ...prev, 
                            selectedCar: e.target.value ? Number(e.target.value) : undefined 
                          }));
                        }}
                        className="transport-form-select"
                      >
                        <option value="">Select a car</option>
                        {cars.map(car => (
                          <option key={car.ID} value={car.ID}>
                            {car.marque} {car.modele} - {car.matricule} (Capacity: {car.nbr_place}, Category: {car.categorie})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bottom Buttons */}
            <div className="transport-bottom-buttons">
              <button type="submit" className="add-transportation-button">
                + Add transportation
              </button>
              <button type="button" className="check-transportation-button" onClick={handleCheckTransportations}>
                check transportations
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}