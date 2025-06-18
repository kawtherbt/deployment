import './customer.css';

function Customer(props:any){
    const handleRowClick = (e: React.MouseEvent) => {
        // Don't toggle if clicking the add department button
        if (e.target instanceof HTMLElement && e.target.id === 'add_department_button') {
            return;
        }
        
        if(props.selectedClient !== props.client_id) {
            props.setSelectedClient(props.client_id);
        } else {
            props.setSelectedClient(-1);
        }
    };

    return(
        <div className="customer_containing_div" onClick={handleRowClick}>
            <div className='customer_containing_subdiv checkbox'>
                <input 
                type="checkbox"
                name='customer_checkbox' 
                id='customer_checkbox'
                checked={props.isSelected}
                onChange={(e)=>{props.onselect(props.client_id,e.target.checked)}}
                onClick={(e) => e.stopPropagation()}
                />
            </div>
            <div className='customer_containing_subdiv'>
                <h3>{props.client_id??"id"}</h3>
            </div>
            <div className='customer_containing_subdiv'>
                <h3>{props.name??"name"}</h3>
            </div>
            <div className='customer_containing_subdiv'>
                <h3>{props.email??"email"}</h3>
            </div>
            <div className='customer_containing_subdiv'>
                <h3>{props.phone_number??"phone number"}</h3>
            </div>
            <div className='customer_containing_subdiv'>
                <h3>{props.domain??"domain"}</h3>
            </div>
            <div className={`customer_containing_button_subdiv ${(props.extended&&!props.addDepartmentISVisible)?'extended':''}`}>
                <button 
                    id='add_department_button' 
                    onClick={(e) => {
                        e.stopPropagation();
                        props.setClientID(props.client_id);
                        props.openAddDepartment();
                    }}
                >
                    add department
                </button>
            </div>
        </div>
    );
}

export default Customer