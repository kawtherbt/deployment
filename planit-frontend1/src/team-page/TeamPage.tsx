import {useEffect, useState } from 'react';
import './TeamPage.css';
import Sidebar from '../sidebar/Sidebar';
import { FETCH_STATUS } from '../fetchStatus';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search } from 'lucide-react';
import TeamElement from './team-element/TeamElement';
import deleteImg from '../assets/delete_24dp_grey.svg';
import AddTeamModal from './add-team/AddTeamModal';
import AddStaffToTeamModal from './add-staff-team/AddStaffToTeamModal';
import RemoveStaffFromTeamModal from './remove-taff-team/RemoveStaffFromTeamModal';
import arrowBack from '../assets/arrow_back_black.svg';
import arrowForward from '../assets/arrow_forward_black.svg';
import { URLS } from '../URLS';

interface Team {
    ID:number;
    nom:string;
    members:number;
    created_at : string;
    status : string;
}

interface Staff {
    ID: number;
    nom: string;
    prenom: string;
    email: string;
    num_tel: number;
    team_id:number,
    status: string;
}

interface StaffInfo {
    ID: number;
    nom: string;
    prenom: string;
}

interface TeamInfo {
    ID: number;
    nom: string;
}

interface selectedItems{
    [key:string]:boolean,
}

function TeamPage(){

    const [status,setStatus] = useState<string>(FETCH_STATUS.IDLE);
    const [teams,setTeams] = useState<Team[]>([]);
    const [staff,setStaff] = useState<Staff[]>([]);
    const [searchTerm,setSearchTerm] = useState<string>("");
    const [selectedItems,setSelectedItems] = useState<selectedItems>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddStaffToTeamModalOpen, setIsAddStaffToTeamModalOpen] = useState(false);
    const [teamId, setTeamId] = useState<number>(0)
    const [isRemoveStaffFromTeamModalOpen, setIsRemoveStaffFromTeamModalOpen] = useState(false);
    const [staffInfo, setStaffInfo] = useState<StaffInfo>({ID:0,nom:'',prenom:''});
    const [teamInfo, setTeamInfo] = useState<TeamInfo>({ID:0,nom:''});
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 7;

    const IndexOfLastItem = itemPerPage * currentPage;
    const IndexOfFirstItem = IndexOfLastItem - itemPerPage;
    

    const getTeams = async () => {
        try {
            setStatus(FETCH_STATUS.LOADING);
            const response = await fetch(`${URLS.ServerIpAddress}/getAllTeams`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
    
            const result = await response.json();
            if (!result.success) {
                console.log(result);
                throw ({ status: response.status, message: result.message });
            }
    
            setTeams(result.data);
            setStatus(FETCH_STATUS.SUCCESS);
        } catch (error: any) {
            toast.error("Error while getting teams");
            setStatus(FETCH_STATUS.ERROR);
        }
    };

    const getStaffForTeams = async () => {
        try {
            setStatus(FETCH_STATUS.LOADING);
            const response = await fetch(`${URLS.ServerIpAddress}/getAllStaffForTeams`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
    
            const result = await response.json();
            if (!result.success) {
                throw ({ status: response.status, message: result.message });
            }
    
            setStaff(result.data??[]);
            setStatus(FETCH_STATUS.SUCCESS);
        } catch (error: any) {
            toast.error("Error while getting staff");
            setStatus(FETCH_STATUS.ERROR);
        }
    };

    const deleteTeams = async (ids:number[]) => {
        try {
            console.log(ids);
            setStatus(FETCH_STATUS.LOADING);
            const response = await fetch(`${URLS.ServerIpAddress}/deleteTeam`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({"IDs":ids}),
            });
    
            const result = await response.json();
            if (!result.success) {
                throw ({ status: response.status, message: result.message });
            }
    
            setStatus(FETCH_STATUS.SUCCESS);
            toast.success("Teams deleted successfully");
            getTeams();
        } catch (error: any) {
            toast.error("Error while deleting teams");
            setStatus(FETCH_STATUS.ERROR);
        }
    };

    const handleDelete = async () => {
        let selectedClientsIds: number[] = [];
        Object.keys(selectedItems).forEach((key) => {
          if (selectedItems[key]) {
            selectedClientsIds.push(parseInt(key));
          }
        });
        if(selectedClientsIds.length > 0){
            await deleteTeams(selectedClientsIds);
        } else {
            toast.warning("No teams selected");
        }
    };

    const filteredTeams = teams.filter((item)=>{
        return(
            (item.nom).toLowerCase().includes(searchTerm.toLowerCase())||
            String(item.created_at).toLowerCase().includes(searchTerm.toLowerCase())||
            (staff?.filter((staff)=>{
                return(
                    item.ID === staff.team_id &&(
                        (staff.nom).toLowerCase().startsWith(searchTerm.toLowerCase())||
                        (staff.prenom).toLowerCase().startsWith(searchTerm.toLowerCase())||
                        (staff.email).toLowerCase().includes(searchTerm.toLowerCase())||
                        (String(staff.num_tel)).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                );
            })).length>0
        );
    });

    const shownTeams = filteredTeams.slice(IndexOfFirstItem, IndexOfLastItem);

    const handleSelectItem = (id:string,isSelected:boolean)=>{
        setSelectedItems((prev)=>({
            ...prev,
            [id]:isSelected,    
        }));
    };

    const handleSelectAll = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const isSelected = e.target.checked;
        const newSelecteditems:selectedItems = {};
        filteredTeams.forEach((value)=>{
            newSelecteditems[String(value.ID)] = isSelected;
        });

        setSelectedItems(newSelecteditems);
    };

    const isAllSelected = filteredTeams.length>0 && filteredTeams.every((item)=>(selectedItems[item.ID]));

    useEffect(() => {
        getTeams()
    }, []);

    useEffect(() => {
        getStaffForTeams();
    }, []);


    return(
        <div className='team_page'>
            <Sidebar />
            <div className='team_page_container'>
                <div className='team_page_header'>
                    <h1 className='team_page_title'>Équipes</h1>
                    <div className='team_page_search'>
                        <input
                        type="text"
                        placeholder="Rechercher"
                        className='team_page_search_input'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className='team_page_search_icon' size={20} />
                    </div>
                    <button className='team_page_add_button' onClick={() => setIsModalOpen(true)}>Ajouter une équipe</button>
                </div>

                <div className='team_page_table_container'>
                    <div className='team_page_table'>
                        <div className='team_page_table_head'>
                            <div className='team_page_checkbox_header'>
                                <input 
                                    type="checkbox" 
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    className='team_page_checkbox_header_input'
                                    id={`team_page_checkbox_header_id`}
                                />
                            </div>
                            <div className='team_page_name_header'>
                                Nom <span className='team_page_sort_icon'>↓</span>
                            </div>
                            <div className='team_page_members_header'>
                                Membres <span className='team_page_sort_icon'>↓</span>
                            </div>
                            <div className='team_page_date_header'>
                                Date <span className='team_page_sort_icon'>↓</span>
                            </div>
                            <div className='team_page_actions_header'>
                                <img src={deleteImg} alt="..." onClick={()=>{handleDelete()}}/>
                            </div>
                        </div>
                        
                        <div className='team_page_table_body'>
                            {status === FETCH_STATUS.LOADING ? (
                                <div className="team_page_loading">Chargement des données...</div>
                            ) : shownTeams.length > 0 ? (
                                shownTeams.map((item) => (
                                    <TeamElement key={item.ID} item={item} isSelected={selectedItems[item.ID]} onSelect={handleSelectItem} staff={staff} setIsAddStaffToTeamModalOpen={setIsAddStaffToTeamModalOpen} setTeamId={setTeamId} setStaffInfo={setStaffInfo} setTeamInfo={setTeamInfo} setIsRemoveStaffFromTeamModalOpen={setIsRemoveStaffFromTeamModalOpen}/>
                                ))
                            ) : (
                                <div className="team_page_no_data">Aucune donnée trouvée</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='team_page_table_footer_nav_buttons'>
                    <button className='team_page_table_prev' onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                      <img src={arrowBack} alt="" />
                    </button>
                    <button onClick={() => setCurrentPage(1)} className={currentPage === 1 ? 'active_page_button' : ''}>1</button>
                    {(filteredTeams.length / itemPerPage) > 1 && (
                      <button onClick={() => setCurrentPage(2)} className={currentPage === 2 ? 'active_page_button' : ''}>2</button>
                    )}
                    {(filteredTeams.length / itemPerPage) > 2 && (
                      <button onClick={() => setCurrentPage(3)} className={currentPage === 3 ? 'active_page_button' : ''}>3</button>
                    )}
                    {(filteredTeams.length / itemPerPage) > 4 && <button disabled>...</button>}
                    {(filteredTeams.length / itemPerPage) > 3 && (
                      <button onClick={() => setCurrentPage(Math.floor(filteredTeams.length / itemPerPage) + 1)} className={currentPage === (Math.floor(filteredTeams.length / itemPerPage) + 1) ? 'active_page_button' : ''}>
                        {Math.floor(filteredTeams.length / itemPerPage) + 1}
                      </button>
                    )}
                    <button className='team_page_table_next' onClick={() => currentPage < filteredTeams.length / itemPerPage && setCurrentPage(currentPage + 1)}>
                      <img src={arrowForward} alt="" />
                    </button>
                  </div>
            </div>

            <AddTeamModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                getTeams={getTeams}
            />

            <AddStaffToTeamModal
                isOpen={isAddStaffToTeamModalOpen}
                onClose={() => setIsAddStaffToTeamModalOpen(false)}
                getStaff={getStaffForTeams}
                teamId={teamId}
                staffList={staff}
            />

            <RemoveStaffFromTeamModal
                isOpen={isRemoveStaffFromTeamModalOpen}
                onClose={() => setIsRemoveStaffFromTeamModalOpen(false)}
                getStaff={getStaffForTeams}
                staffInfo={staffInfo}
                teamInfo={teamInfo}
            />

            <ToastContainer 
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
            />
        </div>
    );
}


export default TeamPage;