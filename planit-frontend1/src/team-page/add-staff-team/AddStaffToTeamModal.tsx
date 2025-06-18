import React, { useEffect, useState } from 'react';
import './AddStaffToTeamModal.css';
import { X } from 'lucide-react';
import { FETCH_STATUS } from '../../fetchStatus';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';
  
interface Staff {
    ID: number;
    nom: string;
    prenom: string;
    email: string;
    num_tel: number;
    team_id:number,
    status: string;
}

interface AddStaffToTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  getStaff: () => void;
  teamId: number;
  staffList: Staff[];
}

interface selectedItems {
  [key: string]: boolean;
}


const AddStaffToTeamModal: React.FC<AddStaffToTeamModalProps> = ({ isOpen, onClose, getStaff, teamId, staffList }) => {
  const [formData, setFormData] = useState({
    staffIds: [],
    teamId: teamId??0,
  });
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);
  const [selectedItems, setSelectedItems] = useState<selectedItems>({});

  const handleSelectItem = (id: number, isSelected: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: isSelected,
    }));
  };

  useEffect(()=>{setFormData({...formData,teamId:teamId})},[teamId])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let selectedStaffIds: number[] = [];
    Object.keys(selectedItems).forEach((key) => {
      if (selectedItems[key]) {
        selectedStaffIds.push(parseInt(key));
      }
    });
    if(selectedStaffIds.length > 0){
        const submitData = {
            ...formData,
            staffIds: selectedStaffIds,
        }
        try {
        setStatus(FETCH_STATUS.LOADING);      
        const response = await fetch(`${URLS.ServerIpAddress}/addStaffToTeam`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(submitData),
            credentials: 'include',
        });
        
        const result = await response.json();
        if (!result.success) {
            throw { status: response.status, message: result.message };
        }
        
        toast.success("Staff added to team successfully");
        setStatus(FETCH_STATUS.SUCCESS);
        resetForm();
        getStaff();
        onClose();
        } catch (error: any) {
        console.error("Error adding staff to team:", error.message);
        setStatus(FETCH_STATUS.ERROR);
        toast.error(`Error adding staff to team: ${error.message || 'Unknown error'}`);
        }
    }else{
        toast.warning("no cars selected");
    }
  };

  const resetForm = () => {
    setFormData({
      staffIds: [],
      teamId: teamId??0,
    });
    setSelectedItems({});
  };

  if (!isOpen) return null;

  return (
    <div className="add_staff_to_team_modal_overlay">
      <div className="add_staff_to_team_modal">
        <div className="add_staff_to_team_modal_header">
          <h2>Staff</h2>
          <button 
            className="add_staff_to_team_modal_close" 
            onClick={()=>{resetForm();onClose()}}
            disabled={status === FETCH_STATUS.LOADING}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="add_staff_to_team_modal_form">
          
          <div className="add_staff_to_team_modal_form_staff_list">
            {staffList.map((staff) => (
              <div key={staff.ID} className="add_staff_to_team_modal_form_staff_list_item">
                <input 
                type="checkbox" 
                name="staffId" 
                value={staff.ID} 
                checked={selectedItems[staff.ID]}
                onChange={(e) => handleSelectItem(staff.ID, e.target.checked)}
                />
                <span>{staff.nom} {staff.prenom}</span>
              </div>
            ))}
          </div>
          <div className="add_staff_to_team_modal_actions">
            <button 
              type="button" 
              className="add_staff_to_team_modal_cancel" 
              onClick={()=>{resetForm();onClose()}}
              disabled={status === FETCH_STATUS.LOADING}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              id="add_staff_to_team_submit"
              className="add_staff_to_team_modal_submit"
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

export default AddStaffToTeamModal;