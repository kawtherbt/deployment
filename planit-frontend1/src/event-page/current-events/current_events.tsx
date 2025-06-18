import {useState} from "react";
import { FETCH_STATUS } from "../../fetchStatus";

import Event_element from "./event-element/event_element";
import Loading from "../../loading/loading";

import searchImg from "../../assets/search_black.svg";
import backArrowImg from "../../assets/chevron_right_black.svg";

import './current_events.css';

interface UpComingEventItem{
    ID:number;
    nom:string;
    date_debut:string;
}

function Current_events(props:any){

    const [isExpanded,setIsExpanded] = useState(false);
    const [searchTerm , setSearchTerm] = useState<string>("");

    const filteredUpcomingEvents = (props.UpComingEvents).filter((item:UpComingEventItem)=>{
        return(
            item.nom&&(item.nom.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    });
    
    return(
        <div className={isExpanded?"UpComingEvents expanded":"UpComingEvents"}>
            <button id="open_close" onClick={()=>{setIsExpanded(!isExpanded)}}><img src={backArrowImg} alt="error"/></button>
            <div className="search">
                <img src={searchImg} alt="error" />
                <input 
                    id="searchText"
                    type="text" 
                    value={searchTerm}
                    onChange={(e)=>{setSearchTerm(e.target.value)}}
                    />
            </div>
            {(props.status === FETCH_STATUS.LOADING)&&<Loading/>}
            {(props.status === FETCH_STATUS.SUCCESS)&&<div className="events">
                {filteredUpcomingEvents.map((item:any,index:number)=>(
                    <div key={item.ID} className={`upcoming_event ${index===props.selectedUpcomingEventIndex ? "selected":""}`} onClick={()=>{if(props.selectedUpcomingEventIndex === index){props.setselectedUpcomingEventIndex(-1)}else{props.setselectedUpcomingEventIndex(index)}}}>
                        <Event_element ID={item.ID} name={item.nom} date={item.date_debut}/>
                    </div>
                ))}
            </div>}
            {(props.status===FETCH_STATUS.ERROR)&&<div className="events">Erreur!</div>}
        </div>
    );
}

export default Current_events;