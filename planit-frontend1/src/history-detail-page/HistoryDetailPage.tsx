// src/components/EventDetails.tsx
import React, { useState, useEffect } from 'react';
import './HistoryDetailPage.css';
import { URLS } from '../URLS';
import { useLocation } from 'react-router-dom';
import { FETCH_STATUS } from '../fetchStatus';
import Sidebar from '../sidebar/Sidebar';

// Type definitions
interface EventInfo {
    event_enddate: string;
    event_address: string;
    event_description: string;
    event_edition: string;
    event_nbr_invite: number;
}

interface Equipment {
    equipment_name: string;
    details: string;
    type: string;
    category_name: string;
    sub_category_name: string;
    use_number: number;
}

interface Soiree {
    soiree_address: string;
    soiree_date: string;
    soiree_description: string;
    soiree_price: number;
}

interface Staff {
    staff_name: string;
    staff_lastname: string;
    num_tel: string;
    email: string;
    departement: string;
    role: string;
    onleave: boolean;
}

interface Transport {
    adress_depart: string;
    adress_arrive: string;
    temps_depart: string;
    prix: number;
    description: string;
    nbr_place: number;
    matricule: string;
    categorie: string;
    car_name: string;
}

interface Workshop {
    workshop_name: string;
    nbr_invite: number;
    nbr_max_invite: number;
    prix: number;
    workshop_category: string;
    temp_debut: string;
    temp_fin: string;
    instructor_name: string;
    instructor_number: string;
    instructor_description: string;
}

interface Accommodation {
    accomodation_name: string;
    address: string;
    accomodation_price: number;
    date_debut: string;
    date_fin: string;
    description: string;
    accomodation_type: string;
    capacity: number;
}

interface Break {
    id: number;
    name: string;
    start_time: string;
    duration: string;
    price_per_person: number;
    description: string;
}

interface receivedEventInfo {
    ID: number;
    event_nom: string;
    date: string;
    type: string;
    client_nom: string;
    num_tel: string;
    email: string;
}

// Updated EventData interface to handle arrays
interface EventData {
  eventInfo: EventInfo | null;
  equipment: Equipment[];
  soirees: Soiree[]; // Changed from single to array
  staff: Staff[];
  transports: Transport[]; // Changed from single to array
  workshops: Workshop[]; // Changed from single to array
  accommodations: Accommodation[]; // Changed from single to array
  breaks: Break[];
}

interface EventDetailsProps {
  eventId: number;
  eventInfosent: receivedEventInfo;
}

const HistoryDetailPage = () => {
  const location = useLocation();
  const eventId = location.state?.eventId;
  const eventInfosent = location.state?.eventInfo;
  const [eventData, setEventData] = useState<EventData>({
    eventInfo: null,
    equipment: [],
    soirees: [],
    staff: [],
    transports: [],
    workshops: [], 
    accommodations: [],
    breaks: []
  });
  const [status, setStatus] = useState<string>(FETCH_STATUS.IDLE);
  
  console.log("eventInfo", eventInfosent);
  console.log("eventId", eventId);

  const getEventInfo = async () => {
    try {
        setStatus(FETCH_STATUS.LOADING);
        const response = await fetch(`${URLS.ServerIpAddress}/getRestOfEventsHistoryData/${eventId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );
        const result = await response.json();
        if (!result.success) {
            throw ({ status: response.status, message: result.message });
        }
        const data = (result.data)[0];
        console.log("data: ",data);
        setEventData(prev => ({...prev, eventInfo: {...data, ...eventInfosent}}));
        setStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
        console.error("Error while getting event info", error);
        setStatus(FETCH_STATUS.ERROR);
    }
  }

  const getEventEquipment = async () => {
    try {
        setStatus(FETCH_STATUS.LOADING);
        const response = await fetch(`${URLS.ServerIpAddress}/getEventEquipment/${eventId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );
        const result = await response.json();
        if (!result.success) {
            throw ({ status: response.status, message: result.message });
        }
        console.log("equipment Data: ", result.data);
        setEventData(prev => ({...prev, equipment: result.data}));
        setStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
        console.error("Error while getting event equipment", error);
        setStatus(FETCH_STATUS.ERROR);
    }
  }

  const getEventStaff = async () => {
    try {
        setStatus(FETCH_STATUS.LOADING);
        const response = await fetch(`${URLS.ServerIpAddress}/getEventStaff/${eventId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );
        const result = await response.json();
        if (!result.success) {
            throw ({ status: response.status, message: result.message });
        }

        setEventData(prev => ({...prev, staff: result.data}));
        setStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
        console.error("Error while getting event staff", error);
        setStatus(FETCH_STATUS.ERROR);
    }
  }

  // Updated to handle multiple soirees
  const getEventSoirees = async () => {
    try {
        setStatus(FETCH_STATUS.LOADING);
        const response = await fetch(`${URLS.ServerIpAddress}/getEventSoiree/${eventId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );
        const result = await response.json();
        if (!result.success) {
            throw ({ status: response.status, message: result.message });
        }

        // Ensure result.data is an array
        const soireeData = Array.isArray(result.data) ? result.data : [result.data];
        setEventData(prev => ({...prev, soirees: soireeData}));
        setStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
        console.error("Error while getting event soirees", error);
        setStatus(FETCH_STATUS.ERROR);
    }
  }

  // Updated to handle multiple transports
  const getEventTransports = async () => {
    try {
        setStatus(FETCH_STATUS.LOADING);
        const response = await fetch(`${URLS.ServerIpAddress}/getEventtransport/${eventId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );
        const result = await response.json();
        if (!result.success) {
            throw ({ status: response.status, message: result.message });
        }

        // Ensure result.data is an array
        const transportData = Array.isArray(result.data) ? result.data : [result.data];
        setEventData(prev => ({...prev, transports: transportData}));
        setStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
        console.error("Error while getting event transports", error);
        setStatus(FETCH_STATUS.ERROR);
    }
  }

  // Updated to handle multiple workshops
  const getEventWorkshops = async () => {
    try {
        setStatus(FETCH_STATUS.LOADING);
        const response = await fetch(`${URLS.ServerIpAddress}/getEventWorkshops/${eventId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );
        const result = await response.json();
        if (!result.success) {
            throw ({ status: response.status, message: result.message });
        }

        // Ensure result.data is an array
        const workshopData = Array.isArray(result.data) ? result.data : [result.data];
        setEventData(prev => ({...prev, workshops: workshopData}));
        setStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
        console.error("Error while getting event workshops", error);
        setStatus(FETCH_STATUS.ERROR);
    }
  }

  // Updated to handle multiple accommodations
  const getEventAccommodations = async () => {
    try {
        setStatus(FETCH_STATUS.LOADING);
        const response = await fetch(`${URLS.ServerIpAddress}/getEventAccomodation/${eventId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );
        const result = await response.json();
        if (!result.success) {
            throw ({ status: response.status, message: result.message });
        }

        // Ensure result.data is an array
        const accommodationData = Array.isArray(result.data) ? result.data : [result.data];
        setEventData(prev => ({...prev, accommodations: accommodationData}));
        setStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
        console.error("Error while getting event accommodations", error);
        setStatus(FETCH_STATUS.ERROR);
    }
  }

  const getEventBreaks = async () => {
    try {
        setStatus(FETCH_STATUS.LOADING);
        const response = await fetch(`${URLS.ServerIpAddress}/api/getAllPausesForEvent/${eventId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );
        const result = await response.json();
        if (!result.success) {
            throw ({ status: response.status, message: result.message });
        }
        setEventData(prev => ({...prev, breaks: result.data}));
        setStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
        console.error("Error while getting event breaks", error);
        setStatus(FETCH_STATUS.ERROR);
    }
  }

  useEffect(() => {
    if(location.state?.eventId && location.state?.eventInfo){
      getEventInfo();
      getEventEquipment();
      getEventStaff();
      getEventSoirees(); // Updated function name
      getEventTransports(); // Updated function name
      getEventWorkshops(); // Updated function name
      getEventAccommodations(); // Updated function name
      getEventBreaks();
      console.log("event info data", eventData);
    }
  }, [location.state]);
  
  const handleRetry = () => {
    window.location.reload();
  };

  if (status === FETCH_STATUS.LOADING) {
    return (<>
        <Sidebar/>
        <div className="event-details-container">
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading event details...</p>
            </div>
        </div>
    </>
    );
  }

  if (status === FETCH_STATUS.ERROR) {
    return (<>
        <Sidebar/>
        <div className="event-details-container">
            <div className="error-container">
          <p className="error-message">Error while getting event info</p>
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
            </div>
        </div>
    </>
    );
  }

  return (<>
        <Sidebar/>
        <div className="event-details-container">
            <div className="event-details-wrapper">
                {/* Header */}
            <div className="event-header">
            <h1 className="event-title">Event Details</h1>
            {eventData.eventInfo && (
                <div className="event-info-grid">
                <div className="info-item">
                    <span className="icon">📅</span>
                    <span className="info-text">End Date: {eventData.eventInfo?.event_enddate ? new Date(eventData.eventInfo.event_enddate).toLocaleDateString('en-GB') : 'N/A'}</span>
                </div>
                <div className="info-item">
                    <span className="icon">📍</span>
                    <span className="info-text">Address: {eventData.eventInfo?.event_address ? eventData.eventInfo.event_address : 'N/A'}</span>
                </div>
                <div className="info-item">
                    <span className="icon">👥</span>
                    <span className="info-text">Invites: {eventData.eventInfo?.event_nbr_invite ? eventData.eventInfo.event_nbr_invite : 'N/A'}</span>
                </div>
                <div className="info-item">
                    <span className="edition-badge">{eventData.eventInfo?.event_edition ? eventData.eventInfo.event_edition : 'N/A' }</span>
                </div>
                </div>
            )}
            {eventData.eventInfo?.event_description && (
                <p className="event-description">{eventData.eventInfo?.event_description ? eventData.eventInfo.event_description : 'N/A'}</p>
            )}
            </div>

            <div className="sections-grid">
            {/* Equipment Section */}
            <div className="section-card">
                <h2 className="section-title">
                <span className="section-icon">🔧</span>
                Equipment
                </h2>
                <div className="equipment-list">
                {eventData.equipment.length > 0 ? (
                    eventData.equipment.map((item, index) => (
                    <div key={index} className="equipment-item">
                        <h3 className="equipment-name">{item.equipment_name ? item.equipment_name : 'N/A'}</h3>
                        <p className="equipment-details">{item.details ? item.details : 'N/A'}</p>
                        <div className="equipment-badges">
                        <span className="badge badge-type">{item.type ? item.type : 'N/A'}</span>
                        <span className="badge badge-category">{item.category_name ? item.category_name : 'N/A'}</span>
                        <span className="badge badge-usage">Used: {item.use_number ? item.use_number : 'N/A'}x</span>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="no-data">No equipment assigned</p>
                )}
                </div>
            </div>

            {/* Staff Section */}
            <div className="section-card">
                <h2 className="section-title">
                <span className="section-icon">👤</span>
                Staff
                </h2>
                <div className="staff-list">
                {eventData.staff.length > 0 ? (
                    eventData.staff.map((person, index) => (
                    <div key={index} className="staff-item">
                        <h3 className="staff-name">{person.staff_name ? person.staff_name : 'N/A'} {person.staff_lastname ? person.staff_lastname : 'N/A'}</h3>
                        <p className="staff-role">{person.role ? person.role : 'N/A'} - {person.departement ? person.departement : 'N/A'}</p>
                        <div className="contact-info">
                        <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <span className="contact-text">{person.num_tel ? person.num_tel : 'N/A'}</span>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">✉️</span>
                            <span className="contact-text">{person.email ? person.email : 'N/A'}</span>
                        </div>
                        </div>
                        {person.onleave && (
                        <span className="badge badge-leave">On Leave</span>
                        )}
                    </div>
                    ))
                ) : (
                    <p className="no-data">No staff assigned</p>
                )}
                </div>
            </div>

            {/* Updated Soirees Section - Now handles multiple soirees */}
            {eventData.soirees.length > 0 && (
                <div className="section-card">
                <h2 className="section-title">
                    <span className="section-icon">🌙</span>
                    Evening Events
                </h2>
                <div className="soirees-list">
                    {eventData.soirees.map((soiree, index) => (
                    <div key={index} className="soiree-item">
                        <div className="soiree-details">
                        <div className="detail-item">
                            <span className="detail-icon">📍</span>
                            <span className="detail-text">{soiree.soiree_address ? soiree.soiree_address : 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">📅</span>
                            <span className="detail-text">{soiree.soiree_date ? new Date(soiree.soiree_date).toLocaleDateString('en-GB') : 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">💰</span>
                            <span className="detail-text">${soiree.soiree_price ? soiree.soiree_price : 'N/A'}</span>
                        </div>
                        <p className="soiree-description">{soiree.soiree_description ? soiree.soiree_description : 'N/A'}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Updated Transport Section - Now handles multiple transports */}
            {eventData.transports.length > 0 && (
                <div className="section-card">
                <h2 className="section-title">
                    <span className="section-icon">🚌</span>
                    Transportation
                </h2>
                <div className="transports-list">
                    {eventData.transports.map((transport, index) => (
                    <div key={index} className="transport-item">
                        <div className="transport-details">
                        <div className="route-info">
                            <p className="route-label">Route</p>
                            <p className="route-text">{transport.adress_depart ? transport.adress_depart : 'N/A'} → {transport.adress_arrive ? transport.adress_arrive : 'N/A'}</p>
                        </div>
                        <div className="transport-grid">
                            <div className="transport-item-detail">
                            <p className="transport-label">Departure</p>
                            <p className="transport-value">{transport.temps_depart ? transport.temps_depart : 'N/A'}</p>
                            </div>
                            <div className="transport-item-detail">
                            <p className="transport-label">Price</p>
                            <p className="transport-value">${transport.prix ? transport.prix : 'N/A'}</p>
                            </div>
                            <div className="transport-item-detail">
                            <p className="transport-label">Category</p>
                            <p className="transport-value">{transport.categorie ? transport.categorie : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="vehicle-info">
                            <p className="vehicle-label">Vehicle</p>
                            <p className="vehicle-text">{transport.car_name ? transport.car_name : 'N/A'} ({transport.matricule ? transport.matricule : 'N/A' })</p>
                            <p className="capacity-text">Capacity: {transport.nbr_place ? transport.nbr_place : 'N/A'} seats</p>
                        </div>
                        <p className="transport-description">{transport.description ? transport.description : 'N/A'}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Updated Workshops Section - Now handles multiple workshops */}
            {eventData.workshops.length > 0 && (
                <div className="section-card">
                <h2 className="section-title">
                    <span className="section-icon">🎯</span>
                    Workshops
                </h2>
                <div className="workshops-list">
                    {eventData.workshops.map((workshop, index) => (
                    <div key={index} className="workshop-item">
                        <div className="workshop-details">
                        <h3 className="workshop-name">{workshop.workshop_name ? workshop.workshop_name : 'N/A'}</h3>
                        <div className="workshop-grid">
                            <div className="workshop-item-detail">
                            <p className="workshop-label">Time</p>
                            <p className="workshop-value">{workshop.temp_debut ? workshop.temp_debut : 'N/A'} - {workshop.temp_fin ? workshop.temp_fin : 'N/A'}</p>
                            </div>
                            <div className="workshop-item-detail">
                            <p className="workshop-label">Price</p>
                            <p className="workshop-value">${workshop.prix ? workshop.prix : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="participants-info">
                            <p className="participants-label">Participants</p>
                            <p className="participants-value">{workshop.nbr_invite ? workshop.nbr_invite : 'N/A'} / {workshop.nbr_max_invite ? workshop.nbr_max_invite : 'N/A'}</p>
                        </div>
                        <div className="instructor-info">
                            <p className="instructor-label">Instructor</p>
                            <p className="instructor-name">{workshop.instructor_name ? workshop.instructor_name : 'N/A'}</p>
                            <p className="instructor-phone">{workshop.instructor_number ? workshop.instructor_number : 'N/A'}</p>
                            <p className="instructor-description">{workshop.instructor_description ? workshop.instructor_description : 'N/A'}</p>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Updated Accommodations Section - Now handles multiple accommodations */}
            {eventData.accommodations.length > 0 && (
                <div className="section-card">
                <h2 className="section-title">
                    <span className="section-icon">🏨</span>
                    Accommodations
                </h2>
                <div className="accommodations-list">
                    {eventData.accommodations.map((accommodation, index) => (
                    <div key={index} className="accommodation-item">
                        <div className="accommodation-details">
                        <h3 className="accommodation-name">{accommodation.accomodation_name ? accommodation.accomodation_name : 'N/A'}</h3>
                        <div className="accommodation-info">
                            <div className="accommodation-item-detail">
                            <span className="accommodation-icon">📍</span>
                            <span className="accommodation-text">{accommodation.address ? accommodation.address : 'N/A'}</span>
                            </div>
                            <div className="accommodation-grid">
                            <div className="accommodation-detail">
                                <p className="accommodation-label">Check-in</p>
                                <p className="accommodation-value">{accommodation.date_debut ? new Date(accommodation.date_debut).toLocaleDateString('en-GB') : 'N/A'}</p>
                            </div>
                            <div className="accommodation-detail">
                                <p className="accommodation-label">Check-out</p>
                                <p className="accommodation-value">{accommodation.date_fin ? new Date(accommodation.date_fin).toLocaleDateString('en-GB') : 'N/A'}</p>
                            </div>
                            <div className="accommodation-detail">
                                <p className="accommodation-label">Price</p>
                                <p className="accommodation-value">${accommodation.accomodation_price ? accommodation.accomodation_price : 'N/A'}</p>
                            </div>
                            <div className="accommodation-detail">
                                <p className="accommodation-label">Capacity</p>
                                <p className="accommodation-value">{accommodation.capacity ? accommodation.capacity : 'N/A'} guests</p>
                            </div>
                            </div>
                            <div className="accommodation-type">
                            <span className="badge badge-accommodation">{accommodation.accomodation_type ? accommodation.accomodation_type : 'N/A'}</span>
                            </div>
                            <p className="accommodation-description">{accommodation.description ? accommodation.description : 'N/A'}</p>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}
            </div>

            {/* Breaks Section */}
            {eventData.breaks.length > 0 && (
            <div className="breaks-section">
                <h2 className="section-title">
                <span className="section-icon">⏸️</span>
                Scheduled Breaks
                </h2>
                <div className="breaks-grid">
                {eventData.breaks.map((breakItem) => (
                    <div key={breakItem.id} className="break-item">
                    <h3 className="break-name">{breakItem.name ? breakItem.name : 'N/A'}</h3>
                    <div className="break-time">
                        <span className="time-icon">🕐</span>
                        <span className="time-text">{breakItem.start_time ? breakItem.start_time : 'N/A'} ({breakItem.duration ? breakItem.duration : 'N/A'})</span>
                    </div>
                    <div className="break-price">
                        <span className="price-icon">💰</span>
                        <span className="price-text">${breakItem.price_per_person ? breakItem.price_per_person : 'N/A'} per person</span>
                    </div>
                    <p className="break-description">{breakItem.description ? breakItem.description : 'N/A'}</p>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
        </div>
    </>);
};

export default HistoryDetailPage;