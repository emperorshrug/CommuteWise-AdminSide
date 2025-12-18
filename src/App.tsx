import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalSidebar from "./components/GlobalSidebar";
import RouteManager from "./pages/RouteManager";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="relative h-screen w-screen overflow-hidden bg-slate-100">
        {/* LAYER 1: GLOBAL SIDEBAR (Floating on top, Left aligned) */}
        <div className="absolute top-0 left-0 h-full z-50 pointer-events-auto">
          <GlobalSidebar />
        </div>

        {/* LAYER 0: MAIN CONTENT (Full Screen, Behind Sidebar) */}
        {/* We use 'pl-20' (80px) to shift content if you wanted it not to be covered, 
            BUT for a full map feel, we usually use w-full and let the sidebar cover the map edge.
            Since RouteManagerSidebar needs to sit NEXT to GlobalSidebar, we will handle spacing there. */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Routes>
            <Route path="/" element={<RouteManager />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
