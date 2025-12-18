// src/components/RouteManagerSidebar.tsx

/**
 * CONTEXT: COMMUTEWISE ROUTE MANAGER SIDEBAR FACADE
 * =================================================
 * THIS COMPONENT CHOOSES BETWEEN:
 *
 * - StopManagerPanel (DEFAULT STOP / TERMINAL MANAGEMENT MODE)
 * - RouteBuilderPanel (ROUTE CREATION MODE)
 *
 * THE ACTUAL LOGIC FOR EACH MODE LIVES IN THEIR OWN MODULES.
 */

import { useRouteBuilderStore } from "../store/useRouteBuilderStore";
import StopManagerPanel from "./sidebar/StopManagerPanel";
import RouteBuilderPanel from "./sidebar/RouteBuilderPanel";

interface RouteManagerSidebarProps {
  onClose: () => void;
}

export default function RouteManagerSidebar({
  onClose,
}: RouteManagerSidebarProps) {
  const { isBuilding } = useRouteBuilderStore();

  // CAPS LOCK COMMENT: WHEN ROUTE BUILDER MODE ACTIVE -> SHOW BUILDER PANEL
  if (isBuilding) {
    return <RouteBuilderPanel />;
  }

  // CAPS LOCK COMMENT: OTHERWISE SHOW STANDARD STOP MANAGER PANEL
  return <StopManagerPanel onClose={onClose} />;
}
