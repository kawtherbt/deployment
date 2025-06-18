import React, { useEffect, useState } from 'react';
import './UpdatePrestataireModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';

interface Prestataire {
  ID: number;
  nom: string;
  email: string;
  num_tel: string;
  address: string;
  type: string;
}

interface UpdatePrestataireModalProps {
  isOpen: boolean;
  onClose: () => void;
  getPrestataires: () => void;
  item: Prestataire;
}

const UpdatePrestataireModal: React.FC<UpdatePrestataireModalProps> = ({ isOpen, onClose, getPrestataires, item }) => {
  const [formData, setFormData] = useState({
    nom: item.nom ?? "",
    email: item.email ?? "",
    num_tel: item.num_tel ?? "",
    address: item.address ?? "",
    type: item.type ?? "Transport"
  });

  useEffect(() => {
    if (item) {
      setFormData({
        nom: item.nom ?? "",
        email: item.email ?? "",
        num_tel: item.num_tel ?? "",
        address: item.address ?? "",
        type: item.type ?? "Transport"
      });
    }
  }, [item]);

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
      const submitData = {...formData, ID: item.ID};
      setStatus(FETCH_STATUS.LOADING);      
      const response = await fetch(`${URLS.ServerIpAddress}/api/updatePrestataire`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(submitData),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      toast.success("Prestataire modifié avec succès");
      setStatus(FETCH_STATUS.SUCCESS);
      resetForm();
      getPrestataires();
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de la modification du prestataire:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(`Erreur lors de la modification du prestataire: ${error.message || 'Erreur inconnue'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      email: '',
      num_tel: '',
      address: '',
      type: 'Transport'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="update_prestataire_modal_overlay">
      <div className="update_prestataire_modal">
        <div className="update_prestataire_modal_header">
          <h2>Modifier le prestataire</h2>
          <button 
            className="update_prestataire_modal_close" 
            onClick={()=>{resetForm();onClose()}}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="update_prestataire_modal_form">
          <div className="update_prestataire_modal_form_row">
            <div className="update_prestataire_modal_form_group">
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
            
            <div className="update_prestataire_modal_form_group">
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
          </div>
          
          <div className="update_prestataire_modal_form_row">
            <div className="update_prestataire_modal_form_group">
              <label htmlFor="telephone">Téléphone</label>
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
            
            <div className="update_prestataire_modal_form_group">
              <label htmlFor="type">Type</label>
              <div className="update_prestataire_modal_select_wrapper">
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

          <div className="update_prestataire_modal_form_group">
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
          
          <div className="update_prestataire_modal_actions">
            <button 
              type="button" 
              className="update_prestataire_modal_cancel" 
              onClick={()=>{resetForm();onClose()}}
              disabled={status === FETCH_STATUS.LOADING}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="update_prestataire_modal_submit"
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

export default UpdatePrestataireModal;
