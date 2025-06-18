import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import { FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { URLS } from '../URLS';
import { Toaster, toast } from 'react-hot-toast';
import './TransportList.css';

interface Staff {
  staff_id: number;
  staff_name: string;
  staff_role: string;
}

interface Transport {
  ID: number;
  adress_depart: string;
  adress_arrive: string;
  temps_depart: string;
  description: string;
  prix: number;
  evenement_id: number;
  car_id: number;
  agence_id: number;
  car_name: string;
  car_matricule: string;
  car_capacity: number;
  agence_name: string;
  staff: Staff[];
}

const TransportList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const location = useLocation();
  const eventId = location.state?.evenement_id || localStorage.getItem('current_event_id');

  useEffect(() => {
    const fetchTransports = async () => {
      if (!eventId) {
        setError('No event ID found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${URLS.ServerIpAddress}/getEventTransport/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transports');
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch transports');
        }

        setTransports(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching transports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransports();
  }, [eventId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleDelete = async (id: number) => {
    if (!id || id <= 0) {
      toast.error('Invalid transport ID');
      return;
    }

    try {
      console.log('Attempting to delete transport with ID:', id);
      const requestBody = { ID: id.toString() };
      console.log('Request body:', requestBody);

      const response = await fetch(`${URLS.ServerIpAddress}/deleteTransport`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to delete transport';
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
          console.error('Error data:', errorData);
        } catch (e) {
          console.error('Error parsing response:', e);
          if (response.status === 404) {
            errorMessage = 'Transport not found';
          } else if (response.status === 400) {
            errorMessage = 'Invalid transport ID or request format';
          }
        }
        throw new Error(errorMessage);
      }

      const result = JSON.parse(responseText);
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete transport');
      }

      // Remove the deleted transport from the state
      setTransports(prevTransports => prevTransports.filter(transport => transport.ID !== id));
      toast.success('Transport deleted successfully');
    } catch (error) {
      console.error('Error deleting transport:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete transport');
    }
  };

  const filteredTransports = transports.filter(transport =>
    transport.adress_depart.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transport.adress_arrive.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransports = filteredTransports.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="transport-list-container">
        <Toaster position="top-right" />
        <Sidebar />
        <div className="transport-list-content">
          <div className="loading-message">Loading transports...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transport-list-container">
        <Toaster position="top-right" />
        <Sidebar />
        <div className="transport-list-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="transport-list-container">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="transport-list-content">
        <div className="transport-list-header">
          <h1>Transportation List</h1>
          <div className="transport-list-actions">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="transport-table-container">
          <table className="transport-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Departure Time</th>
                <th>Description</th>
                <th>Price</th>
                <th>Car</th>
                <th>Agency</th>
                <th>Staff</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTransports.map((transport) => (
                <tr key={transport.ID}>
                  <td>{transport.ID}</td>
                  <td>{transport.adress_depart}</td>
                  <td>{transport.adress_arrive}</td>
                  <td>{formatDate(transport.temps_depart)}</td>
                  <td>{transport.description}</td>
                  <td>${transport.prix.toFixed(2)}</td>
                  <td>{transport.car_name} ({transport.car_matricule})</td>
                  <td>{transport.agence_name || 'Internal'}</td>
                  <td>
                    {transport.staff.map(staff => (
                      <div key={staff.staff_id}>
                        {staff.staff_name} - {staff.staff_role}
                      </div>
                    ))}
                  </td>
                  <td>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(transport.ID)}
                      title="Delete transport"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportList; 