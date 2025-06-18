import React, { useState, useEffect } from 'react';
import './InSoiree.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../URLS';

interface Soiree {
  ID: number;
  nom: string;
  soiree_address: string;
  soiree_date: string;
  soiree_prix: number;
  soiree_nombreMax: number;
  soiree_description: string;
  evenement_id: number;
  soiree_price?: number;
  max_guests: number;
}

const InSoiree = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [soirees, setSoirees] = useState<Soiree[]>([]);
  const [selectedSoirees, setSelectedSoirees] = useState<number[]>([]);
  
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
    console.log('InSoiree component mounted');
    console.log('Location state:', location.state);
    console.log('Current event ID:', evenement_id);
    console.log('Numeric event ID:', numericEventId);
    
    if (numericEventId && !isNaN(numericEventId)) {
      console.log('Valid numeric event ID found, fetching soirees...');
      fetchSoirees();
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

  const fetchSoirees = async () => {
    try {
      if (!numericEventId || isNaN(numericEventId)) {
        throw new Error('Invalid event ID');
      }

      const url = `${URLS.ServerIpAddress}/api/getEventSoiree/${numericEventId}`;
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
        console.error('Error response:', responseText);
        throw new Error(`Failed to fetch soirees: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Fetched soirees:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch soirees');
      }

      // Map the API response to include max_guests from soiree_max_guests
      const mappedSoirees = result.data.map((soiree: any) => ({
        ...soiree,
        max_guests: soiree.soiree_max_guests // Map soiree_max_guests to max_guests
      }));

      console.log('Mapped soirees:', mappedSoirees);
      setSoirees(mappedSoirees);
    } catch (error: any) {
      console.error('Error fetching soirees:', error);
      toast.error(error.message || 'Failed to fetch soirees');
    }
  };

  const handleDelete = async (soireeId: number) => {
    if (!soireeId) {
      console.error('Invalid soiree ID:', soireeId);
      toast.error('Invalid soiree ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this soiree?')) {
      try {
        console.log('=== DELETE OPERATION STARTED ===');
        console.log('Soiree ID to delete:', soireeId);
        
        const headers = getAuthHeaders();
        console.log('Request headers:', headers);
        
        const deleteUrl = `${URLS.ServerIpAddress}/api/deleteSoiree`;
        console.log('Delete URL:', deleteUrl);
        
        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ID: soireeId.toString() }),
          credentials: 'include'
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          // First try to parse as JSON
          let errorMessage = 'Failed to delete soiree';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If JSON parsing fails, get the text response
            const errorText = await response.text();
            console.error('Error response:', errorText);
            
            if (response.status === 404) {
              errorMessage = 'Soiree not found';
            } else if (response.status === 400) {
              errorMessage = 'Invalid soiree ID';
            }
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Delete response:', result);
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to delete soiree');
        }

        console.log('=== DELETE OPERATION SUCCESSFUL ===');
        await fetchSoirees();
        toast.success('Soiree deleted successfully!');
      } catch (error: any) {
        console.error('=== DELETE OPERATION FAILED ===');
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        toast.error(error.message || 'Failed to delete soiree');
      }
    }
  };

  const handleCheckboxChange = (soireeId: number) => {
    setSelectedSoirees(prev => 
      prev.includes(soireeId) 
        ? prev.filter(id => id !== soireeId)
        : [...prev, soireeId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const validSoireeIds = filtered
        .filter(soiree => soiree && typeof soiree.ID === 'number')
        .map(soiree => soiree.ID);
      setSelectedSoirees(validSoireeIds);
    } else {
      setSelectedSoirees([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedSoirees.length === 0) {
      console.log('No soirees selected for deletion');
      toast.warning('Please select at least one soiree to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedSoirees.length} selected soiree(s)?`)) {
      try {
        console.log('Starting bulk delete for soirees:', selectedSoirees);
        const headers = getAuthHeaders();
        console.log('Bulk delete request headers:', headers);

        // Delete each soiree sequentially to ensure proper error handling
        for (const soireeId of selectedSoirees) {
          try {
            const deleteUrl = `${URLS.ServerIpAddress}/api/deleteSoiree`;
            console.log('Deleting soiree:', soireeId);
            
            const response = await fetch(deleteUrl, {
              method: 'DELETE',
              headers: {
                ...headers,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ ID: soireeId.toString() }),
              credentials: 'include'
            });

            if (!response.ok) {
              // First try to parse as JSON
              let errorMessage = 'Failed to delete soiree';
              try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
              } catch (e) {
                // If JSON parsing fails, get the text response
                const errorText = await response.text();
                console.error('Error response:', errorText);
                
                if (response.status === 404) {
                  errorMessage = 'Soiree not found';
                } else if (response.status === 400) {
                  errorMessage = 'Invalid soiree ID';
                }
              }
              throw new Error(errorMessage);
            }

            const result = await response.json();
            if (!result.success) {
              throw new Error(result.message || 'Failed to delete soiree');
            }
          } catch (error: any) {
            console.error(`Failed to delete soiree ${soireeId}:`, error);
            toast.error(`Failed to delete soiree ${soireeId}: ${error.message}`);
            // Continue with other deletions even if one fails
          }
        }

        console.log('All delete operations completed, refreshing soirees...');
        await fetchSoirees();
        setSelectedSoirees([]);
        toast.success('Selected soirees deleted successfully!');
      } catch (error: any) {
        console.error('Error in handleDeleteSelected:', error);
        console.error('Error stack:', error.stack);
        toast.error('Failed to delete selected soirees: ' + error.message);
      }
    }
  };

  const filtered = soirees.filter(s => 
    s.nom.toLowerCase().includes(search.toLowerCase()) ||
    s.soiree_address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#faf7f2' }}>
      <Sidebar />
      <div className="insoiree-container">
        <div className="insoiree-header-row">
          <h2 className="insoiree-title">Soirees</h2>
          <div className="insoiree-controls">
            <button 
              className="insoiree-create-btn" 
              onClick={() => navigate('/AddSoiree', { state: { evenement_id } })}
            >
              + Create New Soiree
            </button>
            <input
              className="insoiree-search"
              type="text"
              placeholder="Search by name or address..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        {selectedSoirees.length > 0 && (
          <div className="insoiree-bulk-actions">
            <span>{selectedSoirees.length} selected</span>
            <button 
              className="insoiree-delete-selected"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
          </div>
        )}
        
        <div className="insoiree-table-wrapper">
          <table className="insoiree-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    className="insoiree-checkbox"
                    checked={selectedSoirees.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Address</th>
                <th>Date</th>
                <th>Price</th>
                <th>Max Guests</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((soiree) => (
                <tr key={`soiree-${soiree.ID}`} className="insoiree-row">
                  <td>
                    <input 
                      type="checkbox" 
                      className="insoiree-checkbox"
                      checked={selectedSoirees.includes(soiree.ID)}
                      onChange={() => handleCheckboxChange(soiree.ID)}
                    />
                  </td>
                  <td>{soiree.nom}</td>
                  <td>{soiree.soiree_address}</td>
                  <td>{new Date(soiree.soiree_date).toLocaleString()}</td>
                  <td>{
                    soiree.soiree_price !== undefined && soiree.soiree_price !== null
                      ? soiree.soiree_price
                      : (soiree.soiree_prix !== undefined && soiree.soiree_prix !== null
                        ? soiree.soiree_prix
                        : 'N/A')
                  }</td>
                  <td>{soiree.max_guests || soiree.soiree_nombreMax || 'N/A'}</td>
                  <td>{soiree.soiree_description || 'N/A'}</td>
                  <td>
                    <div className="insoiree-actions">
                      <button 
                        className="insoiree-delete-btn"
                        onClick={() => handleDelete(soiree.ID)}
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
        
        <div className="insoiree-button-row">
          <button 
            className="insoiree-back-btn" 
            onClick={() => navigate('/add-details', { state: { evenement_id: numericEventId } })}
          >
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

export default InSoiree; 