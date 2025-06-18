// HistoryEvent.tsx
import './HistoryEvent.css';
import morePoints from '../../assets/more_horiz_black.svg'
import { useNavigate } from 'react-router-dom';
// Define the shape of a history item
interface HistoryItem {
  ID: string;
  num_tel: number;
  client_nom: string;
  event_nom: string;
  date: string;
  type: string;
  email: string;
}


interface HistoryEventProps {
  item: HistoryItem;
  isSelected: boolean;
  onSelect: (id: string, isSelected: boolean) => void;
}

const HistoryEvent: React.FC<HistoryEventProps> = ({ item,isSelected,onSelect})=>{
  const navigate = useNavigate();
  return (
    <tr className={`history_event ${isSelected ? 'history_event--selected' : ''}`} onClick={() => {navigate(`/history-detail`,{state:{eventId:item.ID,eventInfo:item}})}}>
      <td className="history_event_checkbox_cell">
        {/*<input 
          type="checkbox" 
          checked={isSelected} 
          onChange={(e) => onSelect(item.ID, e.target.checked)}
          className="history_event_checkbox"

        />*/}
      </td>
      <td className="history_event_phone_cell">{item.num_tel}</td>
      <td className="history_event_name_cell">
        <div className="history_event_logo_name">  
          <span className="history_event_name">{item.client_nom}</span>
        </div>
      </td>
      <td className="history_event_event_cell">{item.event_nom}</td>
      <td className="history_event_date_cell">
        <div className="history_event_date_container">
          <span className="history_event_calendar_icon">📅</span>
          <span>{new Date(item.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</span>
        </div>
      </td>
      <td className="history_event_status_cell">
        <span className={`history_event_status history_event_status--${item.type}`}>
          {item.type}
        </span>
      </td>
      <td className="history_event_email_cell">{item.email}</td>
      <td className="history_event_actions_cell">
        <button 
          className="history_event_more_actions" 
        >
          <img src={morePoints} alt="..." />
        </button>
      </td>
    </tr>
  );
};

export default HistoryEvent;