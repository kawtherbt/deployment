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
  getAllStaff:     `${ServerIpAddress}:8082/api/getAllStaff`,     // GET
  addStaff:        `${ServerIpAddress}:8082/api/addStaff`,        // POST
  updateStaff:     `${ServerIpAddress}:8082/api/updateStaff`,     // PUT
  deleteStaff:     `${ServerIpAddress}:8082/api/deleteStaff`,     // DELETE
  getStaffById: (id: number) => `${ServerIpAddress}:8082/api/staff/${id}`,
// ─── Event ──────────────────────────────────────────────
  addEvent:                   `${ServerIpAddress}:8081/api/addEvent`,                    
  addEventType:               `${ServerIpAddress}:8081/api/addEventType`,                
  getEventTypes:              `${ServerIpAddress}:8081/api/getEventTypes`,               
  getUPcomingEvents:          `${ServerIpAddress}:8081/api/getUPcomingEvents`,           
  getEventsHistory:           `${ServerIpAddress}:8081/api/getEventsHistory`,            
  getUPcomingEventsPageData:  `${ServerIpAddress}:8081/api/getUPcomingEventsPageData`,   
  getFirstPageData:           `${ServerIpAddress}:8081/api/getFirstPageData`,            
  getUPcomingEventsFirstPage: `${ServerIpAddress}:8081/api/getUPcomingEventsFirstPage`,  
  getRestOfEventsHistoryData: (id: number) => `${ServerIpAddress}:8081/api/getRestOfEventsHistoryData/${id}`,

  // ─── Pause ──────────────────────────────────────────────
  addPause:                   `${ServerIpAddress}/addPause`,                    
  updatePause:                `${ServerIpAddress}/updatePause`,                 
  deletePause:                `${ServerIpAddress}/deletePause`,                 
  getAllPausesForEvent:       (eventId: number) => `${ServerIpAddress}/getAllPausesForEvent/${eventId}`,
};
  // ─── You can add more service URLs here…
