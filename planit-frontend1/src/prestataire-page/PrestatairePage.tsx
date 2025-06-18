import React, { useEffect, useState } from 'react';
import './PrestatairePage.css';
import { Search, Plus, Trash2 } from 'lucide-react';
import { FETCH_STATUS } from '../fetchStatus';
import { URLS } from '../URLS';
import { toast, ToastContainer } from 'react-toastify';
import PrestataireElement from './prestataire-element/PrestataireElement';
import AddPrestataireModal from './add-prestataire/AddPrestataireModal';
import UpdatePrestataireModal from './update-prestataire/UpdatePrestataireModal';
import Sidebar from '../sidebar/Sidebar';

interface Prestataire {
  ID: number;
  nom: string;
  email: string;
  num_tel: string;
  address: string;
  type: string;
}

const PrestatairePage: React.FC = () => {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [status, setStatus] = useState<typeof FETCH_STATUS[keyof typeof FETCH_STATUS]>(FETCH_STATUS.IDLE);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrestataires, setSelectedPrestataires] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [prestataireToUpdate, setPrestataireToUpdate] = useState<Prestataire | null>(null);

  const getPrestataires = async () => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${URLS.ServerIpAddress}/api/getAllPrestataires`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      setPrestataires(result.data);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des prestataires:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(`Erreur lors de la récupération des prestataires: ${error.message || 'Erreur inconnue'}`);
    }
  };

  useEffect(() => {
    getPrestataires();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPrestataires = prestataires.filter(prestataire =>
    (prestataire.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (prestataire.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (String(prestataire.num_tel)?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (prestataire.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPrestataires(prev => [...prev, id]);
    } else {
      setSelectedPrestataires(prev => prev.filter(prestataireId => prestataireId !== id));
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPrestataires(filteredPrestataires.map(prestataire => prestataire.ID));
    } else {
      setSelectedPrestataires([]);
    }
  };

  const handleUpdate = (prestataire: Prestataire) => {
    setPrestataireToUpdate(prestataire);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedPrestataires.length === 0) {
      toast.warning("Veuillez sélectionner au moins un prestataire à supprimer");
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer les prestataires sélectionnés ?")) {
      return;
    }

    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${URLS.ServerIpAddress}/api/deletePrestataire`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ IDs: selectedPrestataires }),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      toast.success("Prestataires supprimés avec succès");
      setSelectedPrestataires([]);
      getPrestataires();
    } catch (error: any) {
      console.error("Erreur lors de la suppression des prestataires:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(`Erreur lors de la suppression des prestataires: ${error.message || 'Erreur inconnue'}`);
    }
  };

  return (<>
    <Sidebar/>
    <div className="prestataire_page">
      <div className="prestataire_page_header">
        <h1>Prestataires de service</h1>
        <div className="prestataire_page_actions">
          <div className="prestataire_page_search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Rechercher un prestataire..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {selectedPrestataires.length > 0 && (
            <button 
              className="prestataire_page_delete_button"
              onClick={handleDelete}
              disabled={status === FETCH_STATUS.LOADING}
            >
              <Trash2 size={20} />
              Supprimer ({selectedPrestataires.length})
            </button>
          )}
          <button 
            className="prestataire_page_add_button"
            onClick={() => setIsAddModalOpen(true)}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <Plus size={20} />
            Ajouter un prestataire
          </button>
        </div>
      </div>

      <div className="prestataire_page_content">
        {status === FETCH_STATUS.LOADING ? (
          <div className="prestataire_page_loading">Chargement des données...</div>
        ) : filteredPrestataires.length === 0 ? (
          <div className="prestataire_page_no_data">
            {searchTerm ? "Aucun prestataire ne correspond à votre recherche" : "Aucun prestataire trouvé"}
          </div>
        ) : (
          <table className="prestataire_page_table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedPrestataires.length === filteredPrestataires.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrestataires.map(prestataire => (
                <PrestataireElement
                  key={prestataire.ID}
                  item={prestataire}
                  isSelected={selectedPrestataires.includes(prestataire.ID)}
                  onselect={handleSelect}
                  setUpdate={handleUpdate}
                  setIsUpdateModalOpen={setIsUpdateModalOpen}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddPrestataireModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        getPrestataires={getPrestataires}
      />

      {prestataireToUpdate && (
        <UpdatePrestataireModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setPrestataireToUpdate(null);
          }}
          getPrestataires={getPrestataires}
          item={prestataireToUpdate}
        />
      )}
    </div>
    <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
  </>);
};

export default PrestatairePage; 