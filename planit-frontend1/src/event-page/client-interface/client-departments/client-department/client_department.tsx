import './client_department.css'

function ClientDepartment(props:any){
    return(
        <div className='client_department_div'>
            <div className="client_department_subdiv">
                <h3>{props.nom}</h3>
            </div>

            <div className="client_department_subdiv">
                <h3>{props.department}</h3>
            </div>

            <div className="client_department_subdiv">
                <h3>{props.num_tel}</h3>
            </div>

            <div className="client_department_subdiv">
                <h3>{props.email}</h3>
            </div>
        </div>
    )
}

export default ClientDepartment;