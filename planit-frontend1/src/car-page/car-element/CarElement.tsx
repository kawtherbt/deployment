
import { useEffect, useRef, useState } from "react";
import morePoints from "../../assets/more_horiz_black.svg"
import './CarElement.css'

interface CarElement{
    ID:number;
    nom:string;
    matricule:string;
    nbr_place:number;
    categorie:string;
}

interface CarElementProps{
    item:CarElement;
    isSelected:boolean;
    onselect:(id:number,isSelected:boolean)=>void;
    setUpdate:(item:CarElement)=>void;
    setIsUpdateModalOpen:(isOpen:boolean)=>void;
}

const CarElement:React.FC<CarElementProps> = ({item,isSelected,onselect,setUpdate,setIsUpdateModalOpen})=>{

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
        <tr className={`car_element ${isSelected ? 'car_element--selected':""}`}>
            <td className='car_element_checkbox_cell'>
                <input 
                type="checkbox"
                checked={isSelected}
                onChange={(e)=>{onselect(item.ID,e.target.checked)}}
                />
            </td>
            <td className='car_element_name_cell'>
                <span className='car_elment_name'>{item.nom}</span>
            </td>
            <td className='car_element_matricule_cell'>
                <span className='car_element_matricule'>{item.matricule}</span>
            </td>
            <td className='car_element_category_cell'>
                <span className='car_element_category'>{item.categorie}</span>
            </td>
            <td className='car_element_nbr_place_cell'>
                <span className='car_element_nbr_place'>{item.nbr_place}</span>
            </td>
            <td className="car_element_actions_cell">
                <div className="car_element_more_actions_container" ref={dropdownRef}>
                    <button 
                    className="car_element_more_actions" 
                    onClick={()=>{setDropdownOpen((prev)=>(!prev))}}
                    >
                    <img src={morePoints} alt="..." />
                    </button >
                    {dropdownOpen && (
                        <div className="car_element_dropdown_menu">
                            <button className="dropdown_item" onClick={()=>{setUpdate(item);setIsUpdateModalOpen(true)}}>Edit</button>
                        </div>
                    )}
                </div>

            </td>
        </tr>
    )
}

export default CarElement;