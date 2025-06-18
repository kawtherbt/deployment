import React, { useState, useEffect } from 'react';
import './UpdateEquipment.css';
import Sidebar from '../sidebar/Sidebar';
import SubCategoryModal from './add-sub_category/SubCategoryModal';
import CategoryModal from './add-category/CategoryModal';
import PrestataireModal from '../add-equipment/add-prestataire/PrestataireModal';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { URLS } from '../URLS';
import { Prestataire } from '../types/Prestataire';

interface Category {
  id: number;
  nom: string;
}

interface SubCategory {
  id: number;
  nom: string;
  category_id: number;
}

interface CategoriesAndSubCategories {
  sub_category_id: number;
  sub_category_name: string;
  category_id: number;
  category_name: string;
}

interface equipmentprops{
  equipmentIds: number[]; 
  nom: string; 
  RFID: string; 
  category_id: string; 
  type: string; 
  date_location: string; 
  date_retour: string; 
  prix: string; 
  code_bar: string; 
  agence_id: string; 
  sub_category_id: string; 
  date_achat: string; 
  details: string;
  quantite: number
}

const parseDate = (dateString: string) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

export default function UpdateEquipment() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [formData, setFormData] = useState<equipmentprops>({
    equipmentIds: state?.ids,
    nom: state?.item.nom,
    RFID: state?.item.RFID,
    category_id: state?.item.category_id,
    type: state?.item.type,
    date_location: state?.item.date_location,
    date_retour: state?.item.date_retour,
    prix: state?.item.prix,
    code_bar: state?.item.code_bar,
    agence_id: state?.item.agence_id,
    sub_category_id: state?.item.sub_category_id,
    date_achat: state?.item.date_achat,
    details: state?.item.details,
    quantite: state?.item.quantite
  });

  const [categoriesAndSubCategories, setCategoriesAndSubCategories] = useState<CategoriesAndSubCategories[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPrestataireModalOpen, setIsPrestataireModalOpen] = useState(false);
  const [selectedPrestataire, setSelectedPrestataire] = useState<Prestataire | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If category changes, update subcategories
    if (name === 'category_id') {
      const filtered = subCategories.filter(sub => sub.category_id === Number(value));
      setFilteredSubCategories(filtered);
      // Reset sub_category_id when category changes
      setFormData(prev => ({ ...prev, sub_category_id: '' }));
    }
  };

  const handleCategoryDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    
    if (value === "addNewSubCategory") {
      setIsSubCategoryModalOpen(true);
      e.target.value = formData.sub_category_id || "";
    } else if(value === "addNewCategory"){
      setIsCategoryModalOpen(true);
      e.target.value = formData.category_id || "";
    } else {
      handleInputChange(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = Object.fromEntries(Object.entries({
        ...formData,
        quantite: Number(formData.quantite),
        prix: Number(formData.prix),
        IDs: formData.equipmentIds,
        agence_id: formData.agence_id ? Number(formData.agence_id) : undefined,
        date_location: formData.date_location ? new Date(formData.date_location).getTime() : undefined,
        date_retour: formData.date_retour ? new Date(formData.date_retour).getTime() : undefined,
        date_achat: formData.date_achat ? new Date(formData.date_achat).getTime() : undefined
      }).filter(([_, value]) => value !== '' && value !== null && value !== undefined));

      console.log("formData", JSON.stringify(formData));
      console.log("submitData", JSON.stringify(submitData));
      const response = await fetch(`${URLS.ServerIpAddress}/updateEquipment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to update equipment');
      await response.json();
      setFormData({
        equipmentIds: [], 
        nom: '', 
        RFID: '', 
        category_id: '', 
        type: '', 
        date_location: '', 
        date_retour: '', 
        prix: '', 
        code_bar: '', 
        agence_id: '', 
        sub_category_id: '', 
        date_achat: '', 
        details: '',
        quantite: 0
      });
      toast.success('Equipment updated successfully!');
      navigate('/equipment');
    } catch (error: any) {
      toast.error('Failed to update equipment: ' + error.message);
    }
  };

  const getCategoriesAndSubCategories = async () => {
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/getCategory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
  
      const result = await response.json();
      setCategoriesAndSubCategories(result.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch categories and subcategories');
    }
  };

  const handleCategoriesAndSubCategories = () => {
    const tempCategories: Category[] = [];
    const tempSubCategories: SubCategory[] = [];
    
    categoriesAndSubCategories.forEach((item: CategoriesAndSubCategories) => {
      if(item.category_id && !tempCategories.some(cat => cat.id === item.category_id)) {
        tempCategories.push({id: item.category_id, nom: item.category_name});
      }
      if(item.sub_category_id) {
        tempSubCategories.push({
          id: item.sub_category_id,
          nom: item.sub_category_name,
          category_id: item.category_id
        });
      }
    });
    
    setCategories(tempCategories);
    setSubCategories(tempSubCategories);
  };

  const handleSubCategoryAdded = () => {
    getCategoriesAndSubCategories();
  };

  const handleCategoryAdded = () => {
    getCategoriesAndSubCategories();
  };

  const handlePrestataireSelect = (prestataire: Prestataire) => {
    setSelectedPrestataire(prestataire);
    setFormData(prev => ({ ...prev, agence_id: prestataire.ID.toString() }));
  };

  const getPrestataireById = async (id: string) => {
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/getAllPrestataires`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prestataires');
      }

      const result = await response.json();
      const prestataire = result.data.find((p: Prestataire) => p.ID.toString() === id);
      if (prestataire) {
        setSelectedPrestataire(prestataire);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch prestataire details');
    }
  };

  useEffect(() => {
    getCategoriesAndSubCategories();
  }, []);

  useEffect(() => {
    handleCategoriesAndSubCategories();
  }, [categoriesAndSubCategories]);

  useEffect(() => {
    if (location.state && location.state.item) {
      const type = location.state.item.type === 'loue' ? 'rented' : 'purchased';
      
      setFormData({
        equipmentIds: location.state.ids,
        nom: location.state.item.nom,
        RFID: location.state.item.RFID,
        category_id: location.state.item.category_id,
        type: type,
        date_location: location.state.item.date_location,
        date_retour: location.state.item.date_retour,
        prix: location.state.item.prix,
        code_bar: location.state.item.code_bar,
        agence_id: location.state.item.agence_id,
        sub_category_id: location.state.item.sub_category_id,
        date_achat: location.state.item.date_achat,
        details: location.state.item.details,
        quantite: location.state.item.quantite
      });

      // If there's an agence_id, fetch the prestataire details
      if (location.state.item.agence_id) {
        getPrestataireById(location.state.item.agence_id);
      }
    }
  }, [location.state]);

  // Add effect to set filtered subcategories when categories are loaded
  useEffect(() => {
    if (formData.category_id && subCategories.length > 0) {
      const filtered = subCategories.filter(sub => sub.category_id === Number(formData.category_id));
      setFilteredSubCategories(filtered);
    }
  }, [subCategories, formData.category_id]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        {/*<h1 className="page-title">Update Equipment</h1>*/}
        
        <div className="form-card">
          <h2 className="form-title">Update Equipment</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Left Column */}
              <div>
                <div className="form-group">
                  <label className="form-label">Equipment ID</label>
                  <input
                    type="text"
                    name="quantite"
                    placeholder="Enter equipment ID"
                    className="form-input"
                    value={formData.quantite}
                    onChange={handleInputChange}
                    onBlur={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Enter equipment name"
                    className="form-input"
                    value={formData.nom}
                    onChange={handleInputChange}
                    
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">RFID</label>
                  <input
                    type="text"
                    name="RFID"
                    placeholder="Enter RFID"
                    className="form-input"
                    value={formData.RFID}
                    onChange={handleInputChange}
                    
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <div className="select-wrapper">
                    <select
                      name="category_id"
                      className="form-select"
                      value={formData.category_id}
                      onChange={handleCategoryDropdownChange}
                      
                    >
                      <option value="" disabled>Select category</option>
                      {categories.map((category: Category) => (
                        <option key={category.id} value={category.id}>{category.nom}</option>
                      ))}
                      <option value="addNewCategory">+Add New category</option>
                    </select>
                    <div className="select-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <div className="select-wrapper">
                    <select
                      name="type"
                      className="form-select"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select type</option>
                      <option value="rented">Rented</option>
                      <option value="purchased">Purchased</option>
                    </select>
                    <div className="select-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {(formData.type === 'rented') && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Rental Date</label>
                      <div className="date-picker-wrapper">
                        <input
                          type="date"
                          name="date_location"
                          placeholder="Select date"
                          className="form-input"
                          value={formData.date_location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Right Column */}
              <div>
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="text"
                    name="prix"
                    placeholder="Enter price"
                    className="form-input"
                    value={formData.prix}
                    onChange={handleInputChange}
                    
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Barcode</label>
                  <input
                    type="text"
                    name="code_bar"
                    placeholder="Enter barcode"
                    className="form-input"
                    value={formData.code_bar}
                    onChange={handleInputChange}
                    
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">agence</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      name="agence_id"
                      placeholder="Select agence"
                      className="form-input"
                      value={selectedPrestataire ? selectedPrestataire.nom : ''}
                      readOnly
                      onClick={() => setIsPrestataireModalOpen(true)}
                    />
                    <button
                      type="button"
                      className="select-prestataire-button"
                      onClick={() => setIsPrestataireModalOpen(true)}
                    >
                      Select
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Sub-Category</label>
                  <div className="select-wrapper">
                    <select
                      name="sub_category_id"
                      className="form-select"
                      value={formData.sub_category_id}
                      onChange={handleCategoryDropdownChange}
                    >
                      <option value="" disabled>Select sub-category</option>
                      {filteredSubCategories.map((subCategory: SubCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>{subCategory.nom}</option>
                      ))}
                      <option value="addNewSubCategory">+Add New subcategorie</option>
                    </select>
                    <div className="select-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {(formData.type === 'rented') && (
                  <div className="form-group">
                    <label className="form-label">Return Date</label>
                    <div className="date-picker-wrapper">
                      <input
                        type="date"
                        name="date_retour"
                        placeholder="Select date"
                        className="form-input"
                        value={formData.date_retour}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
                
                {(formData.type === 'purchased') && (
                  <div className="form-group">
                    <label className="form-label">Purchase Date</label>
                    <div className="date-picker-wrapper">
                      <input
                        type="date"
                        name="date_achat"
                        placeholder="Select date"
                        className="form-input"
                        value={formData.date_achat}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Specific Details - Full Width */}
            <div className="form-group">
              <label className="form-label">Specific Details</label>
              <textarea
                name="details"
                placeholder="Details"
                rows={4}
                className="form-textarea"
                value={formData.details}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <div className="button-container">
              <button
                type="submit"
                className="submit-button"
              >
                Update Equipment
              </button>
            </div>
          </form>
        </div>
      </div>

      <SubCategoryModal 
        isOpen={isSubCategoryModalOpen}
        onClose={() => setIsSubCategoryModalOpen(false)}
        onSubCategoryAdded={handleSubCategoryAdded}
        categories={categories}
      />
      
      <CategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />

      <PrestataireModal
        isOpen={isPrestataireModalOpen}
        onClose={() => setIsPrestataireModalOpen(false)}
        onSelect={handlePrestataireSelect}
      />
      
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}