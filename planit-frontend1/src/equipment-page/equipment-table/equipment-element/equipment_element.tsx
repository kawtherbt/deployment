import './equipment_element.css'
import dropdown from '../../../assets/stat_minus_1_black.svg'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface EquipmentElementProps {
    id: number;
    name: string;
    categorie: string;
    type: string;
    quantite: number;
    disponibilite: number;
    details: string;
    category_id: number;
    sub_category_id: number;
    date_location: string;
    date_retour: string;
    prix: string;
    code_bar: string;
    agence_id: string;
    date_achat: string;
    ids: number[];
    onselect: (id: number, isSelected: boolean) => void;
    isSelected: boolean;
    setSelectedIds: (ids: number[]) => void;
    setEquipementSelected: (selected: {index:number,selected:boolean}) => void;
    equipementSelected: {index:number,selected:boolean};
    index: number | string;
    isSubCategory?: boolean; 
}

function Equipment_element(props: EquipmentElementProps){
    const navigate = useNavigate();
    
    const clicked = false;
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

    const handleEquipmentClick = (e: React.MouseEvent) => {
        if (!props.isSubCategory) {
            e.stopPropagation(); 
            if (props.equipementSelected.index !== props.index) {
                props.setSelectedIds(props.ids);
                props.setEquipementSelected({index: props.index as number, selected: !props.equipementSelected.selected});
            } else {
                props.setEquipementSelected({index: -1, selected: false});
            }
        }
    };

    return(
        <div 
            className={`equipement_containing_div ${props.equipementSelected.index === props.index ? 'selected' : ''} ${props.isSubCategory ? 'subcategory' : ''}`} 
            onClick={handleEquipmentClick}
            style={{ cursor: props.isSubCategory ? 'pointer' : 'default' }}
        >
            
            <div className='equipement_containing_subdiv checkbox'>
                <input 
                    type="checkbox" 
                    name='equipment_checkbox' 
                    id='equipment_checkbox'
                    checked={props.isSelected}
                    onChange={(e) => {
                        e.stopPropagation();
                        props.onselect(props.id, e.target.checked);
                    }}
                    hidden={true}
                />
            </div>

            <div className='equipement_containing_subdiv'>
                <h3>{props.name ?? "-"}</h3>
            </div>

            <div className='equipement_containing_subdiv'>
                <h3>{props.categorie ?? "-"}</h3>
            </div>

            <div className='equipement_containing_subdiv'>
                <h3>{props.type ?? "-"}</h3>
            </div>

            <div className='equipement_containing_subdiv'>
                <h3>{props.quantite ?? "-"}</h3>
            </div>

            <div className='equipement_containing_subdiv'>
                <h3>{props.details ?? "-"}</h3>
            </div>

            <div className='equipement_containing_subdiv'>
                <h3 data-status={props.disponibilite > 0 ? "disponible" : "non disponible"}>
                    {props.disponibilite > 0 ? `${String(props.disponibilite)} disponible` : `0 disponible`}
                </h3>
            </div>

            <div className='equipement_containing_subdiv'>
                <h3>{props.agence_id ?? "-"}</h3>
            </div>

            <div className={`equipement_containing_dropdownarrow_subdiv`} ref={dropdownRef}>
                {!props.isSubCategory && <button 
                    className="equipement_element_more_actions" 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        setDropdownOpen((prev) => (!prev));
                    }}
                >
                    <img className={`dropdownarrow ${clicked ? 'extended' : ''}`} src={dropdown} alt="problem" />
                </button>}

                {props.isSubCategory && <button className="equipement_element_more_actions" disabled={true} style={{width: '32px',height: '36px'}} ></button>}

                {dropdownOpen && (
                    <div className="equipement_element_dropdown_menu">
                        <button 
                            className="dropdown_item" 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/UpdateEquipment`, {
                                    state: {
                                        ids: props.ids,
                                        item: {
                                            nom: props.name,
                                            categorie: props.categorie,
                                            type: props.type,
                                            quantite: props.quantite,
                                            disponibilite: props.disponibilite,
                                            details: props.details,
                                            category_id: props.category_id,
                                            sub_category_id: props.sub_category_id,
                                            date_location: props.date_location,
                                            date_retour: props.date_retour,
                                            prix: props.prix,
                                            code_bar: props.code_bar,
                                            date_achat: props.date_achat
                                        }
                                    }
                                });
                            }}
                        >
                            Edit
                        </button>
                        <button 
                            className="dropdown_item" 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/AddEquipment`, {
                                    state: {
                                        item: {
                                            nom: props.name,
                                            categorie: props.categorie,
                                            type: props.type,
                                            quantite: props.quantite,
                                            disponibilite: props.disponibilite,
                                            details: props.details,
                                            category_id: props.category_id,
                                            sub_category_id: props.sub_category_id,
                                        }
                                    }
                                });
                            }}
                        >
                            Clone
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Equipment_element;