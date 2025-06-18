import { useForm } from 'react-hook-form';
import { URLS } from '../../URLS';
import './AddCustomer.css'
import { toast, ToastContainer } from 'react-toastify';

function AddCustomer(props:any){

    const {register,reset,handleSubmit,formState:{errors}} = useForm();

    const Onsubmit =async (data:any)=>{
        try {
            const submitData = {...data,num_tel:Number(data.num_tel)}
            const reponse = await fetch(`${URLS.ServerIpAddress}/api/addClient`,{
                method:"POST",
                headers:{"Content-type":"application/json"},
                body: JSON.stringify(submitData),
                credentials:'include'
            })

            const result = await reponse.json();
            if(!result.success){
                throw({status:reponse.status,message:result.message});
            }
            
            toast.success('Client added successfully');
            props.getClients();
            //clearForm();
        } catch (error:any) {
            toast.error(error.message);
            console.error("failed to add a client",error.message);
        }
    }

    function clearForm(){
        reset();
    }

    return(
        <div className={`AddCustomer_container ${props.extended?'extended':''}`}>

            <div className='AddCustomer_container_header'>
                <h2>Add Customer</h2>
                <button id='AddCustomer_container_exit_button' onClick={()=>{props.extend()}}>X</button>
            </div>

            <div className='AddCustomer_container_form_div'>
                <form id='AddCustomer_container_form' onSubmit={handleSubmit(Onsubmit)}>

                    <div className='AddCustomer_container_form_input'>
                        <p className='AddCustomer_container_label'>company name</p>

                        <input type="text" {...register("nom",{required:"company name is required"})} />
                        {errors.nom&&<p>{String(errors.nom.message)}</p>}
                    </div>

                    <div className='AddCustomer_container_form_input'>
                        <p className='AddCustomer_container_label'>company Email</p>

                        <input type="text" {...register("email",{required:"email is required"})} />
                        {errors.email&&<p>{String(errors.email.message)}</p>}
                    </div>

                    <div className='AddCustomer_container_form_input'>
                        <p className='AddCustomer_container_label'>company Phone number</p>

                        <input type="number" {...register("num_tel",{required:"phone number is required"})} />
                        {errors.num_tel&&<p>{String(errors.num_tel.message)}</p>}
                    </div>

                    <div className='AddCustomer_container_form_input'>
                        <p className='AddCustomer_container_label'>company Domain</p>

                        <input type="text" {...register("domain",{required:"domain is required"})} />
                        {errors.domain&&<p>{String(errors.domain.message)}</p>}
                    </div>

                    <button type='submit'> Add Customer</button>

                </form>
            </div>
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

export default AddCustomer;