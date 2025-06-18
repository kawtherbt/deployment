import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './UpdateStaffModal.css';
import { toast } from 'react-toastify';
const API = import.meta.env.VITE_API_URL?? "http://localhost:5000";

interface StaffElement {
  ID: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  disponibility?: string;
  phone?: string;
  joinDate?: string;
}

interface UpdateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  getStaff: () => void;
  item: StaffElement;
}

const UpdateStaffModal: React.FC<UpdateStaffModalProps> = ({ isOpen, onClose, getStaff, item }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: '',
    disponibility: 'Available'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        nom: item.nom || '',
        prenom: item.prenom || '',
        email: item.email || '',
        role: item.role || '',
        disponibility: item.disponibility || 'Available'
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
      
      const response = await fetch(`${API}/updateStaff/${item.ID}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update staff');
      }
      
      toast.success("Staff updated successfully");
      getStaff();
      onClose();
    } catch (error: any) {
      console.error("Error updating staff:", error.message);
      toast.error(error.message || 'Failed to update staff');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="update-staff-modal">
        <div className="modal-header">
          <h2>Update Staff</h2>
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
              {isLoading ? 'Updating...' : 'Update Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStaffModal; 