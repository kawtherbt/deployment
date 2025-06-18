import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, ArrowLeft, CheckCircle, Users, ChevronDown, ChevronRight as ChevronRightIcon, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './EventStaff.css';
import { FETCH_STATUS } from '../fetchStatus';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../URLS';

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

interface SelectedItems {
  [key: number]: boolean;
}

function EventStaff() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = location.state?.eventId;
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [staffList, setStaffList] = useState<StaffElement[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 7;
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isTeamsExpanded, setIsTeamsExpanded] = useState<boolean>(false);
  const [showAssignedStaff, setShowAssignedStaff] = useState<boolean>(false);
export const ServerIpAddress = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  const IndexOfLastItem = itemPerPage * currentPage;
  const IndexOfFirstItem = IndexOfLastItem - itemPerPage;

  const filteredStaff = staffList.filter((item) => {
    return (
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.departement?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredStaff.length / itemPerPage);
  const shownStaff = filteredStaff.slice(IndexOfFirstItem, IndexOfLastItem);
  const allSelected = shownStaff.length > 0 && shownStaff.every((item) => selectedItems[item.ID]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    const tempSelectedItems: SelectedItems = {};

    shownStaff.forEach((item) => {
      tempSelectedItems[item.ID] = isSelected;
    });
    setSelectedItems(tempSelectedItems);
  };

  const handleSelectItem = (id: number, isSelected: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: isSelected,
    }));
  };

  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(null);
    }
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchStaff = async () => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      console.log('Fetching staff...');
      
      const endpoint = showAssignedStaff 
        ? `${API}/getStaffByEvent/${eventId}`
        : `${API}/getAvailableStaff`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to fetch staff: ${responseText}`);
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
        throw new Error(result.message || 'Failed to fetch staff');
      }

      // Ensure available is treated as a number
      const processedData = result.data.map((staff: any) => ({
        ...staff,
        available: Number(staff.available)
      }));

      console.log('Processed staff data:', processedData);
      setStaffList(processedData);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while getting staff:", error);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(error.message || 'Error loading staff');
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchStaff();
    }
  }, [showAssignedStaff]);

  const handleAddToEvent = async () => {
    const selectedStaffIds = Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => parseInt(id));

    if (selectedStaffIds.length === 0) {
      toast.warning("Please select at least one staff member");
      return;
    }

    if (!eventId) {
      toast.error("Event ID not found. Please return to the event details page and try again.");
      return;
    }

    try {
      setStatus(FETCH_STATUS.LOADING);
      
      console.log('Adding staff to event:', {
        selectedStaffIds,
        eventId,
        token: localStorage.getItem('token')
      });
      
      // Add each selected staff member to the event
      const addPromises = selectedStaffIds.map(staffId => {
        const requestBody = {
          staff_id: staffId,
          evenement_id: eventId
        };
        console.log('Making API request for staff:', staffId, 'with body:', requestBody);
        
        return fetch(`${API}/addStaffToEvent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(requestBody)
        }).then(async response => {
          const responseText = await response.text();
          console.log('Response for staff:', staffId, ':', {
            status: response.status,
            statusText: response.statusText,
            body: responseText
          });
          
          if (!response.ok) {
            throw new Error(`Failed to add staff ${staffId}: ${responseText}`);
          }
          return response;
        });
      });

      // Wait for all requests to complete
      const responses = await Promise.all(addPromises);
      
      // Check if any request failed
      const failedRequests = responses.filter(response => !response.ok);
      if (failedRequests.length > 0) {
        throw new Error(`Failed to add ${failedRequests.length} staff members to the event`);
      }

      // Clear selections after successful addition
      setSelectedItems({});
      toast.success(`Successfully added ${selectedStaffIds.length} staff member(s) to the event`);
      
      // Refresh the staff list
      await fetchStaff();
      
    } catch (error: any) {
      console.error('Error adding staff to event:', error);
      toast.error(error.message || 'Failed to add staff to event');
    } finally {
      setStatus(FETCH_STATUS.SUCCESS);
    }
  };

  const handleDelete = async () => {
    const selectedStaffIds = Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => parseInt(id));

    if (selectedStaffIds.length === 0) {
      toast.warning("Please select at least one staff member");
      return;
    }

    if (!eventId) {
      toast.error("Event ID not found. Please return to the event details page and try again.");
      return;
    }

    try {
      setStatus(FETCH_STATUS.LOADING);
      
      console.log('Setting staff as available:', {
        selectedStaffIds,
        eventId,
        token: localStorage.getItem('token')
      });
      
      // Set each selected staff member as available
      const setAvailablePromises = selectedStaffIds.map(staffId => {
        const requestBody = {
          staff_id: staffId,
          evenement_id: eventId
        };
        console.log('Making API request to set staff available:', staffId, 'with body:', requestBody);
        
        return fetch(`${API}/setStaffAvailable`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(requestBody)
        }).then(async response => {
          const responseText = await response.text();
          console.log('Response for staff:', staffId, ':', {
            status: response.status,
            statusText: response.statusText,
            body: responseText
          });
          
          if (!response.ok) {
            throw new Error(`Failed to set staff ${staffId} as available: ${responseText}`);
          }
          return response;
        });
      });

      // Wait for all requests to complete
      const responses = await Promise.all(setAvailablePromises);
      
      // Check if any request failed
      const failedRequests = responses.filter(response => !response.ok);
      if (failedRequests.length > 0) {
        throw new Error(`Failed to set ${failedRequests.length} staff members as available`);
      }

      // Clear selections after successful update
      setSelectedItems({});
      toast.success(`Successfully removed ${selectedStaffIds.length} staff member(s) from the event`);
      
      // Refresh the staff list
      await fetchStaff();
      
    } catch (error: any) {
      console.error('Error setting staff as available:', error);
      toast.error(error.message || 'Failed to remove staff from event');
    } finally {
      setStatus(FETCH_STATUS.SUCCESS);
    }
  };

  const handleMenuClick = (id: number) => {
    // Add menu functionality here
    console.log('Menu clicked for staff with ID:', id);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const handleGoBack = () => {
    navigate('/eventdetails');
  };

  const handleCheckStaff = () => {
    setShowAssignedStaff(!showAssignedStaff);
  };

  const handleCheckAgencyStaff = () => {
    navigate('/agency-staff-in-event', { state: { eventId: eventId } });
  };

  const toggleTeams = () => {
    setIsTeamsExpanded(!isTeamsExpanded);
  };

  const handleTeamsClick = () => {
    navigate('/in-staff-team');
    setIsTeamsExpanded(false);
  };

  const getAvailabilityStatus = (available: number) => {
    switch (available) {
      case 1:
        return { text: 'Available', class: 'available' };
      case 0:
        return { text: 'Unavailable', class: 'unavailable' };
      default:
        return { text: 'Unknown', class: 'unknown' };
    }
  };

  const formatPhoneNumber = (num: number) => {
    return `+216 ${num}`;
  };

  const formatName = (nom: string, prenom: string | null) => {
    return prenom ? `${prenom} ${nom}` : nom;
  };

  return (
    <div className='event-staff'>
      <Sidebar />
      <div className='event-staff-content'>
        <header className='event-staff-header'>
          <div className='title-section'>
            <div className='management-header'>
              <h1 className='event-staff-title'>Event Staff</h1>
              <div className='toggle-team-container'>
                <button 
                  className='toggle-teams-button'
                  onClick={toggleTeams}
                  aria-expanded={isTeamsExpanded}
                >
                  {isTeamsExpanded ? <ChevronDown size={18} /> : <ChevronRightIcon size={18} />}
                </button>
                {isTeamsExpanded && (
                  <div className='teams-dropdown' onClick={handleTeamsClick}>
                    <span>Teams Management</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='event-staff-actions'>
            <div className='search-container'>
              <Search className='search-icon' size={18} />
              <input
                type="text"
                placeholder='Search staff...'
                className='search-input'
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value) }}
              />
            </div>

            <button 
              className={`add-to-event-button ${showAssignedStaff ? 'remove-button' : ''}`}
              onClick={showAssignedStaff ? handleDelete : handleAddToEvent}
            >
              {showAssignedStaff ? (
                <>
                  <Trash2 size={18} />
                  <span>Remove from Event</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>Add to Event</span>
                </>
              )}
            </button>
          </div>
        </header>

        <div className='table-container'>
          <div className='table-header-actions'>
            <button 
              className={`toggle-staff-button ${showAssignedStaff ? 'active' : ''}`}
              onClick={handleCheckStaff}
            >
              <CheckCircle size={18} />
              <span>{showAssignedStaff ? 'Show Available Staff' : 'Show Assigned Staff'}</span>
            </button>
          </div>
          <table className='staff-table'>
            <thead>
              <tr>
                <th className='event-staff-checkbox-header'>
                  <div className='event-staff-checkbox-container'>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      id="select-all"
                      className='event-staff-checkbox-input'
                    />
                    <label htmlFor="select-all" className='event-staff-checkbox-label'></label>
                  </div>
                </th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {status === FETCH_STATUS.LOADING ? (
                <tr>
                  <td colSpan={7} className="loading-row">
                    <div className="loading-spinner"></div>
                    <span>Loading staff...</span>
                  </td>
                </tr>
              ) : filteredStaff.length > 0 ? (
                shownStaff.map((item) => (
                  <tr 
                    key={item.ID} 
                    className={`staff-row ${selectedItems[item.ID] ? 'selected' : ''}`}
                  >
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        id={`staff-${item.ID}`}
                        checked={selectedItems[item.ID] || false}
                        onChange={(e) => handleSelectItem(item.ID, e.target.checked)}
                        className="event-staff-checkbox-input"
                      />
                      <label htmlFor={`staff-${item.ID}`} className="event-staff-checkbox-label"></label>
                    </td>
                    <td>{item.prenom}</td>
                    <td>{item.nom}</td>
                    <td>{item.email}</td>
                    <td>{formatPhoneNumber(item.num_tel)}</td>
                    <td>{item.departement}</td>
                    <td>{item.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="empty-row">
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3>No Available Staff</h3>
                      <p>There are currently no staff members marked as available.</p>
                      <div className="empty-state-actions">
                        <button 
                          className="refresh-button"
                          onClick={fetchStaff}
                        >
                          Refresh List
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className='event-staff-footer'>
          <div className='pagination-info'>
            Showing {shownStaff.length} of {filteredStaff.length} staff
          </div>
          <div className='footer-actions'>
            <button className='go-back-button' onClick={handleGoBack}>
              <ArrowLeft size={18} />
              Go Back
            </button>
            <button className='check-agency-staff-button' onClick={handleCheckAgencyStaff}>
              <Users size={18} />
              Check Agency Staff
            </button>
          </div>
          <div className='pagination-controls'>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            {renderPagination()}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>
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

export default EventStaff; 