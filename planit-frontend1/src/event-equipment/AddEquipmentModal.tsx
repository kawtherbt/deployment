import React, { useState, useEffect } from 'react';
import './AddEquipmentModal.css';
import { URLS } from '../URLS';
import { toast } from 'react-toastify';
import SubCategoryModal from '../add-equipment/add-sub_category/SubCategoryModal';
import CategoryModal from '../add-equipment/add-category/CategoryModal';
import ReserveEquipmentModal from './ReserveEquipmentModal';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  eventId: number;
}

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

interface AgencyEquipment {
  agence_id: number;
  agence_nom: string;
}

interface Agency {
  id: number;
  nom: string;
}

interface FormData {
  nom: string;
  sub_category: string;
  category: string;
  prix: string;
  type: 'loue' | 'achete';
  code_bar: string;
  RFID: string;
  details: string;
  date_achat: string;
  date_location: string;
  date_retour: string;
  quantite: string;
  agence_id: string;
}

function AddEquipmentModal({ isOpen, onClose, onSuccess, eventId }: AddEquipmentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    sub_category: '',
    category: '',
    prix: '',
    type: 'achete',
    code_bar: '',
    RFID: '',
    details: '',
    date_achat: '',
    date_location: '',
    date_retour: '',
    quantite: '1',
    agence_id: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoriesAndSubCategories, setCategoriesAndSubCategories] = useState<CategoriesAndSubCategories[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [newEquipmentId, setNewEquipmentId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    
    if (value === "addNewSubCategory") {
      setIsSubCategoryModalOpen(true);
      e.target.value = formData.sub_category || "";
    } else if(value === "addNewCategory"){
      setIsCategoryModalOpen(true);
      e.target.value = formData.category || "";
    } else {
      handleInputChange(e);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.sub_category) {
      newErrors.sub_category = 'La sous-catégorie est requise';
    }
    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }
    if (!formData.prix || Number(formData.prix) <= 0) {
      newErrors.prix = 'Le prix doit être un nombre positif';
    }
    if (!formData.quantite || Number(formData.quantite) < 1) {
      newErrors.quantite = 'La quantité doit être au moins 1';
    }

    if (formData.type === 'achete' && !formData.date_achat) {
      newErrors.date_achat = 'La date d\'achat est requise pour un équipement acheté';
    }
    if (formData.type === 'loue') {
      if (!formData.date_location) {
        newErrors.date_location = 'La date de location est requise pour un équipement loué';
      }
      if (!formData.date_retour) {
        newErrors.date_retour = 'La date de retour est requise pour un équipement loué';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      const submitData = {
        nom: formData.nom.trim(),
        sub_category: Number(formData.sub_category),
        category: Number(formData.category),
        prix: Number(formData.prix),
        type: formData.type,
        code_bar: formData.code_bar.trim() || undefined,
        RFID: formData.RFID.trim() || undefined,
        details: formData.details.trim() || undefined,
        date_achat: formData.type === 'achete' ? formData.date_achat : undefined,
        date_location: formData.type === 'loue' ? formData.date_location : undefined,
        date_retour: formData.type === 'loue' ? formData.date_retour : undefined,
        quantite: Number(formData.quantite),
        agence_id: formData.agence_id ? Number(formData.agence_id) : undefined
      };

      const response = await fetch(`${URLS.ServerIpAddress}/addEquipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add equipment');
      }

      const result = await response.json();
      
      // Reset form
      setFormData({
        nom: '',
        sub_category: '',
        category: '',
        prix: '',
        type: 'achete',
        code_bar: '',
        RFID: '',
        details: '',
        date_achat: '',
        date_location: '',
        date_retour: '',
        quantite: '1',
        agence_id: ''
      });
      setErrors({});

      toast.success('Équipement ajouté avec succès!');
      
      // Set the new equipment ID and open reserve modal
      setNewEquipmentId(result.data.ID);
      setIsReserveModalOpen(true);
      
      // Don't close the add modal yet, as we want to show the reserve modal
      // The reserve modal will handle closing both modals on success
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Échec de l\'ajout de l\'équipement');
    }
  };

  const handleSubCategoryAdded = () => {
    getCategoriesAndSubCategories();
  };

  const handleCategoryAdded = () => {
    getCategoriesAndSubCategories();
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
      toast.error('Échec de la récupération des catégories et sous-catégories');
    }
  };

  const handleCategoriesAndSubCategories = () => {
    const tempCategories: Category[] = [];
    const tempSubCategories: SubCategory[] = [];
    categoriesAndSubCategories.forEach((item: CategoriesAndSubCategories) => {
      if(item.category_id){
        tempCategories.push({id: item.category_id, nom: item.category_name});
      }
      if(item.sub_category_id){
        tempSubCategories.push({id: item.sub_category_id, nom: item.sub_category_name, category_id: item.category_id});
      }
    });
    setCategories(tempCategories);
    setSubCategories(tempSubCategories);
  };

  const handleReservationSuccess = () => {
    setIsReserveModalOpen(false);
    setNewEquipmentId(null);
    onClose();
    if (onSuccess) {
      onSuccess();
    }
  };

  const getAgencies = async () => {
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/getAvailableAgencyEquipment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch agencies');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch agencies');
      }

      // Extract unique agencies from the equipment data
      const agenciesMap = new Map<number, Agency>();
      result.data.forEach((item: AgencyEquipment) => {
        if (!agenciesMap.has(item.agence_id)) {
          agenciesMap.set(item.agence_id, {
            id: item.agence_id,
            nom: item.agence_nom
          });
        }
      });

      setAgencies(Array.from(agenciesMap.values()));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Échec de la récupération des agences');
    }
  };

  useEffect(() => {
    if (isOpen) {
      getCategoriesAndSubCategories();
      getAgencies();
    }
  }, [isOpen]);

  useEffect(() => {
    handleCategoriesAndSubCategories();
  }, [categoriesAndSubCategories]);

  if (!isOpen) return null;

  return (
    <div className="add-equipment-modal-overlay">
      <div className="add-equipment-modal-content">
        <div className="add-equipment-modal-header">
          <h2>Ajouter un équipement</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="add-equipment-form">
          <div className="form-section">
            <h3>Informations générales</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nom">Nom *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Nom de l'équipement"
                  className={errors.nom ? 'error' : ''}
                  required
                />
                {errors.nom && <span className="error-message">{errors.nom}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="type">Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="achete">Acheté</option>
                  <option value="loue">Loué</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="prix">Prix *</label>
                <input
                  type="number"
                  id="prix"
                  name="prix"
                  value={formData.prix}
                  onChange={handleInputChange}
                  placeholder="Prix en €"
                  min="0"
                  step="0.01"
                  className={errors.prix ? 'error' : ''}
                  required
                />
                {errors.prix && <span className="error-message">{errors.prix}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Catégorisation</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="category">Catégorie *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryDropdownChange}
                  className={errors.category ? 'error' : ''}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.nom}</option>
                  ))}
                  <option value="addNewCategory">+ Ajouter une catégorie</option>
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="sub_category">Sous-catégorie *</label>
                <select
                  id="sub_category"
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleCategoryDropdownChange}
                  className={errors.sub_category ? 'error' : ''}
                  required
                >
                  <option value="">Sélectionner une sous-catégorie</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>{subCategory.nom}</option>
                  ))}
                  <option value="addNewSubCategory">+ Ajouter une sous-catégorie</option>
                </select>
                {errors.sub_category && <span className="error-message">{errors.sub_category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="agence_id">Agence *</label>
                <select
                  id="agence_id"
                  name="agence_id"
                  value={formData.agence_id}
                  onChange={handleInputChange}
                  className={errors.agence_id ? 'error' : ''}
                  required
                >
                  <option value="">Sélectionner une agence</option>
                  {agencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>{agency.nom}</option>
                  ))}
                </select>
                {errors.agence_id && <span className="error-message">{errors.agence_id}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="quantite">Quantité *</label>
                <input
                  type="number"
                  id="quantite"
                  name="quantite"
                  value={formData.quantite}
                  onChange={handleInputChange}
                  placeholder="Quantité"
                  min="1"
                  className={errors.quantite ? 'error' : ''}
                  required
                />
                {errors.quantite && <span className="error-message">{errors.quantite}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Dates</h3>
            <div className="form-grid">
              {formData.type === 'achete' && (
                <div className="form-group">
                  <label htmlFor="date_achat">Date d'achat *</label>
                  <input
                    type="date"
                    id="date_achat"
                    name="date_achat"
                    value={formData.date_achat}
                    onChange={handleInputChange}
                    className={errors.date_achat ? 'error' : ''}
                    required
                  />
                  {errors.date_achat && <span className="error-message">{errors.date_achat}</span>}
                </div>
              )}

              {formData.type === 'loue' && (
                <>
                  <div className="form-group">
                    <label htmlFor="date_location">Date de location *</label>
                    <input
                      type="date"
                      id="date_location"
                      name="date_location"
                      value={formData.date_location}
                      onChange={handleInputChange}
                      className={errors.date_location ? 'error' : ''}
                      required
                    />
                    {errors.date_location && <span className="error-message">{errors.date_location}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="date_retour">Date de retour *</label>
                    <input
                      type="date"
                      id="date_retour"
                      name="date_retour"
                      value={formData.date_retour}
                      onChange={handleInputChange}
                      className={errors.date_retour ? 'error' : ''}
                      required
                    />
                    {errors.date_retour && <span className="error-message">{errors.date_retour}</span>}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Détails supplémentaires</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="code_bar">Code-barres</label>
                <input
                  type="text"
                  id="code_bar"
                  name="code_bar"
                  value={formData.code_bar}
                  onChange={handleInputChange}
                  placeholder="Code-barres"
                />
              </div>

              <div className="form-group">
                <label htmlFor="RFID">RFID</label>
                <input
                  type="text"
                  id="RFID"
                  name="RFID"
                  value={formData.RFID}
                  onChange={handleInputChange}
                  placeholder="Tag RFID"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="details">Détails</label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  placeholder="Description détaillée de l'équipement"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
              Ajouter l'équipement
            </button>
          </div>
        </form>
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

      {newEquipmentId && (
        <ReserveEquipmentModal
          isOpen={isReserveModalOpen}
          onClose={() => {
            setIsReserveModalOpen(false);
            setNewEquipmentId(null);
            onClose();
          }}
          equipmentId={newEquipmentId}
          eventId={eventId}
          onSuccess={handleReservationSuccess}
        />
      )}
    </div>
  );
}

export default AddEquipmentModal; 