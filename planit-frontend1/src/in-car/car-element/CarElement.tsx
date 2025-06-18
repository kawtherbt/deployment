import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit, AlertCircle } from 'lucide-react';
import './CarElement.css';

interface CarElement {
  ID: number;
  nom: string;
  matricule: string;
  nbr_place: number;
  categorie: string;
  status?: string;
}

interface CarElementProps {
  item: CarElement;
  isSelected: boolean;
  onselect: (id: number, isSelected: boolean) => void;
  setUpdate: (item: CarElement) => void;
  setIsUpdateModalOpen: (isOpen: boolean) => void;
}

const CarElement: React.FC<CarElementProps> = ({ item, isSelected, onselect, setUpdate, setIsUpdateModalOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    setUpdate(item);
    setIsUpdateModalOpen(true);
    setDropdownOpen(false);
  };

  // Determine status class for styling
  const getStatusClass = () => {
    if (!item.status) return 'status-unknown';
    
    switch (item.status.toLowerCase()) {
      case 'available':
        return 'status-available';
      case 'unavailable':
        return 'status-unavailable';
      case 'in maintenance':
        return 'status-maintenance';
      default:
        return 'status-unknown';
    }
  };

  return (
    <tr className={`car-element ${isSelected ? 'selected' : ''}`}>
      <td className='checkbox-cell'>
        <div className='in-car-checkbox-container'>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => { onselect(item.ID, e.target.checked) }}
            id={`car-${item.ID}`}
            className='in-car-checkbox-input'
          />
          <label htmlFor={`car-${item.ID}`} className='in-car-checkbox-label'></label>
        </div>
      </td>
      <td className='name-cell'>{item.nom}</td>
      <td className='plate-cell'>{item.matricule}</td>
      <td className='category-cell'>{item.categorie}</td>
      <td className='capacity-cell'>{item.nbr_place}</td>
      <td className='status-cell'>
        <span className={`status-badge ${getStatusClass()}`}>
          {item.status || 'Unknown'}
        </span>
      </td>
      <td className='actions-cell'>
        <div className='dropdown-container' ref={dropdownRef}>
          <button
            className='more-actions-button'
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="More actions"
          >
            <MoreHorizontal size={18} />
          </button>

          {dropdownOpen && (
            <div className='dropdown-menu'>
              <button className='dropdown-item' onClick={handleEdit}>
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button className='dropdown-item'>
                <AlertCircle size={16} />
                <span>Report issue</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CarElement; 