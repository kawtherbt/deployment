import React, { useEffect, useState } from 'react';
//import { Calendar } from 'lucide-react';
import Sidebar from '../sidebar/Sidebar';
import './AddEquipment.css';
import SubCategoryModal from './add-sub_category/SubCategoryModal';
import CategoryModal from './add-category/CategoryModal';
import PrestataireModal from './add-prestataire/PrestataireModal';
import { toast, ToastContainer} from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { URLS } from '../URLS';
import { Prestataire } from '../types/Prestataire';


/*const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};*/

const parseDate = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${year}-${month}-${day}`;
};


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

export default function AddEquipment() {
  
  const location = useLocation();
  

  const [formData, setFormData] = useState({
    nom: '',
    RFID: '',
    category: '',
    type: 'achete',
    date_location: '',
    date_retour: '',
    prix: '',
    code_bar: '',
    agence_id: '',
    date_achat: '',
    details: '',
    subcategorie: '',
    quantite: 0
  });

  
  /*const [activeDatePicker, setActiveDatePicker] = useState(null);*/

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If category changes, update subcategories
    if (name === 'category') {
      const filtered = subCategories.filter(sub => sub.category_id === Number(value));
      setFilteredSubCategories(filtered);
      // Reset subcategorie when category changes
      setFormData(prev => ({ ...prev, subcategorie: '' }));
    }
  };

  /*const handleDateInputClick = (fieldName:any) => {
    setActiveDatePicker(fieldName);
  };*/

  
  /*const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const value = e.target.value;
    handleInputChange({
      target: { name: fieldName, value: value }
    });
    setActiveDatePicker(null); 
  };*/
  
  const handleCategoryDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    
    if (value === "addNewSubCategory") {
      setIsSubCategoryModalOpen(true);
      e.target.value = formData.subcategorie || "";
    } else if(value === "addNewCategory"){
      setIsCategoryModalOpen(true);
      e.target.value = formData.category || "";
    } else {
      handleInputChange(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = Object.fromEntries(Object.entries({
        ...formData,
        prix: Number(formData.prix),
        quantite: Number(formData.quantite),
        category: Number(formData.category),
        sub_category: Number(formData.subcategorie),
        agence_id: formData.agence_id ? Number(formData.agence_id) : undefined,
        date_location: formData.date_location ? parseDate(formData.date_location) : undefined,
        date_retour: formData.date_retour ? parseDate(formData.date_retour) : undefined,
        date_achat: formData.date_achat ? parseDate(formData.date_achat) : undefined,
        RFID: formData.RFID || undefined,
        code_bar: formData.code_bar || undefined,
        details: formData.details || undefined
      }).filter(([_, value]) => value !== '' && value !== null && value !== undefined));

      console.log("submitData : ", JSON.stringify(submitData, null, 2));
      const response = await fetch(`${URLS.ServerIpAddress}/api/addEquipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to add equipment');
      }
  
      const result = await response.json();
      console.log('Equipment added successfully:', result);
      
      
      setFormData({
        nom: '',
        RFID: '',
        category: '',
        type: '',
        date_location: '',
        date_retour: '',
        prix: '',
        code_bar: '',
        agence_id: '',
        subcategorie: '',
        date_achat: '',
        details: '',
        quantite: 0
      });
  
      toast.success('Équipement ajouté avec succès!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Échec de l\'ajout de l\'équipement');
    }
  };

  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPrestataireModalOpen, setIsPrestataireModalOpen] = useState(false);
  const [selectedPrestataire, setSelectedPrestataire] = useState<Prestataire | null>(null);

  const handleSubCategoryAdded = () => {
    getCategoriesAndSubCategories();
  };

  const handleCategoryAdded = () => {
    getCategoriesAndSubCategories();
  };
  


  const [categoriesAndSubCategories, setCategoriesAndSubCategories] = useState<CategoriesAndSubCategories[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);

  const getCategoriesAndSubCategories = async () => {
    try {

      const response = await fetch(`${URLS.ServerIpAddress}/api/getCategory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to add equipment');
      }
  
      const result = await response.json();

      setCategoriesAndSubCategories(result.data);
      console.log(result.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Échec de la récupération des catégories et sous-catégories');
    }
  };

  const handleCategoriesAndSubCategories = () => {
    const tempCategories:Category[] = [];
    const tempSubCategories:SubCategory[] = [];
    categoriesAndSubCategories.forEach((item:CategoriesAndSubCategories) => {
      if(item.category_id){
        tempCategories.push({id:item.category_id,nom:item.category_name});
      }
      if(item.sub_category_id){
        tempSubCategories.push({id:item.sub_category_id,nom:item.sub_category_name,category_id:item.category_id})
      }
  });
  console.log(tempCategories);
  console.log(tempSubCategories);
    setCategories(tempCategories);
    setSubCategories(tempSubCategories);
  }

  useEffect(() => {
    getCategoriesAndSubCategories();
  }, []);

  useEffect(() => {
    handleCategoriesAndSubCategories();
  }, [categoriesAndSubCategories]);

  useEffect(() => {
    if(location.state && location.state.item) {
      setFormData({
        nom: location.state.item.nom,
        RFID: location.state.item.RFID,
        category: location.state.item.category_id,
        type: location.state.item.type,
        date_location: location.state.item.date_location,
        date_retour: location.state.item.date_retour,
        prix: location.state.item.prix,
        code_bar: location.state.item.code_bar,
        agence_id: location.state.item.agence_id,
        subcategorie: location.state.item.sub_category_id,
        date_achat: location.state.item.date_achat,
        details: location.state.item.details,
        quantite: location.state.item.quantite
      });
    }
    console.log(location.state);
  }, [location.state]);

  const handlePrestataireSelect = (prestataire: Prestataire) => {
    setSelectedPrestataire(prestataire);
    setFormData(prev => ({ ...prev, agence_id: prestataire.ID.toString() }));
  };

  return (
    <div className="dashboard-container">
      
      <Sidebar/>
      {/* Main Content */}
      <div className="main-content">
        <h1 className="page-title">Équipement</h1>
        
        {/* Equipment Form Card */}
        <div className="form-card">
          <h2 className="form-title">Ajouter un équipement</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Left Column */}
              <div>
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Sélectionner un nom"
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
                    placeholder="Sélectionner un RFID"
                    className="form-input"
                    value={formData.RFID}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">category</label>
                  <div className="select-wrapper">
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleCategoryDropdownChange}
                      required
                    >
                      <option value="" disabled>Select category</option>
                      {categories.map((category:Category) => (
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
                  <label className="form-label">type</label>
                  <div className="select-wrapper">
                    <select
                      name="type"
                      className="form-select"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select type</option>
                      <option value="loue">Rented</option>
                      <option value="achete">Purchased</option>
                    </select>
                    <div className="select-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Show purchase date only if type is 'achete' or not selected */}
                {(formData.type === 'achete') && (
                  <div className="form-group">
                    <label className="form-label">purchase date</label>
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
                
                {/* Show rental date and return date only if type is 'rented' or not selected */}
                {(formData.type === 'loue') && (
                  <>
                    <div className="form-group">
                      <label className="form-label">rental date</label>
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
                    
                    <div className="form-group">
                      <label className="form-label">return date</label>
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
                  </>
                )}
              </div>
              
              {/* Right Column */}
              <div>
                <div className="form-group">
                  <label className="form-label">prix</label>
                  <input
                    type="number"
                    name="prix"
                    placeholder="Select prix"
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
                    placeholder="Select barcode"
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
                  <label className="form-label">sub_category</label>
                  <div className="select-wrapper">
                    <select
                      name="subcategorie"
                      className="form-select"
                      value={formData.subcategorie}
                      onChange={handleCategoryDropdownChange}
                    >
                      <option value="" disabled>Select sub-category</option>
                      {filteredSubCategories.map((subCategory:SubCategory) => (
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

                <div className="form-group">
                  <label className="form-label">quantite</label>
                  <input
                    type="number"
                    name="quantite"
                    placeholder="Select quantite"
                    className="form-input"
                    value={formData.quantite}
                    onChange={handleInputChange}
                  />
                </div>


                
              </div>
            </div>
            
            {/* Specific Details - Full Width */}
            <div className="form-group">
              <label className="form-label">Specific details</label>
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
                + Add equipment
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