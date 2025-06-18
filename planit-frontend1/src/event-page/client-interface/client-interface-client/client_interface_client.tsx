import './client_interface_client.css';

function ClientInterfaceClient(props:any){
    return(
        <div className="client_interface_client_containing_div">

            <div className='client_interface_client_containing_subdiv'>
                <h3>{props.name??"name"}</h3>
            </div>

            <div className='client_interface_client_containing_subdiv domain'>
                <h3>{props.domain??"domain"}</h3>
            </div>

        </div>
    );
}

export default ClientInterfaceClient;