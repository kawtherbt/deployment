import { Controller, useForm ,FieldValues,  } from "react-hook-form";
import {useEffect,useRef,useState } from "react";
import { forwardRef,useImperativeHandle } from "react";

import Add_new_type from "../add-new-type/add_new_type";
import ClientInterface from "../client-interface/client_interface";
import EventSummaryModal from "../event-summary-modal/EventSummaryModal";

import "./event_creation_form.css"

import arrowImg from "../../assets/arrow_back_black.svg"
import { FETCH_STATUS } from "../../fetchStatus";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from "../../URLS";

interface EventFormData extends FieldValues {
    nom: string;
    edition?: string;
    nbr_invite: number|null;
    type: string;
    date_debut: Date|null;
    date_fin: Date|null;
    address: string;
    description?: string;
    client_id: number|null;
  }

function Event_creation_form(props:any,ref:any){
    const navigate = useNavigate();
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [createdEventData, setCreatedEventData] = useState<any>(null);

    const getClients = async ()=>{
        try {
            
            setClient_interfaceStatus(FETCH_STATUS.LOADING);
            const reponse = await fetch(`${URLS.ServerIpAddress}/api/getAllClients`,{
                method:'GET',
                headers:{"Content-Type":"application/json"},
                credentials: 'include',
            });
    
            const result = await reponse.json();
    
            if(!result.success){
                throw({status:reponse.status,message:result.message});
            }
                
            setClients(result.data);
            setClient_interfaceStatus(FETCH_STATUS.SUCCESS);
        } catch (error:any) {
            console.error("failed to get clients",error.message);
            setClient_interfaceStatus(FETCH_STATUS.ERROR);
        }
    }

    const onSubmit = async (data : EventFormData)=>{
        try{
            //props.setStatus(FETCH_STATUS.LOADING);
             
            console.log("trying to create");
            const reponse = await fetch(`${URLS.ServerIpAddress}/api/addEvent`,{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
                credentials: 'include',
            });
            
            const result = await reponse.json();
            if(!result.success){
                throw{status:reponse.status,message:result.message};
            }

            //props.setStatus(FETCH_STATUS.SUCCESS);
            console.log("Événement créé avec succès")
            toast.success("Événement créé avec succès");
            props.getUpcomingEvents();
            setCreatedEventData(result.data);
            setShowSummaryModal(true);
            //clearform();
        }catch(error:any){
            console.error(error.message);    
            toast.error("Erreur lors de la création de l'événement"); 
            props.setStatus(FETCH_STATUS.ERROR);
        }
    }

    const getEventTypes = async ()=>{
        try{
            const reponse = await fetch(`${URLS.ServerIpAddress}/api/getEventTypes`,{
                method:'GET',
                headers:{'Content-Type':'application/json'},
                credentials: 'include',
            });
            
            const result = await reponse.json();
            if(!result.success){
                throw({status:reponse.status,message:result.message});
            }
            return result.data;
        }catch(error){
            console.error(error)
        }
    }

    const evenementTypesTraitement = async ()=>{
        try{
            
            const data = await getEventTypes();
            console.log("caling types twise")
            if(data !== null){
                let names = [];
                for(let row of data){
                    names.push(row.nom);
                }
                setEventTypes([...names]);
            }
        }catch(error){
            console.error(error)
        }
        
    }

    const updateEvent = async(id:number,data:any)=>{
        try {
            props.setStatus(FETCH_STATUS.LOADING);
            
            const reponse = await fetch(`${URLS.ServerIpAddress}/api/updateEvent`,{
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({...data,"ID":id}),
                credentials: 'include',
            });
            
            const result = await reponse.json();
            if(!result.success){
                throw({status:reponse.status,message:result.message});
            }
            toast.success("Événement mis à jour avec succès");
            props.setStatus(FETCH_STATUS.SUCCESS);
            props.getUpcomingEvents();
        } catch(error:any){
            console.error(error.message);
            toast.error("Erreur lors de la mise à jour de l'événement");     
            props.setStatus(FETCH_STATUS.ERROR);
        }
    }

    const handleUpdate = async()=>{
        if(selectedEventID.current===0){
            toast.warn("Sélectionnez un événement à mettre à jour");
            return 0;
        }
        const data = getValues();
        
        await updateEvent(selectedEventID.current,data);
    }

    const deleteEvent = async(id:number)=>{
        try {
            props.setStatus(FETCH_STATUS.LOADING);
            const reponse = await fetch(`${URLS.ServerIpAddress}/api/deleteEvent`,{
                method:'DELETE',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({"ID":id}),
                credentials: 'include',
            });
            
            const result = await reponse.json();
            if(!result.success){
                throw({status:reponse.status,message:result.message});
            }
            toast.success("Événement supprimé avec succès");
            props.setStatus(FETCH_STATUS.SUCCESS)
            clearform();
            props.getUpcomingEvents();
        } catch(error:any){
            toast.error("Erreur lors de la suppression de l'événement");
            console.error(error.message);  
            props.setStatus(FETCH_STATUS.ERROR);   
        }
    }
    const handleDelete = async ()=>{
        if(selectedEventID.current===0){
            toast.warn("Sélectionnez un événement à supprimer");
            return 0;
        }
        
        await deleteEvent(selectedEventID.current);
    }

    const handleNewTypeIsVisible = ()=>{
        setNewTypeIsvisible(!newTypeIsVisible);
    }

    function OpenClientInterface(){
        setClientInterfaceIsVisible(!ClientInterfaceIsVisible);
    }
    const handleClient_id =(id:number)=>{
        setValue("client_id",id);
    }

    function extractInitials(name:string){
        return ((name.split(' ')).map(n=>n[0])).join('');
    }

    function clearform(){
        setValue("nom","");
        setValue("edition","");
        setValue("nbr_invite",null);
        setValue("type","");
        setValue("date_debut",null);
        setValue("date_fin",null);
        setValue("address","");
        setValue("description","");
        setValue("client_id",null);
        props.setselectedUpcomingEventIndex(-1);
    }

    function getClientName(id:number|null){
        if(id === null){
            setClientName("");
            return;
        }
        const client:any = clients.find((client:any)=>client.ID===id);
        if(client){
            setClientName(client.nom);
        }
    }

    const {register,control,getValues,setValue,handleSubmit,watch,formState:{ errors }} = useForm<EventFormData>();

    const [EventTypes,setEventTypes] = useState<string[]>([]);
    const [newTypeIsVisible,setNewTypeIsvisible] =useState(false);
    const [ClientInterfaceIsVisible,setClientInterfaceIsVisible] = useState(false);
    const [clientName,setClientName] = useState("");
    const [clients,setClients] = useState([]);

    const [Client_interfaceStatus,setClient_interfaceStatus] = useState(FETCH_STATUS.IDLE);

    const date_debut = watch('date_debut');
    
    useEffect(()=>{props.setAddress(watch("address"))},[watch("address")]);
    useEffect(()=>{props.setEvent_name(watch("nom"))},[watch("nom")]);    
    useEffect(()=>{props.setDate(watch("date_debut"))},[watch("date_debut")]);
    useEffect(()=>{props.setDescription(watch("description"))},[watch("description")]);
    
    useEffect(()=>{evenementTypesTraitement()},[]);
    
    useEffect(()=>{
        if(props.selectedUpcomingEventIndex!==-1){
            setValue("nom",(props.selectedUpcomingEvent).nom);
            setValue("date_debut",(new Date((props.selectedUpcomingEvent).date_debut)));
            setValue("date_fin",(new Date((props.selectedUpcomingEvent).date_fin)));
            setValue("address",(props.selectedUpcomingEvent).address);
            setValue("nbr_invite",(props.selectedUpcomingEvent).nbr_invite);
            setValue("client_id",(props.selectedUpcomingEvent).client_id);
            setValue("edition",(props.selectedUpcomingEvent).edition);
            setValue("description",(props.selectedUpcomingEvent).description);
            setValue("type",(props.selectedUpcomingEvent).type);
            
            selectedEventID.current = (props.selectedUpcomingEvent).ID;
        }else{
            selectedEventID.current = 0;
            //clearform();
        }
    },[props.selectedUpcomingEventIndex])
    
    useEffect(()=>{if(watch("client_id")){getClientName(watch("client_id"))}},[watch("client_id")]);

    useEffect(()=>{getClients()},[]);

    const selectedEventID = useRef(0);

    useImperativeHandle(ref,()=>({
        updateEventCall:handleUpdate,
        deleteEventCall:handleDelete,
    }));

    return(<>
        <form id="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="mame_edition">
                <div className="name">
                    <label>nom</label>
                    <input id="name" {...register("nom",{required:"name is required"})}  placeholder="nom"/>
                    {errors.nom&&<p>{String(errors.nom.message)}</p>}
                </div>
                
                <div>
                    <label>édition</label>
                    <input id="edition" {...register("edition")} placeholder="edition"/>
                    {errors.edition&&<p>{String(errors.edition.message)}</p>}   
                </div>
                
            </div>
            
            <div className="number_type">
                <div className="number">
                    <label>nombre d'invités</label>
                    <input id="number" {...register("nbr_invite",{required:"number of invite is required",pattern:{value:/^[0-9]+$/,message:"le numero doit contenir uniquement des chiffres"}})} placeholder="nombre d'invités"/>
                    {errors.nbr_invite&&<p>{String(errors.nbr_invite.message)}</p>}
                </div>
                
                <div className="type">
                    <label>type</label>
                    <Controller
                    name="type"
                    control={control}
                    defaultValue=""
                    rules={{required:"select a type"}}
                    render={({field})=>{
                        return(
                        <select id="type" {...field} onChange={(e)=>{
                            if(e.target.value === "addNewType"){
                                e.preventDefault();
                                setNewTypeIsvisible(true);
                            }else{
                                field.onChange(e);
                            }
                        }}>
                            {field.value ===""&&<option value="" disabled hidden>select a type</option>}
                            {EventTypes.map((valeur,index)=>{
                                return(
                                    <option key={index} value={valeur}>{valeur}</option>
                                );
                            })}
                            <option value="addNewType" >+ add a new type</option>
                        </select>
                    );}}/>
                    {errors.type && <p>{String(errors.type.message)}</p>}
                </div>
                
            </div>
         
            <div className="time">

                <div className="start_time">
                {/* <input type='datetime-local' id="start_time" {...register("date_debut",{required:"start time is required"})} placeholder="start time"/> */}
                    {/*errors.date_debut&&<p>{String(errors.date_debut.message)}</p>*/}
                    <label>date debut</label>
                    <Controller
                    control={control}
                    name="date_debut"
                    rules={{ required: "Start time is required" }}
                    defaultValue={null}
                    render={({ field }) => (
                        <DatePicker
                        selected={field.value}
                        onChange={(date: Date | null) => {
                            field.onChange(date);
                        }}
                        dateFormat="yyyy/MM/dd HH:mm"
                        placeholderText="date debut"
                        showTimeSelect
                        timeIntervals={15}
                        minDate={new Date()}
                        onKeyDown={(e) => e.preventDefault()}
                        />
                    )}
                    />
                    {errors.date_debut && <p>{String(errors.date_debut.message)}</p>}
                </div>

                <div className="end_time">
                    {/*<input type="datetime-local" id="end_time" {...register("date_fin",{required:"end time is required"})} placeholder="end time"/>
                    {errors.date_fin&&<p>{String(errors.date_fin.message)}</p>}*/}
                    <label>date fin</label>
                    <Controller
                        control={control}
                        name="date_fin"
                        rules={{ required: "End time is required" }}
                        defaultValue={null}
                        render={({ field }) => (
                            <DatePicker
                            selected={field.value}
                            onChange={(date: Date|null) => {
                                field.onChange(date);
                            }}
                            dateFormat="yyyy/MM/dd HH:mm"
                            placeholderText="date fin"
                            showTimeSelect
                            timeIntervals={15}
                            wrapperClassName="date-picker-wrapper"
                            minDate={date_debut ? new Date(date_debut) : new Date()} 
                            minTime={
                                date_debut && new Date(date_debut).toDateString() === new Date().toDateString()
                                  ? new Date(date_debut)
                                  : new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              maxTime={new Date(new Date().setHours(23, 45, 0, 0))}
                            onKeyDown={(e) => e.preventDefault()}
                            />
                        )}
                    />
                    {errors.date_fin && <p>{String(errors.date_fin.message)}</p>}
                </div>

            </div>
            
            <div className="address_client_description">
                <div className="address_description">
                    <div className="address1">
                        <label>adresse</label>
                        <input id="address1" {...register("address",{required:"address is required"})} placeholder="address"/>
                        {errors.address&&<p>{String(errors.address.message)}</p>}
                    </div>
                    <div className="description1">
                        <label>description</label>
                        <textarea id="description1" {...register("description")} rows={10} cols={100} placeholder="description"/>
                    </div>
                    
                </div>
                <div className="client">
                    <button id="client_button" type="button" onClick={()=>{OpenClientInterface()}}> Clients</button>
                    <input type="hidden" {...register("client_id", { required: "Client selection is required" })} />
                    {errors.client_id && <p className="text-red-500">{String(errors.client_id.message)}</p>}
                    {watch("client_id")&&<div className="profile-square">
                        <div className="profile-circle">
                            {extractInitials(clientName)}
                        </div>
                        <div className="profile-name">
                            {clientName}
                        </div>
                    </div>}
                </div>
                

            </div>
            <div className="buttons_below">
                <button id="go_back" type="button" onClick={()=>{clearform();navigate('/firstPage')}}><img src={arrowImg} alt=""/>Go Back</button>
                {/*<button id="add_details" type="button" onClick={()=>{if(props.selectedUpcomingEvent?.ID){navigate('/eventDetails', {state: { evenement_id: props.selectedUpcomingEvent.ID },});} else {toast.error("No event selected")}}}>+ add details</button>*/}
                <button id="create_new_event" type="submit">+ create a new event</button>
            </div>
            
        </form>
        {newTypeIsVisible&&<Add_new_type getEventTypes={evenementTypesTraitement} isvisible={handleNewTypeIsVisible}/>}
        {ClientInterfaceIsVisible&&<ClientInterface clients={clients} setClients={setClients} handleClient_id={handleClient_id} storedClientId={watch("client_id")} setClientName={setClientName} status={Client_interfaceStatus} isOpen={setClientInterfaceIsVisible}/>}
        {showSummaryModal && createdEventData && (
            <EventSummaryModal
                isOpen={showSummaryModal}
                onClose={() => {
                    setShowSummaryModal(false);
                    setCreatedEventData(null);
                    props.getUpcomingEvents();
                    clearform();
                }}
                eventData={createdEventData}
            />
        )}
        <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
        />
    </>);
}

export default forwardRef(Event_creation_form);

