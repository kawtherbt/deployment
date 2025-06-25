import AddAccountModal from "./accounts/add-account/AddAccountModal";

export const ServerIpAddress = import.meta.env.VITE_API_URL ?? "http://planit-alb-726372627.us-east-1.elb.amazonaws.com/api";
const AuthServiceURL = import.meta.env.VITE_AUTH_URL ?? "http://planit-alb-726372627.us-east-1.elb.amazonaws.com/api";
export const URLS = {
  ServerIpAddress,
  // ─── Auth ───────────────────────────────────────────────
  signUp:          `${AuthServiceURL}/signUp`,          // POST
  logIn:           `${AuthServiceURL}/logIn`,           // POST
  updateAccount:   `${AuthServiceURL}/updateAccount`,   // PUT
  getAccounts:     `${AuthServiceURL}/getAccounts`,      // GET
  deleteAccount:   `${AuthServiceURL}/deleteAccount`,   // DELETE
  // ─── Entreprise ──────────────────────────────────────────────
  addEntreprise:    `${AuthServiceURL}/addEntreprise`,   // POST
  updateEntreprise: `${AuthServiceURL}/updateEntreprise`,// PUT
  deleteEntreprise: `${AuthServiceURL}/deleteEntreprise`,// DELETE
  getAllEntreprises:`${AuthServiceURL}/getAllEntreprises`, // GET
  // ─── Staff ──────────────────────────────────────────────
  getAllStaff:     `${ServerIpAddress}/getAllStaff`,     // GET
  addStaff:        `${ServerIpAddress}/addStaff`,        // POST
  updateStaff:     `${ServerIpAddress}/updateStaff`,     // PUT
  deleteStaff:     `${ServerIpAddress}/deleteStaff`,     // DELETE
  getStaffById: (id: number) => `${ServerIpAddress}/staff/${id}`,
  addStaffWithAgence:        `${ServerIpAddress}/addStaffWithAgence`,         // POST
  getParticipation:          `${ServerIpAddress}/getParticipation`,           // GET
  getStaffEvents: (id: number) => `${ServerIpAddress}/getStaffEvents/${id}`,  // GET
  getEventStaff:    (id: number) => `${ServerIpAddress}/getEventStaff/${id}`, // GET
  getAvailabeEventStaff: (start: string, end: string) => `${ServerIpAddress}/getAvailabeEventStaff/${start}/${end}`, // GET
  addStaffToEvent:           `${ServerIpAddress}/addStaffToEvent`,            // POST
  removeStaffFromEvent: (staffId: number, eventId: number) => `${ServerIpAddress}/removeStaffFromEvent/${staffId}/${eventId}`, // DELETE
  getAvailableStaff:         `${ServerIpAddress}/getAvailableStaff`,          // GET
  getStaffByEvent: (eventId: number) => `${ServerIpAddress}/getStaffByEvent/${eventId}`, // GET
  setStaffAvailable:         `${ServerIpAddress}/setStaffAvailable`,          // PUT
  getAllAgencies:            `${ServerIpAddress}/getAllAgencies`,             // GET
  getAgenceTableStructure:   `${ServerIpAddress}/getAgenceTableStructure`,    // GET
  getStaffWithAgencyByEvent: `${ServerIpAddress}/getStaffWithAgencyByEvent`,  // POST
  deleteStaffAndAssignments: `${ServerIpAddress}/staff/deleteStaffAndAssignments`, // DELETE

  // ─── Team ──────────────────────────────────────────────
addTeam:           `${ServerIpAddress}/addTeam`,            // POST
updateTeam:        `${ServerIpAddress}/updateTeam`,         // PUT
deleteTeam:        `${ServerIpAddress}/deleteTeam`,         // DELETE
addStaffToTeam:    `${ServerIpAddress}/addStaffToTeam`,     // PUT
getAllTeams:       `${ServerIpAddress}/getAllTeams`,        // GET
getAllStaffForTeams: `${ServerIpAddress}/getAllStaffForTeams`, // GET


// ─── Event ──────────────────────────────────────────────
  addEvent:                   `${ServerIpAddress}/addEvent`,                    
  addEventType:               `${ServerIpAddress}/addEventType`, 
  AddAccount:                 `${ServerIpAddress}/accounts`, 
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

  // ─── Accomodation ─────────────────────────────────────────
addAccomodation:     `${ServerIpAddress}/addAccomodation`,       // POST
updateAccomodation:  `${ServerIpAddress}/updateAccomodation`,    // PUT
deleteAccomodation:  `${ServerIpAddress}/deleteAccomodation`,    // DELETE
getAllAccomodations: `${ServerIpAddress}/getAllAccomodations`,   // GET
getEventAccomodation: (id: number) => `${ServerIpAddress}/getEventAccomodation/${id}`, // GET

// ─── Client ───────────────────────────────────────────────
addClient:     `${ServerIpAddress}/addClient`,     // POST
updateClient:  `${ServerIpAddress}/updateClient`,  // PUT
deleteClient:  `${ServerIpAddress}/deleteClient`,  // DELETE
getAllClients: `${ServerIpAddress}/getAllClients`, // GET

// ─── Equipement ───────────────────────────────────────────
addEquipment:               `${ServerIpAddress}/addEquipment`,                // POST
updateEquipment:            `${ServerIpAddress}/updateEquipment`,             // PUT
deleteEquipment:            `${ServerIpAddress}/deleteEquipment`,             // DELETE
getAllEquipment: (ts: number) => `${ServerIpAddress}/getAllEquipment/${ts}`,  // GET
getEquipmentUse: (ts: number) => `${ServerIpAddress}/getEquipmentUse/${ts}`,  // GET
getCategoryUse:  (ts: number) => `${ServerIpAddress}/getcategoryUse/${ts}`,   // GET
getHistoryEquipment: (ts: number) => `${ServerIpAddress}/getHistoryEquipment/${ts}`, // GET
getEventEquipment: (id: number) => `${ServerIpAddress}/getEventEquipment/${id}`,     // GET
getAvailabeEquipment: (start: string, end: string) =>
  `${ServerIpAddress}/getAvailabeEquipment/${start}/${end}`,            // GET
getAvailableEventEquipment: (id: number) =>
  `${ServerIpAddress}/getAvailableEventEquipment/${id}`,                     // GET
getAvailableAgencyEquipment: (id: number) =>
  `${ServerIpAddress}/getAvailableAgencyEquipment/${id}`,                    // GET
reserveEquipment:          `${ServerIpAddress}/reserveEquipment`,            // POST
unreserveEquipment:        `${ServerIpAddress}/unreserveEquipment`,          // DELETE
addEquipmentToEvent:       `${ServerIpAddress}/addEquipmentToEvent`,         // POST
removeEquipmentFromEvent: (eid: number, eid2: number) =>
  `${ServerIpAddress}/removeEquipmentToEvent/${eid}/${eid2}`,                // DELETE
addCategory:               `${ServerIpAddress}/addCategory`,                 // POST
updateCategory:            `${ServerIpAddress}/updateCategory`,              // PUT
deleteCategory:            `${ServerIpAddress}/deleteCategory`,              // DELETE
addSubCategory:            `${ServerIpAddress}/addSubCategory`,              // POST
updateSubCategory:         `${ServerIpAddress}/updateSubCategory`,           // PUT
deleteSubCategory:         `${ServerIpAddress}/deleteSubCategory`,           // DELETE
getCategory:               `${ServerIpAddress}/getCategory`,                 // GET

// ─── Instructor ───────────────────────────────────────────
addInstructor:     `${ServerIpAddress}/addInstructor`,     // POST
updateInstructor:  `${ServerIpAddress}/updateInstructor`,  // PUT
deleteInstructor:  `${ServerIpAddress}/deleteInstructor`,  // DELETE
getAllInstructors: `${ServerIpAddress}/getAllInstructors`, // GET
getInstructorsForWorkshop: `${ServerIpAddress}/getInstructorsForWorkshop`, // GET

// ─── Prestataire ──────────────────────────────────────────
addPrestataire:     `${ServerIpAddress}/addPrestataire`,     // POST
updatePrestataire:  `${ServerIpAddress}/updatePrestataire`,  // PUT
deletePrestataire:  `${ServerIpAddress}/deletePrestataire`,  // DELETE
getAllPrestataires: `${ServerIpAddress}/getAllPrestataires`, // GET

// ─── Soiree ───────────────────────────────────────────────
addSoiree:       `${ServerIpAddress}/addSoiree`,        // POST
updateSoiree:    `${ServerIpAddress}/updateSoiree`,     // PUT
deleteSoiree:    `${ServerIpAddress}/deleteSoiree`,     // DELETE
getAllSoirees:   `${ServerIpAddress}/getAllSoirees`,    // GET
getEventSoiree: (id: number) => `${ServerIpAddress}/getEventSoiree/${id}`, // GET

// ─── Transport (Car) ──────────────────────────────────────
addCar:     `${ServerIpAddress}/addCar`,     // POST
updateCar:  `${ServerIpAddress}/updateCar`,  // PUT
deleteCar:  `${ServerIpAddress}/deleteCar`,  // DELETE
getAllCars: `${ServerIpAddress}/getAllCars`, // GET

// ─── Transport ────────────────────────────────────────────
addTransport:    `${ServerIpAddress}/addTransport`,    // POST
updateTransport: `${ServerIpAddress}/updateTransport`, // PUT
deleteTransport: `${ServerIpAddress}/deleteTransport`, // DELETE
getAllTransports: `${ServerIpAddress}/getAllTransports`, // GET
getEventTransport: (id: number) => `${ServerIpAddress}/getEventtransport/${id}`, // GET
addStaffToTransport:  `${ServerIpAddress}/addStaffToTransport`, // POST
removeStaffFromTransport: (sid: number, eid: number) =>
  `${ServerIpAddress}/removeStaffFromTransport/${sid}/${eid}`, // DELETE
addCarToTransport:    `${ServerIpAddress}/addCarToTransport`, // POST
removeCarFromTransport: `${ServerIpAddress}/removeCarFromTransport`, // DELETE

// ─── Workshop ─────────────────────────────────────────────
addQA:           `${ServerIpAddress}/addQA`,           // POST
updateQA:        `${ServerIpAddress}/updateQA`,        // PUT
deleteQA:        `${ServerIpAddress}/deleteQA`,        // DELETE
getAllQAs:       `${ServerIpAddress}/getAllQAs`,       // GET
addWorkshop:     `${ServerIpAddress}/addWorkshop`,     // POST
updateWorkshop:  `${ServerIpAddress}/updateWorkshop`,  // PUT
deleteWorkshop:  `${ServerIpAddress}/deleteWorkshop`,  // DELETE
getAllWorkshops: `${ServerIpAddress}/getAllWorkshops`, // POST
getEventWorkshops: (id: number) => `${ServerIpAddress}/getEventWorkshops/${id}`, // GET
};
  // ─── You can add more service URLs here…
