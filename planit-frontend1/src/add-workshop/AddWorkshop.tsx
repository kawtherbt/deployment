import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddWorkshop.css';
import Sidebar from '../sidebar/Sidebar';
import InstructorModal from './add-instructor/InstructorModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../URLS';

interface instructorsData {
  ID: number;
  nom: string;
}

export default function AddWorkshop() {
  const location = useLocation();
  const evenement_id = useRef<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (location.state && location.state.evenement_id) {
      evenement_id.current = location.state.evenement_id;
    }
  }, [location.state]);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    prix: '',
    nbr_max_invite: '',
    instructeur_id: null,
    temp_debut: '',
    temp_fin: '',
  });
  const [instructors, setInstructors] = useState<instructorsData[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInstructorDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    
    if (value === "addNewType") {
      setIsModalOpen(true);
      e.target.value = formData.instructeur_id || "";
    } else {
      handleInputChange(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format datetime values to remove timezone information
      const formatDateTime = (dateTimeStr: string) => {
        if (!dateTimeStr) return null;
        const date = new Date(dateTimeStr);
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const submitData = {
        ...formData,
        prix: Number(formData.prix),
        nbr_max_invite: Number(formData.nbr_max_invite),
        instructeur_id: formData.instructeur_id ? Number(formData.instructeur_id) : null,
        evenement_id: evenement_id.current,
        temp_debut: formatDateTime(formData.temp_debut),
        temp_fin: formatDateTime(formData.temp_fin)
      };

      const response = await fetch(`${URLS.ServerIpAddress}/api/addWorkshop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add workshop');
      }

      const result = await response.json();
      console.log('Workshop created successfully:', result);
      toast.success('Workshop created successfully!');
      
      // Reset form
      setFormData({
        nom: '',
        categorie: '',
        prix: '',
        nbr_max_invite: '',
        instructeur_id: null,
        temp_debut: '',
        temp_fin: '',
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to create workshop');
    }
  };

  const getInstructors = async () => {
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/api/getInstructorsForWorkshop`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to get instructors');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to get instructors');
      }

      setInstructors(result.data);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to fetch instructors');
    }
  };

  const handleInstructorAdded = () => {
    getInstructors();
  };

  useEffect(() => {
    getInstructors();
  }, []);

  return (
    <div className="add-workshop-dashboard-container">
      <Sidebar />
      <div className="add-workshop-main-content">
        <h1 className="add-workshop-page-title">Workshop Management</h1>
        <div className="add-workshop-form-card">
          <h2 className="add-workshop-form-subtitle">Add Workshop</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="add-workshop-form-grid">
              {/* Left Column */}
              <div>
                <div className="add-workshop-form-group">
                  <label className="add-workshop-form-label">Workshop Name</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Enter workshop name"
                    className="add-workshop-form-input large-input"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="add-workshop-form-group">
                  <label className="add-workshop-form-label">Category</label>
                  <input
                    type="text"
                    name="categorie"
                    placeholder="Enter workshop category"
                    className="add-workshop-form-input large-input"
                    value={formData.categorie}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="add-workshop-form-group">
                  <label className="add-workshop-form-label">Price</label>
                  <input
                    type="number"
                    name="prix"
                    placeholder="Enter workshop price"
                    className="add-workshop-form-input large-input"
                    value={formData.prix}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="add-workshop-form-group">
                  <label className="add-workshop-form-label">Max Participants</label>
                  <input
                    type="number"
                    name="nbr_max_invite"
                    placeholder="Enter maximum participants"
                    className="add-workshop-form-input large-input"
                    value={formData.nbr_max_invite}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="add-workshop-form-group">
                  <label className="add-workshop-form-label">Instructor</label>
                  <select 
                    id="instructeur_id" 
                    name="instructeur_id"
                    className="add-workshop-form-input large-input"
                    value={formData.instructeur_id ?? ""}
                    onChange={handleInstructorDropdownChange}
                  >
                    <option value="" disabled hidden>Select an instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.ID} value={instructor.ID}>
                        {instructor.nom}
                      </option>
                    ))}
                    <option value="addNewType">+ Add a new instructor</option>
                  </select>
                </div>

                <div className="add-workshop-form-group">
                  <label className="add-workshop-form-label">Start Time</label>
                  <input
                    type="datetime-local"
                    name="temp_debut"
                    className="add-workshop-form-input large-input"
                    value={formData.temp_debut}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="add-workshop-form-group">
                  <label className="add-workshop-form-label">End Time</label>
                  <input
                    type="datetime-local"
                    name="temp_fin"
                    className="add-workshop-form-input large-input"
                    value={formData.temp_fin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Buttons Container */}
            <div className="add-workshop-buttons-container">
              <button type="submit" className="add-workshop-submit-button">
                Create Workshop
              </button>
              <div className="add-workshop-secondary-buttons">
                <button 
                  type="button" 
                  className="add-workshop-secondary-button" 
                  onClick={() => navigate('/add-details', { state: { evenement_id: evenement_id.current } })}
                >
                  Go Back
                </button>
                <button 
                  type="button" 
                  className="add-workshop-secondary-button" 
                  onClick={() => navigate('/in-workshops', { state: { evenement_id: evenement_id.current } })}
                >
                  Check Workshops
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <InstructorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInstructorAdded={handleInstructorAdded}
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