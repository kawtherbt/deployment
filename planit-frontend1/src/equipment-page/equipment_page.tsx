import './equipment_page.css'
import Equipment_table from './equipment-table/equipment_table';
import EquipmentUseGraph from './equipment-use-graph/EquipmentUseGraph';
import Sidebar from '../sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { FETCH_STATUS } from '../fetchStatus';
import { toast } from 'react-toastify';
import { URLS } from '../URLS';

function Equipment_page(){

    const [equipmentGraphData, setEquipmentGraphData] = useState([]);
    const [categoryGraphData, setCategoryGraphData] = useState([]);
    const [status,setStatus] = useState(FETCH_STATUS.IDLE);

    const getEquipmentGraphData = async()=>{
        try {
            const current_time = new Date().toLocaleString("en-CA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).replace(",", "");
            //console.log(JSON.stringify(SubmitData));
            setStatus(FETCH_STATUS.LOADING);
            const reponse = await fetch(`${URLS.ServerIpAddress}/getEquipmentUse/${current_time}`,{
                method:"GET",
                headers:{'Content-Type':'application/json'},
                credentials:'include',
            });
    
            const result = await reponse.json();
            if(!result.success){
                throw({status: reponse.status,message:result.message});
            }
            setEquipmentGraphData(result.data);
            setStatus(FETCH_STATUS.SUCCESS);
        } catch (error:any) {
            console.error("error while getting graph data",error.message);
            toast.error("failed to get graph data");
            setStatus(FETCH_STATUS.ERROR)
        }
    }

    useEffect(()=>{getEquipmentGraphData()},[]);

    const getCategoryGraphData = async()=>{
        try {
            const current_time = new Date().toLocaleString("en-CA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).replace(",", "");
            //console.log(JSON.stringify(SubmitData));
            setStatus(FETCH_STATUS.LOADING);
            const reponse = await fetch(`${URLS.ServerIpAddress}/getCategoryUse/${current_time}`,{
                method:"GET",
                headers:{'Content-Type':'application/json'},
                credentials:'include',
            });
    
            const result = await reponse.json();
            if(!result.success){
                throw({status: reponse.status,message:result.message});
            }
            setCategoryGraphData(result.data);
            setStatus(FETCH_STATUS.SUCCESS);
        } catch (error:any) {
            console.error("error while getting graph data",error.message);
            toast.error("failed to get graph data");
            setStatus(FETCH_STATUS.ERROR)
        }
    }

    useEffect(()=>{getCategoryGraphData()},[]);
    
    return(<>
    <Sidebar/>
    <div className='equipment_page_container'>
        <div className='equipment_page_container_header'>
            <EquipmentUseGraph data={equipmentGraphData} status={status}/>
            <EquipmentUseGraph data={categoryGraphData} status={status}/>
        </div>
        <Equipment_table/>
    </div>
    </>)
}

export default Equipment_page;