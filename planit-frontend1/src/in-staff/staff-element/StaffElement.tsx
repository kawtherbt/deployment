import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit } from 'lucide-react';
import './StaffElement.css';

interface StaffElement {
  ID: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  disponibility?: string;
  phone?: string;
}

interface StaffElementProps {
  item: StaffElement;
  isSelected: boolean;
  onselect: (id: number, isSelected: boolean) => void;
  setUpdate: (item: StaffElement) => void;
  setIsUpdateModalOpen: (isOpen: boolean) => void;
}

const StaffElement: React.FC<StaffElementProps> = ({ item, isSelected, onselect, setUpdate, setIsUpdateModalOpen }) => {
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

  // Determine availability class for styling
  const getAvailabilityClass = () => {
    if (!item.disponibility) return 'availability-unknown';
    
    switch (item.disponibility.toLowerCase()) {
      case 'available':
        return 'availability-available';
      case 'unavailable':
        return 'availability-unavailable';
      case 'on leave':
        return 'availability-on-leave';
      default:
        return 'availability-unknown';
    }
  };

  return (
    <tr className={`staff-element ${isSelected ? 'selected' : ''}`}>
      <td className='checkbox-cell'>
        <div className='in-staff-checkbox-container'>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => { onselect(item.ID, e.target.checked) }}
            id={`staff-${item.ID}`}
            className='in-staff-checkbox-input'
          />
          <label htmlFor={`staff-${item.ID}`} className='in-staff-checkbox-label'></label>
        </div>
      </td>
      <td className='first-name-cell'>{item.nom}</td>
      <td className='last-name-cell'>{item.prenom}</td>
      <td className='email-cell'>{item.email}</td>
      <td className='phone-cell'>{item.phone || 'N/A'}</td>
      <td className='role-cell'>{item.role}</td>
      <td className='availability-cell'>
        <span className={`availability-badge ${getAvailabilityClass()}`}>
          {item.disponibility || 'Unknown'}
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
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default StaffElement; 