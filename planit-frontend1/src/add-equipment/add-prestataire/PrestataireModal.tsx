import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { URLS } from '../../URLS';
import './PrestataireModal.css';
import { Prestataire } from '../../types/Prestataire';

interface PrestataireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (prestataire: Prestataire) => void;
}

export default function PrestataireModal({ isOpen, onClose, onSelect }: PrestataireModalProps) {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getAllPrestataires = async () => {
    try {
      const response = await fetch(`${URLS.ServerIpAddress}/api/getAllPrestataires`, {
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
      setPrestataires(result.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch prestataires');
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAllPrestataires();
    }
  }, [isOpen]);

  const filteredPrestataires = prestataires.filter(prestataire =>
    prestataire.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Select Prestataire</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search prestataires..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="prestataires-list">
          {filteredPrestataires.map((prestataire) => (
            <div
              key={prestataire.ID}
              className="prestataire-item"
              onClick={() => {
                onSelect(prestataire);
                onClose();
              }}
            >
              <span className="prestataire-name">{prestataire.nom}</span>
              <span className="prestataire-type">{prestataire.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 