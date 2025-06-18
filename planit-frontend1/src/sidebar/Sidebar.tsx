import { useState } from "react";
import Element from "./element";
import './Sidebar.css'


import clientImg from '../assets/handshake_black.svg'
import eventImg from '../assets/event_black.svg'
import teamImg from '../assets/groups_black.svg'
import equipmentImg from '../assets/package_black.svg'
import staffImg from '../assets/person_black.svg'
import historyImg from '../assets/history_black.svg'
import settingsImg from '../assets/settings_black.svg'
import logoutImg from '../assets/logout_black.svg'
import dropdown from '../assets/arrow_drop_down_black.svg'
import accountsImg from '../assets/accounts_black.svg'
import carImg from '../assets/swap_driving_black.svg'
import agenceImg from '../assets/real_estate_agent_black.svg'
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

type MenuState = Record<string, boolean>


function Sidebar(){

    const [menuIsVisible,setMenuIsVisible] = useState<MenuState>({
        equipment:false,
        staff:false,
        history:false
    });

    const updateInvisible = (name : string):void=>{
        setMenuIsVisible(
            (current)=>{
                return {
                    ...current,
                    [name] : !current[name],
                };
            }
        );

    }

    const navigate = useNavigate();

    const user = Cookies.get('user');
    const role = Cookies.get('role');
    const userData = user ? JSON.parse(user) : null;
    const nom = userData?.nom;
    
    
    

    return(
        
        <div className="sidebarholder">
            <img id="logo" src={eventImg}></img>
            
            <ul>
                <li>
                    <Element imgUrl={eventImg} link="/event" name="event"/>
                </li>
                <li>
                    <Element imgUrl={clientImg} link="/customer" name="customer"/>
                </li>
                <li>
                    <Element imgUrl={equipmentImg} link="/equipment" name="equipment"/>
                </li>
                <li>
                    <Element imgUrl={agenceImg} link="/PrestatairePage" name="fournisseur"/>
                </li>
                <li>
                    <Element imgUrl={teamImg} link="/teamPage" name="Teams"/>
                </li>
                <li>
                    <Element imgUrl={staffImg} link="/staff" name="Staff"/>
                </li>

                <li>
                    <span>
                        <Element imgUrl={historyImg} link="" name="History"/>
                        <img className="dropdownarrow" onClick={()=>{updateInvisible("history")}} src={dropdown} alt="problem" />
                    </span>
                    <ul className={`sub_menu ${menuIsVisible.history? 'visible':''}`}>
                        <li><a href="/equipment-history">Equipment History</a></li>
                        <li><a href="/history">Event History</a></li>
                    </ul>
                </li>
                <li>
                    <Element imgUrl={accountsImg} link="/Accounts" name="Accounts"/>
                </li>                   
                <li>
                    <Element imgUrl={carImg} link="/car" name="car"/>
                </li>
            </ul>

            <div className="account">
                <img id="setting" src={settingsImg} alt="problem" />
                <img id="accountimg" src={staffImg} alt="problem"/>
                <div className="username">
                    <h3>{nom}</h3>
                    <p>{role}</p>
                </div>
                <img src={logoutImg} alt="problem" onClick={()=>{Cookies.remove("isLogedIn",/*{secure:true,sameSite:"strict"}*/);navigate("/")}}/>
            </div>
        </div>
        
        
        
        
       
        
    );
}

export default Sidebar