import Sidebar from '../sidebar/Sidebar';
import { useEffect, useState } from 'react';
import './StaffPage.css';
import arrowBack from '../assets/arrow_back_black.svg';
import arrowForward from '../assets/arrow_forward_black.svg';
import searchIcon from '../assets/search_black.svg';
import StaffElement from './staff-element/StaffElement';
import { toast } from 'react-toastify';
import { FETCH_STATUS } from '../fetchStatus';

import { Bar, Doughnut } from 'react-chartjs-2';
import {
    ChartOptions,
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';
import Loading from '../loading/loading';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../URLS';
export const ServerIpAddress =import.meta.env.VITE_API_URL?? "http://localhost:5000";

  ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface staffItem{
    ID:number;
    nom:string;
    prenom:string;
    departement:string;
    email:string;
    team:string;
    role:string;
    type:string;
    num_tel:number;
}

interface participation{
  evenement_id:number;
  staff_id:number;
  date_debut:string;
  date_fin:string;
}

function StaffPage(){
    const navigate = useNavigate();

    const getAllStaff = async ()=>{
      try {
        setStatus(FETCH_STATUS.LOADING);
        const reponse = await fetch(`${API}/api/getAllStaff`,{
            method:"GET",
            headers:{'Content-Type':'application/json'},
            credentials:'include',
        });

        const result = await reponse.json();
        if(!result.success){
            throw({status: reponse.status,message:result.message});
        }
        
        setStaff(result.data);
        setStatus(FETCH_STATUS.SUCCESS);
      }catch (error:any) {
        console.error("error while getting upcoming events",error.message);
        toast.error(error.message);
        setStatus(FETCH_STATUS.ERROR)
      }
    }

    const getParticipation = async ()=>{
      try {
        setStatus(FETCH_STATUS.LOADING);
        const reponse = await fetch(`${API}/api/getParticipation`,{
            method:"GET",
            headers:{'Content-Type':'application/json'},
            credentials:'include',
        });

        const result = await reponse.json();
        if(!result.success){
            throw({status: reponse.status,message:result.message});
        }
        
        setParticipationData(result.data);
        setStatus(FETCH_STATUS.SUCCESS);
      }catch (error:any) {
        console.error("error while getting upcoming events",error.message);
        toast.error(error.message);
        setStatus(FETCH_STATUS.ERROR)
      }
    }
    

    const [status,setStatus] = useState(FETCH_STATUS.IDLE);
    const [staff,setStaff] = useState<staffItem[]>([]);
    const [participationData,setParticipationData] = useState<participation[]>([]);
    const [selectedStaffId,setSelectedStaffId] = useState<number>(0);
    const [totalEvents,setTotalEvents] = useState<number[]>([0,0,0,0,0,0]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filter, setFilter] = useState<string>("nom");
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 7;

    const IndexOfLastItem = itemPerPage * currentPage;
    const IndexOfFirstItem = IndexOfLastItem - itemPerPage;


    const filteredStaff = staff.filter((item)=>{
      
        switch(filter){ 
          case "nom":
            const staff_name = item.nom + " " + item.prenom;
            return(staff_name&&(staff_name).toLowerCase().includes(searchTerm.toLowerCase()));
          case "email":
            return(item.email&&(item.email).toLowerCase().includes(searchTerm.toLowerCase()));
          case "role":
            return(item.role&&(item.role).toLowerCase().includes(searchTerm.toLowerCase()));
          case "team":
            return(item.team&&(item.team).toLowerCase().includes(searchTerm.toLowerCase()));
          case "depatement":
            return(item.departement&&(item.departement).toLowerCase().includes(searchTerm.toLowerCase()));
          case "num_tel":
            return(item.num_tel&&String(item.num_tel).toLowerCase().includes(searchTerm.toLowerCase()));
          default:
            return(item.nom&&(item.nom).toLowerCase().includes(searchTerm.toLowerCase()));
        }
    });

    const shownStaff = filteredStaff.slice(IndexOfFirstItem,IndexOfLastItem);


    useEffect(()=>{getAllStaff()},[]);

    const BarOptions:ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '',
          },
        },
        scales: {
          x: {
            stacked: false,
          },
          y: {
            stacked: false,
          },
        },
    };
     const [barLabels, setBarLabels] = useState<string[]>([]);
     const [barData, setBarData] = useState<number[]>([]);
    
    useEffect(()=>{getParticipation()},[]);

    const getMonths = ()=>{
      const monthOrder = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];
    
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const months = [];
    
      for (let i = 5; i >=0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        months.push(monthOrder[monthIndex]);
      }
      setBarLabels(months);
    }

    const getBarData = ()=>{
      const monthCount:any = {};

      participationData.forEach((item)=>{
        if(item.staff_id === selectedStaffId){
          const month = (new Date(item.date_debut)).toLocaleString('en-US', { month: 'long' });
          if(monthCount[month]){
            monthCount[month]++;
          }else{
            monthCount[month] = 1;
          }
        }
      })
      const sortedCount = barLabels.map((month:any)=>monthCount[month]||0);
      setBarData(sortedCount);
    }

    const getTotalEvents = ()=>{
      const monthCount:any = {};
      participationData.forEach((item)=>{
        const month = (new Date(item.date_debut)).toLocaleString('en-US', { month: 'long' });
        if(monthCount[month]){
          monthCount[month]++;
        }else{
          monthCount[month] = 1;
        }
      })
      const sortedCount = barLabels.map((month:any)=>monthCount[month]||0);
      setTotalEvents(sortedCount);
      console.log("total Events : ",totalEvents);
    }

    useEffect(()=>{
      getMonths();
    },[participationData]);

    useEffect(()=>{
      getBarData();
    },[selectedStaffId,barLabels]);

    useEffect(()=>{
      getTotalEvents();
    },[participationData,barLabels]);

    const BarData = {
        labels: barLabels,
        datasets: [
          {
            label: 'Événements participés',
            data: barData,
            backgroundColor: 'rgba(0, 68, 255, 0.6)',
            barPercentage: 0.6,
            categoryPercentage: 1.0,
            grouped: false, 
          },
          {
            label: 'Total des événements',
            data: totalEvents,
            backgroundColor: 'rgba(153, 102, 255, 0.3)',
            barPercentage: 0.6,
            categoryPercentage: 1.0,
            grouped: false, 
          },
        ],
    };
    
    const DoughnutData = {
        labels: ['Disponible', 'Non disponible'],
        datasets: [
          {
            label: 'Progression',
            data: [70, 30],
            backgroundColor: [
              'rgba(75, 192, 192, 0.8)', 
              'rgba(200, 200, 200, 0.3)'  
            ],
            borderWidth: 1,
          },
        ],
      };
    
      const DoughnutOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom' as const,
          },
          title: {
            display: true,
            text: 'Aperçu de la progression',
          },
        },
        cutout: '95%',
      };

      

    return(
        <div className='staff_page'>
            <Sidebar/>
            <div className='staff_page_content'>
                <button onClick={()=>{navigate('/AddStaff')}}>+</button>
                <div className='staff_page_content_graphs'>

                    <div className='staff_page_content_bargraph'>
                        <Bar options={BarOptions} data={BarData} />
                    </div>

                    <div className='staff_page_content_circlegraph'>
                        <Doughnut data={DoughnutData} options={DoughnutOptions} />
                    </div>

                </div>
                
                <div className='staff_page_content_table'>
                <div className='staff_page_header'>
                    <h2>Personnel</h2>
                    <div className='staff_search_filter_div'>
                        <div className='staff_serch_div'>
                            <img src={searchIcon} alt="" />
                            <input 
                            type="text" 
                            placeholder='Rechercher'
                            value={searchTerm}
                            onChange={(e)=>{setSearchTerm(e.target.value)}}
                            />
                        </div>
                        <select 
                        name="filter_staff" 
                        id="filter_staff"
                        value={filter}
                        onChange={(e)=>{setFilter(e.target.value)}}
                        >
                            <option value="nom">Nom</option>
                            <option value="depatement">Département</option>
                            <option value="email">Email</option>
                            <option value="team">Équipe</option>
                            <option value="num_tel">Téléphone</option>
                        </select>
                    </div>
                </div>
                <div className='staff_page_content_table_header'>
                    <h3>Employé</h3>
                    <h3>Département</h3>
                    <h3>Numéro de téléphone</h3>
                    <h3>Email</h3>
                    <h3>Équipe</h3>
                    
                </div>
                <div className='staff_elements_div'>
                    {status === FETCH_STATUS.LOADING?<Loading/>
                    :shownStaff.map((item:any)=>(
                        <StaffElement id={item.ID} name={item.nom} surname={item.prenom} departement={item.departement} email={item.email} team={item.team_nom} tel={item.num_tel} selectedStaffId={selectedStaffId} setSelectedStaffId={setSelectedStaffId}/>
                    ))}
                </div>
                <div className='staff_page_footer'>
                        <button className='accounts_page_table_prev' onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                        <img src={arrowBack} alt="" />
                        </button>
                        <button onClick={() => setCurrentPage(1)} className={currentPage === 1 ? 'active_page_button' : ''}>1</button>
                        {(filteredStaff.length / itemPerPage) > 1 && (
                        <button onClick={() => setCurrentPage(2)} className={currentPage === 2 ? 'active_page_button' : ''}>2</button>
                        )}
                        {(filteredStaff.length / itemPerPage) > 2 && (
                        <button onClick={() => setCurrentPage(3)} className={currentPage === 3 ? 'active_page_button' : ''}>3</button>
                        )}
                        {(filteredStaff.length / itemPerPage) > 4 && <button disabled>...</button>}
                        {(filteredStaff.length / itemPerPage) > 3 && (
                        <button onClick={() => setCurrentPage(Math.floor(filteredStaff.length / itemPerPage) + 1)} className={currentPage === (Math.floor(filteredStaff.length / itemPerPage) + 1) ? 'active_page_button' : ''}>
                            {Math.floor(filteredStaff.length / itemPerPage) + 1}
                        </button>
                        )}
                        <button className='accounts_page_table_next' onClick={() => currentPage < Math.floor(filteredStaff.length / itemPerPage) + 1 && setCurrentPage(currentPage + 1)}>
                        <img src={arrowForward} alt="" />
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default StaffPage;