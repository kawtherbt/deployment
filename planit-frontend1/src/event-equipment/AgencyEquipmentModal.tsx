import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import './AgencyEquipmentModal.css';
import { URLS } from '../URLS';
import { FETCH_STATUS } from '../fetchStatus';
import { toast } from 'react-toastify';
import ReserveEquipmentModal from './ReserveEquipmentModal';
import AddEquipmentModal from './AddEquipmentModal';

interface AgencyEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  onSuccess: () => void;
}

interface AgencyEquipment {
  ID: number;
  nom: string;
  code_bar: string | null;
  RFID: string | null;
  details: string | null;
  type: string;
  prix: number;
  date_achat: string | null;
  date_location: string | null;
  date_retour: string | null;
  agence_id: number;
  available: boolean;
  sub_category_id: number;
  sub_category_name: string;
  category_id: number;
  category_name: string;
  agence_nom: string;
  agence_num_tel: string;
  agence_email: string;
  agence_address: string;
}

function AgencyEquipmentModal({ isOpen, onClose, eventId, onSuccess }: AgencyEquipmentModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string>('');
  const [equipment, setEquipment] = useState<AgencyEquipment[]>([]);
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);
  const [agencies, setAgencies] = useState<string[]>([]);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAgencyEquipment();
    }
  }, [isOpen]);

  const fetchAgencyEquipment = async () => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${URLS.ServerIpAddress}/getAvailableAgencyEquipment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch agency equipment');
      }

      setEquipment(result.data);
      
      // Extract unique agency names
      const uniqueAgencies = Array.from(new Set(result.data.map((item: AgencyEquipment) => item.agence_nom))) as string[];
      setAgencies(uniqueAgencies);
      
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error('Error fetching agency equipment:', error);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(error.message || 'Error loading agency equipment');
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sub_category_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgency = !selectedAgency || item.agence_nom === selectedAgency;
    return matchesSearch && matchesAgency;
  });

  const handleReserveClick = (equipmentId: number) => {
    setSelectedEquipmentId(equipmentId);
    setIsReserveModalOpen(true);
  };

  const handleReservationSuccess = () => {
    setIsReserveModalOpen(false);
    setSelectedEquipmentId(null);
    fetchAgencyEquipment(); // Refresh the list
    if (onSuccess) {
      onSuccess();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="agency-modal-overlay">
      <div className="agency-modal-content">
        <div className="agency-modal-header">
          <div className="header-content">
            <h2>Équipements disponibles par agence</h2>
            <button className="add-equipment-button" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} />
              Ajouter un équipement
            </button>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="agency-modal-filters">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Rechercher des équipements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="controls-row">
            <select
              className="agency-select"
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
            >
              <option value="">Toutes les agences</option>
              {agencies.map(agency => (
                <option key={agency} value={agency}>{agency}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="agency-modal-table-container">
          <table className="agency-equipment-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Agence</th>
                <th>Disponibilité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {status === FETCH_STATUS.LOADING ? (
                <tr>
                  <td colSpan={8} className="loading-row">
                    <div className="loading-spinner"></div>
                    <span>Chargement des équipements...</span>
                  </td>
                </tr>
              ) : status === FETCH_STATUS.ERROR ? (
                <tr>
                  <td colSpan={8} className="error-row">
                    <div className="error-state">
                      <div className="error-icon">⚠️</div>
                      <h3>Erreur de chargement</h3>
                      <p>Impossible de charger les équipements. Veuillez réessayer.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-row">
                    <div className="empty-state">
                      <div className="empty-icon">🔧</div>
                      <h3>Aucun équipement trouvé</h3>
                      <p>Essayez d'ajuster votre recherche</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((equipment) => (
                  <tr key={equipment.ID} className="equipment-row">
                    <td>{equipment.nom}</td>
                    <td>{equipment.category_name}</td>
                    <td>{equipment.prix} €</td>
                    <td>{equipment.agence_nom}</td>
                    <td>
                      <span className={`status-badge ${equipment.available ? 'available' : 'unavailable'}`}>
                        {equipment.available ? 'Disponible' : 'Non disponible'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`reserve-button ${equipment.available ? '' : 'disabled'}`}
                        onClick={() => handleReserveClick(equipment.ID)}
                        disabled={!equipment.available}
                      >
                        Réserver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEquipmentId && (
        <ReserveEquipmentModal
          isOpen={isReserveModalOpen}
          onClose={() => {
            setIsReserveModalOpen(false);
            setSelectedEquipmentId(null);
          }}
          equipmentId={selectedEquipmentId}
          eventId={eventId}
          onSuccess={handleReservationSuccess}
        />
      )}

      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchAgencyEquipment();
          if (onSuccess) {
            onSuccess();
          }
        }}
        eventId={eventId}
      />
    </div>
  );
}

export default AgencyEquipmentModal; 