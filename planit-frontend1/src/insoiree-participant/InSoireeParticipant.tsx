import React, { useState } from 'react';
import './InSoireeParticipant.css';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';

const participants = [
  {
    id: 1,
    name: "Jean Dupont",
    phone: "+33 6 12 34 56 78",
    email: "jean.dupont@email.com"
  },
  {
    id: 2,
    name: "Marie Martin",
    phone: "+33 6 87 65 43 21",
    email: "marie.martin@email.com"
  },
  {
    id: 3,
    name: "Pierre Durand",
    phone: "+33 6 11 22 33 44",
    email: "pierre.durand@email.com"
  }
];

const InSoireeParticipant = () => {
  const navigate = useNavigate();
  const { soireeId } = useParams();
  const [search, setSearch] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<Record<number, boolean>>({});

  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = filtered.length > 0 && 
    filtered.every(participant => selectedParticipants[participant.id]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const newSelected: Record<number, boolean> = {};
    
    filtered.forEach(participant => {
      newSelected[participant.id] = isChecked;
    });
    
    setSelectedParticipants(newSelected);
  };

  const handleSelectParticipant = (id: number, isChecked: boolean) => {
    setSelectedParticipants(prev => ({
      ...prev,
      [id]: isChecked
    }));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#faf7f2' }}>
      <Sidebar />
      <div className="soireeparticipant-container">
        <div className="soireeparticipant-header-row">
          <h2 className="soireeparticipant-title">Participants de la soirée</h2>
          <div className="soireeparticipant-controls">
            <button 
              className="soireeparticipant-create-btn" 
              onClick={() => alert('Create participant form would open here')}
            >
              + Add Participant
            </button>
            <input
              className="soireeparticipant-search"
              type="text"
              placeholder="Search participants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="soireeparticipant-table-wrapper">
          <table className="soireeparticipant-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <div className="soiree-checkbox-container">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      className="soiree-checkbox-input"
                    />
                    <label htmlFor="select-all" className="soiree-checkbox-label"></label>
                  </div>
                </th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((participant) => (
                <tr key={participant.id} className="soireeparticipant-row">
                  <td className="checkbox-cell">
                    <div className="soiree-checkbox-container">
                      <input
                        type="checkbox"
                        id={`participant-${participant.id}`}
                        checked={!!selectedParticipants[participant.id]}
                        onChange={(e) => handleSelectParticipant(participant.id, e.target.checked)}
                        className="soiree-checkbox-input"
                      />
                      <label 
                        htmlFor={`participant-${participant.id}`} 
                        className="soiree-checkbox-label"
                      ></label>
                    </div>
                  </td>
                  <td>{participant.name}</td>
                  <td>{participant.phone}</td>
                  <td>{participant.email}</td>
                  <td className="actions-cell">
                    <div className="actions-wrapper">
                      <span className="soireeparticipant-recycle-bin" title="Delete">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" /></svg>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="soireeparticipant-button-row">
          <button className="soireeparticipant-back-btn" onClick={() => navigate('/in-soiree')}>
            &#8592; Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default InSoireeParticipant; 