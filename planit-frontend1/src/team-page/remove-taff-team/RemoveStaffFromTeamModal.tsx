import React, { useEffect, useState } from 'react';
import './RemoveStaffFromTeamModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';

interface StaffInfo {
  ID: number;
  nom: string;
  prenom: string;
}

interface TeamInfo {
  ID: number;
  nom: string;
}

interface RemoveStaffFromTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  getStaff: () => void;
  staffInfo: StaffInfo;
  teamInfo: TeamInfo;
}

const RemoveStaffFromTeamModal: React.FC<RemoveStaffFromTeamModalProps> = ({ isOpen, onClose, getStaff, staffInfo, teamInfo }) => {
  const [formData, setFormData] = useState({
    staffId: staffInfo.ID??0,
    teamId: 0,
  });
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const submitData = {
            staffIds: [formData.staffId],
            teamId: formData.teamId,
        }
      setStatus(FETCH_STATUS.LOADING);      
      const response = await fetch(`${URLS.ServerIpAddress}/api/addStaffToTeam`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(submitData),
        credentials: 'include',
      });
      
      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      
      console.log("Staff removed successfully");
      setStatus(FETCH_STATUS.SUCCESS);
      resetForm();
      getStaff();
      onClose();
    } catch (error: any) {
      console.error("Error removing staff:", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error(`Error removing staff: ${error.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
        staffId: 0,
        teamId: 0
    });
  };

  useEffect(()=>{},[]);

  if (!isOpen) return null;

  return (
    <div className="remove_staff_from_team_modal_overlay">
      <div className="remove_staff_from_team_modal">
        <div className="remove_staff_from_team_modal_header">
          <h2>{`Remove ${staffInfo.nom} ${staffInfo.prenom} from ${teamInfo.nom}`}</h2>
          <button 
            className="remove_staff_from_team_modal_close" 
            onClick={()=>{resetForm();onClose()}}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="remove_staff_from_team_modal_form">
          
          <div className="remove_staff_from_team_modal_actions">
            <button 
              type="button" 
              className="remove_staff_from_team_modal_cancel" 
              onClick={()=>{resetForm();onClose()}}
              disabled={status === FETCH_STATUS.LOADING}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              id="remove_staff_from_team_modal_submit"
              className="remove_staff_from_team_modal_submit"
              disabled={status === FETCH_STATUS.LOADING}
            >
              {status === FETCH_STATUS.LOADING ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemoveStaffFromTeamModal;