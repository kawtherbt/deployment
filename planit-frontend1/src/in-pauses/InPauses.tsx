import React, { useState, useEffect } from 'react';
import './InPauses.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../URLS';

interface Pause {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  price_per_person: number;
  details: string;
  evenement_id: number;
}

const InPauses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [pauses, setPauses] = useState<Pause[]>([]);
  const [selectedPauses, setSelectedPauses] = useState<number[]>([]);
  
  // Log the raw values
  console.log('Raw location state:', location.state);
  console.log('Raw localStorage event ID:', localStorage.getItem('current_event_id'));
  
  const evenement_id = location.state?.evenement_id || localStorage.getItem('current_event_id');
  console.log('Raw evenement_id:', evenement_id, 'Type:', typeof evenement_id);
  
  // Ensure we have a valid number
  const numericEventId = evenement_id ? Number(evenement_id) : null;
  console.log('Converted numericEventId:', numericEventId, 'Type:', typeof numericEventId);
  
  // Validate the conversion
  if (evenement_id && (isNaN(numericEventId!) || typeof numericEventId !== 'number')) {
    console.error('Failed to convert event ID to number:', evenement_id);
    toast.error('Invalid event ID format');
    setTimeout(() => navigate('/add-details'), 2000);
    return;
  }

  useEffect(() => {
    console.log('InPauses component mounted');
    console.log('Location state:', location.state);
    console.log('Current event ID:', evenement_id);
    console.log('Numeric event ID:', numericEventId);
    
    if (numericEventId && !isNaN(numericEventId)) {
      console.log('Valid numeric event ID found, fetching pauses...');
      fetchPauses();
    } else {
      console.error('No valid event ID found in location state or localStorage');
      toast.error('No valid event ID found. Please return to event details.');
      setTimeout(() => navigate('/add-details'), 2000);
    }
  }, [numericEventId, navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log('Getting auth headers, token exists:', !!token);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Auth headers set with token');
    } else {
      console.error('No token found in localStorage');
    }
    
    return headers;
  };

  const fetchPauses = async () => {
    try {
      if (!numericEventId || isNaN(numericEventId)) {
        throw new Error('Invalid event ID');
      }

      const url = `${URLS.ServerIpAddress}/api/getAllPausesForEvent/${evenement_id}`;
      const headers = getAuthHeaders();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...headers,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }
      
      const data = await response.json();
      console.log('Raw data from fetch:', data);
      
      if (Array.isArray(data)) {
        // Filter out the non-pause properties (message and success)
        const pausesArray = data.filter(item => typeof item === 'object' && 'id' in item);
        console.log('Filtered pauses array:', pausesArray);
        setPauses(pausesArray);
      } 
      else if (data.success && Array.isArray(data.data)) {
        setPauses(data.data);
      }
      else if (Array.isArray(data.result)) {
        setPauses(data.result);
      }
      else {
        console.error('Unexpected data format:', data);
        throw new Error('Unexpected response format from server');
      }
    } catch (error: any) {
      console.error('Error in fetchPauses:', error);
      toast.error('Failed to fetch pauses: ' + error.message);
    }
  };

  const handleDelete = async (pauseId: number) => {
    if (!pauseId) {
      console.error('Invalid pause ID:', pauseId);
      toast.error('Invalid pause ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this break?')) {
      try {
        console.log('=== DELETE OPERATION STARTED ===');
        console.log('Pause ID to delete:', pauseId);
        console.log('Event ID:', evenement_id);
        
        const headers = getAuthHeaders();
        console.log('Request headers:', headers);
        
        const deleteUrl = `${URLS.ServerIpAddress}/api/deletePause`;
        console.log('Delete URL:', deleteUrl);
        
        const requestBody = { ID: String(pauseId) };
        console.log('Request body:', requestBody);
        
        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          credentials: 'include'
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Delete failed with status:', response.status);
          console.error('Error response:', errorText);
          throw new Error(`Failed to delete break: ${errorText}`);
        }

        const result = await response.json();
        console.log('Delete response:', result);
        
        if (!result.success) {
          console.error('Delete operation failed:', result.message);
          throw new Error(result.message || 'Failed to delete break');
        }

        console.log('=== DELETE OPERATION SUCCESSFUL ===');
        await fetchPauses();
        toast.success('Break deleted successfully!');
      } catch (error: any) {
        console.error('=== DELETE OPERATION FAILED ===');
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        toast.error(error.message || 'Failed to delete break');
      }
    }
  };

  const handleCheckboxChange = (pauseId: number) => {
    setSelectedPauses(prev => 
      prev.includes(pauseId) 
        ? prev.filter(id => id !== pauseId)
        : [...prev, pauseId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const validPauseIds = filtered
        .filter(pause => pause && typeof pause.id === 'number')
        .map(pause => pause.id);
      setSelectedPauses(validPauseIds);
    } else {
      setSelectedPauses([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPauses.length === 0) {
      console.log('No pauses selected for deletion');
      toast.warning('Please select at least one break to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedPauses.length} selected break(s)?`)) {
      try {
        console.log('Starting bulk delete for pauses:', selectedPauses);
        const headers = getAuthHeaders();
        console.log('Bulk delete request headers:', headers);

        const deletePromises = selectedPauses.map(pauseId => {
          console.log('Creating delete promise for pause:', pauseId);
          return fetch(`${URLS.ServerIpAddress}/api/deletePause`, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify({ id: pauseId }),
            credentials: 'include'
          });
        });

        console.log('Waiting for all delete operations to complete...');
        await Promise.all(deletePromises);
        console.log('All delete operations completed, refreshing pauses...');
        
        await fetchPauses();
        setSelectedPauses([]);
        toast.success('Selected breaks deleted successfully!');
      } catch (error: any) {
        console.error('Error in handleDeleteSelected:', error);
        console.error('Error stack:', error.stack);
        toast.error('Failed to delete selected breaks: ' + error.message);
      }
    }
  };

  const filtered = pauses.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff7ed' }}>
      <Sidebar />
      <div className="pauses-container">
        <div className="pauses-header-row">
          <h2 className="pauses-title">Pauses</h2>
          <div className="pauses-controls">
            <button 
              className="pauses-create-btn" 
              onClick={() => navigate('/addPause', { state: { evenement_id } })}
            >
              + Create New Pause
            </button>
            <input
              className="pauses-search"
              type="text"
              placeholder="Search by name or details..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        {selectedPauses.length > 0 && (
          <div className="pauses-bulk-actions">
            <span>{selectedPauses.length} selected</span>
            <button 
              className="pauses-delete-selected"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
          </div>
        )}
        
        <div className="pauses-table-wrapper">
          <table className="pauses-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    className="pauses-checkbox"
                    checked={selectedPauses.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Price/Person</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pause) => (
                <tr key={`pause-${pause.id}`} className="pauses-row">
                  <td>
                    <input 
                      type="checkbox" 
                      className="pauses-checkbox"
                      checked={selectedPauses.includes(pause.id)}
                      onChange={() => handleCheckboxChange(pause.id)}
                    />
                  </td>
                  <td>{pause.name}</td>
                  <td>{pause.start_time}</td>
                  <td>{pause.end_time}</td>
                  <td>${pause.price_per_person}</td>
                  <td>
                    <div className="pauses-actions">
                      <button 
                        className="pauses-delete-btn"
                        onClick={() => handleDelete(pause.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pauses-button-row">
          <button className="pauses-back-btn" onClick={() => navigate('/add-details')}>
            &#8592; Go Back
          </button>
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
};

export default InPauses; 