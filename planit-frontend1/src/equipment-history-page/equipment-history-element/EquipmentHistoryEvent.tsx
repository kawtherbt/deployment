// HistoryEvent.tsx
import './EquipmentHistoryEvent.css';
import morePoints from '../../assets/more_horiz_black.svg'

// Define the shape of a history item
interface EquipmentHistoryItem {
  ID: number;
  event_name: string;
  equipment_name: string;
  date_debut: string;
  date_fin: string;
  type: string;
  use_number: number;
}

interface EquipmentHistoryEventProps {
  item: EquipmentHistoryItem;
  isSelected: boolean;
  onSelect: (id: string, isSelected: boolean) => void;
}

const EquipmentHistoryEvent: React.FC<EquipmentHistoryEventProps> = ({ item, isSelected, onSelect }) => {
  return (
    <tr className={`history_event ${isSelected ? 'history_event--selected' : ''}`}>
      <td className="history_event_checkbox_cell">
        {/*<input 
          type="checkbox" 
          checked={isSelected} 
          onChange={(e) => onSelect(item.ID.toString(), e.target.checked)}
          className="history_event_checkbox"
        />*/}
      </td>
      <td className="history_event_equipment_cell">{item.equipment_name}</td>
      <td className="history_event_number_cell">{item.use_number}</td>
      <td className="history_event_type_cell">{item.type}</td>
      <td className="history_event_event_cell">{item.event_name}</td>
      <td className="history_event_date_cell">
        <div className="history_event_date_container">
          <span className="history_event_calendar_icon">📅</span>
          <span>{new Date(item.date_debut).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'})}</span>
        </div>
      </td>
      <td className="history_event_date_cell">
        <div className="history_event_date_container">
          <span className="history_event_calendar_icon">📅</span>
          <span>{new Date(item.date_fin).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'})}</span>
        </div>
      </td>
      <td className="history_event_actions_cell">
        <button className="history_event_more_actions">
          <img src={morePoints} alt="..." />
        </button>
      </td>
    </tr>
  );
};

export default EquipmentHistoryEvent;