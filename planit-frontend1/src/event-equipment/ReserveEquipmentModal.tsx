import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { URLS } from '../URLS';
import './ReserveEquipmentModal.css';

interface ReserveEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId: number;
  eventId: number;
  onSuccess: () => void;
}

function ReserveEquipmentModal({ isOpen, onClose, equipmentId, eventId, onSuccess }: ReserveEquipmentModalProps) {
  const [formData, setFormData] = useState({
    date_debut: '',
    date_fin: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventId || isNaN(eventId)) {
      console.error('Invalid event ID:', eventId);
      toast.error('Invalid event ID');
      return;
    }

    if (!equipmentId || isNaN(equipmentId)) {
      console.error('Invalid equipment ID:', equipmentId);
      toast.error('Invalid equipment ID');
      return;
    }

    if (!formData.date_debut || !formData.date_fin) {
      console.error('Missing dates:', formData);
      toast.error('Please select both start and end dates');
      return;
    }

    console.log('Submitting reservation form with data:', {
      equipement_id: equipmentId,
      evenement_id: eventId,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin
    });
    
    try {
      console.log('Sending reservation request to:', `${URLS.ServerIpAddress}/reserveEquipment`);
      const response = await fetch(`${URLS.ServerIpAddress}/reserveEquipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          equipement_id: equipmentId,
          evenement_id: eventId,
          date_debut: formData.date_debut,
          date_fin: formData.date_fin
        })
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      
      if (!result.success) {
        console.error('Reservation failed:', result.message);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
          const errorMessage = result.errors.map((err: any) => err.message).join(', ');
          throw new Error(errorMessage);
        }
        throw new Error(result.message || 'Failed to reserve equipment');
      }

      console.log('Reservation successful');
      toast.success('Equipment reserved successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error reserving equipment:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      toast.error(error.message || 'Failed to reserve equipment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Réserver l'équipement</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date_debut">Date de début</label>
            <input
              type="datetime-local"
              id="date_debut"
              name="date_debut"
              value={formData.date_debut}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date_fin">Date de fin</label>
            <input
              type="datetime-local"
              id="date_fin"
              name="date_fin"
              value={formData.date_fin}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="confirm-button">
              Confirmer
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ReserveEquipmentModal; 