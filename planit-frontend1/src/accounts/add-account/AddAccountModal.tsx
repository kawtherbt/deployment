import React, { useState } from 'react';
import './AddAccountsModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { URLS } from '../../URLS';


interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  getAccounts: () => void;
}


const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, getAccounts }) => {
  const [formData, setFormData] = useState({
    nom: '',
    role: '',
    email: '',
    password: '',
    type: 'permanent',
    activation_date: '',
    deactivation_date: ''
  });
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);

  const Role = Cookies.get("role")??"";
 

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
      setStatus(FETCH_STATUS.LOADING);      
      const response = await fetch(`${URLS.ServerIpAddress}/signUp`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      toast.success("account created successfully");
      setStatus(FETCH_STATUS.SUCCESS);
      resetForm();
      getAccounts(); 
      onClose();
    } catch (error: any) {
      console.error("Error creating account:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(`Error creating account: ${error.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
        nom: '',
        role: '',
        email: '',
        password: '',
        type: 'permanent',
        activation_date: '',
        deactivation_date: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="add_account_modal_overlay">
      <div className="add_account_modal">
        <div className="add_account_modal_header">
          <h2>Compte</h2>
          <button 
            className="add_account_modal_close" 
            onClick={()=>{resetForm();onClose()}}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="add_account_modal_form">
          <div className="add_account_modal_form_row">
            <div className="add_account_modal_form_group">
              <label htmlFor="nom">Nom</label>
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
            
            <div className="add_account_modal_form_group">
              <label htmlFor="type">Type</label>
              <div className="add_account_modal_select_wrapper">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  disabled={status === FETCH_STATUS.LOADING}
                >
                  <option value="permanent">Permanent</option>
                  <option value="temporaire">Temporaire</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="add_account_modal_form_row">
            <div className="add_account_modal_form_group">
                <label htmlFor="role">Role</label>
                <div className="add_account_modal_select_wrapper">
                    <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    disabled={status === FETCH_STATUS.LOADING}
                    >
                    <option value="user">user</option>
                    <option value="superUser">super user</option>
                    {["admin","super_admin"].includes(Role) &&<option value="admin">admin</option>}
                    </select>
                </div>
            </div>
            {formData.type === "temporaire" && <div className="add_account_modal_form_group">
              <label className="startTime">Start Time</label>
              <input
              type="dateTime-local"
              name="activation_date"
              value={formData.activation_date}
              onChange={handleChange}
              required
              />
            </div>}
            
          </div>

          <div className="add_account_modal_form_row">
            <div className="add_account_modal_form_group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Johndoe@gmail.com"
                  required
                  disabled={status === FETCH_STATUS.LOADING}
                />
              </div>
            {formData.type === "temporaire" && <div className="add_account_modal_form_group">
              <label className="finishTime">Date de fin</label>
              <input
              type="dateTime-local"
              name="deactivation_date"
              value={formData.deactivation_date}
              onChange={handleChange}
              required
              />
            </div>}
            
          </div>

          <div className="add_account_modal_form_row">
            <div className="add_account_modal_form_group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>
            {Role === "super_admin" && 
            <div className="add_account_modal_form_group">
              <label htmlFor="entreprise">Entreprise</label>
              <div className="add_account_modal_select_wrapper">
                  <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={status === FETCH_STATUS.LOADING}
                  >

                  </select>
              </div>
            </div>
            }
            
          </div>
          
          <div className="add_account_modal_actions">
            <button 
              type="button" 
              className="add_account_modal_cancel" 
              onClick={()=>{resetForm();onClose()}}
              disabled={status === FETCH_STATUS.LOADING}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="add_account_modal_submit"
              id='submit_account'
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

export default AddAccountModal;