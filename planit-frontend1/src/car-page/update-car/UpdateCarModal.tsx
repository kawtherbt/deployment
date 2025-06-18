import React, { useEffect, useState } from 'react';
import './UpdateCarModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';

interface CarElement {
  ID: number;
  nom: string;
  matricule: string;
  nbr_place: number;
  categorie: string;
}

interface UpdateCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  getCars: () => void;
  item:CarElement;
}

const UpdateCarModal: React.FC<UpdateCarModalProps> = ({ isOpen, onClose, getCars, item }) => {
  const [formData, setFormData] = useState({
    nom: item.nom??"",
    matricule: item.matricule??"",
    nbr_place: item.nbr_place??0,
    categorie: item.categorie??""
  });

  useEffect(() => {
    if (item) {
      setFormData({
        nom: item.nom??"",
        matricule: item.matricule??"",
        nbr_place: item.nbr_place??0,
        categorie: item.categorie??""
      });
    }
  }, [item]);

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
        const submitData = {...formData,ID:item.ID}
      setStatus(FETCH_STATUS.LOADING);      
      const response = await fetch(`${URLS.ServerIpAddress}/updateCar`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(submitData),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      toast.success("Car created successfully");
      setStatus(FETCH_STATUS.SUCCESS);
      resetForm();
      getCars();
      onClose();
    } catch (error: any) {
      console.error("Error updating car:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      alert(`Error updating car: ${error.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      matricule: '',
      nbr_place: 0,
      categorie: 'Sedan'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="update_car_modal_overlay">
      <div className="update_car_modal">
        <div className="update_car_modal_header">
          <h2>Modifier le véhicule</h2>
          <button 
            className="update_car_modal_close" 
            onClick={()=>{resetForm();onClose()}}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="update_car_modal_form">
          <div className="update_car_modal_form_row">
            <div className="update_car_modal_form_group">
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
            
            <div className="update_car_modal_form_group">
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
          
          <div className="update_car_modal_form_row">
            <div className="update_car_modal_form_group">
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
            
            <div className="update_car_modal_form_group">
              <label htmlFor="categorie">Catégorie</label>
              <div className="update_car_modal_select_wrapper">
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
          
          <div className="update_car_modal_actions">
            <button 
              type="button" 
              className="update_car_modal_cancel" 
              onClick={()=>{resetForm();onClose()}}
              disabled={status === FETCH_STATUS.LOADING}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              id="update_car_submit"
              className="update_car_modal_submit"
              disabled={status === FETCH_STATUS.LOADING}
            >
              {status === FETCH_STATUS.LOADING ? 'Modification en cours...' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCarModal;