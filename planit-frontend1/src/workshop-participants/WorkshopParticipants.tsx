import React, { useState } from 'react';
import './WorkshopParticipants.css';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';

interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
}

type WorkshopParticipantsMap = {
  [key: number]: Participant[];
}

type WorkshopNamesMap = {
  [key: number]: string;
}

// Mock data for participants in different workshops
const workshopParticipants: WorkshopParticipantsMap = {
  1: [ // Basics of Mobile UX participants
    {
      id: 1,
      name: "David Miller",
      email: "david.miller@example.com",
      phone: "+33 6 12 34 56 78",
      registeredDate: "01 Dec, 2023"
    },
    {
      id: 2,
      name: "Emma Johnson",
      email: "emma.j@example.com",
      phone: "+33 6 23 45 67 89",
      registeredDate: "02 Dec, 2023"
    },
    {
      id: 3,
      name: "Robert Chen",
      email: "robert.chen@example.com",
      phone: "+33 6 34 56 78 90",
      registeredDate: "05 Dec, 2023"
    }
  ],
  2: [ // Advanced Web Design participants would go here
    {
      id: 4,
      name: "Sophie Martin",
      email: "sophie.m@example.com",
      phone: "+33 6 45 67 89 01",
      registeredDate: "01 Dec, 2023"
    },
    // More participants...
  ],
  3: [ // Introduction to AI participants would go here
    {
      id: 7,
      name: "Thomas Dupont",
      email: "thomas.d@example.com",
      phone: "+33 6 78 90 12 34",
      registeredDate: "03 Dec, 2023"
    },
    // More participants...
  ]
};

const workshopNames: WorkshopNamesMap = {
  1: "Basics of Mobile UX",
  2: "Advanced Web Design",
  3: "Introduction to AI"
};

const WorkshopParticipants = () => {
  const navigate = useNavigate();
  const { workshopId } = useParams<{ workshopId: string }>();
  const [search, setSearch] = useState('');

  // Default to workshop ID 1 if not provided
  const currentWorkshopId = workshopId ? parseInt(workshopId) : 1;
  const workshopName = workshopNames[currentWorkshopId] || "Unknown Workshop";
  
  // Get participants for the current workshop
  const participants = workshopParticipants[currentWorkshopId] || [];

  // Filter participants based on search
  const filtered = participants.filter((p: Participant) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#faf7f2' }}>
      <Sidebar />
      <div className="workshop-participants-container">
        <div className="workshop-participants-header-row">
          <h2 className="workshop-participants-title">Participants for: {workshopName}</h2>
          <input
            className="workshop-participants-search"
            type="text"
            placeholder="Search participants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="workshop-participants-table-wrapper">
          <table className="workshop-participants-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registered Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((participant: Participant) => (
                <tr key={participant.id} className="workshop-participants-row">
                  <td>
                    <input type="checkbox" className="workshop-participants-checkbox" />
                  </td>
                  <td>{participant.name}</td>
                  <td>{participant.email}</td>
                  <td>{participant.phone}</td>
                  <td>{participant.registeredDate}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <span className="workshop-participants-recycle-bin" title="Delete">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" /></svg>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="workshop-participants-button-row">
          <button className="workshop-participants-back-btn" onClick={() => navigate('/in-workshops')}>
            &#8592; Back to Workshops
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopParticipants; 