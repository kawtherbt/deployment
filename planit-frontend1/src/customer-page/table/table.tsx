import { useState,useEffect, useRef } from 'react';
import dropImg from '../../assets/arrow_drop_down_black.svg'
import menuImg from '../../assets/menu_black.svg'
import './table.css'

import Customer from '../customer/customer';
import ClientDepartments from './client-departments/client_departments';
import { toast, ToastContainer } from 'react-toastify';
import UpdateCustomerModal from '../update-customer/UpdateCustomerModal';
import arrowBack from '../../assets/arrow_back_black.svg';
import arrowForward from '../../assets/arrow_forward_black.svg';
import { URLS } from '../../URLS';

interface selectedItems {
  [key: string]: boolean;
}

interface Client {
    ID: number;
    nom: string;
    email: string;
    num_tel: string;
    domain: string;
}

/*interface CustomerElement {
  ID: number;
  nom: string;
  email: string;
  phone_number: string;
  domain: string;
}*/

function content(props:any){

    const [selectedClient,setSelectedClient] = useState(-1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [selectedItems, setSelectedItems] = useState<selectedItems>({});
    const [isUpdateModalOpen,setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredClients = props.clients.filter((item:any) => 
        item.nom.toLowerCase().includes(props.searchTerm.toLowerCase())
    );

    
    //const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentClients = filteredClients.slice(startIndex, endIndex);

    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setDropdownOpen(false);
        }
      }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);


      const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isSelected = e.target.checked;
        const tempSelectedItems: selectedItems = {};
    
        props.clients.forEach((item:any) => {
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

      const allSelected = props.clients.length > 0 && props.clients.every((item:any) => selectedItems[item.ID]);

    const deleteClients = async (ids:number[])=>{
        try {
            if (!ids.length) {
                toast.warning("No clients selected for deletion");
                return;
            }

            const response = await fetch(`${URLS.ServerIpAddress}/api/deleteClient`,{
                method:'DELETE',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({IDs:ids}),
                credentials:'include'
            });

            const result = await response.json();

            if(!result.success){
                throw({status:response.status,message:result.message});
            }
            
            // Update local state
            const updatedClients = props.clients.filter((client: Client) => !ids.includes(client.ID));
            props.setClients(updatedClients);
            
            // Clear selection
            setSelectedItems({});
            
            // Show success message
            toast.success("Clients deleted successfully");
            
            // Refresh data from server
            props.getClients();
        } catch (error:any) {
            console.error("Failed to delete clients:", error);
            toast.error(error.message || "An error occurred while deleting clients");
        }
    }

    const handleDelete = async () => {
        let selectedClientsIds: number[] = [];
        Object.keys(selectedItems).forEach((key) => {
          if (selectedItems[key]) {
            selectedClientsIds.push(parseInt(key));
          }
        });
        if(selectedClientsIds.length > 0){
            setIsDeleteModalOpen(true);
        } else {
            toast.warning("No clients selected");
        }
    }

    const confirmDelete = async () => {
        let selectedClientsIds: number[] = [];
        Object.keys(selectedItems).forEach((key) => {
          if (selectedItems[key]) {
            selectedClientsIds.push(parseInt(key));
          }
        });
        await deleteClients(selectedClientsIds);
        setIsDeleteModalOpen(false);
    }

    const handleUpdate = () => {
        const selectedClientsIds = Object.keys(selectedItems).filter((key) => selectedItems[key]);
        console.log(selectedClientsIds);
        if (selectedClientsIds.length === 1) {
          setSelectedClient(parseInt(selectedClientsIds[0]));
          setIsUpdateModalOpen(true);
        } else if (selectedClientsIds.length === 0) {
          toast.warning("No client selected");
        } else {
          toast.warning("Please select only one client to update");
        }
    };

    return(
        
        <div className='table'>
            <div className="head">
                <div className="Customer_Table_Title">
                    <input 
                    type="checkbox"
                     name="all_customers_checkbox"
                      id="all_customers_checkbox" 
                      checked={allSelected}
                      onChange={handleSelectAll}
                      />
                </div>
                <div className="Customer_Table_Title">
                    <h3>Customer id</h3>
                    <img src={dropImg}/>
                </div>

                <div className="Customer_Table_Title">
                    <h3>name</h3>
                    <img src={dropImg}/>
                </div>

                <div className="Customer_Table_Title">
                    <h3>Email</h3>
                    <img src={dropImg}/>
                </div>

                <div className="Customer_Table_Title">
                    <h3>Phone number</h3>
                    <img src={dropImg}/>
                </div>

                <div className="Customer_Table_Title">
                    <h3>Domain</h3>
                    <img src={dropImg}/>
                </div>
                <div className="Customer_Table_Title" ref={dropdownRef}>
                    <button 
                    className="staff_more_actions" 
                    onClick={()=>{setDropdownOpen((prev)=>(!prev))}}
                    >
                    <img id='customer_menu_img' src={menuImg}/>
                    </button >
                    {dropdownOpen && (
                        <div className="staff_element_dropdown_menu">
                            <button className="dropdown_item" onClick={()=>{handleUpdate()}}>Edit</button>
                            <button className="dropdown_item" onClick={()=>{handleDelete()}}>delete</button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className='customers'>
                {(currentClients).map((item:any)=>{
                    return(
                        <div key={item.ID}>
                            <Customer 
                                client_id={item.ID} 
                                name={item.nom} 
                                email={item.email} 
                                phone_number={item.num_tel} 
                                domain={item.domain} 
                                extend 
                                extended={props.extended} 
                                openAddDepartment={props.openAddDepartment} 
                                setClientID={props.setClientID} 
                                setSelectedClient={setSelectedClient} 
                                selectedClient={selectedClient} 
                                addDepartmentISVisible={props.addDepartmentISVisible} 
                                isSelected={selectedItems[item.ID]} 
                                onselect={handleSelectItem}
                            />
                            {selectedClient === item.ID && <ClientDepartments clientID={item.ID}/>}
                        </div>
                    );
                })}
            </div> 

            <div className='table-footer-nav'>
                <button 
                    className='table-footer-prev' 
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                >
                    <img src={arrowBack} alt="" />
                </button>
                <button 
                    onClick={() => setCurrentPage(1)} 
                    className={currentPage === 1 ? 'active-page-button' : ''}
                >
                    1
                </button>
                {(filteredClients.length / itemsPerPage) > 1 && (
                    <button 
                        onClick={() => setCurrentPage(2)} 
                        className={currentPage === 2 ? 'active-page-button' : ''}
                    >
                        2
                    </button>
                )}
                {(filteredClients.length / itemsPerPage) > 2 && (
                    <button 
                        onClick={() => setCurrentPage(3)} 
                        className={currentPage === 3 ? 'active-page-button' : ''}
                    >
                        3
                    </button>
                )}
                {(filteredClients.length / itemsPerPage) > 4 && <button disabled>...</button>}
                {(filteredClients.length / itemsPerPage) > 3 && (
                    <button 
                        onClick={() => setCurrentPage(Math.floor(filteredClients.length / itemsPerPage) + 1)} 
                        className={currentPage === (Math.floor(filteredClients.length / itemsPerPage) + 1) ? 'active-page-button' : ''}
                    >
                        {Math.floor(filteredClients.length / itemsPerPage) + 1}
                    </button>
                )}
                <button 
                    className='table-footer-next' 
                    onClick={() => currentPage < filteredClients.length / itemsPerPage && setCurrentPage(currentPage + 1)}
                >
                    <img src={arrowForward} alt="" />
                </button>
            </div>

            <UpdateCustomerModal 
                isOpen={isUpdateModalOpen} 
                onClose={()=>{setIsUpdateModalOpen(false)}} 
                getClients={props.getClients} 
                itemid={selectedClient} 
                items={props.clients}
            />

            {isDeleteModalOpen && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <h3>Delete Clients</h3>
                        <p>Are you sure you want to delete the selected clients? This action cannot be undone.</p>
                        <div className="delete-modal-buttons">
                            <button className="delete-modal-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="delete-modal-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

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

export default content;