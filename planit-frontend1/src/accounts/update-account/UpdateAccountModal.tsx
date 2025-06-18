import React, { useEffect, useState } from 'react';
import './UpdateAccountModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { URLS } from '../../URLS';

interface accountItem{
    ID:number;
    nom:string;
    role:string;
    email:string;
    team:string;
    type:string;
    activation_date:string;
    deactivation_date:string;
}

interface UpdateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  getAccounts: () => void;
  account:accountItem;
}


const UpdateAccountModal: React.FC<UpdateAccountModalProps> = ({ isOpen, onClose, getAccounts, account }) => {
  const [formData, setFormData] = useState({
    nom: account.nom??"",
    role: account.role??"",
    email: account.email??"",
    password: '',
    type: account.type??"",
    activation_date: account.activation_date??"",
    deactivation_date: account.deactivation_date??"",
  });
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);

  useEffect(() => {
    if (account) {
      setFormData({
        nom: account.nom ?? "",
        role: account.role ?? "",
        email: account.email ?? "",
        password: '',
        type: account.type ?? "",
        activation_date: account.activation_date ?? "",
        deactivation_date: account.deactivation_date ?? ""
      });
    }
  }, [account]);

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
        const submitData = {...formData,ID:account.ID}
      setStatus(FETCH_STATUS.LOADING);      
      const response = await fetch(`${URLS.ServerIpAddress}/updateAccount`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(submitData),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      toast.success("account updated successfully");
      setStatus(FETCH_STATUS.SUCCESS);
      resetForm();
      getAccounts(); 
      onClose();
    } catch (error: any) {
      console.error("Error updating account:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(`Error updating account: ${error.message || 'Unknown error'}`);
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
    <div className="update_account_modal_overlay">
      <div className="update_account_modal">
        <div className="update_account_modal_header">
          <h2>Modifier le compte</h2>
          <button 
            className="update_account_modal_close" 
            onClick={()=>{resetForm();onClose()}}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="update_account_modal_form">
          <div className="update_account_modal_form_row">
            <div className="update_account_modal_form_group">
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
            
            <div className="update_account_modal_form_group">
              <label htmlFor="type">Type</label>
              <div className="update_account_modal_select_wrapper">
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
          
          <div className="update_account_modal_form_row">
            <div className="update_account_modal_form_group">
                <label htmlFor="role">Role</label>
                <div className="update_account_modal_select_wrapper">
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
            {formData.type === "temporaire" && <div className="update_account_modal_form_group">
              <label className="startTime">Start Time</label>
              <input
              type="date"
              name="activation_date"
              value={formData.activation_date}
              onChange={handleChange}
              required
              />
            </div>}
            
          </div>

          <div className="update_account_modal_form_row">
            <div className="update_account_modal_form_group">
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
            {formData.type === "temporaire" && <div className="update_account_modal_form_group">
              <label className="finishTime">Date de fin</label>
              <input
              type="date"
              name="deactivation_date"
              value={formData.deactivation_date}
              onChange={handleChange}
              required
              />
            </div>}
            
          </div>

          <div className="update_account_modal_form_row">
            <div className="update_account_modal_form_group">
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
            <div className="update_account_modal_form_group">
              <label htmlFor="entreprise">Entreprise</label>
              <div className="update_account_modal_select_wrapper">
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
          
          <div className="update_account_modal_actions">
            <button 
              type="button" 
              className="update_account_modal_cancel" 
              onClick={()=>{resetForm();onClose()}}
              disabled={status === FETCH_STATUS.LOADING}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="update_account_modal_submit"
              id='submit_account'
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

export default UpdateAccountModal;