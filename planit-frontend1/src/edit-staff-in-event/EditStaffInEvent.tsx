import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './EditStaffInEvent.css';
import { FETCH_STATUS } from '../fetchStatus';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  fullName: string;
  email: string;
  agency: string;
  role: string;
  startDate: string;
  endDate: string;
  salary: string;
  count?: string;
}

interface LocationState {
  staffData: {
    fullName: string;
    email: string;
    agency: string;
    role: string;
    employees?: number;
  };
  eventId?: string;
}

function EditStaffInEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<string>(FETCH_STATUS.SUCCESS);
  const [isMultiple, setIsMultiple] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    agency: '',
    role: '',
    startDate: '',
    endDate: '',
    salary: '',
    count: ''
  });

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.staffData) {
      setFormData({
        fullName: state.staffData.fullName,
        email: state.staffData.email,
        agency: state.staffData.agency,
        role: state.staffData.role,
        startDate: '',
        endDate: '',
        salary: '',
        count: state.staffData.employees?.toString() || ''
      });
      setIsMultiple(!!state.staffData.employees);
    }
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would make an API call to update the staff
      toast.success("Staff updated successfully");
      navigate('/agency-staff-in-event', { state: { eventId: location.state?.eventId } });
    } catch (error: any) {
      toast.error('Error updating staff');
    }
  };

  const handleGoBack = () => {
    navigate('/agency-staff-in-event', { state: { eventId: location.state?.eventId } });
  };

  return (
    <div className="asie-dashboard-container">
      <div className="asie-main-content">
        <h1 className="asie-page-title">Edit Staff</h1>
        <div className="asie-form-card">
          <form onSubmit={handleSubmit}>
            <div className="asie-form-grid">
              {!isMultiple && (
                <>
                  <div className="asie-form-group">
                    <label className="asie-form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="asie-form-input"
                      required
                    />
                  </div>
                  <div className="asie-form-group">
                    <label className="asie-form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="asie-form-input"
                      required
                    />
                  </div>
                  <div className="asie-form-group">
                    <label className="asie-form-label">Agency</label>
                    <input
                      type="text"
                      name="agency"
                      value={formData.agency}
                      onChange={handleInputChange}
                      className="asie-form-input"
                      required
                    />
                  </div>
                </>
              )}
              <div className="asie-form-group">
                <label className="asie-form-label">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="asie-form-input"
                  required
                />
              </div>
              <div className="asie-form-group">
                <label className="asie-form-label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="asie-form-input"
                />
              </div>
              <div className="asie-form-group">
                <label className="asie-form-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="asie-form-input"
                />
              </div>
              <div className="asie-form-group">
                <label className="asie-form-label">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="asie-form-input"
                />
              </div>
              {isMultiple && (
                <div className="asie-form-group">
                  <label className="asie-form-label">Count</label>
                  <input
                    type="number"
                    name="count"
                    value={formData.count}
                    onChange={handleInputChange}
                    className="asie-form-input"
                    placeholder="Enter count"
                    required
                  />
                </div>
              )}
            </div>

            <div className="asie-form-actions">
              <div className="asie-multiple-checkbox">
                <input
                  type="checkbox"
                  id="isMultiple"
                  checked={isMultiple}
                  onChange={(e) => setIsMultiple(e.target.checked)}
                  className="asie-checkbox-input"
                />
                <label htmlFor="isMultiple" className="asie-checkbox-label"></label>
                <span>Add Multiple Staff</span>
              </div>
              <div className="asie-button-group">
                <button type="button" className="asie-back-button" onClick={handleGoBack}>
                  Go Back
                </button>
                <button type="submit" className="asie-submit-button">
                  Update Staff
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

export default EditStaffInEvent; 