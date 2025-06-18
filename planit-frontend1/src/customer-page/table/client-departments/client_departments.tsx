import { useEffect, useState } from "react";
import "./client_departments.css"
import ClientDepartment from "./client_department/client_department";
import { URLS } from "../../../URLS";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ClientDepartments(props:any){

    const [departments,setDepartments] = useState([]);

    const getClientDepartments = async ()=>{
        try {
            //alert("trying to get client department");
            //alert(JSON.stringify({user_id:props.clientID}));
            const reponse = await fetch(`${URLS.ServerIpAddress}/getClientDepartments/${props.clientID}`,{
                method:'GET',
                headers:{"Content-Type":"application/json"},
                //body:JSON.stringify({client_id:props.clientID}),
                credentials:'include'
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
        <>
            {departments.length > 0 && <div className="client_departments_div">
                {departments.map((item:any)=>(
                    <ClientDepartment 
                        key={item.ID}
                        ID={item.ID}
                        nom={item.nom} 
                        department={item.department} 
                        num_tel={item.num_tel} 
                        email={item.email}
                        onUpdate={getClientDepartments}
                    />
                ))}
            </div>}
            <ToastContainer 
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
            />
        </>
    )
}

export default ClientDepartments;