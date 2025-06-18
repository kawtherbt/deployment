import './TeamElement.css'
import addCircle from '../../assets/add_circle_24dp_blue.svg'
import dropDownarrow from '../../assets/arrow_drop_down_black.svg'
import { useState } from 'react';
import TeamStaff from '../team-staff/TeamStaff';

interface TeamElementItem{
  ID:number;
  nom:string;
  created_at : string;
  status : string;
}

interface TeamStaffitem{
  ID: number;
  nom: string;
  prenom: string;
  email: string;
  num_tel: number;
  team_id:number,
  status: string;
}

interface StaffInfo {
  ID: number;
  nom: string;
  prenom: string;
}

interface TeamInfo {
  ID: number;
  nom: string;
}

interface TeamElmentProps{
  item:TeamElementItem;
  isSelected:boolean;
  onSelect:(id:string,isSelected:boolean)=>void;
  staff:TeamStaffitem[],
  setIsAddStaffToTeamModalOpen: (isOpen: boolean) => void;
  setTeamId:(id:number)=>void;
  setStaffInfo:(staffInfo:StaffInfo)=>void;
  setTeamInfo:(teamInfo:TeamInfo)=>void;
  setIsRemoveStaffFromTeamModalOpen:(isOpen:boolean)=>void;
}

const TeamElement : React.FC<TeamElmentProps>=({item,isSelected,onSelect,staff,setIsAddStaffToTeamModalOpen,setTeamId,setStaffInfo,setTeamInfo,setIsRemoveStaffFromTeamModalOpen})=>{

  const [isOpen , setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const filteredStaff=staff.filter((staffitem)=>(staffitem.team_id===item.ID));
  
  const handleTeamInfo = ()=>{
    setTeamInfo({ID:item.ID,nom:item.nom});

  }

  return(<>
    <div className={`team_element ${isSelected ? 'team_element--selected' : ''}`}>
      <div className="team_element_checkbox_cell">
        <input 
          type="checkbox" 
          checked={isSelected} 
          onChange={(e) => onSelect(String(item.ID), e.target.checked)}
          className="team_element_checkbox"
          id={`team_element_checkbox_id`}
        />
      </div>
      <div className="team_element_name_cell">
        <div className="team_element_logo_name">  
            {/* add the logo here*/ }
          <span className="team_element_name">{item.nom}</span>
        </div>
      </div>
      <div className="team_element_members_cell">{filteredStaff.length}</div>
      <div className="team_element_creation_date_cell">
        <div className="team_element_creation_date_container">
          <span className="team_element_calendar_icon">📅</span>
          <span>{new Date(item.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</span>
        </div>
      </div>
      {/*<td className="team_element_status_cell">
        <span className={`team_element_status team_element_status--${item.status}`}>
          {item.status}
        </span>
      </td>*/}
      
      <div className="team_element_actions_cell">
        <button 
          className="team_element_more_actions" 
        >
          <img src={addCircle} alt="..." onClick={()=>{setTeamId(item.ID);setIsAddStaffToTeamModalOpen(true)}}/>
        </button>
        <button 
          className="team_element_more_actions" 
          onClick={()=>{toggleDropdown()}}
        >
          <img src={dropDownarrow} alt="..." className={`team_element_dropdown_button ${isOpen? '.team_element_dropdown_button--open':''}`} />
        </button>
      </div>
    </div>
    {isOpen && filteredStaff.length>0&&(
      <div className="team_element_staff_wrapper">
        <div className={`team_element_staff_container ${isOpen? 'team_element_staff_container--open':''}`}>
          {filteredStaff.map((staffItem)=>(
            <TeamStaff key={staffItem.ID} item={staffItem} isSelected={isSelected} setStaffInfo={setStaffInfo} setTeamInfo={handleTeamInfo} setIsRemoveStaffFromTeamModalOpen={setIsRemoveStaffFromTeamModalOpen}/>
          ))}
        </div>
      </div>
    )}
  </>)
}

export default TeamElement;