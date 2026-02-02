import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Admin from './components/Pages/Admin.jsx';
import { ExcelDataProvider } from './data/ExcelDataContext.jsx';
import Goodbye from './components/Pages/Goodbye.jsx';
import Rfqapproval from './components/Pages/Rfqapproval.jsx';
import PoLists from './components/Pages/PoLists.jsx';
import RfqDetails from './components/Pages/RfqDetails.jsx';
import Create_Newuser from './components/Pages/Create_NewUser.jsx';
import RfqItemsDetail from './components/Pages/RfqItemsDetail.jsx';
import Login from './components/Pages/Login.jsx';
import SitePrDetail from './components/Pages/SitePrDetail.jsx';
import SingleSitePrDetail from './components/Pages/SingleSitePrDetail.jsx';
import GooglePage from './components/Pages/GooglePage.jsx';
import Dashboard from './components/Pages/Dashboard.jsx';
import ApiTester from './components/Pages/ApiTester.jsx';
  
    
import UserContext from '../src/context/UserContext.jsx';
import LeaveRequest from './components/Pages/LeaveRequest.jsx';
import PrCompareDashboard from './components/Pages/PrCompareDashboard.jsx';
import { PDFAcroComboBox } from 'pdf-lib';
import SessionWatcher from './components/Pages/SessionWatcher';


import VolvoApiTester from './components/Pages/VOLVO/VolvoApiTester';
import VolvoAPIHub from './components/Pages/VOLVO/VolvoAPIHub';
import VehicleInfo from './components/Pages/VOLVO/VehicleInfo';
import ListOfVehicle from './components/Pages/VOLVO/ListOfVehicle';
import VehiclePosition from './components/Pages/VOLVO/VehiclePosition';
import VehicleStatus from './components/Pages/VOLVO/VehicleStatus';

import VolvoTrackScore from './components/Pages/VolvoTrackScore';
import VolvoTrackScore2 from './components/Pages/VOLVO/VolvoTrackScore2';
import RfmsSpec from './components/Pages/RfmsSpec';
import GroupDriver from './components/Pages/GroupDriver';
import GroupMsg from './components/Pages/GroupMsg';
import GroupScores from './components/Pages/VOLVO/GroupScores';
import TechFiles from './components/Pages/TechFiles';
import VehicleAlert from './components/Pages/VehicleAlert';
import GroupVehicle from './components/Pages/VOLVO/GroupVehicle';


import SkywiseSoftwareHub from './components/Pages/SkywiseSoftwareHub';
import SrishtiIndexPage from './components/Pages/SrishtiIndexPage';
import LimsIndexPage from './components/Pages/LimsIndexPage';
import { List } from 'lucide-react';

LimsIndexPage
createRoot(document.getElementById('root')).render(
    <UserContext>
  <ExcelDataProvider>
    <Router>
      <SessionWatcher timeout={20 * 60 * 1000}> 
      <Routes>
        <Route path="/Menu" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/site-pr-tracking" element={<SitePrDetail />} />
        <Route path="/single-pr/:prNumber" element={< SingleSitePrDetail />} />



       <Route path="/volvo-api-hub" element={< VolvoAPIHub />} />
       <Route path="/volvo-api-tester" element={< VolvoApiTester />} />

       <Route path="/vehicle-info" element={< VehicleInfo />} />

       <Route path="/volvo-truck-score" element={< VolvoTrackScore />} />
       <Route path="/VolvoTrackScore2" element={< VolvoTrackScore2 />} />


       <Route path="/rfms-spec" element={< RfmsSpec />} />
       <Route path="/volvo-group-driver" element={< GroupDriver />} />

       <Route path="/volvo-group-messaging" element={< GroupMsg />} />
       <Route path="/volvo-group-scores" element={< GroupScores />} />
       <Route path="/volvo-group-tech-files" element={< TechFiles />} />
       <Route path="/volvo-group-vehicle-alert" element={< VehicleAlert />} />
       <Route path="/volvo-group-vehicle-Api" element={< GroupVehicle />} />

       <Route path="/list-of-vehicles" element={< ListOfVehicle />} />
       <Route path="/position-of-vehicles" element={< VehiclePosition />} />
       <Route path="/status-of-vehicles" element={< VehicleStatus />} />


 

        <Route path="*" element={< Login />} />
        <Route path="guest-home" element={< SkywiseSoftwareHub />} />

        <Route path="/approver-status" element={< Rfqapproval />} />
        <Route path="/rfqDetails/:paramId" element={< RfqDetails />} />
        <Route path="/rfqItemsDetail/:paramId" element={< RfqItemsDetail />} />
        <Route path="/po-followup" element={< PoLists />} />
        <Route path="/create_new_userid" element={< Create_Newuser />} />

 
        <Route path="/goodbye" element={< Goodbye />} />
        <Route path="/admin" element={< Admin />} />  
        <Route path="/api-testing" element={< ApiTester />} />



        <Route path="/online" element={< GooglePage   />} />
       <Route path="/dashboard" element={< Dashboard />} />
       <Route path="/leaverequest" element={< LeaveRequest />} />
       <Route path="/prcompare" element={<PrCompareDashboard />} />

        <Route path="/skywise-techonologies" element={< SkywiseSoftwareHub />} /> 
        <Route path="/srishti-index" element={< SrishtiIndexPage />} /> 
        <Route path="/lims-index" element={< LimsIndexPage />} /> 


      </Routes>
      </SessionWatcher>
    </Router>
  </ExcelDataProvider>
</UserContext>
);


  