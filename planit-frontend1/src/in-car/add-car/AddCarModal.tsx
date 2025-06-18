import React, { useState } from 'react';
import { X } from 'lucide-react';
import './AddCarModal.css';
import { toast } from 'react-toastify';
const API = import.meta.env.VITE_API_URL?? "http://localhost:5000";


interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  getCars: () => void;
}

const AddCarModal: React.FC<AddCarModalProps> = ({ isOpen, onClose, getCars }) => {
  const [formData, setFormData] = useState({
    nom: '',
    matricule: '',
    nbr_place: '',
    categorie: '',
    status: 'Available'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API}/addCar`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to add car');
      }
      
      toast.success("Car added successfully");
      getCars();
      onClose();
      setFormData({
        nom: '',
        matricule: '',
        nbr_place: '',
        categorie: '',
        status: 'Available'
      });
    } catch (error: any) {
      console.error("Error adding car:", error.message);
      toast.error(error.message || 'Failed to add car');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-car-modal">
        <div className="modal-header">
          <h2>Add New Car</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom">Name</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Enter car name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="matricule">License Plate</label>
            <input
              type="text"
              id="matricule"
              name="matricule"
              value={formData.matricule}
              onChange={handleChange}
              placeholder="Enter license plate"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nbr_place">Capacity</label>
            <input
              type="number"
              id="nbr_place"
              name="nbr_place"
              value={formData.nbr_place}
              onChange={handleChange}
              placeholder="Enter number of seats"
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="categorie">Category</label>
            <select
              id="categorie"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="In maintenance">In maintenance</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarModal; 