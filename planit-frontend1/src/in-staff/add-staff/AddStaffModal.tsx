import React, { useState } from 'react';
import { X } from 'lucide-react';
import './AddStaffModal.css';
import { toast } from 'react-toastify';
export const ServerIpAddress = import.meta.env.VITE_API_URL?? "http://localhost:5000";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  getStaff: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, getStaff }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: '',
    disponibility: 'Available'
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
      
      const response = await fetch(`${API}/addStaff`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to add staff');
      }
      
      toast.success("Staff added successfully");
      getStaff();
      onClose();
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        role: '',
        disponibility: 'Available'
      });
    } catch (error: any) {
      console.error("Error adding staff:", error.message);
      toast.error(error.message || 'Failed to add staff');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-staff-modal">
        <div className="modal-header">
          <h2>Add New Staff</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom">First Name</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="prenom">Last Name</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select a role</option>
              <option value="Manager">Manager</option>
              <option value="Driver">Driver</option>
              <option value="Guide">Guide</option>
              <option value="Coordinator">Coordinator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="disponibility">Availability</label>
            <select
              id="disponibility"
              name="disponibility"
              value={formData.disponibility}
              onChange={handleChange}
              required
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal; 