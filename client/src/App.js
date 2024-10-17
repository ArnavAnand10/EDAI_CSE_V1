import { Routes, Route } from "react-router-dom";
import "./App.css";
import VolunteerScreen from "./Components/Volunteer/VolunteerScreen";
import RequestHelp from "./Components/Victim/RequestHelp";
import { RequestProvider } from "./Contexts/RequestContext";
import VictimRegister from "./Components/Victim/VictimRegister";
import VictimLogin from "./Components/Victim/VictimLogin";
import AllRequests from "./Components/Victim/AllRequests";
import VolunteerRegister from "./Components/Volunteer/VolunteerRegister";
import VolunteerLogin from "./Components/Volunteer/VolunteerLogin";

function App() {
  return (
    <div>
      <Routes>
      
        <Route element={<VictimRegister/> } path = "/victim-register"/>
        <Route element={<VictimLogin />} path="/victim-login" />
        <Route element={<VolunteerScreen />} path="/volunteer" />
        <Route element={<AllRequests />} path="/victim-requests" />

        {/* volunteer register */}

        <Route element={<VolunteerRegister />} path="/volunteer-register" />
        <Route element={<VolunteerLogin />} path="/volunteer-login" />

        <Route
          element={
            <RequestProvider>
              <RequestHelp />
            </RequestProvider>
          }
          path="/victim-help"
        />
      </Routes>
    </div>
  );
}

export default App;
