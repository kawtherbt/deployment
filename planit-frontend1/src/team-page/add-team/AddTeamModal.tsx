import React, { useState } from 'react';
import './AddTeamModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  getTeams: () => void;
}

interface Team {
    nom:string;
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({ isOpen, onClose, getTeams }) => {
  const [formData, setFormData] = useState<Team>({
    nom:"",
  });
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'members' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setStatus(FETCH_STATUS.LOADING);      
      const response = await fetch(`${URLS.ServerIpAddress}/api/addTeam`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      toast.success("Team created successfully");
      setStatus(FETCH_STATUS.SUCCESS);
      resetForm();
      getTeams();
      onClose();
    } catch (error: any) {
      console.error("Error creating team:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(`Error creating team: ${error.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
        nom:"",

    });
  };

  if (!isOpen) return null;

  return (
    <div className="add_team_modal_overlay">
      <div className="add_team_modal">
        <div className="add_team_modal_header">
          <h2>Equipe</h2>
          <button 
            className="add_team_modal_close" 
            onClick={()=>{resetForm();onClose()}}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="add_team_modal_form">
          <div className="add_team_modal_form_row">
            <div className="add_team_modal_form_group">
              <label htmlFor="nom">Name</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Team x"
                required
                disabled={status === FETCH_STATUS.LOADING}
              />
            </div>
          </div>
          
          <div className="add_team_modal_actions">
            <button 
              type="button" 
              className="add_team_modal_cancel" 
              onClick={()=>{resetForm();onClose()}}
              disabled={status === FETCH_STATUS.LOADING}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              id="add_team_submit"
              className="add_team_modal_submit"
              disabled={status === FETCH_STATUS.LOADING}
            >
              {status === FETCH_STATUS.LOADING ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamModal;