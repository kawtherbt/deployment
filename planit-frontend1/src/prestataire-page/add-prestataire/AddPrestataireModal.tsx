import React, { useState } from 'react';
import './AddPrestataireModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';

interface AddPrestataireModalProps {
  isOpen: boolean;
  onClose: () => void;
  getPrestataires: () => void;
}

const AddPrestataireModal: React.FC<AddPrestataireModalProps> = ({ isOpen, onClose, getPrestataires }) => {
  const [formData, setFormData] = useState({
    nom: '',
    address: '',
    num_tel: '',
    email: '',
    type: 'Transport'
  });
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData ={...formData,num_tel:Number(formData.num_tel)}
      setStatus(FETCH_STATUS.LOADING);      
      const response = await fetch(`${URLS.ServerIpAddress}/addPrestataire`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(submitData),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      toast.success("Prestataire ajouté avec succès");
      setStatus(FETCH_STATUS.SUCCESS);
      resetForm();
      getPrestataires();
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du prestataire:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(`Erreur lors de l'ajout du prestataire: ${error.message || 'Erreur inconnue'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      address: '',
      num_tel: '',
      email: '',
      type: 'Transport'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="add_prestataire_modal_overlay">
      <div className="add_prestataire_modal">
        <div className="add_prestataire_modal_header">
          <h2>Ajouter un prestataire</h2>
          <button 
            className="add_prestataire_modal_close" 
            onClick={()=>{resetForm();onClose()}}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="add_prestataire_modal_form">
          <div className="add_prestataire_modal_form_row">
            <div className="add_prestataire_modal_form_group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Nom du prestataire"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>

            <div className="add_prestataire_modal_form_group">
              <label htmlFor="address">Adresse</label>
              <input
                type="text"
                id="adresse"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Adresse complète"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>
          </div>

          <div className="add_prestataire_modal_form_row">
            <div className="add_prestataire_modal_form_group">
              <label htmlFor="telephone">Numéro de téléphone</label>
              <input
                type="tel"
                id="telephone"
                name="num_tel"
                value={formData.num_tel}
                onChange={handleChange}
                placeholder="+212 6XX-XXXXXX"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>

            <div className="add_prestataire_modal_form_group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemple.com"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>

            <div className="add_prestataire_modal_form_group">
              <label htmlFor="type">Type</label>
              <div className="add_prestataire_modal_select_wrapper">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  disabled={status === FETCH_STATUS.LOADING}
                >
                  <option value="Transport">Transport</option>
                  <option value="Personnel">Personnel</option>
                  <option value="Équipement">Équipement</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="add_prestataire_modal_actions">
            <button 
              type="button" 
              className="add_prestataire_modal_cancel" 
              onClick={()=>{resetForm();onClose()}}
              disabled={status === FETCH_STATUS.LOADING}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              id="add_prestataire_submit"
              className="add_prestataire_modal_submit"
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

export default AddPrestataireModal; 