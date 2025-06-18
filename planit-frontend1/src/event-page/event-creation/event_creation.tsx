import { useState,useRef } from "react";

import Event_creation_form from "../event-creation-form/event_creation_form";
import deleteImg from "../../assets/delete_black.svg"
import editImg from"../../assets/edit_black.svg"

import "./event_creation.css"
import { FETCH_STATUS } from "../../fetchStatus";
import Loading from "../../loading/loading";


function Event_creation(props:any){
    const [date,setDate]= useState<string|Date>("Choisir une date");
    const [address , setAddress] = useState("Sélectionner un lieu") ;
    const [Event_name,setEvent_name] = useState("Nom de votre événement");
    const [description ,setDescription] = useState("Écrivez une petite description pour l'événement");
    const [status,setStatus] = useState(FETCH_STATUS.IDLE);

    const Event_creation_form_ref = useRef<{updateEventCall:()=>Promise<void>,deleteEventCall:()=>Promise<void>}>(null);

    const handlesetEvent_name = (nameParam :string)=>{
        if(nameParam === ""){
            setEvent_name("Nom de votre événement");
        }else{
            setEvent_name(nameParam)
        }
    }

    const handlesetDate = (dateParam :Date)=>{
        if(!dateParam){
            setDate("Choisir une date");
        }else{
            setDate(dateParam)
        }
    }

    const handlesetAddress = (addressParam :string)=>{
        if(addressParam === ""){
            setAddress("Sélectionner un lieu");
        }else{
            setAddress(addressParam)
        }
    }
    
    const handlesetDescription = (descriptionParam :string)=>{
        if(!descriptionParam){
            setDescription("Écrivez une petite description pour l'événement");
        }else{
            setDescription(descriptionParam)
        }
    }

    const handleUpdateClick = async(e: React.MouseEvent)=>{
        e.preventDefault();
        await Event_creation_form_ref.current?.updateEventCall();
    }

    const handleDeleteClick = async(e: React.MouseEvent)=>{
        e.preventDefault();
        await Event_creation_form_ref.current?.deleteEventCall();
    }

    if(status === FETCH_STATUS.LOADING){
        return <div className="event_creation">
            <Loading/>
        </div>
    }

    return(<>
    <div className="event_creation">
        <div className="event_details">
            <div className="date_address">
                <p id="date">{String(date)}</p>
                <p id="address">{address}</p>
            </div>

            <h1 id="event_name">{Event_name}</h1>

            <div className="description_edit_delete">
                <p id="description">{description}</p>
                <img id="edit" src={editImg} alt="" onClick={handleUpdateClick}/>
                <img id="delete" src={deleteImg} alt="" onClick={handleDeleteClick}/>
            </div>
        </div>

        <Event_creation_form 
            setStatus={setStatus} 
            ref={Event_creation_form_ref} 
            setEvent_name={handlesetEvent_name} 
            setAddress={handlesetAddress} 
            setDate={handlesetDate} 
            setDescription={handlesetDescription} 
            selectedUpcomingEvent={props.selectedUpcomingEvent} 
            selectedUpcomingEventIndex={props.selectedUpcomingEventIndex} 
            setselectedUpcomingEventIndex={props.setselectedUpcomingEventIndex} 
            getUpcomingEvents={props.getUpcomingEvents} 
            setUpComingEvents={props.setUpComingEvents}
        />
    </div>
    </>);
}

export default Event_creation;