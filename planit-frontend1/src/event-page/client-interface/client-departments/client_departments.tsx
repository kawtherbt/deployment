import { useEffect, useState } from "react";
import "./client_departments.css"
import ClientDepartment from "./client-department/client_department";
import { URLS } from "../../../URLS";
function ClientDepartments(props:any){

    const [departments,setDepartments] = useState([]);

    const getClientDepartments = async ()=>{
        try {
            //alert("trying to get client department");
            //alert(JSON.stringify({user_id:props.clientID}));
            const reponse = await fetch(`${URLS.ServerIpAddress}/getClientDepartments/${props.clientID}`,{
                method:'GET',
                headers:{"Content-Type":"application/json"},
                credentials: 'include',
            });

            const result = await reponse.json();

            if(!result.success){
                throw({status:reponse.status,message:result.message});
            }
            
            setDepartments(result.data);
        } catch (error:any) {
            console.error("failed to get clients",error.message);
        }
    }

    useEffect(()=>{getClientDepartments()},[])

    return(
        <div className="client_departments_div">
            {departments.map((item:any)=>(
                <ClientDepartment key={item.ID} nom={item.nom} department={item.department} num_tel={item.num_tel} email={item.email}/>
            ))}
        </div>
    )
}

export default ClientDepartments;