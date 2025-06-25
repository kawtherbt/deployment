export const ServerIpAddress = import.meta.env.VITE_API_URL ?? "http://planit-alb-397640012.us-east-1.elb.amazonaws.com";
const AuthServiceURL = import.meta.env.VITE_AUTH_URL ?? "http://planit-alb-397640012.us-east-1.elb.amazonaws.com/api";
export const URLS = {
  ServerIpAddress,
  // ─── Auth ───────────────────────────────────────────────
  signUp:          `${AuthServiceURL}/signUp`,          // POST
  logIn:           `${AuthServiceURL}/logIn`,           // POST
  updateAccount:   `${AuthServiceURL}/updateAccount`,   // PUT
  getAccounts:     `${AuthServiceURL}/getAccounts`,      // GET
  deleteAccount:   `${AuthServiceURL}/deleteAccount`,   // DELETE

  // ─── Staff ──────────────────────────────────────────────
  getAllStaff:     `${ServerIpAddress}/getAllStaff`,     // GET
  addStaff:        `${ServerIpAddress}/addStaff`,        // POST
  updateStaff:     `${ServerIpAddress}/updateStaff`,     // PUT
  deleteStaff:     `${ServerIpAddress}/deleteStaff`,     // DELETE
  getStaffById: (id: number) => `${ServerIpAddress}/staff/${id}`,
// ─── Event ──────────────────────────────────────────────
  addEvent:                   `${ServerIpAddress}/addEvent`,                    
  addEventType:               `${ServerIpAddress}/addEventType`,                
  getEventTypes:              `${ServerIpAddress}/getEventTypes`,               
  getUPcomingEvents:          `${ServerIpAddress}/getUPcomingEvents`,           
  getEventsHistory:           `${ServerIpAddress}/getEventsHistory`,            
  getUPcomingEventsPageData:  `${ServerIpAddress}/getUPcomingEventsPageData`,   
  getFirstPageData:           `${ServerIpAddress}/getFirstPageData`,            
  getUPcomingEventsFirstPage: `${ServerIpAddress}/getUPcomingEventsFirstPage`,  
  getRestOfEventsHistoryData: (id: number) => `${ServerIpAddress}/getRestOfEventsHistoryData/${id}`,

  // ─── Pause ──────────────────────────────────────────────
  addPause:                   `${ServerIpAddress}/addPause`,                    
  updatePause:                `${ServerIpAddress}/updatePause`,                 
  deletePause:                `${ServerIpAddress}/deletePause`,                 
  getAllPausesForEvent:       (eventId: number) => `${ServerIpAddress}/getAllPausesForEvent/${eventId}`,
};
  // ─── You can add more service URLs here…
