import './customer_page.css';
import Sidebar from '../sidebar/Sidebar';
import Table from './table/table';
import AddCustomer from './add-customer/AddCustomer';
import Department from './department/department';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { URLS } from '../URLS';

function Customer_page(){
    
    const [extended,setExtended] = useState(true);
    const [addDepartmentISVisible,setAddDepartmentIsVisible] = useState(false);
    const [clientID,setClientID] =useState();
    const [clients,setClients] = useState([]);
    const [searchTerm,setSearchTerm] = useState<string>("");

    const getClients = async () => {
        try {
            const reponse = await fetch(`${URLS.ServerIpAddress}/api/getAllClients`,{
                method:'GET',
                headers:{"Content-Type":"application/json"},
                credentials:'include'
            });

            const result = await reponse.json();

            if(!result.success){
                throw({status:reponse.status,message:result.message});
            }
            setClients([]);
            setClients(result.data);
        } catch (error:any) {
            console.error("failed to get clients",error.message);
            toast.error("failed to get clients");
        }
    }

    useEffect(() => {
        getClients();
    }, []);

    function openAddDepartment(){
        setAddDepartmentIsVisible(!addDepartmentISVisible);
    }

    function extend(){
        setExtended(!extended);
    }

    return(
    <div className='Customer_Page_Container'>
        <Sidebar/>
        <button id='add_customer_side_open' onClick={()=>{setExtended(false)}}>+</button>
        
        <div className='Customer_Page_Content'>
            <div className='customer_page_container_search'>
                <Search className='customer_page_search_icon' size={20} />
                <input
                    type="text"
                    placeholder='Search'
                    className='customer_page_container_search_input'
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value) }}
                />
            </div>
            <Table 
                openAddDepartment={openAddDepartment} 
                addDepartmentISVisible={addDepartmentISVisible} 
                extended={extended} 
                setClientID={setClientID} 
                clients={clients} 
                setClients={setClients}
                searchTerm={searchTerm}
                getClients={getClients}
            />
        </div>
        <AddCustomer extend={extend} extended={extended} clients={clients} setClients={setClients} getClients={getClients}/>
        {addDepartmentISVisible&&<Department clientID={clientID} openAddDepartment={openAddDepartment}/>}
    </div>
    );
}

export default Customer_page;