import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../sidebar/Sidebar';
import './EventEquipment.css';
import { FETCH_STATUS } from '../fetchStatus';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { URLS } from '../URLS';
import ReserveEquipmentModal from './ReserveEquipmentModal';
import AgencyEquipmentModal from './AgencyEquipmentModal';

interface EquipmentElement {
  ID: number;
  nom: string;
  code_bar: string;
  RFID: string;
  details: string;
  entreprise_id: number;
  category_id: number;
  type: string;
  prix: number;
  date_achat: string;
  date_location: string;
  date_retour: string;
  agence_id: number;
  sub_category_id: number;
  available: boolean;
  // These fields will be populated by the backend join
  category_name?: string;
  sub_category_name?: string;
  agence_nom?: string;
  date_debut?: string;
  date_fin?: string;
}

interface SelectedItems {
  [key: number]: boolean;
}

interface SortConfig {
  key: 'category_name' | null;
  direction: 'asc' | 'desc';
}

function EventEquipment() {
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [equipmentList, setEquipmentList] = useState<EquipmentElement[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const [showReservedEquipment, setShowReservedEquipment] = useState(false);
  const itemPerPage = 7;
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc'
  });
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);

  const IndexOfLastItem = itemPerPage * currentPage;
  const IndexOfFirstItem = IndexOfLastItem - itemPerPage;

  const filteredEquipment = equipmentList.filter((item) => {
    return (
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sub_category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredEquipment.length / itemPerPage);

  const handleSort = (key: 'category_name') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedEquipment = () => {
    if (!sortConfig.key) return filteredEquipment;

    return [...filteredEquipment].sort((a, b) => {
      const aValue = a[sortConfig.key!] || '';
      const bValue = b[sortConfig.key!] || '';

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedEquipment = getSortedEquipment();
  const shownEquipment = sortedEquipment.slice(IndexOfFirstItem, IndexOfLastItem);
  const allSelected = shownEquipment.length > 0 && shownEquipment.every((item) => selectedItems[item.ID]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    const newSelectedItems = { ...selectedItems };

    shownEquipment.forEach((item) => {
      newSelectedItems[item.ID] = isSelected;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleSelectItem = (id: number, isSelected: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: isSelected,
    }));
  };

  useEffect(() => {
    if (!eventId) {
      console.error('No event ID provided');
      toast.error('Event ID is required');
      navigate('/');
      return;
    }
    console.log('Event ID from URL:', eventId);
    if (showReservedEquipment) {
      getReservedEquipment();
    } else {
      getEquipment();
    }
  }, [eventId, showReservedEquipment]);

  const getEquipment = async () => {
    try {
      console.log('Starting getEquipment function');
      setStatus(FETCH_STATUS.LOADING);
      
      console.log('Fetching from URL:', `${URLS.ServerIpAddress}/getAvailableEquipmentForEvent`);

      const response = await fetch(`${URLS.ServerIpAddress}/getAvailableEquipmentForEvent`, {
        method: "GET",
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response data:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch equipment');
      }

      setEquipmentList(result.data);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while getting equipment:", error);
      console.error("Error stack:", error.stack);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(error.message || 'Error loading equipment');
    }
  };

  const getReservedEquipment = async () => {
    try {
      console.log('Starting getReservedEquipment function');
      setStatus(FETCH_STATUS.LOADING);
      
      console.log('Fetching from URL:', `${URLS.ServerIpAddress}/getReservedEquipmentForEvent/${eventId}`);

      const response = await fetch(`${URLS.ServerIpAddress}/getReservedEquipmentForEvent/${eventId}`, {
        method: "GET",
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response data:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch reserved equipment');
      }

      setEquipmentList(result.data);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while getting reserved equipment:", error);
      console.error("Error stack:", error.stack);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(error.message || 'Error loading reserved equipment');
    }
  };

  const handleAddToEvent = async () => {
    let selectedEquipmentIds: number[] = [];
    Object.keys(selectedItems).forEach((key) => {
      if (selectedItems[Number(key)]) {
        selectedEquipmentIds.push(Number(key));
      }
    });
    if (selectedEquipmentIds.length > 0) {
      try {
        // Here you would make an API call to add the selected equipment to the event
        toast.success("Equipment added to event successfully");
      } catch (error: any) {
        toast.error('Error adding equipment to event');
      }
    } else {
      toast.warning("No equipment selected");
    }
  };

  const handleReserveClick = (equipmentId: number) => {
    if (!eventId) {
      console.error('No event ID available');
      toast.error('Event ID is required');
      return;
    }
    console.log('Reserve button clicked for equipment ID:', equipmentId);
    console.log('Current event ID:', eventId);
    setSelectedEquipmentId(equipmentId);
    setIsModalOpen(true);
    console.log('Modal opened for equipment reservation');
  };

  const handleReservationSuccess = () => {
    console.log('Reservation successful, refreshing equipment list');
    getEquipment(); // Refresh the equipment list
  };

  const handleUnreserveClick = async (equipmentId: number) => {
    if (!eventId) {
      console.error('No event ID available');
      toast.error('Event ID is required');
      return;
    }

    try {
      console.log('Unreserving equipment:', {
        equipement_id: equipmentId,
        evenement_id: parseInt(eventId, 10)
      });

      const response = await fetch(`${URLS.ServerIpAddress}/unreserveEquipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          equipement_id: equipmentId,
          evenement_id: parseInt(eventId, 10)
        })
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to unreserve equipment');
      }

      toast.success('Équipement retiré avec succès');
      getReservedEquipment(); // Refresh the list
    } catch (error: any) {
      console.error('Error unreserving equipment:', error);
      toast.error(error.message || 'Erreur lors du retrait de l\'équipement');
    }
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="event-equipment">
      <Sidebar />
      <div className="event-equipment-content">
        <h1 className="event-equipment-title">
          {showReservedEquipment ? 'Équipements réservés' : 'Ajouter des équipements à l\'événement'}
        </h1>
        
        <div className="event-equipment-form-container">
          <div className="event-equipment-actions">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Rechercher des équipements..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="sort-container">
              <select 
                className="sort-select"
                value={sortConfig.key || ''}
                onChange={(e) => handleSort(e.target.value as 'category_name')}
              >
                <option value="">Trier par...</option>
                <option value="category_name">Catégorie</option>
              </select>
            </div>

            <button 
              className="agency-reserve-button"
              onClick={() => setIsAgencyModalOpen(true)}
            >
              Réserver depuis agence
            </button>

            <button 
              className={`view-toggle-button ${showReservedEquipment ? 'active' : ''}`}
              onClick={() => setShowReservedEquipment(!showReservedEquipment)}
            >
              {showReservedEquipment ? 'Voir équipements disponibles' : 'Voir équipements réservés'}
            </button>
          </div>

          <div className="table-container">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th className="event-equipment-checkbox-header">
                    <div className="event-equipment-checkbox-container">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        id="select-all"
                        className="event-equipment-checkbox-input"
                      />
                      <label htmlFor="select-all" className="event-equipment-checkbox-label"></label>
                    </div>
                  </th>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Type</th>
                  <th>Prix</th>
                  {showReservedEquipment && (
                    <>
                      <th>Date de début</th>
                      <th>Date de fin</th>
                    </>
                  )}
                  <th>Disponibilité</th>
                  {!showReservedEquipment && <th>Réserver</th>}
                  {showReservedEquipment && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {status === FETCH_STATUS.LOADING ? (
                  <tr>
                    <td colSpan={showReservedEquipment ? 9 : 7} className="loading-row">
                      <div className="loading-spinner"></div>
                      <span>Chargement des équipements...</span>
                    </td>
                  </tr>
                ) : filteredEquipment.length === 0 ? (
                  <tr>
                    <td colSpan={showReservedEquipment ? 9 : 7} className="empty-row">
                      <div className="empty-state">
                        <div className="empty-icon">🔧</div>
                        <h3>Aucun équipement trouvé</h3>
                        <p>Essayez d'ajuster votre recherche</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  shownEquipment.map((item) => (
                    <tr key={item.ID} className="equipment-row">
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={selectedItems[item.ID] || false}
                          onChange={(e) => handleSelectItem(item.ID, e.target.checked)}
                        />
                      </td>
                      <td>{item.nom}</td>
                      <td>{item.category_name || 'N/A'}</td>
                      <td>{item.type || 'N/A'}</td>
                      <td>{item.prix ? item.prix.toFixed(2) + ' €' : 'N/A'}</td>
                      {showReservedEquipment && (
                        <>
                          <td>{item.date_debut ? formatDate(item.date_debut) : 'N/A'}</td>
                          <td>{item.date_fin ? formatDate(item.date_fin) : 'N/A'}</td>
                        </>
                      )}
                      <td>
                        <span className={`status-badge ${item.available ? 'available' : 'unavailable'}`}>
                          {item.available ? 'Disponible' : 'Non disponible'}
                        </span>
                      </td>
                      {!showReservedEquipment && (
                        <td>
                          <button 
                            className={`reserve-button ${selectedItems[item.ID] ? 'reserved' : ''}`}
                            onClick={() => handleReserveClick(item.ID)}
                          >
                            {selectedItems[item.ID] ? 'Réservé' : 'Réserver'}
                          </button>
                        </td>
                      )}
                      {showReservedEquipment && (
                        <td>
                          <button 
                            className="remove-button"
                            onClick={() => handleUnreserveClick(item.ID)}
                          >
                            Retirer
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="event-equipment-footer">
            <div className="pagination-info">
              Affichage de {shownEquipment.length} sur {filteredEquipment.length} équipements
            </div>
            <div className="pagination-controls">
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
          </div>
        </div>
      </div>

      {selectedEquipmentId && eventId && (
        <ReserveEquipmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEquipmentId(null);
          }}
          equipmentId={selectedEquipmentId}
          eventId={parseInt(eventId, 10)}
          onSuccess={handleReservationSuccess}
        />
      )}

      {eventId && (
        <AgencyEquipmentModal
          isOpen={isAgencyModalOpen}
          onClose={() => setIsAgencyModalOpen(false)}
          eventId={parseInt(eventId, 10)}
          onSuccess={handleReservationSuccess}
        />
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
}

export default EventEquipment; 