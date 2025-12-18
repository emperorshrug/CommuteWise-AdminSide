import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalSidebar from "./components/GlobalSidebar";
import RouteManager from "./pages/RouteManager";
import "./App.css";

// CAPS LOCK COMMENT: THESE CONSTANTS MIRROR THE TAILWIND WIDTH CLASSES USED IN GLOBALSIDEBAR
// CAPS LOCK COMMENT: W-20 = 5REM, W-64 = 16REM (ASSUMING 16PX ROOT FONT SIZE)
const GLOBAL_SIDEBAR_WIDTH_COLLAPSED = 80; // 5 * 16
const GLOBAL_SIDEBAR_WIDTH_EXPANDED = 256; // 16 * 16

function App() {
  // CAPS LOCK COMMENT: LIFTED GLOBAL SIDEBAR EXPANDED STATE SO OTHER LAYERS KNOW ITS CURRENT WIDTH
  const [isGlobalSidebarExpanded, setIsGlobalSidebarExpanded] = useState(false);

  const globalSidebarWidth = isGlobalSidebarExpanded
    ? GLOBAL_SIDEBAR_WIDTH_EXPANDED
    : GLOBAL_SIDEBAR_WIDTH_COLLAPSED;

  return (
    <Router>
      {/* CAPS LOCK COMMENT: ROOT LAYER - MAP LIVES BEHIND EVERYTHING, SIDE BARS FLOAT ABOVE */}
      <div className="relative h-screen w-screen overflow-hidden bg-slate-100">
        {/* CAPS LOCK COMMENT: GLOBAL NAV SIDEBAR (FLOATING ON TOP, LEFT ALIGNED) */}
        <div className="absolute top-0 left-0 h-full z-50 pointer-events-auto">
          <GlobalSidebar
            isExpanded={isGlobalSidebarExpanded}
            onToggle={() => setIsGlobalSidebarExpanded((prev) => !prev)}
          />
        </div>

        {/* CAPS LOCK COMMENT: MAIN CONTENT LAYER (MAP + ROUTE MANAGER ETC.) BEHIND THE SIDE BAR */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Routes>
            {/* CAPS LOCK COMMENT: GLOBAL SIDEBAR WIDTH IS PASSED DOWN SO ROUTEMANAGER CAN POSITION ITS OWN SIDEBAR NEXT TO IT */}
            <Route
              path="/"
              element={<RouteManager globalSidebarWidth={globalSidebarWidth} />}
            />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
