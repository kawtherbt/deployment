import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './UpdateCarModal.css';
import { toast } from 'react-toastify';

interface CarElement {
  ID: number;
  nom: string;
  matricule: string;
  nbr_place: number;
  categorie: string;
  status?: string;
  lastUsed?: string;
  mileage?: number;
}

interface UpdateCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  getCars: () => void;
  item: CarElement;
}

const UpdateCarModal: React.FC<UpdateCarModalProps> = ({ isOpen, onClose, getCars, item }) => {
  const [formData, setFormData] = useState({
    nom: '',
    matricule: '',
    nbr_place: '',
    categorie: '',
    status: 'Available'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        nom: item.nom || '',
        matricule: item.matricule || '',
        nbr_place: String(item.nbr_place) || '',
        categorie: item.categorie || '',
        status: item.status || 'Available'
      });
    }
  }, [isOpen, item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`http://localhost:5000/api/updateCar/${item.ID}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update car');
      }
      
      toast.success("Car updated successfully");
      getCars();
      onClose();
    } catch (error: any) {
      console.error("Error updating car:", error.message);
      toast.error(error.message || 'Failed to update car');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="update-car-modal">
        <div className="modal-header">
          <h2>Update Car</h2>
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
              {isLoading ? 'Updating...' : 'Update Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCarModal; 