import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight, MoreHorizontal, Edit, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './AgencyStaffInEvent.css';
import { FETCH_STATUS } from '../fetchStatus';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../URLS';

interface StaffElement {
  ID: number;
  nom: string;
  prenom: string;
  email: string;
  departement: string;
  num_tel: number;
  role: string;
  available: boolean;
  agence_id: number;
  agence_nom: string;
  date_debut: string;
  date_fin: string;
  has_agency: number;
}

interface SelectedItems {
  [key: number]: boolean;
}

interface LocationState {
  eventId?: number;
}

function AgencyStaffInEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const [status, setStatus] = useState<string>(FETCH_STATUS.SUCCESS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [staffList, setStaffList] = useState<StaffElement[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('Event ID:', locationState?.eventId);
    if (locationState?.eventId) {
      fetchStaff();
    } else {
      toast.error('Event ID is missing');
      navigate('/event-staff');
    }
  }, [location.state]);

  const fetchStaff = async () => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      
      if (!locationState?.eventId) {
        throw new Error('Event ID is missing');
      }

      const eventId = parseInt(locationState.eventId.toString(), 10);
      if (isNaN(eventId) || eventId < 1) {
        throw new Error('Invalid Event ID');
      }

      const response = await fetch(`${URLS.ServerIpAddress}/getStaffWithAgencyByEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          evenement_id: eventId
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication required');
          navigate('/login');
          return;
        }
        throw new Error(result.message || 'Failed to fetch staff');
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch staff');
      }

      setStaffList(result.data);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error('Error fetching staff:', error);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(error.message || 'Failed to load staff');
      if (error.message === 'Event ID is missing') {
        navigate('/event-staff');
      }
    }
  };

  const IndexOfLastItem = itemPerPage * currentPage;
  const IndexOfFirstItem = IndexOfLastItem - itemPerPage;

  const filteredStaff = staffList.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    if (!searchTermLower) return true;

    return (
      item.nom.toLowerCase().includes(searchTermLower) ||
      item.prenom.toLowerCase().includes(searchTermLower) ||
      item.email.toLowerCase().includes(searchTermLower) ||
      item.role.toLowerCase().includes(searchTermLower) ||
      item.agence_nom.toLowerCase().includes(searchTermLower) ||
      item.departement.toLowerCase().includes(searchTermLower)
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleEdit = (id: number) => {
    const staffToEdit = staffList.find(staff => staff.ID === id);
    if (staffToEdit) {
      navigate('/EditStaffInEvent', {
        state: {
          staffData: {
            id: staffToEdit.ID,
            fullName: `${staffToEdit.prenom} ${staffToEdit.nom}`,
            email: staffToEdit.email,
            agency: staffToEdit.agence_nom,
            role: staffToEdit.role,
            startDate: staffToEdit.date_debut,
            endDate: staffToEdit.date_fin
          },
          eventId: locationState?.eventId
        }
      });
    }
  };

  const handleDelete = (index: number) => {
    handleDeleteSingle(index);
    setDropdownOpen(null);
  };

  const handleDeleteSelected = async () => {
    let selectedStaffIds: number[] = [];
    Object.keys(selectedItems).forEach((key) => {
      if (selectedItems[parseInt(key)]) {
        selectedStaffIds.push(parseInt(key));
      }
    });
    if (selectedStaffIds.length > 0) {
      try {
        // Add delete functionality here
        toast.success("Selected agency staff removed from event");
      } catch (error: any) {
        toast.error('Error removing agency staff from event');
      }
    } else {
      toast.warning("No agency staff selected");
    }
  };

  const handleDeleteSingle = async (id: number) => {
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/staff/deleteStaffAndAssignments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          staff_id: id
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication required');
          navigate('/login');
          return;
        }
        throw new Error(result.message || 'Failed to delete staff');
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete staff');
      }

      toast.success('Staff member and their assignments deleted successfully');
      // Refresh the staff list
      await fetchStaff();
    } catch (error: any) {
      console.error('Error deleting staff:', error);
      toast.error(error.message || 'Failed to delete staff');
    }
  };

  const handleGoBack = () => {
    navigate('/event-staff');
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

  const formatPhoneNumber = (num: number) => {
    return `+216 ${num}`;
  };

  return (
    <div className='agency-staff-in-event'>
      <Sidebar />
      <div className='agency-staff-in-event-content'>
        <header className='agency-staff-in-event-header'>
          <div className='title-section'>
            <h1 className='agency-staff-in-event-title'>Agency Staff in Event</h1>
          </div>
          <div className='agency-staff-in-event-actions'>
            <div className='search-container'>
              <Search className='search-icon' size={18} />
              <input
                type="text"
                placeholder='Search agency staff...'
                className='search-input'
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value) }}
              />
            </div>

            <button 
              className='add-staff-button'
              onClick={() => navigate('/AddStaffInEvent', { state: { eventId: locationState?.eventId } })}
              title="Add Agency Staff"
            >
              <Plus size={20} />
            </button>
          </div>
        </header>

        <div className='table-container'>
          <table className='staff-table'>
            <thead>
              <tr>
                <th className='checkbox-header'>
                  <div className='checkbox-container'>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      id="select-all"
                      className='checkbox-input'
                    />
                    <label htmlFor="select-all" className='checkbox-label'></label>
                  </div>
                </th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Agency</th>
                <th>Department</th>
                <th>Role</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th className='actions-header'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {status === FETCH_STATUS.LOADING ? (
                <tr>
                  <td colSpan={11} className="loading-row">
                    <div className="loading-spinner"></div>
                    <span>Loading agency staff...</span>
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
                        className="checkbox-input"
                      />
                      <label htmlFor={`staff-${item.ID}`} className="checkbox-label"></label>
                    </td>
                    <td>{item.prenom}</td>
                    <td>{item.nom}</td>
                    <td>{item.email}</td>
                    <td>{formatPhoneNumber(item.num_tel)}</td>
                    <td>{item.agence_nom}</td>
                    <td>{item.departement}</td>
                    <td>{item.role}</td>
                    <td>{new Date(item.date_debut).toLocaleDateString()}</td>
                    <td>{new Date(item.date_fin).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleDelete(item.ID)}
                        title="Remove staff"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="empty-row">
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3>No agency staff found</h3>
                      <p>Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className='agency-staff-in-event-footer'>
          <div className='pagination-info'>
            Showing {shownStaff.length} of {filteredStaff.length} agency staff
          </div>
          
          <div className='footer-center'>
            <button className='go-back-button' onClick={handleGoBack}>
              <ArrowLeft size={18} />
              Go Back to Event Staff
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

export default AgencyStaffInEvent; 