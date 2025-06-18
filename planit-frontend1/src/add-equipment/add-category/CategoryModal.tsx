import React, { useState } from 'react';
import './CategoryModal.css';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCategoryAdded: () => void;
}

interface formDataType{
    nom: string,
}
const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onCategoryAdded }) => {
  const [formData, setFormData] = useState<formDataType>({
    nom: '',
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
        const response = await fetch(`${URLS.ServerIpAddress}/api/addCategory`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),
        });

        if(!response.ok) {
            throw new Error('Failed to add category');
        }

        const result = await response.json();
      
        if(!result.success) {
            throw({ status: response.status, message: result.message });
        }
      
        setFormData({ 
            nom: '',
        });
        onCategoryAdded();
      
        toast.success('Category added successfully!');
        onClose();
        }catch (error) {
        console.error('Error:', error);
        toast.error('Failed to add category. Please try again.');
        } finally {
        setIsSubmitting(false);
        }
    };

  if (!isOpen) return null;

  return (
    <div className="category-modal-overlay">
      <div className="category-modal-content">
        <div className="category-modal-header">
          <h2>Add New Category</h2>
          <button className="category-modal-close-btn" onClick={onClose} disabled={isSubmitting}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="category-form-group">
            <label className="category-form-label">Name</label>
            <input
              type="text"
              name="nom"
              placeholder="Enter category name"
              className="category-form-input"
              value={formData.nom}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          
          <div className="category-modal-buttons">
            <button 
              type="submit" 
              className="category-add-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add category'}
            </button>
            <button 
              type="button" 
              className="category-cancel-btn" 
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

export default CategoryModal;