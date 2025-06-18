import React, { useEffect, useState } from 'react';
import './UpdateCustomerModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';

interface CustomerElement {
  ID: number;
  nom: string;
  email: string;
  num_tel: number;
  domain: string;
}

interface UpdateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  getClients: () => void;
  itemid:number;
  items:CustomerElement[];
}

const UpdateCustomerModal: React.FC<UpdateCustomerModalProps> = ({ isOpen, onClose, getClients, itemid, items }) => {
  const [formData, setFormData] = useState({
    nom: items.find(item => item.ID === itemid)?.nom??"",
    email: items.find(item => item.ID === itemid)?.email??"",
    num_tel: items.find(item => item.ID === itemid)?.num_tel??"",
    domain: items.find(item => item.ID === itemid)?.domain??""
  });

  useEffect(() => {
    if (items.find(item => item.ID === itemid)) {
      setFormData({
        nom: items.find(item => item.ID === itemid)?.nom??"",
        email: items.find(item => item.ID === itemid)?.email??"",
        num_tel: items.find(item => item.ID === itemid)?.num_tel??"",
        domain: items.find(item => item.ID === itemid)?.domain??""
      });
    }
  }, [items, itemid]);

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
        const submitData = {...formData,num_tel:Number(formData.num_tel),ID:Number(itemid)}
      setStatus(FETCH_STATUS.LOADING);      
      const response = await fetch(`${URLS.ServerIpAddress}/updateClient`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(submitData),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      toast.success("Customer updated successfully");
      setStatus(FETCH_STATUS.SUCCESS);
      resetForm();
      getClients();
      onClose();
    } catch (error: any) {
      console.error("Error updating customer:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      //alert(`Error updating customer: ${error.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      email: '',
      num_tel: 0,
      domain: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="update_car_modal_overlay">
      <div className="update_car_modal">
        <div className="update_car_modal_header">
          <h2>Vehicles</h2>
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
              <label htmlFor="nom">Name</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="John doe"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>
            
            <div className="update_car_modal_form_group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>
          </div>
          
          <div className="update_car_modal_form_row">
            <div className="update_car_modal_form_group">
              <label htmlFor="num_tel">Phone number</label>
              <input
                type="number"
                id="num_tel"
                name="num_tel"
                value={formData.num_tel || ''}
                onChange={handleChange}
                placeholder="phone number"
                min="1"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>
            
            <div className="update_car_modal_form_group">
              <label htmlFor="domain">Domain</label>
              <div className="update_car_modal_select_wrapper">
                <input
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                  disabled={status === FETCH_STATUS.LOADING}
                />
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
              Cancel
            </button>
            <button 
              type="submit" 
              id="update_car_submit"
              className="update_car_modal_submit"
              disabled={status === FETCH_STATUS.LOADING}
            >
              {status === FETCH_STATUS.LOADING ? 'updating...' : 'update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCustomerModal;