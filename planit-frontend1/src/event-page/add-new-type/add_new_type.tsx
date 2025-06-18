import { URLS } from '../../URLS';
import './add_new_type.css'
import { useForm } from 'react-hook-form'

function Add_new_type (props:any){

    const submitNewType = async (data:any)=>{
        try{
            const reponse = await fetch(`${URLS.ServerIpAddress}/addEventType`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data),
                credentials: 'include',
            });
            
            const result = await reponse.json();
            
            if(!result.success){
                throw({status:reponse.status,message:result.message});
            }
            
            await props.getEventTypes();

        }catch(error:any){
            console.error("error while submitting new type",error.message);
            alert('failed to fetch');
        }
    }



    const {register,handleSubmit,formState:{errors}} = useForm();

    return(
        <div className='addNewType' >
            <button id='close_button' onClick={props.isvisible}>X</button>
            <form onSubmit={handleSubmit(submitNewType)} id='add_new_type_form'>
                <div className='new_type_name_input'>
                    <label htmlFor="name">nom</label>
                    <input type="text" {...register("name",{required:"name is required"})}/>
                    {errors.name&&<p>{String(errors.name.message)}</p>}
                </div>
                
                <button type='submit'>+ add new type</button>
            </form>
            
        </div>
    )
}

export default Add_new_type;