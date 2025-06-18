import { Search, Plus } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Equipment_element from './equipment-element/equipment_element';
import dropdown from '../../assets/arrow_drop_down_black.svg';
import deleteIcon from '../../assets/delete_black.svg' ;
import filterIcon from '../../assets/filter_black.svg'
import './equipment_table.css'
import { FETCH_STATUS } from '../../fetchStatus';
import Loading from '../../loading/loading';
import DeleteEquipmentModal from '../delete-equipment/DeleteEquipmentModal';

import arrow_back from '../../assets/arrow_back_black.svg';
import arrow_forward from '../../assets/arrow_forward_black.svg';
import printImg from '../../assets/cloud_download_black.svg';
import { toast, ToastContainer } from 'react-toastify';
import { URLS } from '../../URLS';

interface Equipment{
    ID:number;
    nom:string;
    sub_category_id:number;
    category_id:number;
    type:string;
    details:string;
    category_name:string;
    sub_category_name:string;
    disponible:boolean;   
    date_location: string; 
    date_retour: string; 
    prix: string; 
    code_bar: string; 
    agence_id: string; 
    date_achat: string; 
}
interface compressedEquipment extends Equipment{
    quantite:number;
    ids:number[];
    disponibilite:number;
}
interface selectedItems {
    [key: string]: boolean;
  }

interface SubCategory{
    ID:number;
    nom:string;
    category_id:number;
    category_name:string;
    quantite:number;
    disponibilite:number;
    isSubCategory:boolean;
    sub_category_id:number;
}

function Equipment_table(props:any){
    const navigate = useNavigate();

    const getAllEquipment = async()=>{
        try {
            const current_time = new Date().toLocaleString("en-CA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).replace(",", "");
            //const SubmitData = {timestamp:String(current_time)}
            //console.log(JSON.stringify(SubmitData));
            setStatus(FETCH_STATUS.LOADING);
            const reponse = await fetch(`${URLS.ServerIpAddress}/api/getAllEquipment/${current_time}`,{
                method:"GET",
                headers:{'Content-Type':'application/json'},
                credentials:'include',
            });
    
            const result = await reponse.json();
            if(!result.success){
                throw({status: reponse.status,message:result.message});
            }
            //console.log(result.data); //somehow fixes the graph taking the hole page problem
            setEquipments(result.data);
            setStatus(FETCH_STATUS.SUCCESS);
        } catch (error:any) {
            console.error("error while getting equipments",error.message);
            toast.error("failed to get equipments");
            setStatus(FETCH_STATUS.ERROR)
        }
    }


    

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [equipments,setEquipments] = useState<Equipment[]>([]);
    const [compressedEquipments,setCompressedEquipments] = useState<compressedEquipment[]>([]);
    const [subCategories,setSubCategories] = useState<SubCategory[]>([]);
    const [restOfEquipment,setRestOfEquipment] = useState<Equipment[]>([]);
    const [selectedIds,setSelectedIds] = useState<number[]>([]);
    const [equipementSelected,setEquipementSelected] = useState<{index:number,selected:boolean}>({index:-1,selected:false});
    const [selectedItems, setSelectedItems] = useState<selectedItems>({});
    const [status,setStatus] = useState(FETCH_STATUS.IDLE);
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 7;

    const IndexOfLastItem = itemPerPage * currentPage;
    const IndexOfFirstItem = IndexOfLastItem - itemPerPage;

    const filteredEquipment = compressedEquipments.filter((item:any)=>{
        return (item.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const shownEquipment = [...subCategories,...restOfEquipment].slice(IndexOfFirstItem, IndexOfLastItem);
    //console.log("shownEquipment : ",JSON.stringify(shownEquipment, null, 2));
    const allSelected = shownEquipment.length > 0 && shownEquipment.every((item:any) => selectedItems[item.ID]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isSelected = e.target.checked;
        const tempSelectedItems: selectedItems = {};
    
        shownEquipment.forEach((item:any) => {
          tempSelectedItems[item.ID] = isSelected;
        });
        setSelectedItems(tempSelectedItems);
      };
    
      const handleSelectItem = (id: number, isSelected: boolean) => {
        setSelectedItems((prev) => ({
          ...prev,
          [id]: isSelected,
        }));
      };

    useEffect(()=>{getAllEquipment()},[]);

    const handleSubCategory = ()=>{
        const tempSubCategories:SubCategory[] = [];
        const tempRestOfEquipment:Equipment[] = [];
        filteredEquipment.forEach((item:any)=>{
            if(item.sub_category_id){
                const existingSubCategor = tempSubCategories.find(subCategor => subCategor.ID === item.sub_category_id);
                if(!existingSubCategor){
                    tempSubCategories.push({ID:item.sub_category_id,nom:item.sub_category_name,category_id:item.category_id,category_name:item.category_name,quantite:item.quantite,disponibilite:item.disponibilite,isSubCategory:true,sub_category_id:item.sub_category_id});
                }else{
                    existingSubCategor.quantite += item.quantite;
                    existingSubCategor.disponibilite += item.disponibilite;
                }
            }else{
                tempRestOfEquipment.push(item);
            }
        });
        setSubCategories(tempSubCategories);
        setRestOfEquipment(tempRestOfEquipment);
        //console.log("rest of equipment : ",JSON.stringify(tempRestOfEquipment, null, 2));
        //console.log("sub categories : ",JSON.stringify(tempSubCategories, null, 2));
    }

    useEffect(()=>{handleSubCategory()},[searchTerm,compressedEquipments]);

    const handleCompressedEquipment = ()=>{
        const tempCompressedEquipments:compressedEquipment[] = [];
        let disponibilite = 0;
        equipments.forEach((item:Equipment)=>{
            const tempCompressedEquipment = tempCompressedEquipments.find((compressedItem:compressedEquipment)=>compressedItem.nom === item.nom&&compressedItem.details === item.details);
            if(item.disponible){
                disponibilite=1;
            }else{
                disponibilite=0;
            }
            if(tempCompressedEquipment){
                tempCompressedEquipment.quantite++;
                tempCompressedEquipment.ids.push(item.ID);
                tempCompressedEquipment.disponibilite = tempCompressedEquipment.disponibilite+disponibilite;
            }else{
                tempCompressedEquipments.push({...item,quantite:1,ids:[item.ID],disponibilite:disponibilite});
            }
        });
        
        setCompressedEquipments(tempCompressedEquipments);
    }

    useEffect(()=>{handleCompressedEquipment()},[equipments]);

    const [isDeleteEquipmentModalOpen, setIsDeleteEquipmentModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        type: '',
        availability: ''
    });
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
    const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
    const [isAvailabilityFilterOpen, setIsAvailabilityFilterOpen] = useState(false);
    const filterDropdownRef = useRef<HTMLDivElement | null>(null);

    // Get unique categories and types for filter options
    const categories = Array.from(new Set(equipments.map(eq => eq.category_name)));
    const types = Array.from(new Set(equipments.map(eq => eq.type)));

    // Apply filters to equipment
    const applyFilters = (equipment: any) => {
        if (filters.category && equipment.category_name !== filters.category) return false;
        if (filters.type && equipment.type !== filters.type) return false;
        if (filters.availability === 'available' && equipment.disponibilite <= 0) return false;
        if (filters.availability === 'unavailable' && equipment.disponibilite > 0) return false;
        return true;
    };

    // Update filtered equipment when filters change
    useEffect(() => {
        const filtered = compressedEquipments.filter(applyFilters);
        setCompressedEquipments(filtered);
    }, [filters]);

    // Reset filters
    const resetFilters = () => {
        setFilters({
            category: '',
            type: '',
            availability: ''
        });
        getAllEquipment();
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
                setIsFilterDropdownOpen(false);
            }
        }
        if (isFilterDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isFilterDropdownOpen]);

    const [selectedSubCategory,setSelectedSubCategory] = useState<number>(-1);
    /*console.log("shownEquipment: ",JSON.stringify(shownEquipment, null, 2));
    console.log("compressedEquipments: ",JSON.stringify(compressedEquipments, null, 2));
    console.log("subCategories: ",JSON.stringify(subCategories, null, 2));*/
    console.log("selectedSubCategory: ",selectedSubCategory);

    return(
        <div className='equipment_table_containing_div'>
            
            <div className='equipement_table_header_div'>

                <div className='equipment_table_header_subdiv'>
                    <h3>Équipements</h3>

                    <div className='equipment_page_container_search'>
                        <Search className='equipment_page_search_icon' size={20} />
                        <input
                        type="text"
                        placeholder='Rechercher'
                        className='equipment_page_container_search_input'
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value) }}
                        />
                    </div>

                    <div className='quiment_table_header_subdiv_buttons' style={{position: 'relative'}}>
                        <button 
                            id='quiment_table_header_subdiv_add_button' 
                            onClick={() => navigate('/AddEquipment')}
                            style={{ marginRight: '8px' }}
                        >
                            <Plus size={16} style={{ marginRight: '4px' }} />
                            Ajouter
                        </button>
                        <button id='quiment_table_header_subdiv_delete_button' onClick={() =>{if(selectedIds.length > 0){setIsDeleteEquipmentModalOpen(true)}else{toast.error("Veuillez sélectionner au moins un équipement")}}}><img src={deleteIcon}/>supprimer</button>
                        <button id='quiment_table_header_subdiv_filter_button' onClick={() => setIsFilterDropdownOpen((prev) => !prev)}>
                            <img src={filterIcon}/>
                            Filtrer
                            {(filters.category || filters.type || filters.availability) && (
                                <span className="filter-indicator"></span>
                            )}
                        </button>
                        {isFilterDropdownOpen && (
                            <div ref={filterDropdownRef} className="equipment_table_filter_dropdown">
                                <div 
                                    className="dropdown_item filter-section" 
                                    onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
                                >
                                    Catégorie
                                    {filters.category && <span className="selected-filter">{filters.category}</span>}
                                </div>
                                {isCategoryFilterOpen && (
                                    <div className="filter-options">
                                        <div 
                                            className={`filter-option ${filters.category === '' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setFilters(prev => ({...prev, category: ''}));
                                                setIsCategoryFilterOpen(false);
                                            }}
                                        >
                                            Tous
                                        </div>
                                        {categories.map((category, index) => (
                                            <div 
                                                key={index}
                                                className={`filter-option ${filters.category === category ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setFilters(prev => ({...prev, category}));
                                                    setIsCategoryFilterOpen(false);
                                                }}
                                            >
                                                {category}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div 
                                    className="dropdown_item filter-section"
                                    onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                                >
                                    Type
                                    {filters.type && <span className="selected-filter">{filters.type}</span>}
                                </div>
                                {isTypeFilterOpen && (
                                    <div className="filter-options">
                                        <div 
                                            className={`filter-option ${filters.type === '' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setFilters(prev => ({...prev, type: ''}));
                                                setIsTypeFilterOpen(false);
                                            }}
                                        >
                                            Tous
                                        </div>
                                        {types.map((type, index) => (
                                            <div 
                                                key={index}
                                                className={`filter-option ${filters.type === type ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setFilters(prev => ({...prev, type}));
                                                    setIsTypeFilterOpen(false);
                                                }}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div 
                                    className="dropdown_item filter-section"
                                    onClick={() => setIsAvailabilityFilterOpen(!isAvailabilityFilterOpen)}
                                >
                                    Disponibilité
                                    {filters.availability && (
                                        <span className="selected-filter">
                                            {filters.availability === 'available' ? 'Disponible' : 'Non disponible'}
                                        </span>
                                    )}
                                </div>
                                {isAvailabilityFilterOpen && (
                                    <div className="filter-options">
                                        <div 
                                            className={`filter-option ${filters.availability === '' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setFilters(prev => ({...prev, availability: ''}));
                                                setIsAvailabilityFilterOpen(false);
                                            }}
                                        >
                                            Tous
                                        </div>
                                        <div 
                                            className={`filter-option ${filters.availability === 'available' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setFilters(prev => ({...prev, availability: 'available'}));
                                                setIsAvailabilityFilterOpen(false);
                                            }}
                                        >
                                            Disponible
                                        </div>
                                        <div 
                                            className={`filter-option ${filters.availability === 'unavailable' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setFilters(prev => ({...prev, availability: 'unavailable'}));
                                                setIsAvailabilityFilterOpen(false);
                                            }}
                                        >
                                            Non disponible
                                        </div>
                                    </div>
                                )}

                                {(filters.category || filters.type || filters.availability) && (
                                    <div className="filter-actions">
                                        <button 
                                            className="reset-filters"
                                            onClick={resetFilters}
                                        >
                                            Réinitialiser les filtres
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className='equipment_table_header_names_subdiv'>
                    <div className='equipment_table_header_names_subdiv_subdiv checkbox'>
                        <input 
                        type="checkbox"
                         name='equipment_checkbox'
                          id='equipment_checkbox'
                          checked={allSelected}
                          onChange={handleSelectAll}
                          hidden={true}
                          />
                    </div>

                    <div className='equipment_table_header_names_subdiv_subdiv'>
                       <h3>equipment</h3> 
                       <img src={dropdown} alt="" />
                    </div>

                    <div className='equipment_table_header_names_subdiv_subdiv'>
                       <h3>Categorie</h3> 
                       <img src={dropdown} alt="" />
                    </div>

                    <div className='equipment_table_header_names_subdiv_subdiv'>
                       <h3>type</h3> 
                       <img src={dropdown} alt="" />
                    </div>

                    <div className='equipment_table_header_names_subdiv_subdiv'>
                       <h3>Quantite</h3> 
                       <img src={dropdown} alt="" />
                    </div>

                    <div className='equipment_table_header_names_subdiv_subdiv'>
                       <h3>Details</h3> 
                       <img src={dropdown} alt="" />
                    </div>

                    <div className='equipment_table_header_names_subdiv_subdiv'>
                       <h3>Disponibilite</h3>
                       <img src={dropdown} alt="" /> 
                    </div>

                    <div className='equipment_table_header_names_subdiv_subdiv'>
                       <h3>Agence</h3>
                       <img src={dropdown} alt="" /> 
                    </div>

                </div>

            </div>

            {/*<div className='equipment_table_elements_div'>
                {status === FETCH_STATUS.LOADING?<Loading/>
                :shownEquipment.map((item:any,index:number)=>{
                    return(<div key={index} onClick={()=>{if(selectedSubCategory !== index){setSelectedSubCategory(index)}else{setSelectedSubCategory(-1)}}}>
                    <Equipment_element key={index} index={index} id={item.ID} name={item.nom} categorie={item.category_name} type={item.type} quantite={item.quantite} disponibilite={item.disponibilite} details={item.details} ids={item.ids} category_id={item.category_id} sub_category_id={item.sub_category_id} date_location={item.date_location} date_retour={item.date_retour} prix={item.prix} code_bar={item.code_bar} fournisseur={item.fournisseur} date_achat={item.date_achat} onselect={handleSelectItem} isSelected={selectedItems[item.ID]} setSelectedIds={setSelectedIds} setEquipementSelected={setEquipementSelected} equipementSelected={equipementSelected}/>
                    {((selectedSubCategory === index) && (item.isSubCategory)) && (
                        compressedEquipments.map((compresseditem:any,compressedindex:number)=>{
                            if(compresseditem.sub_category_id === item.sub_category_id){
                                return(<Equipment_element key={compressedindex} index={compressedindex} id={compresseditem.ID} name={compresseditem.nom} categorie={compresseditem.category_name} type={compresseditem.type} quantite={compresseditem.quantite} disponibilite={compresseditem.disponibilite} details={compresseditem.details} ids={compresseditem.ids} category_id={compresseditem.category_id} sub_category_id={compresseditem.sub_category_id} date_location={compresseditem.date_location} date_retour={compresseditem.date_retour} prix={compresseditem.prix} code_bar={compresseditem.code_bar} fournisseur={compresseditem.fournisseur} date_achat={compresseditem.date_achat} onselect={handleSelectItem} isSelected={selectedItems[compresseditem.ID]} setSelectedIds={setSelectedIds} setEquipementSelected={setEquipementSelected} equipementSelected={equipementSelected}/>)
                            }
                        }))
                    }
                    </div>)
                })}
            </div>*/}


            <div className='equipment_table_elements_div'>
                {status === FETCH_STATUS.LOADING ? <Loading/> :
                shownEquipment.map((item: any, index: number) => {
                    return (
                        <div key={index}>
                            <div onClick={(e) => {
                                if (item.isSubCategory) {
                                    e.stopPropagation(); 
                                    if (selectedSubCategory !== index) {
                                        setSelectedSubCategory(index);
                                    } else {
                                        setSelectedSubCategory(-1);
                                    }
                                }
                            }}>
                                <Equipment_element 
                                    key={index} 
                                    index={index} 
                                    id={item.ID} 
                                    name={item.nom} 
                                    categorie={item.category_name} 
                                    type={item.type} 
                                    quantite={item.quantite} 
                                    disponibilite={item.disponibilite} 
                                    details={item.details} 
                                    ids={item.ids} 
                                    category_id={item.category_id} 
                                    sub_category_id={item.sub_category_id} 
                                    date_location={item.date_location} 
                                    date_retour={item.date_retour} 
                                    prix={item.prix} 
                                    code_bar={item.code_bar} 
                                    agence_id={item.agence_id} 
                                    date_achat={item.date_achat} 
                                    onselect={handleSelectItem} 
                                    isSelected={selectedItems[item.ID]} 
                                    setSelectedIds={setSelectedIds} 
                                    setEquipementSelected={setEquipementSelected} 
                                    equipementSelected={equipementSelected}
                                    isSubCategory={item.isSubCategory} 
                                />
                            </div>
                            
                            
                            {((selectedSubCategory === index) && (item.isSubCategory)) && (
                                <div style={{ marginLeft: '20px' }}> 
                                    {compressedEquipments.map((compresseditem: any, compressedindex: number) => {
                                        if (compresseditem.sub_category_id === item.sub_category_id) {
                                            return (
                                                <Equipment_element 
                                                    key={`compressed-${compressedindex}`} 
                                                    index={1000 + compressedindex} 
                                                    id={compresseditem.ID} 
                                                    name={compresseditem.nom} 
                                                    categorie={compresseditem.category_name} 
                                                    type={compresseditem.type} 
                                                    quantite={compresseditem.quantite} 
                                                    disponibilite={compresseditem.disponibilite} 
                                                    details={compresseditem.details} 
                                                    ids={compresseditem.ids} 
                                                    category_id={compresseditem.category_id} 
                                                    sub_category_id={compresseditem.sub_category_id} 
                                                    date_location={compresseditem.date_location} 
                                                    date_retour={compresseditem.date_retour} 
                                                    prix={compresseditem.prix} 
                                                    code_bar={compresseditem.code_bar} 
                                                    agence_id={compresseditem.agence_id} 
                                                    date_achat={compresseditem.date_achat} 
                                                    onselect={handleSelectItem} 
                                                    isSelected={selectedItems[compresseditem.ID]} 
                                                    setSelectedIds={setSelectedIds} 
                                                    setEquipementSelected={setEquipementSelected} 
                                                    equipementSelected={equipementSelected}
                                                    isSubCategory={false} 
                                                />
                                            );
                                        }
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className='equipment_table_footer_div'>
                <button className='equipment_table_prev' onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                    <img src={arrow_back} alt="" />
                </button>
                <button onClick={() => setCurrentPage(1)} className={currentPage === 1 ? 'active_page_button' : ''}>1</button>
                {(filteredEquipment.length / itemPerPage) > 1 && (
                    <button onClick={() => setCurrentPage(2)} className={currentPage === 2 ? 'active_page_button' : ''}>2</button>
                )}
                {(filteredEquipment.length / itemPerPage) > 2 && (
                    <button onClick={() => setCurrentPage(3)} className={currentPage === 3 ? 'active_page_button' : ''}>3</button>
                )}
                {(filteredEquipment.length / itemPerPage) > 4 && <button disabled>...</button>}
                {(filteredEquipment.length / itemPerPage) > 3 && (
                <button onClick={() => setCurrentPage(Math.floor(filteredEquipment.length / itemPerPage) + 1)} className={currentPage === (Math.floor(filteredEquipment.length / itemPerPage) + 1) ? 'active_page_button' : ''}>
                    {Math.floor(filteredEquipment.length / itemPerPage) + 1}
                </button>
                )}
                <button className='equipment_table_next' onClick={() => currentPage < filteredEquipment.length / itemPerPage && setCurrentPage(currentPage + 1)}>
                  <img src={arrow_forward} alt="" />
                </button>
            </div>
            <DeleteEquipmentModal
            isOpen={isDeleteEquipmentModalOpen}
            onClose={() => setIsDeleteEquipmentModalOpen(false)}
            getEquipment={getAllEquipment}
            ids={selectedIds}
            />

            <ToastContainer 
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
            />
            
        </div>
    );
}

export default Equipment_table;