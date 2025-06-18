import React, { useEffect, useState } from 'react';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightIcon } from 'lucide-react';
import Sidebar from '../sidebar/Sidebar';
import './InStaff.css';
import { FETCH_STATUS } from '../fetchStatus';
import StaffElementComponent from './staff-element/StaffElement';
import AddStaffModal from './add-staff/AddStaffModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateStaffModal from './update-staff/UpdateStaffModal';
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL?? "http://localhost:5000";

interface StaffElement {
  ID: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  disponibility?: string;
  phone?: string;
}

interface SelectedItems {
  [key: string]: boolean;
}

function InStaff() {
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [staffList, setStaffList] = useState<StaffElement[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isTeamsExpanded, setIsTeamsExpanded] = useState<boolean>(false);
  const [staffToUpdate, setStaffToUpdate] = useState<StaffElement>({
    ID: 0,
    nom: "",
    prenom: "",
    email: "",
    role: "",
  });
  const itemPerPage = 7;
  const navigate = useNavigate();

  const IndexOfLastItem = itemPerPage * currentPage;
  const IndexOfFirstItem = IndexOfLastItem - itemPerPage;

  const filteredStaff = staffList.filter((item) => {
    return (
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase())
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

  const toggleTeams = () => {
    setIsTeamsExpanded(!isTeamsExpanded);
  };

  const handleTeamsClick = () => {
    navigate('/in-staff-team');
    setIsTeamsExpanded(false);
  };

  useEffect(() => {
    getStaff();
  }, []);

  const getStaff = async () => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${API}/getAllStaff`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        throw ({ status: response.status, message: result.message });
      }

      // Enhance data with mock fields for demonstration
      const enhancedData = result.data.map((staff: StaffElement) => ({
        ...staff,
        disponibility: ['Available', 'Unavailable', 'On Leave'][Math.floor(Math.random() * 3)],
        phone: `+216 ${Math.floor(Math.random() * 10000000) + 90000000}`
      }));

      setStaffList(enhancedData);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while getting staff", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error('Error loading staff');
    }
  };

  const deleteStaff = async (ids: number[]) => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${API}/deleteStaff`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ IDs: ids }),
      });

      const result = await response.json();

      if (!result.success) {
        throw ({ status: response.status, message: result.message });
      }

      toast.success("Staff deleted successfully");
      if (allSelected && currentPage > 1 && shownStaff.length === ids.length) {
        setCurrentPage(currentPage - 1);
      }
      getStaff();
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while deleting staff", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error('Error deleting staff');
    }
  };

  const handleDelete = async () => {
    let selectedStaffIds: number[] = [];
    Object.keys(selectedItems).forEach((key) => {
      if (selectedItems[key]) {
        selectedStaffIds.push(parseInt(key));
      }
    });
    if (selectedStaffIds.length > 0) {
      await deleteStaff(selectedStaffIds);
    } else {
      toast.warning("No staff selected");
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end page numbers
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return (
      <div className="pagination">
        <button 
          className="pagination-arrow" 
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
        </button>
        
        {pages.map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              className={`pagination-page ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="pagination-ellipsis">{page}</span>
          )
        ))}
        
        <button 
          className="pagination-arrow" 
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className='in-staff'>
      <Sidebar />
      <div className='in-staff-content'>
        <header className='in-staff-header'>
          <div className='title-section'>
            <div className='management-header'>
              <h1 className='in-staff-title'>Staff Management</h1>
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
          <div className='in-staff-actions'>
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
              className='add-button'
              onClick={() => {}}
              title="Add Staff to Event"
            >
              <Plus size={20} />
              Add Staff to Event
            </button>
            <button 
              className='add-staff-button'
              onClick={() => navigate('/Addstaff')}
              title="Add Staff"
            >
              <Plus size={20} />
            </button>
          </div>
        </header>

        <div className='table-container'>
          <table className='staff-table'>
            <thead>
              <tr>
                <th className='in-staff-checkbox-header'>
                  <div className='in-staff-checkbox-container'>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      id="select-all"
                      className='in-staff-checkbox-input'
                    />
                    <label htmlFor="select-all" className='in-staff-checkbox-label'></label>
                  </div>
                </th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Availability</th>
                <th className='actions-header'>
                  <button className='delete-button' onClick={handleDelete} title="Delete selected">
                    <Trash2 size={18} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {status === FETCH_STATUS.LOADING ? (
                <tr>
                  <td colSpan={8} className="loading-row">
                    <div className="loading-spinner"></div>
                    <span>Loading staff...</span>
                  </td>
                </tr>
              ) : filteredStaff.length > 0 ? (
                shownStaff.map((item) => (
                  <StaffElementComponent 
                    key={item.ID} 
                    item={item} 
                    isSelected={selectedItems[item.ID]} 
                    onselect={handleSelectItem} 
                    setUpdate={setStaffToUpdate} 
                    setIsUpdateModalOpen={setIsUpdateModalOpen}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty-row">
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3>No staff found</h3>
                      <p>Try adjusting your search or add new staff</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className='in-staff-footer'>
          <div className='pagination-info'>
            Showing {shownStaff.length} of {filteredStaff.length} staff
          </div>
          {renderPagination()}
        </footer>
      </div>
      
      <AddStaffModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getStaff={getStaff}
      />

      <UpdateStaffModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        getStaff={getStaff}
        item={staffToUpdate}
      />

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

export default InStaff; 