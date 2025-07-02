import AddAccountModal from "./accounts/add-account/AddAccountModal";

export const ServerIpAddress =
  import.meta.env.VITE_API_URL ??
  "planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api";

const AuthServiceURL = `${ServerIpAddress}/auth`;
const StaffServiceURL = `://planit-alb-1532976624.uhttps-east-1.elb.amazonaws.com:80/api/staff`;
const EntrepriseServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/entreprise`;
const EventServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/event`;
const AccomodationServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/accomodation`;
const ClientServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/client`;
const EquipmentServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/equipment`;
const TransportServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/transport`;
const WorkshopServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/workshop`;
const SoireeServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/soiree`;  
const InstructorServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/instructor`;
const PrestataireServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/apiprestataire`;
const TeamServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/team`;
const PauseServiceURL = `planit-alb-1132579378.us-east-1.elb.amazonaws.com:80/api/pause`;

export const URLS = {
  ServerIpAddress,

  // ─── Auth ───────────────────────────────────────────────
  signUp: `${AuthServiceURL}/signUp`, // POST
  logIn: `${AuthServiceURL}/logIn`, // POST
  updateAccount: `${AuthServiceURL}/updateAccount`, // PUT
  getAccounts: `${AuthServiceURL}/getAccounts`, // GET
  deleteAccount: `${AuthServiceURL}/deleteAccount`, // DELETE
  

  // ─── Entreprise ──────────────────────────────────────────────
  addEntreprise: `${EntrepriseServiceURL}/addEntreprise`, // POST
  updateEntreprise: `${EntrepriseServiceURL}/updateEntreprise`, // PUT
  deleteEntreprise: `${EntrepriseServiceURL}/deleteEntreprise`, // DELETE
  getAllEntreprises: `${EntrepriseServiceURL}/getAllEntreprises`, // GET

  // ─── Staff ──────────────────────────────────────────────
  getAllStaff: `${StaffServiceURL}/getAllStaff`, // GET
  addStaff: `${StaffServiceURL}/addStaff`, // POST
  updateStaff: `${StaffServiceURL}/updateStaff`, // PUT
  deleteStaff: `${StaffServiceURL}/deleteStaff`, // DELETE
  getStaffById: (id: number) => `${StaffServiceURL}/staff/${id}`,
  addStaffWithAgence: `${StaffServiceURL}/addStaffWithAgence`, // POST
  getParticipation: `${StaffServiceURL}/getParticipation`, // GET
  getStaffEvents: (id: number) => `${StaffServiceURL}/getStaffEvents/${id}`, // GET
  getEventStaff: (id: number) => `${StaffServiceURL}/getEventStaff/${id}`, // GET
  getAvailabeEventStaff: (start: string, end: string) =>
    `${StaffServiceURL}/getAvailabeEventStaff/${start}/${end}`, // GET
  addStaffToEvent: `${StaffServiceURL}/addStaffToEvent`, // POST
  removeStaffFromEvent: (staffId: number, eventId: number) =>
    `${StaffServiceURL}/removeStaffFromEvent/${staffId}/${eventId}`, // DELETE
  getAvailableStaff: `${StaffServiceURL}/getAvailableStaff`, // GET
  getStaffByEvent: (eventId: number) =>
    `${StaffServiceURL}/getStaffByEvent/${eventId}`, // GET
  setStaffAvailable: `${StaffServiceURL}/setStaffAvailable`, // PUT
  getAllAgencies: `${StaffServiceURL}/getAllAgencies`, // GET
  getAgenceTableStructure: `${StaffServiceURL}/getAgenceTableStructure`, // GET
  getStaffWithAgencyByEvent: `${StaffServiceURL}/getStaffWithAgencyByEvent`, // POST
  deleteStaffAndAssignments: `${StaffServiceURL}/deleteStaffAndAssignments`, // DELETE

  // ─── Team ──────────────────────────────────────────────
  addTeam: `${TeamServiceURL}/addTeam`, // POST
  updateTeam: `${TeamServiceURL}/updateTeam`, // PUT
  deleteTeam: `${TeamServiceURL}/deleteTeam`, // DELETE
  addStaffToTeam: `${TeamServiceURL}/addStaffToTeam`, // PUT
  getAllTeams: `${TeamServiceURL}/getAllTeams`, // GET
  getAllStaffForTeams: `${TeamServiceURL}/getAllStaffForTeams`, // GET

  // ─── Event ──────────────────────────────────────────────
  addEvent: `${EventServiceURL}/addEvent`,
  addEventType: `${EventServiceURL}/addEventType`,
  AddAccount: `${EventServiceURL}/accounts`,
  getEventTypes: `${EventServiceURL}/getEventTypes`,
  getUPcomingEvents: `${EventServiceURL}/getUPcomingEvents`,
  getEventsHistory: `${EventServiceURL}/getEventsHistory`,
  getUPcomingEventsPageData: `${EventServiceURL}/getUPcomingEventsPageData`,
  getFirstPageData: `${EventServiceURL}/getFirstPageData`,
  getUPcomingEventsFirstPage: `${EventServiceURL}/getUPcomingEventsFirstPage`,
  getRestOfEventsHistoryData: (id: number) =>
    `${EventServiceURL}/getRestOfEventsHistoryData/${id}`,

  // ─── Pause ──────────────────────────────────────────────
  addPause: `${PauseServiceURL}/addPause`,
  updatePause: `${PauseServiceURL}/updatePause`,
  deletePause: `${PauseServiceURL}/deletePause`,
  getAllPausesForEvent: (eventId: number) =>
    `${PauseServiceURL}/getAllPausesForEvent/${eventId}`,

  // ─── Accomodation ─────────────────────────────────────────
  addAccomodation: `${AccomodationServiceURL}/addAccomodation`, // POST
  updateAccomodation: `${AccomodationServiceURL}/updateAccomodation`, // PUT
  deleteAccomodation: `${AccomodationServiceURL}/deleteAccomodation`, // DELETE
  getAllAccomodations: `${AccomodationServiceURL}/getAllAccomodations`, // GET
  getEventAccomodation: (id: number) =>
    `${AccomodationServiceURL}/getEventAccomodation/${id}`, // GET

  // ─── Client ───────────────────────────────────────────────
  addClient: `${ClientServiceURL}/addClient`, // POST
  updateClient: `${ClientServiceURL}/updateClient`, // PUT
  deleteClient: `${ClientServiceURL}/deleteClient`, // DELETE
  getAllClients: `${ClientServiceURL}/getAllClients`, // GET

  // ─── Equipement ───────────────────────────────────────────
  addEquipment: `${EquipmentServiceURL}/addEquipment`, // POST
  updateEquipment: `${EquipmentServiceURL}/updateEquipment`, // PUT
  deleteEquipment: `${EquipmentServiceURL}/deleteEquipment`, // DELETE
  getAllEquipment: (ts: number) => `${EquipmentServiceURL}/getAllEquipment/${ts}`, // GET
  getEquipmentUse: (ts: number) => `${EquipmentServiceURL}/getEquipmentUse/${ts}`, // GET
  getCategoryUse: (ts: number) => `${EquipmentServiceURL}/getcategoryUse/${ts}`, // GET
  getHistoryEquipment: (ts: number) =>
    `${EquipmentServiceURL}/getHistoryEquipment/${ts}`, // GET
  getEventEquipment: (id: number) =>
    `${EquipmentServiceURL}/getEventEquipment/${id}`, // GET
  getAvailabeEquipment: (start: string, end: string) =>
    `${EquipmentServiceURL}/getAvailabeEquipment/${start}/${end}`, // GET
  getAvailableEventEquipment: (id: number) =>
    `${EquipmentServiceURL}/getAvailableEventEquipment/${id}`, // GET
  getAvailableAgencyEquipment: (id: number) =>
    `${EquipmentServiceURL}/getAvailableAgencyEquipment/${id}`, // GET
  reserveEquipment: `${EquipmentServiceURL}/reserveEquipment`, // POST
  unreserveEquipment: `${EquipmentServiceURL}/unreserveEquipment`, // DELETE
  addEquipmentToEvent: `${EquipmentServiceURL}/addEquipmentToEvent`, // POST
  removeEquipmentFromEvent: (eid: number, eid2: number) =>
    `${EquipmentServiceURL}/removeEquipmentToEvent/${eid}/${eid2}`, // DELETE
  addCategory: `${EquipmentServiceURL}/addCategory`, // POST
  updateCategory: `${EquipmentServiceURL}/updateCategory`, // PUT
  deleteCategory: `${EquipmentServiceURL}/deleteCategory`, // DELETE
  addSubCategory: `${EquipmentServiceURL}/addSubCategory`, // POST
  updateSubCategory: `${EquipmentServiceURL}/updateSubCategory`, // PUT
  deleteSubCategory: `${EquipmentServiceURL}/deleteSubCategory`, // DELETE
  getCategory: `${EquipmentServiceURL}/getCategory`, // GET

  // ─── Instructor ───────────────────────────────────────────
  addInstructor: `${InstructorServiceURL}/addInstructor`, // POST
  updateInstructor: `${InstructorServiceURL}/updateInstructor`, // PUT
  deleteInstructor: `${InstructorServiceURL}/deleteInstructor`, // DELETE
  getAllInstructors: `${InstructorServiceURL}/getAllInstructors`, // GET
  getInstructorsForWorkshop: `${InstructorServiceURL}/getInstructorsForWorkshop`, // GET

  // ─── Prestataire ──────────────────────────────────────────
  addPrestataire: `${PrestataireServiceURL}/addPrestataire`, // POST
  updatePrestataire: `${PrestataireServiceURL}/updatePrestataire`, // PUT
  deletePrestataire: `${PrestataireServiceURL}/deletePrestataire`, // DELETE
  getAllPrestataires: `${PrestataireServiceURL}/getAllPrestataires`, // GET

  // ─── Soiree ───────────────────────────────────────────────
  addSoiree: `${SoireeServiceURL}/addSoiree`, // POST
  updateSoiree: `${SoireeServiceURL}/updateSoiree`, // PUT
  deleteSoiree: `${SoireeServiceURL}/deleteSoiree`, // DELETE
  getAllSoirees: `${SoireeServiceURL}/getAllSoirees`, // GET
  getEventSoiree: (id: number) => `${SoireeServiceURL}/getEventSoiree/${id}`, // GET

  // ─── Transport (Car) ──────────────────────────────────────
  addCar: `${TransportServiceURL}/addCar`, // POST
  updateCar: `${TransportServiceURL}/updateCar`, // PUT
  deleteCar: `${TransportServiceURL}/deleteCar`, // DELETE
  getAllCars: `${TransportServiceURL}/getAllCars`, // GET

  // ─── Transport ────────────────────────────────────────────
  addTransport: `${TransportServiceURL}/addTransport`, // POST
  updateTransport: `${TransportServiceURL}/updateTransport`, // PUT
  deleteTransport: `${TransportServiceURL}/deleteTransport`, // DELETE
  getAllTransports: `${TransportServiceURL}/getAllTransports`, // GET
  getEventTransport: (id: number) =>
    `${TransportServiceURL}/getEventtransport/${id}`, // GET
  addStaffToTransport: `${TransportServiceURL}/addStaffToTransport`, // POST
  removeStaffFromTransport: (sid: number, eid: number) =>
    `${TransportServiceURL}/removeStaffFromTransport/${sid}/${eid}`, // DELETE
  addCarToTransport: `${TransportServiceURL}/addCarToTransport`, // POST
  removeCarFromTransport: `${TransportServiceURL}/removeCarFromTransport`, // DELETE

  // ─── Workshop ─────────────────────────────────────────────
  addQA: `${WorkshopServiceURL}/addQA`, // POST
  updateQA: `${WorkshopServiceURL}/updateQA`, // PUT
  deleteQA: `${WorkshopServiceURL}/deleteQA`, // DELETE
  getAllQAs: `${WorkshopServiceURL}/getAllQAs`, // GET
  addWorkshop: `${WorkshopServiceURL}/addWorkshop`, // POST
  updateWorkshop: `${WorkshopServiceURL}/updateWorkshop`, // PUT
  deleteWorkshop: `${WorkshopServiceURL}/deleteWorkshop`, // DELETE
  getAllWorkshops: `${WorkshopServiceURL}/getAllWorkshops`, // POST
  getEventWorkshops: (id: number) =>
    `${WorkshopServiceURL}/getEventWorkshops/${id}`, // GET
};
