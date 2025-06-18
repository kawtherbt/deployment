
import './AddDetails.css';
import Sidebar from '../sidebar/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Icons import - you'll need to create or import these SVG files
import staffIcon from '../assets/person_black.svg';
import equipmentIcon from '../assets/package_black.svg';
import workshopIcon from '../assets/handyman_black.svg';
import locationIcon from '../assets/location_on_black.svg';
import soireeIcon from '../assets/nightlife.svg';
import transportationIcon from '../assets/trip_black.svg';
import accommodationIcon from '../assets/hotel_black.svg';
import breakIcon from '../assets/pause_circle_black.svg';

interface CardProps {
  title: string;
  icon: string;
  color: string;
  textColor: string;
}

const Card: React.FC<CardProps> = ({ title, icon, color, textColor }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const evenement_id = location.state?.evenement_id;

  const handleClick = () => {
    if (!evenement_id) {
      toast.error('No event ID provided');
      return;
    }

    switch (title.toLowerCase()) {
      case 'break':
        navigate('/addPause', { state: { evenement_id } });
        break;
      // Add other cases as needed
      default:
        console.log('Navigation not implemented for:', title);
    }
  };

  return (
    <div className="card" style={{ backgroundColor: color }} onClick={handleClick}>
      <img src={icon} alt={title} className="card-icon" />
      <h3 style={{ color: textColor }}>{title}</h3>
      <p style={{ color: textColor }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sem velit viverra amet faucibus.
      </p>
    </div>
  );
};


const AddDetails: React.FC = () => {
    const navigate = useNavigate();
  return (
    <div className="add-details-container">
      <Sidebar />
      
      <div className="content-area">
        <div className="header">
          <span className="greeting">👋 Hello Nischal</span>
          <div className="user-info">
            <span>Nischal Gautam</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>

        <div className="cards-container">
          <div className="row">
            <Card title="Staff" icon={staffIcon} color="#6B5DE6" textColor="#FFFFFF" />
            <Card title="Equipment" icon={equipmentIcon} color="#FFFFFF" textColor="#000000" />
            <Card title="Workshops/presentations" icon={workshopIcon} color="#FFFFFF" textColor="#000000" />
            <Card title="Location" icon={locationIcon} color="#6B5DE6" textColor="#FFFFFF" />
          </div>
          
          <div className="row">
            <Card title="Soirée" icon={soireeIcon} color="#FFFFFF" textColor="#000000" />
            <Card title="transportation" icon={transportationIcon} color="#6B5DE6" textColor="#FFFFFF" />
            <Card title="Accomodation" icon={accommodationIcon} color="#FFFFFF" textColor="#000000" />
            <Card title="Break" icon={breakIcon} color="#6B5DE6" textColor="#FFFFFF" />
          </div>
        </div>

        <div className="footer">
          <button className="go-back-btn" onClick={()=>{navigate(-1)}}>← Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default AddDetails;