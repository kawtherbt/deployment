import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import './EventSummaryModal.css';

interface EventSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventData: {
        nom: string;
        edition?: string;
        nbr_invite: number;
        type: string;
        date_debut: Date;
        date_fin: Date;
        address: string;
        description?: string;
        client_id: number;
        ID: number;
    };
}

const EventSummaryModal: React.FC<EventSummaryModalProps> = ({ isOpen, onClose, eventData }) => {
    const navigate = useNavigate();

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAddDetails = () => {
        if (!eventData.ID) {
            toast.warning("Impossible d'accéder aux détails de l'événement: ID manquant");
            return;
        }
        navigate('/eventDetails', {
            state: { evenement_id: eventData.ID }
        });
    };

    if (!isOpen || !eventData) return null;

    return (
        <div className="event-summary-modal-overlay">
            <div className="event-summary-modal">
                <div className="event-summary-modal-header">
                    <h2>Event Created Successfully!</h2>
                    <button 
                        className="event-summary-modal-close" 
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="event-summary-content">
                    <div className="event-summary-section">
                        <h3>Event Details</h3>
                        <div className="event-summary-grid">
                            <div className="event-summary-item">
                                <label>Name:</label>
                                <span>{eventData.nom}</span>
                            </div>
                            {eventData.edition && (
                                <div className="event-summary-item">
                                    <label>Edition:</label>
                                    <span>{eventData.edition}</span>
                                </div>
                            )}
                            <div className="event-summary-item">
                                <label>Type:</label>
                                <span>{eventData.type}</span>
                            </div>
                            <div className="event-summary-item">
                                <label>Number of Guests:</label>
                                <span>{eventData.nbr_invite}</span>
                            </div>
                            <div className="event-summary-item">
                                <label>Start Date:</label>
                                <span>{formatDate(eventData.date_debut)}</span>
                            </div>
                            <div className="event-summary-item">
                                <label>End Date:</label>
                                <span>{formatDate(eventData.date_fin)}</span>
                            </div>
                            <div className="event-summary-item">
                                <label>Address:</label>
                                <span>{eventData.address}</span>
                            </div>
                            {eventData.description && (
                                <div className="event-summary-item full-width">
                                    <label>Description:</label>
                                    <span>{eventData.description}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="event-summary-actions">
                    <button 
                        className="event-summary-close-btn"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button 
                        className="event-summary-details-btn"
                        onClick={handleAddDetails}
                    >
                        Add Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventSummaryModal; 