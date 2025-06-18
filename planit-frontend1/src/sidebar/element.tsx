import './element.css'
import { Link } from 'react-router-dom';

function Element(props:any){
    return(
        <div className="Element">
            <img src = {props.imgUrl}></img>
            <Link to= {props.link}> {props.name}</Link>
        </div>
    );
}

export default Element