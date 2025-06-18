import React, { useState, useEffect } from 'react';
import './firstpage.css';
import businessImage from '../assets/first_page_business.png';
import advertisementImage from '../assets/first_page_advertisement.png';
import digitalImage from '../assets/first_page_digital.png';
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
export const ServerIpAddress = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const FirstPage = () => {

  const user = Cookies.get('user');
  const role = Cookies.get('role');
  const userData = user ? JSON.parse(user) : null;
  const [nom, setNom] = useState(userData?.nom||'');
  const [stats, setStats] = useState({
    events: 0,
    participants: 0,
    workshops: 0
  });
  const [firstPageUpcomingEvents, setFirstPageUpcomingEvents] = useState([]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getFirstPageData = async () => {
    try {
      const response = await fetch(`${ServerIpAddress}/getFirstPageData`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      const data = (result.data)[0];

      const eventsRaw = (data.events)?.toString().trim();
      const participantsRaw = (data.participants)?.toString().trim();
      const workshopsRaw = (data.workshops)?.toString().trim();

      setStats({
        events: Number(eventsRaw) || 0,
        participants: Number(participantsRaw) || 0,
        workshops: Number(workshopsRaw) || 0
      });
      console.log("events: ", Number((data.events)?.trim()));
      console.log("eventsRaw type: ", typeof(eventsRaw));
      console.log("stats: ", JSON.stringify(stats));
    } catch (error: any) {
      console.error("Error while getting first page data:", error.message);
      toast.error("Error loading statistics");
    }
  };

  const getFirstPageUpcomingEvents = async () => {
    try {
      const response = await fetch(`${ServerIpAddress}/getUPcomingEventsFirstPage`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }
      console.log("result DATA: ",JSON.stringify(result.data));
      setFirstPageUpcomingEvents(result.data);
      console.log("FirstPageUpcomingEvents: ",JSON.stringify(firstPageUpcomingEvents));
    } catch (error: any) {
      console.error("Error while getting first page upcoming events:", error.message);
      toast.error("Error loading upcoming events");
    }
  };

  const formatTimeLeft = (timeleft: any) => {
    const days = Math.floor(timeleft.hours / 24);
    const hours = timeleft.hours % 24;

    if (days > 0) {
      return `in ${days} days`;
    } else if (hours > 0) {
      return `in ${hours} hours`;
    } else if (timeleft.minutes > 0) {
      return `in ${timeleft.minutes} minutes`;
    } else {
      return 'starting soon';
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem('nom');
    if (storedName) {
      setNom(storedName);
    }
    getFirstPageData();
    getFirstPageUpcomingEvents();
  }, []);

  return (
    <div className="first-page-container">
      <div className="top-gradient-section">
        <header>
          <div className="logo">PLAN IT</div>
          <div className="user-menu">
            <div className="avatar">{getInitials(nom)}</div>
            <span>{nom}</span>
          </div>
        </header>
      </div>
      
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">{`Welcome back, ${nom}!`}</h1>
          <p className="welcome-subtitle">Ready to discover amazing events and connect with like-minded people?</p>
        </div>
      </section>
      
      <main>
        {/* Upcoming Events Heading */}
        <a href="#" className="upcoming-events-title">Upcoming Events</a>
        
        {/* Upcoming Events Cards */}
        <div className="events-card-container">
          {firstPageUpcomingEvents.map((event: any, index: number) => (
            <a href="#" key={index} style={{ textDecoration: 'none', flex: 1 }}>
              <div className="event-card">
                <div className="days-label">{formatTimeLeft(event.timeleft)}</div>
                <div className="quote-icon">❝</div>
                <p className="event-description">{event.description}</p>
                <div className="divider"></div>
                <div className="event-info">
                  <div>
                    <div className="event-company">{event.nom}</div>
                    <div className="event-position">{event.address}</div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        {/* View All Events and Add New Event Buttons */}
        <div className="button-container">
          <a href="/upcomingEvents" className="view-all-events-btn">View All Events</a>
          <a href="/event" className="add-new-event-btn">Add New Event</a>
        </div>
        
        {/* Updated What this month has in store for you section */}
        <section className="month-stats-section">
          <h1>What this month has in store for you</h1>
          <div className="stats-container">
            <div className="stat-item">
              <svg className="stat-icon events" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM11 7h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm-4-8h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm8-8h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
              </svg>
              <div className="stat-number">{stats.events}</div>
              <div className="stat-label">events</div>
            </div>
            <div className="stat-item">
              <svg className="stat-icon visitors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <div className="stat-number">{stats.participants}</div>
              <div className="stat-label">visitors</div>
            </div>
            <div className="stat-item">
              <svg className="stat-icon workshops" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              <div className="stat-number">{stats.workshops}</div>
              <div className="stat-label">workshops</div>
            </div>
          </div>
        </section>
        
        {/* Updated Business Events Sections */}
        <section className="event-categories-section">
          <div className="event-category">
            <div className="event-illustration">
              <img src={businessImage} alt="Business networking illustration" />
            </div>
            <div className="event-details">
              <span className="category-number">5</span>
              <h2 className="category-title">Business related Events</h2>
              <p className="category-description">Express yourself in ways never before possible with a business card. You can showcase your work by uploading rich content such as photos, videos and custom links.</p>
            </div>
          </div>
          
          <div className="event-category">
            <div className="event-illustration">
              <img src={advertisementImage} alt="Advertising events illustration" />
            </div>
            <div className="event-details">
              <span className="category-number">4</span>
              <h2 className="category-title">Advertising Events</h2>
              <p className="category-description">Express yourself in ways never before possible with a business card. You can showcase your work by uploading rich content such as photos, videos and custom links.</p>
            </div>
          </div>
          
          <div className="event-category">
            <div className="event-illustration">
              <img src={digitalImage} alt="Technology events illustration" />
            </div>
            <div className="event-details">
              <span className="category-number">4</span>
              <h2 className="category-title">Technology Events</h2>
              <p className="category-description">The shortest route to your customers is through their mobile phones. Utilize our share options and take your brand viral by sharing your EBEX with your clients and friends.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FirstPage;