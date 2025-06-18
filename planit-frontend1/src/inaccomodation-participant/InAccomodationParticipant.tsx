import React, { useState, useEffect } from 'react';
import './InAccomodationParticipant.css';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';

// Updated mock data to include more specific accommodation types
const mockParticipantsByCategory: Record<string, Array<any>> = {
  'vip-accommodation': [
    { id: 1, name: 'Alice Smith', phone: '+33 6 12 34 56 78', start: '12/12/2023', end: '13/12/2023', type: 'Suite' },
    { id: 2, name: 'Bob Martin', phone: '+33 6 87 65 43 21', start: '12/12/2023', end: '13/12/2023', type: 'Suite' },
    { id: 9, name: 'Grace Kelly', phone: '+33 6 01 23 45 67', start: '12/12/2023', end: '13/12/2023', type: 'Suite' },
    { id: 10, name: 'Henry Ford', phone: '+33 6 98 76 54 32', start: '12/12/2023', end: '13/12/2023', type: 'Single' },
    { id: 11, name: 'Isabelle Brown', phone: '+33 6 11 22 33 44', start: '12/12/2023', end: '13/12/2023', type: 'Single' },
    { id: 12, name: 'Jack Wilson', phone: '+33 6 55 66 77 88', start: '12/12/2023', end: '13/12/2023', type: 'Single' },
    { id: 13, name: 'Kate Johnson', phone: '+33 6 99 88 77 66', start: '12/12/2023', end: '13/12/2023', type: 'Single' },
    { id: 14, name: 'Leo Martinez', phone: '+33 6 12 23 34 45', start: '12/12/2023', end: '13/12/2023', type: 'Suite' },
    { id: 15, name: 'Mia Roberts', phone: '+33 6 56 67 78 89', start: '12/12/2023', end: '13/12/2023', type: 'Suite' },
    { id: 16, name: 'Noah Lee', phone: '+33 6 90 91 92 93', start: '12/12/2023', end: '13/12/2023', type: 'Suite' },
  ],
  'user-accommodation': [
    { id: 3, name: 'Charlie Durand', phone: '+33 6 11 22 33 44', start: '12/12/2023', end: '13/12/2023', type: 'Standard' },
    { id: 4, name: 'Diane Dupuis', phone: '+33 6 22 33 44 55', start: '12/12/2023', end: '13/12/2023', type: 'Premium' },
    { id: 5, name: 'Eric Morel', phone: '+33 6 33 44 55 66', start: '12/12/2023', end: '13/12/2023', type: 'Standard' },
    { id: 17, name: 'Olivia Clark', phone: '+33 6 34 56 78 90', start: '12/12/2023', end: '13/12/2023', type: 'Standard' },
    { id: 18, name: 'Peter Kim', phone: '+33 6 45 67 89 01', start: '12/12/2023', end: '13/12/2023', type: 'Premium' },
    { id: 19, name: 'Quinn Davis', phone: '+33 6 56 78 90 12', start: '12/12/2023', end: '13/12/2023', type: 'Standard' },
  ],
  'instructors-accommodation': [
    { id: 6, name: 'Fanny Laurent', phone: '+33 6 44 55 66 77', start: '12/12/2023', end: '13/12/2023', type: 'Suite' },
    { id: 7, name: 'Gilles Petit', phone: '+33 6 55 66 77 88', start: '12/12/2023', end: '13/12/2023', type: 'Suite' },
    { id: 20, name: 'Rachel Green', phone: '+33 6 67 78 90 12', start: '12/12/2023', end: '13/12/2023', type: 'Single' },
    { id: 21, name: 'Steve Rogers', phone: '+33 6 78 90 12 34', start: '12/12/2023', end: '13/12/2023', type: 'Single' },
    { id: 22, name: 'Tony Stark', phone: '+33 6 89 01 23 45', start: '12/12/2023', end: '13/12/2023', type: 'Suite' },
  ],
};

const defaultParticipants = [
  { id: 8, name: 'Default User', phone: '+33 6 99 99 99 99', start: '12/12/2023', end: '13/12/2023', type: 'Standard' },
];

const accommodationDisplayNames: Record<string, string> = {
  'vip': 'VIP Accommodations',
  'user': 'User Accommodations',
  'instructors': 'Instructors Accommodations'
};

// Create a mapping for accommodation type styling
const accommodationTypeClass: Record<string, string> = {
  'Suite': 'suite',
  'Single': 'single',
  'Standard': 'standard',
  'Premium': 'premium'
};

const InAccomodationParticipant = () => {
  const navigate = useNavigate();
  const { accomodationId } = useParams<{ accomodationId: string }>();
  const [search, setSearch] = useState('');
  const [displayCategory, setDisplayCategory] = useState('Default Accommodations');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Determine the category key based on the accomodationId
  useEffect(() => {
    console.log("Accommodation ID:", accomodationId);
    
    // Extract the type from the ID
    if (accomodationId) {
      if (accomodationId.includes('vip')) {
        setDisplayCategory(accommodationDisplayNames['vip']);
        console.log("Setting to VIP");
      } else if (accomodationId.includes('user')) {
        setDisplayCategory(accommodationDisplayNames['user']);
        console.log("Setting to User");
      } else if (accomodationId.includes('instructors')) {
        setDisplayCategory(accommodationDisplayNames['instructors']);
        console.log("Setting to Instructors");
      }

      // Check if there's a specific type filter in the ID (like suite or single)
      if (accomodationId.includes('suite')) {
        setSelectedType('Suite');
      } else if (accomodationId.includes('single')) {
        setSelectedType('Single');
      } else if (accomodationId.includes('standard')) {
        setSelectedType('Standard');
      } else if (accomodationId.includes('premium')) {
        setSelectedType('Premium');
      }
    }
  }, [accomodationId]);

  // Determine which participants to display based on accommodation type
  const getCategoryKey = () => {
    if (accomodationId?.includes('vip')) return 'vip-accommodation';
    if (accomodationId?.includes('user')) return 'user-accommodation';
    if (accomodationId?.includes('instructors')) return 'instructors-accommodation';
    return '';
  };

  const allParticipants = mockParticipantsByCategory[getCategoryKey()] || defaultParticipants;
  
  // Filter by selected type if specified
  const typeFilteredParticipants = selectedType 
    ? allParticipants.filter(p => p.type === selectedType)
    : allParticipants;

  const filtered = typeFilteredParticipants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  // Count participants by type
  const typeCounts = allParticipants.reduce((counts: Record<string, number>, participant) => {
    const type = participant.type;
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#faf7f2' }}>
      <Sidebar />
      <div className="accomodationparticipant-container">
        <div className="accomodationparticipant-header-row">
          <h2 className="accomodationparticipant-title">
            Participants for {displayCategory}
            {selectedType && ` - ${selectedType} Type`}
            {Object.keys(typeCounts).length > 0 && (
              <span style={{ fontSize: '0.8rem', fontWeight: 'normal', marginLeft: '10px' }}>
                ({Object.entries(typeCounts).map(([type, count]) => `${count} ${type}`).join(', ')})
              </span>
            )}
          </h2>
          <input
            className="accomodationparticipant-search"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="accomodationparticipant-table-wrapper">
          <table className="accomodationparticipant-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Accommodation Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((participant) => (
                <tr key={participant.id} className="accomodationparticipant-row">
                  <td>
                    <input type="checkbox" className="accomodationparticipant-checkbox" />
                  </td>
                  <td>{participant.name}</td>
                  <td>{participant.phone}</td>
                  <td>{participant.start}</td>
                  <td>{participant.end}</td>
                  <td>
                    <span className={`accomodationparticipant-type-pill ${accommodationTypeClass[participant.type] || participant.type.toLowerCase()}`}>
                      {participant.type}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="accomodationparticipant-recycle-bin" title="Delete">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" /></svg>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="accomodationparticipant-button-row">
          <button className="accomodationparticipant-back-btn" onClick={() => navigate('/in-accomodation')}>
            &#8592; Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default InAccomodationParticipant; 