import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="header">
        <div className="logo">NilGen</div>
        <nav className="nav-menu">
          {/* Nav items would go here */}
        </nav>
      </header>
      
      <main className="main-content">
        <h1 className="title">upcoming events</h1>
        
        {/* Quote card */}
        <div className="quote-card">
          <div className="quote-content">
            <blockquote>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </blockquote>
            <div className="quote-attribution">client</div>
          </div>
          <div className="quote-illustration">
            {/* World illustration would go here */}
          </div>
        </div>
        
        {/* Month selector */}
        <div className="month-selector">
          <p>What You want to be curate for you</p>
          <div className="months">
            <div className="month">JAN</div>
            <div className="month active">FEB</div>
            <div className="month">MAR</div>
          </div>
        </div>
        
        {/* Event cards */}
        <div className="events-grid">
          {/* Conference card */}
          <div className="event-card conference">
            <div className="event-illustration">
              {/* Conference illustration */}
            </div>
            <div className="event-details">
              <h3 className="event-date">18/02</h3>
              <h2 className="event-title">Conference</h2>
              <p className="event-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              <button className="register-btn">Register</button>
            </div>
          </div>
          
          {/* Networking card */}
          <div className="event-card networking">
            <div className="event-details">
              <h3 className="event-date">20/02</h3>
              <h2 className="event-title">Networking Event</h2>
              <p className="event-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              <button className="register-btn">Register</button>
            </div>
            <div className="event-illustration">
              {/* Networking illustration */}
            </div>
          </div>
          
          {/* Workshop card */}
          <div className="event-card workshop">
            <div className="event-illustration">
              {/* Workshop illustration */}
            </div>
            <div className="event-details">
              <h3 className="event-date">25/02</h3>
              <h2 className="event-title">Workshop Event</h2>
              <p className="event-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              <button className="register-btn">Register</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;