import React, { useEffect, useState } from 'react';
import './AddStaff.css';
import Sidebar from '../sidebar/Sidebar';
import { URLS } from '../URLS';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';

export default function AddStaff() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    email: '',
    department: '',
    team: 0,
    role: '',
    privilege: ''
  });

  const Role = Cookies.get("role")??"";

  const [teams,setTeams] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData:any = {nom:formData.firstName,num_tel:Number(formData.contact),email:formData.email,department:formData.department,team_id:Number(formData.team),role:formData.role}
      if (formData.lastName.trim() !== '') {
        submitData.prenom = formData.lastName;
      }
      const response = await fetch(`${URLS.ServerIpAddress}/addStaff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
        credentials:'include',
      });
      
      const result = await response.json();
      if(!result.success){
        throw({status: response.status,message:result.message});
      }
      setFormData({ firstName: '', lastName: '', contact: '', email: '', department: '', team: 0, role: '', privilege: 'user' });
      if(teams.length > 0){
        setFormData({...formData,team:teams[0].ID});
      }
      toast.success('Staff member added successfully!');
      addAccount(result.ID);
    } catch (error: any) {
      toast.error('Failed to add staff member: ' + error.message);
    }
  };

  const addAccount = async (id:number)=>{
    try {
      const submitData={nom:(formData.firstName+" "+formData.lastName).trim(),role:formData.privilege,email:formData.email,type:"permanent",staff_id:id,status:"active"}
      console.log("account submitData:",JSON.stringify(submitData,null,2));
      const response = await fetch(`${URLS.ServerIpAddress}/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
        credentials:'include',
      });
      
      const result = await response.json();
      if(!result.success){
        throw({status: response.status,message:result.message});
      }
      setFormData({ firstName: '', lastName: '', contact: '', email: '', department: '', team: 0, role: '', privilege: 'user' });
      if(teams.length > 0){
        setFormData({...formData,team:teams[0].ID});
      }
      toast.success('account created successfully!');
    } catch (error: any) {
      console.log("account error:",JSON.stringify(error,null,2));
      toast.error('Failed to create account: ' + error.message);
    }
  }

  const getTeams = async ()=>{
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/getAllTeams`, {
        method:'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
      });
      const result = await response.json();
      if(!result.success){
        throw({status: response.status,message:result.message});
      }
      setTeams(result.data);
      if((result.data).length > 0){
        formData.team = result.data[0].ID;
      }
    } catch (error: any) {
      console.log("teams error:",JSON.stringify(error,null,2));
      toast.error('Failed to get teams: ' + error.message);
    }
  }

  useEffect(()=>{
    getTeams();
  },[]);

  return (
    <div className="asf-dashboard-container">
      <Sidebar />
      <div className="asf-main-content">
        <h1 className="asf-page-title">Ajouter un membre du personnel</h1>
        <div className="asf-form-card">
          <form onSubmit={handleSubmit}>
            <div className="asf-form-grid">
              <div>
                <div className="asf-form-group">
                  <label className="asf-form-label">Prénom</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Entrez le prénom"
                    className="asf-form-input"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="asf-form-group">
                  <label className="asf-form-label">Nom</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Entrez le nom"
                    className="asf-form-input"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <div className="asf-form-group">
                  <label className="asf-form-label">Contact</label>
                  <input
                    type="tel"
                    name="contact"
                    placeholder="Entrez le numéro de téléphone"
                    className="asf-form-input"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="asf-form-group">
                  <label className="asf-form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Entrez l'adresse email"
                    className="asf-form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <div className="asf-form-group">
                  <label className="asf-form-label">Département</label>
                  <div className="asf-select-wrapper">
                    <select
                      name="department"
                      className="asf-form-select"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Sélectionnez un département</option>
                      <option value="technical">Technique</option>
                      <option value="operations">Opérations</option>
                      <option value="management">Gestion</option>
                      <option value="logistics">Logistique</option>
                    </select>

                  </div>
                </div>
                <div className="asf-form-group">
                  <label className="asf-form-label">Équipe</label>
                  <div className="asf-select-wrapper">
                    <select
                      name="team"
                      className="asf-form-select"
                      value={formData.team}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Sélectionnez une équipe</option>
                      {teams.map((team:any)=>(
                        <option value={Number(team.ID)}>{team.nom}</option>
                      ))}
                    </select>

                  </div>
                </div>
                <div className="asf-form-group">
                  <label className="asf-form-label">Rôle</label>
                  <div className="asf-select-wrapper">
                    <select
                      name="role"
                      className="asf-form-select"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Sélectionnez un rôle</option>
                      <option value="manager">Gestionnaire</option>
                      <option value="supervisor">Superviseur</option>
                      <option value="technician">Technicien</option>
                      <option value="operator">Opérateur</option>
                    </select>

                  </div>
                </div>

                <div className="asf-form-group">
                  <label className="asf-form-label">Privilège</label>
                  <div className="asf-select-wrapper">
                    <select
                      name="privilege"
                      className="asf-form-select"
                      value={formData.privilege}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Sélectionnez un privilège</option>
                      <option value="user">Utilisateur</option>
                      <option value="super_user">Super Utilisateur</option>
                      <option value="admin">Administrateur</option>
                      <option value="super_admin">Super Administrateur</option>

                    </select>

                  </div>
                </div>
              </div>
            </div>
            <div className="asf-buttons-container">
              <button type="submit" className="asf-submit-button">
                Ajouter le membre du personnel
              </button>
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