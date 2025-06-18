import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './InAccomodationTable.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { URLS } from '../URLS';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Accommodation {
  ID: number;
  accomodation_name: string;
  address: string;
  accomodation_type: 'single' | 'double' | 'suite';
  description: string;
  accomodation_price: number;
  date_debut: string;
  date_fin: string;
  number: number;
}

const InAccomodationTable = () => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [search, setSearch] = useState('');
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const eventId = location.state?.evenement_id;
        if (!eventId) {
          toast.error('No event ID found');
          navigate('/add-details');
          return;
        }

        // Ensure eventId is a number
        const numericEventId = Number(eventId);
        if (isNaN(numericEventId)) {
          toast.error('Invalid event ID format');
          return;
        }

        console.log('Fetching accommodations for event ID:', numericEventId);
        console.log('Event ID type:', typeof numericEventId);

        const response = await fetch(`${URLS.ServerIpAddress}/api/getEventAccomodation/${numericEventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (!response.ok) {
          throw new Error(`Failed to fetch accommodations: ${responseText}`);
        }

        let result;
        try {
          result = JSON.parse(responseText);
          console.log('Parsed response:', result);
        } catch (e) {
          console.error('Error parsing response:', e);
          throw new Error('Invalid response format from server');
        }

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch accommodations');
        }

        setAccommodations(result.data || []);
      } catch (error: any) {
        console.error('Error fetching accommodations:', error);
        toast.error(error.message || 'Failed to fetch accommodations');
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [location.state, navigate]);

  const handleExpand = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  const filteredAccommodations = accommodations.filter(acc => 
    acc.accomodation_name.toLowerCase().includes(search.toLowerCase()) ||
    acc.address.toLowerCase().includes(search.toLowerCase()) ||
    acc.accomodation_type.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/api/deleteAccomodation`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ID: id })
      });

      const responseText = await response.text();
      console.log('Delete response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to delete accommodation: ${responseText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing delete response:', e);
        throw new Error('Invalid response format from server');
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete accommodation');
      }

      // Remove the deleted accommodation from the state
      setAccommodations(prev => prev.filter(acc => acc.ID !== id));
      toast.success('Accommodation deleted successfully');
    } catch (error: any) {
      console.error('Error deleting accommodation:', error);
      toast.error(error.message || 'Failed to delete accommodation');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#faf7f2' }}>
        <Sidebar />
        <div className="accommodation-container">
          <div className="loading-message">Loading accommodations...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#faf7f2' }}>
      <Sidebar />
      <div className="accommodation-container">
        <div className="accommodation-header-row">
          <h2 className="accommodation-title">Accommodation</h2>
          <div className="accommodation-controls">
            <button
              className="accommodation-create-btn"
              onClick={() => navigate('/AddAccomodation', { state: { evenement_id: location.state?.evenement_id } })}
            >
              + Create New Accommodation
            </button>
            <input
              className="accommodation-search"
              type="text"
              placeholder="Search by name, location, or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="accommodation-table-wrapper">
          <table className="accommodation-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Location</th>
                <th>Start time</th>
                <th>Finish time</th>
                <th>Number</th>
                <th>Type</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccommodations.map((acc) => (
                <React.Fragment key={acc.ID}>
                  <tr className="accommodation-row">
                    <td>
                      <button
                        className="expand-btn"
                        onClick={() => handleExpand(acc.ID)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {expanded[acc.ID] ? (
                          <span style={{ fontSize: 20, color: '#2563eb' }}>&#8594;</span>
                        ) : (
                          <span style={{ fontSize: 20, color: '#2563eb' }}>+</span>
                        )}
                      </button>
                    </td>
                    <td>{acc.accomodation_name}</td>
                    <td>{acc.address}</td>
                    <td>{formatDateTime(acc.date_debut)}</td>
                    <td>{formatDateTime(acc.date_fin)}</td>
                    <td>{acc.number}</td>
                    <td>
                      <span className={`accommodation-type-pill ${acc.accomodation_type.toLowerCase()}`}>
                        {acc.accomodation_type}
                      </span>
                    </td>
                    <td>{acc.accomodation_price} dt</td>
                    <td>
                      <button 
                        className="accommodation-delete-btn"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this accommodation?')) {
                            handleDelete(acc.ID);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expanded[acc.ID] && (
                    <tr className="accommodation-row sub-row">
                      <td colSpan={9}>
                        <div className="accommodation-details">
                          <h4>Description</h4>
                          <p>{acc.description || 'No description available'}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="accommodation-button-row">
          <button
            className="accommodation-back-btn"
            onClick={() => navigate('/add-details', { state: { evenement_id: location.state?.evenement_id } })}
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

export default InAccomodationTable; 