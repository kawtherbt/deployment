import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Cookies from 'js-cookie';
import './index.css';
import './styles/global-checkbox.css';
import App from './App.tsx';
import Event_page from './event-page/event_page.tsx';
import Customer_page from './customer-page/customer_page.tsx';
import Equipment_page from './equipment-page/equipment_page.tsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Accounts_page from './accounts/accounts_page.tsx';
import Login_page from './login-page/login_page.tsx';
import AccountCreation from './account-creaton/AccountCreation.tsx';
import UpdateEquipment from './update-equipment/UpdateEquipment.tsx';
import AddEquipment from './add-equipment/AddEquipment.tsx';
import AddStaffInEvent from './add-staff-In-Event/AddStaffInEvent.tsx';
import EditStaffInEvent from './edit-staff-in-event/EditStaffInEvent.tsx';
import AddStaff from './add-staff/AddStaff.tsx';
import AddAccomodation from './add-accomodation/AddAccomodation.tsx';
import AddWorkshop from './add-workshop/AddWorkshop.tsx';
import StaffUpdate from './update-staff/StaffUpdate.tsx';
import StaffPage from './staff-page/StaffPage.tsx';
import LandingPage from './landing-page/LandingPage.tsx';
import AddDetails from './AddDetails/AddDetails.tsx';
import HistoryPage from './history-page/HistoryPage.tsx';
import CarPage from './car-page/CarPage.tsx';
import Eventdetails from './eventdetails/Eventdetails.tsx';
import AddPause from './add-pause/AddPause.tsx';
import AddSoiree from './add-soiree/AddSoiree.tsx';
import AdduserAccomodation from './add-user-accomodation-pricing/AdduserAccomodation.tsx';
import AddTransport from './add-transportation/AddTransport.tsx';
import TeamPage from './team-page/TeamPage.tsx';
import FirstPage from './first-page/firstpage.tsx';
import ProjectDashboard from './upcomingevent/upcomingevent.tsx';
import InWorkshops from './in-workshops/InWorkshops';
import InSoiree from './in-soiree/InSoiree';
import InSoireeParticipant from './insoiree-participant/InSoireeParticipant';
import InAccomodationTable from './in-accomodation/InAccomodationTable.tsx';
import InAccomodationParticipant from './inaccomodation-participant/InAccomodationParticipant.tsx';
import InWorkshopsParticipant from './inworkshops-participant/InWorkshopsParticipant.tsx';
import InPauses from './in-pauses/InPauses';
import InStaff from './in-staff/InStaff';
import InCar from './in-car/InCar';
import EventStaff from './event-staff/EventStaff';
import EventEquipment from './event-equipment/EventEquipment';
import InAddEquipment from './in-add-equipment/InAddEquipment';
import AddStaffEventTable from './add-staff-event-table/AddStaffEventTable';
import AgencyStaffInEvent from './agency-staff-in-event/AgencyStaffInEvent';
import InStaffTeam from './in-staff-team/InStaffTeam';
import EquipmentHistoryPage from './equipment-history-page/EquipmentHistoryPage.tsx';
import PrestatairePage from './prestataire-page/PrestatairePage.tsx';
import HistoryDetailPage from './history-detail-page/HistoryDetailPage.tsx';
import TransportList from './transport-list/TransportList';



const isLogedIn = ()=>{
  return Cookies.get('isLogedIn') === 'true';
}

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  return isLogedIn() ? element : <Navigate to="/" replace />;
};


const router = createBrowserRouter([
  {
    path: '/',
    element: <Login_page />,
    errorElement: <div> 404 PAGE NOT FOUND</div>
  },

  {
    path: '/landing',
    element: <LandingPage />,
    errorElement: <div> 404 PAGE NOT FOUND</div>
  },
  {
    path: '/event',
    element:<ProtectedRoute element={<Event_page />} />,
    errorElement: <div> 404 PAGE NOT FOUND</div>
  },
  {
    path: '/addDetails',
    element:<ProtectedRoute element={<AddDetails />} />,
    errorElement: <div> 404 PAGE NOT FOUND</div>
  },
  {
    path: '/customer',
    element:<ProtectedRoute element={<Customer_page />} />,
    errorElement: <div> 404 PAGE NOT FOUND</div>
  },
  {
    path: '/equipment',
    element:<ProtectedRoute element={<Equipment_page/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/staff',
    element:<ProtectedRoute element={<StaffPage/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/Accounts',
    element:<ProtectedRoute element={<Accounts_page/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/AccountCreation',
    element:<ProtectedRoute element={<AccountCreation/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/UpdateEquipment',
    element:<ProtectedRoute element={<UpdateEquipment/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/AddEquipment',
    element:<ProtectedRoute element={<AddEquipment/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/AddStaffInEvent',
    element:<ProtectedRoute element={<AddStaffInEvent/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/EditStaffInEvent',
    element:<ProtectedRoute element={<EditStaffInEvent/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/AddStaff',
    element:<ProtectedRoute element={<AddStaff/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/UpdateStaff',
    element:<ProtectedRoute element={<StaffUpdate/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/AddAccomodation',
    element:<ProtectedRoute element={<AddAccomodation/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/AddWorkshop',
    element:<ProtectedRoute element={<AddWorkshop/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/history',
    element:<ProtectedRoute element={<HistoryPage/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/car',
    element:<ProtectedRoute element={<CarPage/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/eventDetails',
    element:<ProtectedRoute element={<Eventdetails/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/addSoiree',
    element:<ProtectedRoute element={<AddSoiree/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/addPause',
    element:<ProtectedRoute element={<AddPause/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/addUserAccomodation',
    element:<ProtectedRoute element={<AdduserAccomodation/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/addTransport',
    element:<ProtectedRoute element={<AddTransport/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/teamPage',
    element:<ProtectedRoute element={<TeamPage/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/firstPage',
    element:<ProtectedRoute element={<FirstPage/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/upcomingEvents',
    element:<ProtectedRoute element={<ProjectDashboard/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/in-workshops',
    element:<ProtectedRoute element={<InWorkshops/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/in-soiree',
    element:<ProtectedRoute element={<InSoiree/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/in-accomodation',
    element:<ProtectedRoute element={<InAccomodationTable/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/in-accomodation-participant/:accomodationId',
    element:<ProtectedRoute element={<InAccomodationParticipant/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/insoiree-participant/:soireeId',
    element:<ProtectedRoute element={<InSoireeParticipant/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/in-workshops-participant/:workshopId',
    element:<ProtectedRoute element={<InWorkshopsParticipant/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/in-pauses',
    element:<ProtectedRoute element={<InPauses/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/in-staff',
    element:<ProtectedRoute element={<InStaff/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/in-car',
    element:<ProtectedRoute element={<InCar/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/event-staff',
    element:<ProtectedRoute element={<EventStaff/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/event-equipment/:eventId',
    element:<ProtectedRoute element={<EventEquipment/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/in-add-equipment',
    element:<ProtectedRoute element={<InAddEquipment/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/add-staff-event-table',
    element:<ProtectedRoute element={<AddStaffEventTable/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path:'/agency-staff-in-event',
    element:<ProtectedRoute element={<AgencyStaffInEvent/>} />,
    errorElement:<div> 404 PAGE NOT FOUND</div>
  },
  {
    path: '/in-staff-team',
    element: <ProtectedRoute element={<InStaffTeam />} />,
    errorElement: <div>404 PAGE NOT FOUND</div>
  },
  {
    path: '/equipment-history',
    element: <ProtectedRoute element={<EquipmentHistoryPage />} />,
    errorElement: <div>404 PAGE NOT FOUND</div>
  },
  {
    path: '/PrestatairePage',
    element: <ProtectedRoute element={<PrestatairePage />} />,
    errorElement: <div>404 PAGE NOT FOUND</div>
  },
  {
    path: '/history-detail',
    element: <ProtectedRoute element={<HistoryDetailPage />} />,
    errorElement: <div>404 PAGE NOT FOUND</div>
  },
  {
    path: "/transport-list",
    element: <ProtectedRoute element={<TransportList />} />,
    errorElement: <div>404 PAGE NOT FOUND</div>
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
