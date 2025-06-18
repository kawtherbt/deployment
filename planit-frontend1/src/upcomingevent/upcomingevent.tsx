import { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './upcomingevent.css';
import { URLS } from '../URLS';
import { FETCH_STATUS } from '../fetchStatus';
import { toast } from 'react-toastify';

export default function ProjectDashboard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(FETCH_STATUS.IDLE);

  type TeamMember = { color: string };
  type Project = {
    id: number;
    name: string;
    logo: string;
    logoColor: string;
    logoBorder?: string;
    logoTextColor?: string;
    description: string;
    participants: number;
    workshops: number;
    presentations: number;
    daysleft: number;
    teamMembers: TeamMember[];
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const totalProjects = projects.length;
  const projectsPerPage = 5;
  const totalPages = Math.ceil(totalProjects / projectsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getUPcomingEventsPageData = async () => {
    try {
      setStatus(FETCH_STATUS.LOADING);
      const response = await fetch(`${URLS.ServerIpAddress}/getUPcomingEventsPageData`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        throw { status: response.status, message: result.message };
      }

      // Transform the API data to match the Project type
      const transformedProjects = result.data.map((event: any) => ({
        id: event.ID || Math.random(),
        name: event.name,
        logo: event.name.substring(0, 2).toUpperCase(),
        logoColor: 'logo-facebook',
        description: event.description || 'No description available',
        participants: event.participants || 0,
        workshops: event.workshops || 0,
        presentations: 0,
        daysleft: parseInt(event.daysleft) || 0,
        teamMembers: [
          { color: 'avatar-yellow' },
          { color: 'avatar-blue' },
          { color: 'avatar-green' }
        ]
      }));

      setProjects(transformedProjects);
      setStatus(FETCH_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Error while getting upcoming events:", error.message);
      toast.error("Error loading upcoming events");
      setStatus(FETCH_STATUS.ERROR);
    }
  };

  useEffect(() => {
    getUPcomingEventsPageData();
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination for filtered projects
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const handleEventClick = (eventId: number) => {
    navigate('/eventDetails', {
      state: { evenement_id: eventId }
    });
  };

  if (status === FETCH_STATUS.LOADING) {
    return (
      <div className="upcoming-events-layout">
        <Sidebar />
        <div className="upcoming-events-main">
          <div className="upcoming-events-loading">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-events-layout">
      <Sidebar />
      <div className="upcoming-events-main">
        <div className="upcoming-events-container">
          <div className="upcoming-events-top-bar">
            <div className="upcoming-events-search-wrapper">
              <input 
                type="text" 
                placeholder="Search events..." 
                className="upcoming-events-search-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="upcoming-events-user-info">              
            </div>
          </div>
          <div className="upcoming-events-section-container">
            <h2 className="upcoming-events-section-title upcoming-events-centered-title">Your upcoming projects</h2>
            <div className="upcoming-events-list">
              {currentProjects.map((project: Project) => (
                <div 
                  key={project.id} 
                  className="upcoming-events-card"
                  onClick={() => handleEventClick(project.id)}
                >
                  <div className="upcoming-events-card-header">
                    <div className="upcoming-events-project-header">
                      <div className={`upcoming-events-project-logo ${project.logoColor} ${project.logoBorder || ''} ${project.logoTextColor || ''}`}>
                        {project.logo}
                      </div>
                      <div className="upcoming-events-project-details">
                        <div className="upcoming-events-project-title">
                          <h3>{project.name}</h3>
                          <span className="upcoming-events-due">in {project.daysleft} days</span>
                          <MoreVertical size={16} className="upcoming-events-more-icon" /> 
                        </div>
                        <p className="upcoming-events-description">{project.description}</p>
                        <div className="upcoming-events-card-separator"></div>
                        <div className="upcoming-events-stats">
                          <div>
                            <p className="upcoming-events-stat-value">{project.participants}</p>
                            <p className="upcoming-events-stat-label">participants</p>
                          </div>
                          <div>
                            <p className="upcoming-events-stat-value">{project.workshops}</p>
                            <p className="upcoming-events-stat-label">workshops</p>
                          </div>
                          <div>
                            <p className="upcoming-events-stat-value">{project.presentations}</p>
                            <p className="upcoming-events-stat-label">presentations</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="upcoming-events-pagination-wrapper">
              <span className="upcoming-events-pagination-info">
                Showing {currentProjects.length} of {filteredProjects.length} events
              </span>
              <div className="upcoming-events-pagination-buttons">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Prev
                </button>
                {[...Array(Math.ceil(filteredProjects.length / projectsPerPage))].map((_, index) => (
                  <button
                    key={index}
                    className={currentPage === index + 1 ? 'upcoming-events-active-page' : ''}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === Math.ceil(filteredProjects.length / projectsPerPage)}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
