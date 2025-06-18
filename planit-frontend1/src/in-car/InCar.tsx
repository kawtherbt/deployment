import React, { useEffect, useState } from 'react';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../sidebar/Sidebar';
import './InCar.css';
import { FETCH_STATUS } from '../fetchStatus';
import CarElementComponent from './car-element/CarElement';
import AddCarModal from './add-car/AddCarModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateCarModal from './update-car/UpdateCarModal';

interface CarElement {
  ID: number;
  nom: string;
  matricule: string;
  nbr_place: number;
  categorie: string;
  status?: string; // Status field
}

interface SelectedItems {
  [key: string]: boolean;
}

function InCar() {
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cars, setCars] = useState<CarElement[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [carToUpdate, setCarToUpdate] = useState<CarElement>({
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

  const totalPages = Math.ceil(filteredCars.length / itemPerPage);
  const shownCars = filteredCars.slice(IndexOfFirstItem, IndexOfLastItem);
  const allSelected = shownCars.length > 0 && shownCars.every((item) => selectedItems[item.ID]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    const tempSelectedItems: SelectedItems = {};

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
      const response = await fetch("http://localhost:5000/api/getAllCars", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        throw ({ status: response.status, message: result.message });
      }

      // Enhance data with status field
      const enhancedData = result.data.map((car: CarElement) => ({
        ...car,
        status: ['Available', 'Unavailable', 'In maintenance'][Math.floor(Math.random() * 3)]
      }));

      setCars(enhancedData);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while getting cars", error.message);
      setStatus(FETCH_STATUS.ERROR);
      toast.error('Error loading cars');
    }
  };

  const deleteCars = async (ids: number[]) => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch("http://localhost:5000/api/deleteCar", {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ IDs: ids }),
      });

      const result = await response.json();

      if (!result.success) {
        throw ({ status: response.status, message: result.message });
      }

      toast.success("Cars deleted successfully");
      if (allSelected && currentPage > 1 && shownCars.length === ids.length) {
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
    if (selectedCarsIds.length > 0) {
      await deleteCars(selectedCarsIds);
    } else {
      toast.warning("No cars selected");
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end page numbers
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return (
      <div className="pagination">
        <button 
          className="pagination-arrow" 
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
        </button>
        
        {pages.map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              className={`pagination-page ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="pagination-ellipsis">{page}</span>
          )
        ))}
        
        <button 
          className="pagination-arrow" 
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className='in-car'>
      <Sidebar />
      <div className='in-car-content'>
        <header className='in-car-header'>
          <h1 className='in-car-title'>Fleet Management</h1>
          <div className='in-car-actions'>
            <div className='search-container'>
              <Search className='search-icon' size={18} />
              <input
                type="text"
                placeholder='Search cars...'
                className='search-input'
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value) }}
              />
            </div>
            <button 
              className='add-button'
              onClick={() => {}}
              title="Add Car to Event"
            >
              <Plus size={20} />
              Add Car to Event
            </button>
            <button 
              className='add-staff-button'
              onClick={() => setIsModalOpen(true)}
              title="Add Car"
            >
              <Plus size={20} />
            </button>
          </div>
        </header>

        <div className='table-container'>
          <table className='car-table'>
            <thead>
              <tr>
                <th className='in-car-checkbox-header'>
                  <div className='in-car-checkbox-container'>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      id="select-all"
                      className='in-car-checkbox-input'
                    />
                    <label htmlFor="select-all" className='in-car-checkbox-label'></label>
                  </div>
                </th>
                <th>Name</th>
                <th>License Plate</th>
                <th>Category</th>
                <th>Capacity</th>
                <th>Status</th>
                <th className='actions-header'>
                  <button className='delete-button' onClick={handleDelete} title="Delete selected">
                    <Trash2 size={18} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {status === FETCH_STATUS.LOADING ? (
                <tr>
                  <td colSpan={7} className="loading-row">
                    <div className="loading-spinner"></div>
                    <span>Loading cars...</span>
                  </td>
                </tr>
              ) : filteredCars.length > 0 ? (
                shownCars.map((item) => (
                  <CarElementComponent 
                    key={item.ID} 
                    item={item} 
                    isSelected={selectedItems[item.ID]} 
                    onselect={handleSelectItem} 
                    setUpdate={setCarToUpdate} 
                    setIsUpdateModalOpen={setIsUpdateModalOpen}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="empty-row">
                    <div className="empty-state">
                      <div className="empty-icon">🚗</div>
                      <h3>No cars found</h3>
                      <p>Try adjusting your search or add a new car</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className='in-car-footer'>
          <div className='pagination-info'>
            Showing {shownCars.length} of {filteredCars.length} cars
          </div>
          {renderPagination()}
        </footer>
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

export default InCar; 