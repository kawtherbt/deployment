import React, { useState } from 'react';
import './InstructorModal.css';
import { URLS } from '../../URLS';

interface InstructorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInstructorAdded: () => void;
}

interface formDataType{
    nom: string,
    address: string,
    age: number,
    num_tel: number,
    gender: string,
    description: string
}
const InstructorModal: React.FC<InstructorModalProps> = ({ isOpen, onClose, onInstructorAdded }) => {
  const [formData, setFormData] = useState<formDataType>({
    nom: '',
    address: '',
    age: 0,
    num_tel: 0,
    gender: 'male',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const submitData={...formData,age:Number(formData.age),num_tel:Number(formData.num_tel)}
        alert(JSON.stringify(submitData))
        const response = await fetch(`${URLS.ServerIpAddress}/api/addInstructor`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(submitData),
        });

        if(!response.ok) {
            throw new Error('Failed to add instructor');
        }

        const result = await response.json();
      
        if(!result.success) {
            throw({ status: response.status, message: result.message });
        }
      
        // Reset form
        setFormData({ 
            nom: '',
            address: '',
            age: 0,
            num_tel: 0,
            gender: 'male',
            description: ''
        });
        onInstructorAdded();
      
        alert('Instructor added successfully!');
        onClose();
        }catch (error) {
        console.error('Error:', error);
        alert('Failed to add instructor. Please try again.');
        } finally {
        setIsSubmitting(false);
        }
    };

  if (!isOpen) return null;

  return (
    <div className="instructor-modal-overlay">
      <div className="instructor-modal-content">
        <div className="instructor-modal-header">
          <h2>Add New Instructor</h2>
          <button className="instructor-modal-close-btn" onClick={onClose} disabled={isSubmitting}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="instructor-form-group">
            <label className="instructor-form-label">Name</label>
            <input
              type="text"
              name="nom"
              placeholder="Enter instructor name"
              className="instructor-form-input"
              value={formData.nom}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="instructor-form-group">
            <label className="instructor-form-label">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter instructor address"
              className="instructor-form-input"
              value={formData.address}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="instructor-form-row">
            <div className="instructor-form-group half-width">
              <label className="instructor-form-label">Age</label>
              <input
                type="number"
                name="age"
                placeholder="Enter age"
                className="instructor-form-input"
                value={formData.age}
                onChange={handleInputChange}
                min="18"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="instructor-form-group half-width">
              <label className="instructor-form-label">Gender</label>
              <select
                name="gender"
                className="instructor-form-input"
                value={formData.gender}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="instructor-form-group">
            <label className="instructor-form-label">Phone Number</label>
            <input
                type="text"
                name="num_tel"
                placeholder="Enter phone number"
                className="instructor-form-input"
                value={formData.num_tel}
                onChange={handleInputChange}
                pattern="\d{8,}"
                minLength={8}
                title="Phone number must be at least 8 digits"
                required
                disabled={isSubmitting}
            />
          </div>
          <div className="instructor-form-group">
            <label className="instructor-form-label">Description</label>
            <textarea
              name="description"
              placeholder="Enter instructor description, qualifications, etc."
              className="instructor-form-input instructor-textarea"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="instructor-modal-buttons">
            <button 
              type="submit" 
              className="instructor-add-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Instructor'}
            </button>
            <button 
              type="button" 
              className="instructor-cancel-btn" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorModal;