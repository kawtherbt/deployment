import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './Eventdetails.css';

export default function Eventdetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const evenement_id = useRef<number|null>(null)

  useEffect(() => {
    if (location.state && location.state.evenement_id) {
      evenement_id.current = location.state.evenement_id;
    }
  }, [location.state]);


  const items = [
    { title: 'Staff', icon: '🫁', highlighted: true, path: '/event-staff' },
    { title: 'Equipment', icon: '👜', path: '/event-equipment' },
    { title: 'Workshops/presentations', icon: '📊', path: '/addworkshop' },
    { title: 'Location', icon: '📍', highlighted: true, path: '/location' },
    { title: 'Soirée', icon: '🎉', path: '/addSoiree' },
    { title: 'Transportation', icon: '🚗', highlighted: true, path: '/addTransport' },
    { title: 'Accommodation', icon: '🏨', path: '/addAccomodation' },
    { title: 'Break', icon: '☕', path: '/addPause' },
  ];

  const handleCardClick = (path: string) => {
    if (path === '/event-staff') {
      navigate(path, { state: { eventId: evenement_id.current } });
    } else if (path === '/event-equipment') {
      navigate(`${path}/${evenement_id.current}`);
    } else {
      navigate(path, { state: { evenement_id: evenement_id.current } });
    }
  };

  return (
    <div className="evd-dashboard-container">
      <Sidebar />
      <div className="evd-main-content">
        <h1 className="evd-page-title">Event Details</h1>
        <div className="evd-cards-grid">
          {items.map((item, idx) => (
            <button
              key={idx}
              className={`evd-card${item.highlighted ? ' evd-highlighted' : ''}`}
              onClick={() => handleCardClick(item.path)}
            >
              <div className="evd-card-icon">{item.icon}</div>
              <h3 className="evd-card-title">{item.title}</h3>
              <p className="evd-card-description">
                Click to manage {item.title.toLowerCase()} for this event
              </p>
            </button>
          ))}
        </div>
        <button className="evd-go-back-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    </div>
  );
}
