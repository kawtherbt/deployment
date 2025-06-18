const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const URLS = {
  // ─── Auth ───────────────────────────────────────────────
  signUp:          `${API_BASE}/signUp`,          // POST
  logIn:           `${API_BASE}/logIn`,           // POST
  updateAccount:   `${API_BASE}/updateAccount`,   // PUT
  getAccounts:     `${API_BASE}/getAcounts`,      // GET
  deleteAccount:   `${API_BASE}/deleteAccount`,   // DELETE

  // ─── Staff ──────────────────────────────────────────────
  getAllStaff:     `${API_BASE}/getAllStaff`,     // GET
  addStaff:        `${API_BASE}/addStaff`,        // POST
  updateStaff:     `${API_BASE}/updateStaff`,     // PUT
  deleteStaff:     `${API_BASE}/deleteStaff`,     // DELETE
  getStaffById: (id: number) => `${API_BASE}/staff/${id}`,
// ─── Event ──────────────────────────────────────────────
  addEvent:                   `${API_BASE}/addEvent`,                    
  addEventType:               `${API_BASE}/addEventType`,                
  getEventTypes:              `${API_BASE}/getEventTypes`,               
  getUPcomingEvents:          `${API_BASE}/getUPcomingEvents`,           
  getEventsHistory:           `${API_BASE}/getEventsHistory`,            
  getUPcomingEventsPageData:  `${API_BASE}/getUPcomingEventsPageData`,   
  getFirstPageData:           `${API_BASE}/getFirstPageData`,            
  getUPcomingEventsFirstPage: `${API_BASE}/getUPcomingEventsFirstPage`,  
  getRestOfEventsHistoryData: (id: number) => `${API_BASE}/getRestOfEventsHistoryData/${id}`,

  // ─── Pause ──────────────────────────────────────────────
  addPause:                   `${API_BASE}/addPause`,                    
  updatePause:                `${API_BASE}/updatePause`,                 
  deletePause:                `${API_BASE}/deletePause`,                 
  getAllPausesForEvent:       (eventId: number) => `${API_BASE}/getAllPausesForEvent/${eventId}`,
};
  // ─── You can add more service URLs here…
