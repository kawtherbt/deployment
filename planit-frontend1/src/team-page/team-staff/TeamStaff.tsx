import React, { useEffect, useRef, useState } from 'react';
import './TeamStaff.css'
import morePoints from '../../assets/more_horiz_black.svg'


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

interface TeamStaffProps{
    item:TeamStaffitem;
    isSelected:boolean;
    setStaffInfo:(staffInfo:StaffInfo)=>void;
    setTeamInfo:()=>void;
    setIsRemoveStaffFromTeamModalOpen:(isOpen:boolean)=>void;
}


const TeamStaff: React.FC<TeamStaffProps> = ({item,isSelected,setStaffInfo,setTeamInfo,setIsRemoveStaffFromTeamModalOpen})=>{

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setDropdownOpen(false);
        }
      }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
      
    return(
        <div className={`team_staff ${isSelected ? 'team_staff--selected' : ''}`}>
            <div className="team_staff_name_cell">
                <div className="team_staff_logo_name">  
                    <span className="team_staff_name">{item.nom} {item.prenom}</span>
                </div>
            </div>
            <div className="team_staff_phone_cell">{item.num_tel}</div>
            <div className="team_staff_email_cell">{item.email}</div>
            {/*<td className="team_staff_status_cell">
                <span className={`team_staff_status team_staff_status--${item.status}`}>
                    {item.status}
                </span>
            </td>*/}

            <div className="team_staff_actions_cell" ref={dropdownRef}>
                <button 
                    className="team_staff_more_actions" 
                >
                    <img src={morePoints} alt="..." onClick={()=>{setDropdownOpen((prev)=>(!prev))}}/>
                </button>
                {dropdownOpen && (
                        <div className="team_staff_dropdown_menu">
                            <button className="dropdown_item" onClick={()=>{setStaffInfo({ID:item.ID,nom:item.nom,prenom:item.prenom});setTeamInfo();setIsRemoveStaffFromTeamModalOpen(true)}}>remove</button>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default TeamStaff