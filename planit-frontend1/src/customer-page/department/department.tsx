import { useForm } from 'react-hook-form';
import './department.css'
import { URLS } from '../../URLS';
import { toast, ToastContainer } from 'react-toastify';

function Department(props:any){

    const AddDepartment = async(data:any)=>{
        
        try {
            
            data = {...data,"client_id":props.clientID,num_tel:Number(data.num_tel)};
            
            
            const reponse = await fetch(`${URLS.ServerIpAddress}/api/addDepartment`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data),
                credentials:"include",
            });

            const result = await reponse.json();
            if(!result.success){
                throw({status:reponse.status,message:result.message});
            }
            toast.success("department added");
            reset();
        } catch (error:any) {
            console.error("failed to add department",error.message)
            toast.error("failed to add department");

        }
    }

    const {register,handleSubmit,reset,formState:{errors}} = useForm();
    return(
    <div className='add_department_interface'>
        <p>Add department</p>
        <form onSubmit={handleSubmit(AddDepartment)} id='add_department_form'>

            <div className='add_department_form_subdiv'>

                <div className='add_department_form_subdiv_input'>
                    <p>nom</p>
                    <input type="text" {...register('nom',{required:"nom est requis"})} placeholder='nom' />
                    {errors.nom&&<p>{String(errors.nom.message)}</p>}
                </div>

                <div className='add_department_form_subdiv_input'>
                    <p>department</p>
                    <input type="text" {...register('department',{required:"department est requis"})} placeholder='department'/>
                    {errors.department&&<p>{String(errors.department.message)}</p>}
                </div>
                
            </div>

            <div className='add_department_form_subdiv'>

                <div className='add_department_form_subdiv_input'>
                    <p>numero</p>
                    <input type="text" {...register('num_tel',{required:"numero est requis"})} placeholder='numero'/>
                    {errors.num_tel&&<p>{String(errors.num_tel.message)}</p>}
                </div>
                
                <div className='add_department_form_subdiv_input'>
                    <p>Email</p>
                    <input type="text" {...register('email',{required:"email est requis"})} placeholder='Email'/>
                    {errors.email&&<p>{String(errors.email.message)}</p>}
                </div>
                
            </div>
            
            <div className='add_department_form_subdiv_buttons'>
                <button id='AddDepartment_submit_button' type='submit'>add</button>
                <button id='AddDepartment_return_return' onClick={()=>{props.openAddDepartment()}}> cancel</button>
                    
            </div>
        </form>
        <ToastContainer />
    </div>
);
}

export default Department;