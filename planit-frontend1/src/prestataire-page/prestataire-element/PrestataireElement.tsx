import React, { useEffect, useRef, useState } from 'react';
import './PrestataireElement.css';
import { MoreVertical } from 'lucide-react';

interface Prestataire {
  ID: number;
  nom: string;
  email: string;
  num_tel: string;
  address: string;
  type: string;
}

interface PrestataireElementProps {
  item: Prestataire;
  isSelected: boolean;
  onselect: (id: number, isSelected: boolean) => void;
  setUpdate: (item: Prestataire) => void;
  setIsUpdateModalOpen: (isOpen: boolean) => void;
}

const PrestataireElement: React.FC<PrestataireElementProps> = ({ item, isSelected, onselect, setUpdate, setIsUpdateModalOpen }) => {
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

  return (
    <tr className="prestataire_element">
      <td className="prestataire_element_checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onselect(item.ID, e.target.checked)}
        />
      </td>
      <td className="prestataire_element_nom">{item.nom}</td>
      <td className="prestataire_element_email">{item.email}</td>
      <td className="prestataire_element_telephone">{item.num_tel}</td>
      <td className="prestataire_element_type">{item.address}</td>
      <td className="prestataire_element_type">{item.type}</td>
      <td className="prestataire_element_actions">
        <div className="prestataire_element_dropdown" ref={dropdownRef}>
          <button
            className="prestataire_element_dropdown_button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <MoreVertical size={20} />
          </button>
          {dropdownOpen && (
            <div className="prestataire_element_dropdown_menu">
              <button onClick={handleEdit}>Modifier</button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default PrestataireElement; 