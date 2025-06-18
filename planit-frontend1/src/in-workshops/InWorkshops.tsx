import React, { useState, useEffect } from 'react';
import './InWorkshops.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../URLS';
import { ServerIpAddress } from '../URLS';
interface Workshop {
  workshop_id: number;
  workshop_name: string;
  nbr_invite: number | null;
  nbr_max_invite: number;
  prix: number;
  workshop_category: string;
  temp_debut: string;
  temp_fin: string;
  instructor_name: string;
  instructor_number: number;
  instructor_description: string;
}

const InWorkshops = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshops, setSelectedWorkshops] = useState<number[]>([]);
  const [eventId, setEventId] = useState<number | null>(null);
  const [activePopup, setActivePopup] = useState<number | null>(null);

  // Get event ID from location state and ensure it's a number
  useEffect(() => {
    const stateEventId = location.state?.evenement_id;
    console.log('Location state:', location.state);
    console.log('Raw event ID from state:', stateEventId);

    if (!stateEventId) {
      console.error('No event ID found in location state');
      toast.error('No event ID found. Please return to event details.');
      setTimeout(() => navigate('/add-details'), 2000);
      return;
    }

    // Validate event ID is a number
    const numericId = Number(stateEventId);
    if (isNaN(numericId)) {
      console.error('Invalid event ID format:', stateEventId);
      toast.error('Invalid event ID format');
      return;
    }

    console.log('Setting valid event ID:', numericId);
    setEventId(numericId);
  }, [location.state, navigate]);

  // Separate effect for fetching workshops when eventId changes
  useEffect(() => {
    if (eventId !== null) {
      console.log('Event ID changed, fetching workshops for ID:', eventId);
      fetchWorkshops(eventId);
    }
  }, [eventId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  const fetchWorkshops = async (id: number) => {
    try {
      console.log('Starting fetchWorkshops with ID:', id);
      console.log('ID type:', typeof id);

      // Using the correct endpoint with ID in URL parameter
      const url = `${ServerIpAddress}/getEventWorkshops/${id}`;
      console.log('Request URL:', url);

      const headers = getAuthHeaders();
      console.log('Request headers:', headers);

      const requestOptions = {
        method: 'GET',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include' as RequestCredentials
      };

      console.log('Request options:', JSON.stringify(requestOptions, null, 2));

      const response = await fetch(url, requestOptions);
      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to fetch workshops';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
          if (errorData.err) {
            console.error('Server error details:', errorData.err);
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing success response:', e);
        throw new Error('Invalid response format from server');
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch workshops');
      }

      if (Array.isArray(result.data)) {
        console.log('Workshops data:', result.data);
        // Log the first workshop to verify its structure
        if (result.data.length > 0) {
          console.log('First workshop structure:', result.data[0]);
          console.log('Available fields:', Object.keys(result.data[0]));
        }
        setWorkshops(result.data);
      } else {
        console.error('Invalid data format:', result.data);
        throw new Error('Invalid data format received from server');
      }
    } catch (error: any) {
      console.error('Error in fetchWorkshops:', error);
      toast.error(error.message || 'Failed to fetch workshops');
    }
  };

  const handleDelete = async (workshopId: number) => {
    if (!workshopId) {
      toast.error('Invalid workshop ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this workshop?')) {
      try {
        console.log('Starting delete process for workshop ID:', workshopId);
        
        const deleteUrl = `${URLS.ServerIpAddress}/deleteWorkshop`;
        console.log('Delete URL:', deleteUrl);
        
        const requestBody = { id: workshopId };
        console.log('Delete request body:', requestBody);
        
        const headers = {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        console.log('Delete request headers:', headers);

        console.log('Sending delete request...');
        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: headers,
          body: JSON.stringify(requestBody),
          credentials: 'include'
        });

        console.log('Delete response status:', response.status);
        console.log('Delete response headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('Raw delete response:', responseText);

        let result;
        try {
          result = JSON.parse(responseText);
          console.log('Parsed delete response:', result);
        } catch (e) {
          console.error('Error parsing delete response:', e);
          throw new Error('Invalid response format from server');
        }

        if (!result.success) {
          // Log the full error response
          console.error('Delete failed. Full error response:', result);
          console.error('Response status:', response.status);
          console.error('Response headers:', Object.fromEntries(response.headers.entries()));
          
          // Try to get more detailed error information
          const errorDetails = result.errors?.[0];
          console.error('Error details:', errorDetails);
          
          const errorMessage = errorDetails?.message || result.message || 'Failed to delete workshop';
          console.error('Error message:', errorMessage);
          
          throw { 
            status: response.status, 
            message: errorMessage,
            details: errorDetails
          };
        }

        console.log('Delete successful, refreshing workshop list...');
        if (eventId !== null) {
          await fetchWorkshops(eventId);
          console.log('Workshop list refreshed');
        } else {
          console.error('Cannot refresh workshop list: eventId is null');
        }
        
        toast.success('Workshop deleted successfully!');
      } catch (error: any) {
        console.error('Error in delete process:', error);
        console.error('Error stack:', error.stack);
        toast.error(error.message || 'An error occurred while deleting the workshop');
      }
    }
  };

  const handleCheckboxChange = (workshopId: number) => {
    setSelectedWorkshops(prev => 
      prev.includes(workshopId) 
        ? prev.filter(id => id !== workshopId)
        : [...prev, workshopId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const validWorkshopIds = filtered
        .filter(workshop => workshop && typeof workshop.instructor_number === 'number')
        .map(workshop => workshop.instructor_number);
      setSelectedWorkshops(validWorkshopIds);
    } else {
      setSelectedWorkshops([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedWorkshops.length === 0) {
      toast.warning('Please select at least one workshop to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedWorkshops.length} selected workshop(s)?`)) {
      try {
        console.log('Starting bulk delete process for workshops:', selectedWorkshops);
        let successCount = 0;
        let failCount = 0;

        for (const workshopId of selectedWorkshops) {
          try {
            console.log(`Deleting workshop ID: ${workshopId}`);
            
            const deleteUrl = `${ServerIpAddress}/deleteWorkshop`;
            console.log('Delete URL:', deleteUrl);
            
            const requestBody = { id: workshopId };
            console.log('Delete request body:', requestBody);
            
            const headers = {
              ...getAuthHeaders(),
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            };
            console.log('Delete request headers:', headers);

            const response = await fetch(deleteUrl, {
              method: 'DELETE',
              headers: headers,
              body: JSON.stringify(requestBody),
              credentials: 'include'
            });

            console.log(`Response status for workshop ${workshopId}:`, response.status);
            
            const responseText = await response.text();
            console.log(`Raw response for workshop ${workshopId}:`, responseText);

            let result;
            try {
              result = JSON.parse(responseText);
              console.log(`Parsed response for workshop ${workshopId}:`, result);
            } catch (e) {
              console.error(`Error parsing response for workshop ${workshopId}:`, e);
              throw new Error('Invalid response format from server');
            }

            if (!result.success) {
              console.error(`Delete failed for workshop ${workshopId}. Full error response:`, result);
              throw new Error(result.message || 'Failed to delete workshop');
            }

            successCount++;
            console.log(`Successfully deleted workshop ${workshopId}`);
          } catch (error: any) {
            failCount++;
            console.error(`Failed to delete workshop ${workshopId}:`, error);
            toast.error(`Failed to delete workshop ${workshopId}: ${error.message}`);
          }
        }

        // Refresh the workshop list after all deletions
        if (eventId !== null) {
          console.log('Refreshing workshop list after bulk delete');
          await fetchWorkshops(eventId);
          setSelectedWorkshops([]);
          
          // Show summary toast
          if (successCount > 0) {
            toast.success(`Successfully deleted ${successCount} workshop(s)`);
          }
          if (failCount > 0) {
            toast.error(`Failed to delete ${failCount} workshop(s)`);
          }
        } else {
          console.error('Cannot refresh workshop list: eventId is null');
        }
      } catch (error: any) {
        console.error('Error in handleDeleteSelected:', error);
        toast.error('An error occurred during bulk deletion: ' + error.message);
      }
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  const togglePopup = (workshopId: number) => {
    setActivePopup(activePopup === workshopId ? null : workshopId);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.instructor-popup') && !target.closest('.instructor-button')) {
        setActivePopup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = workshops.filter(w => {
    if (!w) return false;
    const searchLower = search.toLowerCase();
    return (
      (w.workshop_name?.toLowerCase() || '').includes(searchLower) ||
      (w.workshop_category?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#faf7f2' }}>
      <Sidebar />
      <div className="workshops-container">
        <div className="workshops-header-row">
          <h2 className="workshops-title">Workshops</h2>
          <div className="workshops-controls">
            <button 
              className="workshops-create-btn" 
              onClick={() => navigate('/AddWorkshop', { state: { evenement_id: eventId } })}
            >
              + Create New Workshop
            </button>
            <input
              className="workshops-search"
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {selectedWorkshops.length > 0 && (
          <div className="workshops-bulk-actions">
            <span>{selectedWorkshops.length} selected</span>
            <button 
              className="workshops-delete-selected"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
          </div>
        )}
        
        <div className="workshops-table-wrapper">
          <table className="workshops-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    className="workshops-checkbox"
                    checked={selectedWorkshops.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Instructor</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Price</th>
                <th>Category</th>
                <th>Max Participants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.workshop_id} className="workshops-row">
                  <td>
                    <input 
                      type="checkbox" 
                      className="workshops-checkbox"
                      checked={selectedWorkshops.includes(w.workshop_id)}
                      onChange={() => handleCheckboxChange(w.workshop_id)}
                    />
                  </td>
                  <td>{w.workshop_name || 'N/A'}</td>
                  <td>
                    <div className="instructor-info">
                      <button 
                        className="instructor-button"
                        onClick={() => togglePopup(w.workshop_id)}
                      >
                        {w.instructor_name || 'N/A'}
                      </button>
                    </div>
                  </td>
                  <td>{formatDateTime(w.temp_debut)}</td>
                  <td>{formatDateTime(w.temp_fin)}</td>
                  <td>{w.prix || 0} dt</td>
                  <td><span className="workshops-type-pill">{w.workshop_category || 'N/A'}</span></td>
                  <td>{w.nbr_max_invite || 0}</td>
                  <td>
                    <button 
                      className="workshops-delete-btn"
                      onClick={() => handleDelete(w.workshop_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="workshops-button-row">
          <button 
            className="workshops-back-btn" 
            onClick={() => navigate('/add-details', { state: { evenement_id: eventId } })}
          >
            &#8592; Go Back
          </button>
        </div>
      </div>

      {/* Instructor Popup Modal */}
      {activePopup !== null && (
        <div className="instructor-modal-overlay">
          <div className="instructor-modal">
            <div className="instructor-modal-content">
              <button 
                className="instructor-modal-close"
                onClick={() => setActivePopup(null)}
              >
                ×
              </button>
              <h3>Instructor Details</h3>
              {filtered.find(w => w.workshop_id === activePopup) && (
                <>
                  <p><strong>Name:</strong> {filtered.find(w => w.workshop_id === activePopup)?.instructor_name || 'N/A'}</p>
                  <p><strong>Number:</strong> {filtered.find(w => w.workshop_id === activePopup)?.instructor_number || 'N/A'}</p>
                  <p><strong>Description:</strong> {filtered.find(w => w.workshop_id === activePopup)?.instructor_description || 'N/A'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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

export default InWorkshops; 