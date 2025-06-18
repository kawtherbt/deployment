import{useForm} from 'react-hook-form';
import { useEffect, useState } from 'react';
import { FETCH_STATUS } from '../fetchStatus';
import {useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './login_page.css';
import Loading from '../loading/loading';
import LeftImage from '../assets/Illustration.svg';
import {toast, ToastContainer} from 'react-toastify';
import { URLS } from '../URLS';
export const ServerIpAddress =import.meta.env.VITE_API_URL ?? "http://localhost:5000";

function Login_page(){
    const navigate = useNavigate();
    const logIn = async (data:any)=>{
        try {
            setStatus(FETCH_STATUS.LOADING);
            console.log('Attempting to login with:', { email: data.email });
            
            const response = await fetch(`${ServerIpAddress}/logIn`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                }),
                credentials: 'include'
            });

            console.log('Login response status:', response.status);
            const result = await response.json();
            console.log('Login response:', result);
            
            if(!result.success){
                throw({status: response.status, message: result.message});
            }
            
            setStatus(FETCH_STATUS.SUCCESS);

            // Store user data in cookies
            Cookies.set('isLogedIn', 'true', {expires: 1/3, sameSite: 'lax'});
            Cookies.set('role', result.data.role, {expires: 1/3, sameSite: 'lax'});
            Cookies.set('user', JSON.stringify(result.data), {expires: 1, sameSite: 'lax'});
            
            // Store token in memory or secure storage
            localStorage.setItem('token', result.data.token);
            
            console.log("connected successfully");
            navigate('/firstPage');
        } catch (error:any) {
            console.error("Login error:", error);
            if (error.message === 'Failed to fetch') {
                toast.error("Cannot connect to server. Please check if the server is running.");
            } else {
                toast.error(error.message || "Failed to log in");
            }
            setStatus(FETCH_STATUS.ERROR);
        }
    }

    const {register, handleSubmit, formState:{errors}} = useForm();
    const [status,setStatus] = useState(FETCH_STATUS.IDLE);

    useEffect(()=>{
        if(Cookies.get("isLogedIn")){
            navigate('/firstPage');
        }}
    ,[])
    
    return(<div className='login_page_container'>
        <div className='login_page_img'>
            <h1>Plan-It</h1>
            <img src={LeftImage} alt='login_img'/>
        </div>
        <div className='login_page_form_containing_div'>
            {status === FETCH_STATUS.LOADING ? <Loading/>
            : <form className='login_page_form' onSubmit={handleSubmit((data) => {
                console.log('Form submitted with data:', data);
                logIn(data);
              })}>
                <div className='login_page_form_input_div'>
                    <p>Email</p>
                    <input 
                        type='text' 
                        placeholder='Enter your email' 
                        {...register('email', {
                            required: 'EMAIL IS REQUIRED',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                                message: 'Invalid email format'
                            }
                        })}
                    />
                    {errors.email && <p className='error-message'>{String(errors.email.message)}</p>}
                </div>
                <div className='login_page_form_input_div'>
                    <p>Password</p>
                    <input 
                        type='password' 
                        placeholder='Enter your password' 
                        {...register('password', {
                            required: 'PASSWORD IS REQUIRED'
                        })}
                    />
                    {errors.password && <p className='error-message'>{String(errors.password.message)}</p>}
                </div>
                <button type='submit'>Log In</button>
            </form>}
        </div>
        <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
        />
    </div>)
}

export default Login_page;