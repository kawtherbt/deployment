import './event_element.css'

function Event_element(props:any){
    
    return(<>
    <div className="event_element">
        <h3>{props.name}</h3>
        <p>{props.date}</p>
    </div>

    </>);
}

export default Event_element;