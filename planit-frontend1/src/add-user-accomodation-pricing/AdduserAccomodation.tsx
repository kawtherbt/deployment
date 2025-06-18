import React, { useEffect, useRef, useState } from 'react';
import { useNavigate ,useLocation } from 'react-router-dom';
import './AdduserAccomodation.css';
import Sidebar from '../sidebar/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FETCH_STATUS } from '../fetchStatus';
import { URLS } from '../URLS';

export default function AdduserAccomodation() {
  const navigate = useNavigate();
  const location = useLocation();
  const evenement_id = useRef<number | null>(null);

  useEffect(() => {
    if (location.state && location.state.evenement_id) {
      evenement_id.current = location.state.evenement_id;
    }
  }, [location.state]);

  const [formData, setFormData] = useState({
    nom: '',
    address: '',
    number: '',
    type: 'single',
    date_debut: '',
    date_fin: '',
    prix:0,
  });

  const [status,setStatus] = useState<string>(FETCH_STATUS.IDLE)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setStatus(FETCH_STATUS.LOADING);
      const submitData = {...formData,evenement_id:evenement_id.current,number:Number(formData.number),prix:Number(formData.prix)}
      const response = await fetch(`${URLS.ServerIpAddress}/addAccomodation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
        credentials:"include",
      });

      if(!response.ok) {
        throw new Error('Failed to add instructor');
      }

      const result = await response.json();
      console.log('Accomodation added successfully:', result);
      toast.success('Accomodation added successfully!');
      setFormData({
        nom: '',
        address: '',
        number: '',
        type: 'single',
        date_debut: '',
        date_fin: '',
        prix:0,
      });
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add accomodation');
      setStatus(FETCH_STATUS.ERROR);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="aua-dashboard-container">
      <Sidebar/>
      <div className="aua-main-content">
        <h1 className="aua-page-title">Add Accomodation</h1>
        
        <div className="aua-form-card">
          <form onSubmit={handleSubmit}>
            <div className="aua-form-grid">
              {/* Left Column */}
              <div>
                <div className="aua-form-group">
                  <label className="aua-form-label">Accomodation Name</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Enter accomodation name"
                    className="aua-form-input"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="aua-form-group">
                  <label className="aua-form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    className="aua-form-input"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="aua-form-group">
                  <label className="aua-form-label">Number</label>
                  <input
                    type="text"
                    name="number"
                    placeholder="Enter number"
                    className="aua-form-input"
                    value={formData.number}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="aua-form-group">
                  <label className="aua-form-label">Prix</label>
                  <input
                    type="text"
                    name="prix"
                    placeholder="Enter price"
                    className="aua-form-input"
                    value={formData.prix}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              

              {/* Right Column */}
              <div>
                <div className="aua-form-group">
                  <label className="aua-form-label">Type</label>
                  {/*<input
                    type="text"
                    name="type"
                    placeholder="Enter type"
                    className="aua-form-input"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  />*/}
                  <select
                    name="type"
                    className="aua-form-input"
                    value={formData.type||"single"}
                    onChange={handleSelectChange}
                    required
                    disabled={status === FETCH_STATUS.LOADING}
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>

                <div className="aua-form-group">
                  <label className="aua-form-label">Date Debut</label>
                  <input
                    type="date"
                    name="date_debut"
                    className="aua-form-input"
                    value={formData.date_debut}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="aua-form-group">
                  <label className="aua-form-label">Date Fin</label>
                  <input
                    type="date"
                    name="date_fin"
                    className="aua-form-input"
                    value={formData.date_fin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Buttons Container */}
            <div className="aua-buttons-container">
              <button type="submit" className="aua-submit-button">
                Add Accomodation
              </button>
              <div className="aua-secondary-buttons">
                <button type="button" className="aua-secondary-button" onClick={handleGoBack}>
                  Go Back
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

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