import { useForm } from 'react-hook-form';
import './update_department.css';
import { URLS } from '../../URLS';
import { toast } from 'react-toastify';

interface UpdateDepartmentProps {
    department: {
        ID: number;
        nom: string;
        department: string;
        num_tel: string;
        email: string;
    };
    onClose: () => void;
    onUpdate: () => void;
}

function UpdateDepartment({ department, onClose, onUpdate }: UpdateDepartmentProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            nom: department.nom,
            department: department.department,
            num_tel: department.num_tel,
            email: department.email
        }
    });

    const updateDepartment = async (data: any) => {
        try {
            const response = await fetch(`${URLS.ServerIpAddress}/UpdateDepartment`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    ID: Number(department.ID),
                    num_tel: Number(data.num_tel)
                }),
                credentials: 'include'
            });

            const result = await response.json();
            if (!result.success) {
                throw ({ status: response.status, message: result.message });
            }

            toast.success("Department updated successfully");
            onUpdate();
            onClose();
        } catch (error: any) {
            console.error("failed to update department", error.message);
            toast.error("Failed to update department");
        }
    };

    return (
        <div className='update_department_interface'>
            <p>Update Department</p>
            <form onSubmit={handleSubmit(updateDepartment)} id='update_department_form'>
                <div className='update_department_form_subdiv'>
                    <div className='update_department_form_subdiv_input'>
                        <p>Name</p>
                        <input 
                            type="text" 
                            {...register('nom', { required: "Name is required" })} 
                            placeholder='Name' 
                        />
                        {errors.nom && <p>{String(errors.nom.message)}</p>}
                    </div>

                    <div className='update_department_form_subdiv_input'>
                        <p>Department</p>
                        <input 
                            type="text" 
                            {...register('department', { required: "Department is required" })} 
                            placeholder='Department'
                        />
                        {errors.department && <p>{String(errors.department.message)}</p>}
                    </div>
                </div>

                <div className='update_department_form_subdiv'>
                    <div className='update_department_form_subdiv_input'>
                        <p>Phone Number</p>
                        <input 
                            type="text" 
                            {...register('num_tel', { required: "Phone number is required" })} 
                            placeholder='Phone Number'
                        />
                        {errors.num_tel && <p>{String(errors.num_tel.message)}</p>}
                    </div>

                    <div className='update_department_form_subdiv_input'>
                        <p>Email</p>
                        <input 
                            type="text" 
                            {...register('email', { required: "Email is required" })} 
                            placeholder='Email'
                        />
                        {errors.email && <p>{String(errors.email.message)}</p>}
                    </div>
                </div>

                <div className='update_department_form_buttons'>
                    <button id='update_department_submit_button' type='submit'>Update</button>
                    <button id='update_department_cancel_button' type='button' onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateDepartment; 