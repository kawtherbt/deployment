import { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar"
import Current_events from "./current-events/current_events";
import Event_creation from "./event-creation/event_creation";
//import Add_new_type from "./add-new-type/add_new_type";
import { FETCH_STATUS } from "../fetchStatus";
import { URLS } from "../URLS";
const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

import "./event_page.css"
import { toast } from "react-toastify";

function Event_page(){
    const getUpcomingEvents = async ()=>{
        try {
            setStatus(FETCH_STATUS.LOADING);
            const reponse = await fetch(`${API}/getUPcomingEvents`,{
                method:"GET",
                headers:{'Content-Type':'application/json'},
                credentials:'include',
            });

            const result = await reponse.json();
            if(!result.success){
                throw({status: reponse.status,message:result.message});
            }

            setUpComingEvents(result.data);
            setStatus(FETCH_STATUS.SUCCESS);
        } catch (error:any) {
            console.error("error while getting upcoming events",error.message);
            toast.error("Erreur lors de la récupération des événements à venir");
            setStatus(FETCH_STATUS.ERROR)
        }
    }
    
    const [UpComingEvents,setUpComingEvents] = useState([{nom:"hola",date_debut:'12-12-1212'}]);
    const [selectedUpcomingEventIndex,setselectedUpcomingEventIndex] = useState(-1);
    const [status,setStatus] = useState(FETCH_STATUS.IDLE);

    useEffect(()=>{getUpcomingEvents()},[]);

    return(
    <div className="container">
        <Sidebar/>
        <div className="maindiv">
            <Current_events status={status} UpComingEvents={UpComingEvents} selectedUpcomingEventIndex={selectedUpcomingEventIndex} setselectedUpcomingEventIndex={setselectedUpcomingEventIndex} />
            <Event_creation 
                getUpcomingEvents={getUpcomingEvents} 
                selectedUpcomingEvent={UpComingEvents[selectedUpcomingEventIndex]} 
                selectedUpcomingEventIndex={selectedUpcomingEventIndex} 
                setselectedUpcomingEventIndex={setselectedUpcomingEventIndex} 
                setUpComingEvents={setUpComingEvents}
            />
        </div>
    </div>
    )
}

export default Event_page;