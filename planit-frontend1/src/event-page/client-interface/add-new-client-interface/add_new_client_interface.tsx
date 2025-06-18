import { useForm } from 'react-hook-form';
import { FETCH_STATUS } from '../../../fetchStatus';
import { useState } from 'react';

import Loading from '../../../loading/loading';
import './add_new_client_interface.css'
import { URLS } from '../../../URLS';
import { ToastContainer, toast } from 'react-toastify';

function Add_new_client_interface(props:any){

    const Onsubmit =async (data:any)=>{
        try {
            setStatus(FETCH_STATUS.LOADING);
            const submitData = {...data,num_tel:Number(data.num_tel)}
            const reponse = await fetch(`${URLS.ServerIpAddress}/addClient`,{
                method:"POST",
                headers:{"Content-type":"application/json"},
                body: JSON.stringify(submitData),
                credentials: 'include',
            })

            const result = await reponse.json();
            if(!result.success){
                throw({status:reponse.status,message:result.message});
            }
            toast.success('client added');
            props.setClients([...props.clients,{nom:data.nom,domain:data.domain}]);
            setStatus(FETCH_STATUS.SUCCESS);
        } catch (error:any) {
            toast.error('failed to add client');
            console.error("failed to add a client",error.message);
            setStatus(FETCH_STATUS.ERROR);
        }
    }

    const {register,handleSubmit,formState:{errors}} = useForm();
    const [status,setStatus] = useState(FETCH_STATUS.IDLE);

    if(status===FETCH_STATUS.LOADING){
       return <div className='add_new_client_interface'><Loading/></div>
    }

    return (
    <div className='add_new_client_interface'>
        <form onSubmit={handleSubmit(Onsubmit)} id='add_new_client_interface_form'>

            <div className='add_new_client_interface_subdiv'>

                <div className='add_new_client_interface_subdiv_nom'>
                    <label>Nom</label>
                    <input {...register('nom',{required:"le nom est obligatoire"})} placeholder='nom'/>
                    {errors.nom&&<p>{String(errors.nom.message)}</p>}
                </div>

                <div className='add_new_client_interface_subdiv_domain'>
                    <label>Domain</label>
                    <input {...register('domain',{required:"le domain est obligatoire"})} placeholder='domain'/>
                    {errors.domain&&<p>{String(errors.domain.message)}</p>}
                </div>

            </div>

            <div className='add_new_client_interface_subdiv'>

                <div className='add_new_client_interface_subdiv_num_tel'>
                    <label>Numero de telephone</label>
                    <input {...register('num_tel',{required:"le numero de telephone est obligatoire",pattern:{value:/^[0-9]+$/,message:"le numero de telephone doit contenir uniquement des chiffres"}})} placeholder='numero de telephone'/>
                    {errors.num_tel&&<p>{String(errors.num_tel.message)}</p>}                
                </div>

                <div className='add_new_client_interface_subdiv_email'>
                    <label>Email</label>
                    <input {...register('email',{required:"l'email est obligatoire"})} placeholder='email'/>
                    {errors.email&&<p>{String(errors.email.message)}</p>}
                </div>

            </div>

            <div className='add_new_client_interface_subdiv buttons'>
                <button type='button' onClick={()=>{props.handleAddNewClientInterfaceIsVisible()}}>cancel</button>
                <button type='submit'>Add new Client</button>
            </div>
        </form>
    </div>);
}

export default Add_new_client_interface;