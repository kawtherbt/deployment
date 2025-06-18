import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './InStaffTeam.css';
import { FETCH_STATUS } from '../fetchStatus';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Team {
  ID: number;
  nom: string;
  members: number;
  created_at: string;
  status: string;
}

interface Staff {
  ID: number;
  nom: string;
  prenom: string;
  email: string;
  num_tel: number;
  team_id: number;
  status: string;
}

interface SelectedItems {
  [key: string]: boolean;
}

function InStaffTeam() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 7;
const ServerIpAddress = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  const IndexOfLastItem = itemPerPage * currentPage;
  const IndexOfFirstItem = IndexOfLastItem - itemPerPage;

  const filteredTeams = teams.filter((item) => {
    return (
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.created_at).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.filter((staffItem) => {
        return (
          item.ID === staffItem.team_id && (
            staffItem.nom.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            staffItem.prenom.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            staffItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(staffItem.num_tel).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      })).length > 0
    );
  });

  const totalPages = Math.ceil(filteredTeams.length / itemPerPage);
  const shownTeams = filteredTeams.slice(IndexOfFirstItem, IndexOfLastItem);
  const allSelected = shownTeams.length > 0 && shownTeams.every((item) => selectedItems[item.ID]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    const tempSelectedItems: SelectedItems = {};

    shownTeams.forEach((item) => {
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
    getTeams();
    getStaffForTeams();
  }, []);

  const getTeams = async () => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${ServerIpAddress}/getAllTeams`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        throw ({ status: response.status, message: result.message });
      }

      setTeams(result.data);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while getting teams", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error('Error loading teams');
    }
  };

  const getStaffForTeams = async () => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${ServerIpAddress}/getAllStaffForTeams` , {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        throw ({ status: response.status, message: result.message });
      }

      setStaff(result.data);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while getting staff", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error('Error loading staff');
    }
  };

  const handleGoBack = () => {
    navigate('/in-staff');
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }

      if (startPage > 2) {
        pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
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
    <div className='in-staff-team'>
      <Sidebar />
      <div className='in-staff-team-content'>
        <header className='in-staff-team-header'>
          <div className='title-section'>
            <h1 className='in-staff-team-title'>Gestion des équipes</h1>
          </div>
          <div className='in-staff-team-actions'>
            <div className='search-container'>
              <Search className='search-icon' size={18} />
              <input
                type="text"
                placeholder='Rechercher des équipes...'
                className='search-input'
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value) }}
              />
            </div>
          </div>
        </header>

        <div className='table-container'>
          <table className='team-table'>
            <thead>
              <tr>
                <th className='team-checkbox-header'>
                  <div className='team-checkbox-container'>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      id="select-all"
                      className='team-checkbox-input'
                    />
                    <label htmlFor="select-all" className='team-checkbox-label'></label>
                  </div>
                </th>
                <th>Nom</th>
                <th>Membres</th>
                <th>Date de création</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {status === FETCH_STATUS.LOADING ? (
                <tr>
                  <td colSpan={5} className="loading-row">
                    <div className="loading-spinner"></div>
                    <span>Chargement des équipes...</span>
                  </td>
                </tr>
              ) : filteredTeams.length > 0 ? (
                shownTeams.map((item) => (
                  <tr 
                    key={item.ID} 
                    className={`team-row ${selectedItems[item.ID] ? 'selected' : ''}`}
                  >
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        id={`team-${item.ID}`}
                        checked={selectedItems[item.ID] || false}
                        onChange={(e) => handleSelectItem(item.ID, e.target.checked)}
                        className="team-checkbox-input"
                      />
                      <label htmlFor={`team-${item.ID}`} className="team-checkbox-label"></label>
                    </td>
                    <td>{item.nom}</td>
                    <td>{staff.filter(staffItem => staffItem.team_id === item.ID).length}</td>
                    <td>{new Date(item.created_at).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                    <td>
                      <span className={`status-badge ${(item.status || 'inactive').toLowerCase()}`}>
                        {item.status || 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="empty-row">
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3>Aucune équipe trouvée</h3>
                      <p>Essayez d'ajuster votre recherche</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className='in-staff-team-footer'>
          <div className='pagination-info'>
            Affichage de {shownTeams.length} sur {filteredTeams.length} équipes
          </div>
          <div className='footer-actions'>
            <button className='go-back-button' onClick={handleGoBack}>
              <ArrowLeft size={18} />
              Retour
            </button>
          </div>
          {renderPagination()}
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

export default InStaffTeam; 