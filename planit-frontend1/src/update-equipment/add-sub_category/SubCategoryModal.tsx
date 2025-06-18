import React, { useState } from 'react';
import './SubCategoryModal.css';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';

interface SubCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubCategoryAdded: () => void;
    categories:Category[];
}

interface Category{
    id:number;
    nom:string;
}

interface formDataType{
    nom: string,
    category_id: number,

}
const SubCategoryModal: React.FC<SubCategoryModalProps> = ({ isOpen, onClose, onSubCategoryAdded, categories }) => {
  const [formData, setFormData] = useState<formDataType>({
    nom: '',
    category_id: 0,
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
        const submitData={...formData,category_id:Number(formData.category_id)}
        const response = await fetch(`${URLS.ServerIpAddress}/api/addSubCategory`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(submitData),
        });

        if(!response.ok) {
            throw new Error('Failed to add sub category');
        }

        const result = await response.json();
      
        if(!result.success) {
            throw({ status: response.status, message: result.message });
        }
      
        // Reset form
        setFormData({ 
            nom: '',
            category_id: 0,

        });
        onSubCategoryAdded();
      
        toast.success('SubCategory added successfully!');
        onClose();
        }catch (error) {
        console.error('Error:', error);
        toast.error('Failed to add SubCategory. Please try again.');
        } finally {
        setIsSubmitting(false);
        }
    };

  if (!isOpen) return null;

  return (
    <div className="sub_category-modal-overlay">
      <div className="sub_category-modal-content">
        <div className="sub_category-modal-header">
          <h2>Add New Sub Category</h2>
          <button className="sub_category-modal-close-btn" onClick={onClose} disabled={isSubmitting}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="sub_category-form-group">
            <label className="sub_category-form-label">Name</label>
            <input
              type="text"
              name="nom"
              placeholder="Enter sub category name"
              className="sub_category-form-input"
              value={formData.nom}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="sub_category-form-group half-width">
            <label className="sub_category-form-label">Category</label>
            <select
              name="category_id"
              className="sub_category-form-input"
              value={formData.category_id}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            >
              <option value="0">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.nom}</option>
              ))}
            </select>
          </div>
        
          <div className="sub_category-modal-buttons">
            <button 
              type="submit" 
              className="sub_category-add-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add sub category'}
            </button>
            <button 
              type="button" 
              className="sub_category-cancel-btn" 
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

export default SubCategoryModal;