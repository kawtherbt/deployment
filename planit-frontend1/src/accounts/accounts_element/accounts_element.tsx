import './accounts_element.css';
import morePoints from "../../assets/more_horiz_black.svg"
import {useState , useRef, useEffect } from 'react';

interface accountItem{
    ID:number;
    nom:string;
    role:string;
    email:string;
    team:string;
    type:string;
    activation_date:string;
    deactivation_date:string;   
    status:string;
}

interface accountElementProps{
    item:accountItem;
    isSelected:boolean;
    onSelect:(id:string,isSelected:boolean)=>void;
    setUpdate:(item:accountItem)=>void;
    setIsUpdateModalOpen:(val:boolean)=>void;
}

const Accounts_element: React.FC<accountElementProps> = ({item,isSelected,onSelect,setUpdate,setIsUpdateModalOpen})=>{
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
        <tr className={`accounts_element ${isSelected? 'accounts_element--selected':''}`}>
            
            <td className="accounts_element_checkbox_cell">
                <input 
                type="checkbox" 
                checked={isSelected} 
                onChange={(e) => onSelect(String(item.ID), e.target.checked)}
                className="history_event_checkbox"
                />
            </td>

            <td className='accounts_element_name_cell'>
                <span className='accounts_element_name'>{item.nom??"-"}</span>
            </td>

            <td className='accounts_element_role_cell'>
                <span className='accounts_element_role'>{item.role??"-"}</span>
            </td>

            <td className='accounts_element_email_cell'>
                <span className='accounts_element_email'>{item.email??"-"}</span>
            </td>

            <td className='accounts_element_team_cell'>
                <span className='accounts_element_team'>{item.team??"-"}</span>
            </td>

            <td className='accounts_element_type_cell'>
                <span className='accounts_element_type'>{item.type??"-"}</span>
            </td>

            <td className='accounts_element_status_cell'>
                <span className='accounts_element_status'>{item.status??"-"}</span>
            </td>

            <td className="accounts_element_actions_cell">
                <div className='accounts_element_more_actions_container' ref={dropdownRef}>
                    <button 
                    className="accounts_element_more_actions"
                    onClick={()=>{setDropdownOpen((prev)=>(!prev))}} 
                    >
                    <img src={morePoints} alt="..." />
                    </button>
                    {dropdownOpen && (
                        <div className="accounts_element_dropdown_menu">
                        <button className="dropdown_item" onClick={()=>{setUpdate(item);setIsUpdateModalOpen(true)}}>Modifier</button>
                        <button className="dropdown_item">Activer</button>
                        <button className="dropdown_item">Désactiver</button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    )
}

export default Accounts_element;
