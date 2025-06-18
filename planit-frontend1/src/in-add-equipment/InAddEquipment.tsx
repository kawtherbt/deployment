import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './InAddEquipment.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Add date formatting utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const parseDate = (dateString: string) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

function InAddEquipment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    RFID: '',
    category: '',
    type: '',
    rentalDate: '',
    returnDate: '',
    price: '',
    code_bar: '',
    fournisseur: '',
    purchaseDate: '',
    details: '',
    subcategorie: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const value = e.target.value;
    handleInputChange({
      target: { name: fieldName, value: value }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to add equipment');
      }
  
      const result = await response.json();
      toast.success('Equipment added successfully!');
      navigate('/event-equipment');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add equipment');
    }
  };

  return (
    <div className="in-add-equipment-container">
      <Sidebar />
      <div className="in-add-equipment-content">
        <h1 className="in-add-equipment-title">Add New Equipment</h1>
        
        <div className="in-add-equipment-form-card">
          <form onSubmit={handleSubmit}>
            <div className="in-add-equipment-form-grid">
              {/* Left Column */}
              <div>
                <div className="in-add-equipment-form-group">
                  <label className="in-add-equipment-form-label">Name</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Enter equipment name"
                    className="in-add-equipment-form-input"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="in-add-equipment-form-group">
                  <label className="in-add-equipment-form-label">RFID</label>
                  <input
                    type="text"
                    name="RFID"
                    placeholder="Enter RFID"
                    className="in-add-equipment-form-input"
                    value={formData.RFID}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="in-add-equipment-form-group">
                  <label className="in-add-equipment-form-label">Category</label>
                  <div className="in-add-equipment-select-wrapper">
                    <select
                      name="category"
                      className="in-add-equipment-form-select"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select category</option>
                      <option value="audio">Audio</option>
                      <option value="video">Video</option>
                      <option value="lighting">Lighting</option>
                      <option value="staging">Staging</option>
                    </select>
                    <div className="in-add-equipment-select-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="in-add-equipment-form-group">
                  <label className="in-add-equipment-form-label">Type</label>
                  <div className="in-add-equipment-select-wrapper">
                    <select
                      name="type"
                      className="in-add-equipment-form-select"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select type</option>
                      <option value="rented">Rented</option>
                      <option value="purchased">Purchased</option>
                    </select>
                    <div className="in-add-equipment-select-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="in-add-equipment-form-group">
                  <label className="in-add-equipment-form-label">Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    className="in-add-equipment-form-input"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="in-add-equipment-form-group">
                  <label className="in-add-equipment-form-label">Barcode</label>
                  <input
                    type="text"
                    name="code_bar"
                    placeholder="Enter barcode"
                    className="in-add-equipment-form-input"
                    value={formData.code_bar}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="in-add-equipment-form-group">
                  <label className="in-add-equipment-form-label">Supplier</label>
                  <input
                    type="text"
                    name="fournisseur"
                    placeholder="Enter supplier"
                    className="in-add-equipment-form-input"
                    value={formData.fournisseur}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="in-add-equipment-form-group">
                  <label className="in-add-equipment-form-label">Subcategory</label>
                  <input
                    type="text"
                    name="subcategorie"
                    placeholder="Enter subcategory"
                    className="in-add-equipment-form-input"
                    value={formData.subcategorie}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Date Fields */}
            <div className="in-add-equipment-form-grid">
              <div>
                {formData.type === 'rented' && (
                  <>
                    <div className="in-add-equipment-form-group">
                      <label className="in-add-equipment-form-label">Rental Date</label>
                      <div className="in-add-equipment-date-picker-wrapper">
                        <input
                          type="date"
                          name="rentalDate"
                          className="in-add-equipment-form-input"
                          value={formData.rentalDate}
                          onChange={(e) => handleDateInputChange(e, 'rentalDate')}
                          required
                        />
                        <Calendar className="in-add-equipment-calendar-icon" size={16} />
                      </div>
                    </div>
                    
                    <div className="in-add-equipment-form-group">
                      <label className="in-add-equipment-form-label">Return Date</label>
                      <div className="in-add-equipment-date-picker-wrapper">
                        <input
                          type="date"
                          name="returnDate"
                          className="in-add-equipment-form-input"
                          value={formData.returnDate}
                          onChange={(e) => handleDateInputChange(e, 'returnDate')}
                          required
                        />
                        <Calendar className="in-add-equipment-calendar-icon" size={16} />
                      </div>
                    </div>
                  </>
                )}

                {formData.type === 'purchased' && (
                  <div className="in-add-equipment-form-group">
                    <label className="in-add-equipment-form-label">Purchase Date</label>
                    <div className="in-add-equipment-date-picker-wrapper">
                      <input
                        type="date"
                        name="purchaseDate"
                        className="in-add-equipment-form-input"
                        value={formData.purchaseDate}
                        onChange={(e) => handleDateInputChange(e, 'purchaseDate')}
                        required
                      />
                      <Calendar className="in-add-equipment-calendar-icon" size={16} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="in-add-equipment-form-group in-add-equipment-form-group-full">
              <label className="in-add-equipment-form-label">Details</label>
              <textarea
                name="details"
                placeholder="Enter details"
                className="in-add-equipment-form-textarea"
                value={formData.details}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="in-add-equipment-form-actions">
              <button type="submit" className="in-add-equipment-submit-button">
                Add Equipment
              </button>
              <button type="button" className="in-add-equipment-cancel-button" onClick={() => navigate('/event-equipment')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default InAddEquipment; 