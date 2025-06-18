import moreHorizontalIcon from '../../assets/more_horiz_black.svg';
import { URLS } from '../../URLS';
import './StaffElement.css';

import {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function StaffElement(props:any){
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

    const deleteStaff = async ()=>{
        try {
          
            const reponse = await fetch(`${API}/api/deleteStaff`,{
                method:"DELETE",
                headers:{'Content-Type':'application/json'},
                credentials:'include',
                body:JSON.stringify({"ID":props.id}),
            });
    
            const result = await reponse.json();
            if(!result.success){
                throw({status: reponse.status,message:result.message});
            }
            
            setDeleted(true);
        
        }catch (error:any) {
          console.error("error while getting upcoming events",error.message);
          toast.error(error.message);
        }
      }

    
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [deleted,setDeleted] = useState(false);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOptionsVisible(false);
        }
      }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return(
        <div className={`accounts_element_container ${deleted ? "deleted":""}`} onClick={()=>{if(props.selectedStaffId !== props.id){props.setSelectedStaffId(props.id)}else{props.setSelectedStaffId(0)}}}>
            
            {<div className='accounts_containing_subdiv checkbox'>
                <input type="checkbox" name='equipment_checkbox' id='equipment_checkbox'/>
            </div>}

            <div className='accounts_containing_subdiv'>
                <h3>{props.name?`${props.name} ${props.surname?props.surname:""}`:"-"}</h3>
            </div>

            <div className='accounts_containing_subdiv'>
                <h3>{props.departement??"Département"}</h3>
            </div>

            <div className='accounts_containing_subdiv'>
                <h3>{props.tel??"Numéro de téléphone"}</h3>
            </div>

            <div className='accounts_containing_subdiv'>
                <h3>{props.email??"Email"}</h3>
            </div>

            <div className='accounts_containing_subdiv'>
                <h3 id='accounts_type'>{props.team??"-"}</h3>
            </div>

            <div className='accounts_containing_subdiv'>
                <img src={moreHorizontalIcon} alt="" onClick={() => setIsOptionsVisible((prev)=>(!prev))}/>
            </div>
            {isOptionsVisible && <div className='StaffElement_options_div' ref={dropdownRef}>
                <h3 onClick={() => {navigate('/UpdateStaff',{state:{ID:props.id,nom:props.name,prenom:props.surname,num_tel:props.tel,email:props.email,team:props.team}})}}>Modifier</h3>
                <h3 onClick={()=>{deleteStaff()}}>Supprimer</h3>
            </div>}
        </div>
    );
}

export default StaffElement;