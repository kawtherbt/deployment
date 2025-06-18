import React, { useState } from 'react';
import './DeleteEquipmentModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';

interface DeleteEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  getEquipment: () => void;
  ids:number[];
}

const DeleteEquipmentModal: React.FC<DeleteEquipmentModalProps> = ({ isOpen, onClose, getEquipment,ids }) => {
  const [formData, setFormData] = useState({
    nbr: 0,

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
        if(formData.nbr < 1){
            toast.error("Number of equipments to delete must be greater than 0");
            return;
        }
        if(formData.nbr > ids.length){
            toast.error("Number of equipments to delete is greater than the number of equipments available");
            return;
        }
        const submitData = {
            IDs:ids,
            nbr:Number(formData.nbr)
        }
      setStatus(FETCH_STATUS.LOADING);      
      const response = await fetch(`${URLS.ServerIpAddress}/deleteEquipment`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(submitData),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      console.log("equipments deleted successfully");
      setStatus(FETCH_STATUS.SUCCESS);
      resetForm();
      getEquipment();
      onClose();
    } catch (error: any) {
      console.error("Error deleting equipments:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(`Error deleting equipments: ${error.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      nbr: 0,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="delete_equipment_modal_overlay">
      <div className="delete_equipment_modal">
        <div className="delete_equipment_modal_header">
          <h2>Delete Equipment</h2>
          <button 
            className="delete_equipment_modal_close" 
            onClick={()=>{resetForm();onClose()}}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="delete_equipment_modal_form">
          
          
          <div className="delete_equipment_modal_form_row">
            <div className="delete_equipment_modal_form_group">
              <label htmlFor="nbr">Number of equipments</label>
              <input
                type="number"
                id="nbr"
                name="nbr"
                value={formData.nbr || ''}
                onChange={handleChange}
                placeholder="nombre d'equipements"
                min="1"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>
          </div>
          
          <div className="delete_equipment_modal_actions">
            <button 
              type="button" 
              className="delete_equipment_modal_cancel" 
              onClick={()=>{resetForm();onClose()}}
              disabled={status === FETCH_STATUS.LOADING}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              id="delete_equipment_submit"
              className="delete_equipment_modal_submit"
              disabled={status === FETCH_STATUS.LOADING}
            >
              {status === FETCH_STATUS.LOADING ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteEquipmentModal;