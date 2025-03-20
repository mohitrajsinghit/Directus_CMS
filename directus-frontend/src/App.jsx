
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { DirectusProvider } from "./context/DirectusContext";
// import Sidebar from "./components/Sidebar";
// import EmbedDashboard from "./components/EmbedDashboard";
// import StrategicSummary from "./pages/StrategicSummaryPage";
// import Dashboard from "./pages/DashboardPage";
// import SalesAndMarginPlanning from "./pages/SalesMarginPlanningPage";
// import TDReconciliation from "./pages/TDReconciliationPage";
// import TDApprovalStatus from "./pages/TDApprovalStatusPage";

// function App() {
//   const [isCollapsed, setIsCollapsed] = React.useState(false);

//   return (
//     <DirectusProvider>
//       <BrowserRouter>
//         <div style={{ display: "flex", height: "100vh" }}>
//           <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          
//           <main
//             style={{
//               flex: 1,
//               backgroundColor: "#000",
//               color: "#fff",
//               padding: "1rem",
//               transition: "margin-left 0.3s ease",
//             }}
//           >
//             <Routes>
//               <Route path="/strategicsummary" element={<StrategicSummary />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/salesandmarginplanning" element={<SalesAndMarginPlanning />} />
//               <Route path="/tdreconciliation" element={<TDReconciliation />} />
//               <Route path="/tdapprovalstatus" element={<TDApprovalStatus />} />
//               <Route path="/" element={<EmbedDashboard />} />
//               <Route path="/test" element={<EmbedDashboard />} />

//             </Routes>
//           </main>
//         </div>
//       </BrowserRouter>
//     </DirectusProvider>
//   );
// }

// export default App;




import React from "react";
import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { DirectusProvider } from "./context/DirectusContext";
import Sidebar from "./components/Sidebar";
import EmbedDashboard from "./components/EmbedDashboard";
import StrategicSummary from "./pages/StrategicSummaryPage";
import Dashboard from "./pages/DashboardPage";
import SalesAndMarginPlanning from "./pages/SalesMarginPlanningPage";
import TDReconciliation from "./pages/TDReconciliationPage";
import TDApprovalStatus from "./pages/TDApprovalStatusPage";
import SeedPlanPage from "./pages/SeedPlanPage";

function App() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <DirectusProvider>
      <BrowserRouter>
        <div style={{ display: "flex", height: "100vh" }}>
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          
          <main
            style={{
              flex: 1,
              backgroundColor: "#000",
              color: "#fff",
              padding: "1rem",
              transition: "margin-left 0.3s ease",
            }}
          >
            <Routes>
              <Route path="/strategicsummary" element={<StrategicSummary />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/salesandmarginplanning" element={<SalesAndMarginPlanning />} />
              <Route path="/tdreconciliation" element={<TDReconciliation />} />
              <Route path="/tdapprovalstatus" element={<TDApprovalStatus />} />
              <Route path="/" element={<EmbedDashboard />} />
              <Route path="/test" element={<EmbedDashboard />} />
              <Route path="/seed-plan" element={<SeedPlanPage />} /> 
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </DirectusProvider>
  );
}

export default App;
