import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './CarPage.css';
import { FETCH_STATUS } from '../fetchStatus';
import CarElementComponent from './car-element/CarElement';
import arrowBack from '../assets/arrow_back_black.svg';
import arrowForward from '../assets/arrow_forward_black.svg';
import AddCarModal from './add-car/AddCarModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import deleteGreyImg from '../assets/delete_24dp_grey.svg';
import UpdateCarModal from './update-car/UpdateCarModal';
import { URLS } from '../URLS';

interface CarElement {
  ID: number;
  nom: string;
  matricule: string;
  nbr_place: number;
  categorie: string;
}

interface selectedItems {
  [key: string]: boolean;
}

function CarPage() {
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cars, setCars] = useState<CarElement[]>([]);
  const [selectedItems, setSelectedItems] = useState<selectedItems>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false); 
  const [carToUpdate , setCarToUpdate] = useState<CarElement>({
    ID: 0,
    nom: "",
    matricule: "",
    nbr_place: 0,
    categorie: "",
  });
  const itemPerPage = 7;

  const IndexOfLastItem = itemPerPage * currentPage;
  const IndexOfFirstItem = IndexOfLastItem - itemPerPage;

  const filteredCars = cars.filter((item) => {
    return (
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categorie.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const shownCars = filteredCars.slice(IndexOfFirstItem, IndexOfLastItem);

  const allSelected = shownCars.length > 0 && shownCars.every((item) => selectedItems[item.ID]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    const tempSelectedItems: selectedItems = {};

    shownCars.forEach((item) => {
      tempSelectedItems[item.ID] = isSelected;
    });
    setSelectedItems(tempSelectedItems);
  };

  const handleSelectItem = (id: number, isSelected: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: isSelected,
    }));
  };

  useEffect(() => {
    getCars();
  }, []);

  const getCars = async () => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${URLS.ServerIpAddress}/api/getAllCars`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        throw ({ status: response.status, message: result.message });
      }

      setCars(result.data);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while getting events History", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error('Error loading cars');
    }
  };

  const deleteCars = async (ids: number[]) => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${URLS.ServerIpAddress}/api/deleteCar`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ IDs:ids }),
      });

      const result = await response.json();

      if (!result.success) {
        throw ({ status: response.status, message: result.message });
      }

      toast.success("cars deleted successfully");
      if(allSelected){
        setCurrentPage(currentPage - 1);
      }
      getCars();
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while deleting cars", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error('Error deleting cars');
    }
  };

  const handleDelete = async () => {
    let selectedCarsIds: number[] = [];
    Object.keys(selectedItems).forEach((key) => {
      if (selectedItems[key]) {
        selectedCarsIds.push(parseInt(key));
      }
    });
    if(selectedCarsIds.length > 0){
      await deleteCars(selectedCarsIds);
    }else{
      toast.warning("no cars selected");
    }

  }

  return (
    <div className='car_page'>
      <Sidebar />
      <div className='car_page_container'>
        <div className='car_page_container_header'>
          <div className='car_page_container_title'>Véhicules</div>
          <div className='car_page_container_search'>
            <Search className='car_page_search_icon' size={20} />
            <input
              type="text"
              placeholder='Rechercher'
              className='car_page_container_search_input'
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value) }}
            />
          </div>
          <div className='car_page_container_add_car'>
            <button 
              className='car_page_container_add_car_button'
              onClick={() => setIsModalOpen(true)}
            >
              Ajouter un véhicule
            </button>
          </div>
        </div>
        <div className='car_page_container_table_container'>
          <table className='car_page_container_table'>
            <thead>
              <tr>
                <th className='car_page_container_table_checkbox_header'>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className='car_page_container_table_name_header'>
                  nom
                </th>
                <th className='car_page_container_table_matricule_header'>
                  matricule
                </th>
                <th className='car_page_container_table_category_header'>
                  categorie
                </th>
                <th className='car_page_container_table_nbr_place_header'>
                  nombre des places
                </th>
                <th className='car_page_container_table_actions_header'>
                  <img src={deleteGreyImg} alt="" onClick={()=>{handleDelete()}}/>
                </th>
              </tr>
            </thead>
            <tbody>
              {status === FETCH_STATUS.LOADING ? (
                <tr>
                  <td colSpan={6} className="car_page_table_loading">Chargement des données...</td>
                </tr>
              ) : filteredCars.length > 0 ? (
                <>
                  {shownCars.map((item) => (
                    <CarElementComponent key={item.ID} item={item} isSelected={selectedItems[item.ID]} onselect={handleSelectItem} setUpdate={setCarToUpdate} setIsUpdateModalOpen={setIsUpdateModalOpen}/>
                  ))}
                  {currentPage*itemPerPage>filteredCars.length && <tr style={{height: "100%"}}></tr>}
                  
                </>              
              ) : (
                <tr>
                  <td colSpan={6} className="car_page_table_no_data">Aucun véhicule trouvé</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6}>
                  <div className='car_page_table_footer_nav_buttons'>
                    <button className='car_page_table_prev' onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                      <img src={arrowBack} alt="" />
                    </button>
                    <button onClick={() => setCurrentPage(1)} className={currentPage === 1 ? 'active_page_button' : ''}>1</button>
                    {(filteredCars.length / itemPerPage) > 1 && (
                      <button onClick={() => setCurrentPage(2)} className={currentPage === 2 ? 'active_page_button' : ''}>2</button>
                    )}
                    {(filteredCars.length / itemPerPage) > 2 && (
                      <button onClick={() => setCurrentPage(3)} className={currentPage === 3 ? 'active_page_button' : ''}>3</button>
                    )}
                    {(filteredCars.length / itemPerPage) > 4 && <button disabled>...</button>}
                    {(filteredCars.length / itemPerPage) > 3 && (
                      <button onClick={() => setCurrentPage(Math.floor(filteredCars.length / itemPerPage) + 1)} className={currentPage === (Math.floor(filteredCars.length / itemPerPage) + 1) ? 'active_page_button' : ''}>
                        {Math.floor(filteredCars.length / itemPerPage) + 1}
                      </button>
                    )}
                    <button className='car_page_table_next' onClick={() => currentPage < filteredCars.length / itemPerPage && setCurrentPage(currentPage + 1)}>
                      <img src={arrowForward} alt="" />
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <AddCarModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getCars={getCars}
      />

      <UpdateCarModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        getCars={getCars}
        item={carToUpdate}
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

export default CarPage;