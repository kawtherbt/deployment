import React, { useState } from 'react';
import './AddCarModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  getCars: () => void;
}

const AddCarModal: React.FC<AddCarModalProps> = ({ isOpen, onClose, getCars }) => {
  const [formData, setFormData] = useState({
    nom: '',
    matricule: '',
    nbr_place: null,
    categorie: 'Sedan'
  });
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nbr_place' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setStatus(FETCH_STATUS.LOADING);      
      const response = await fetch(`${URLS.ServerIpAddress}/api/addCar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      console.log("Car created successfully");
      setStatus(FETCH_STATUS.SUCCESS);
      resetForm();
      getCars();
      onClose();
    } catch (error: any) {
      console.error("Error creating car:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(`Error creating car: ${error.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      matricule: '',
      nbr_place: null,
      categorie: 'Sedan'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="add_car_modal_overlay">
      <div className="add_car_modal">
        <div className="add_car_modal_header">
          <h2>Véhicules</h2>
          <button 
            className="add_car_modal_close" 
            onClick={()=>{resetForm();onClose()}}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="add_car_modal_form">
          <div className="add_car_modal_form_row">
            <div className="add_car_modal_form_group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Nom du véhicule"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>
            
            <div className="add_car_modal_form_group">
              <label htmlFor="matricule">Matricule</label>
              <input
                type="text"
                id="matricule"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                placeholder="matricule"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>
          </div>
          
          <div className="add_car_modal_form_row">
            <div className="add_car_modal_form_group">
              <label htmlFor="nbr_place">Nombre de places</label>
              <input
                type="number"
                id="nbr_place"
                name="nbr_place"
                value={formData.nbr_place || ''}
                onChange={handleChange}
                placeholder="Nombre de places"
                min="1"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>
            
            <div className="add_car_modal_form_group">
              <label htmlFor="categorie">Catégorie</label>
              <div className="add_car_modal_select_wrapper">
                <select
                  id="categorie"
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  required
                  disabled={status === FETCH_STATUS.LOADING}
                >
                  <option value="Sedan">Berline</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Citadine</option>
                  <option value="Truck">Camion</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="add_car_modal_actions">
            <button 
              type="button" 
              className="add_car_modal_cancel" 
              onClick={()=>{resetForm();onClose()}}
              disabled={status === FETCH_STATUS.LOADING}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              id="add_car_submit"
              className="add_car_modal_submit"
              disabled={status === FETCH_STATUS.LOADING}
            >
              {status === FETCH_STATUS.LOADING ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarModal;