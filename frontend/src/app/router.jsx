import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ParentDashboardPage from "../pages/ParentDashboardPage";
import StudentsPage from "../pages/StudentsPage";
import ClassroomsPage from "../pages/ClassroomsPage";
import SchoolsPage from "../pages/SchoolsPage";
import AssignmentsPage from "../pages/AssignmentsPage";
import ViewDevoirPage from "../pages/ViewDevoirPage";
import AssignmentDetailPage from "../pages/AssignmentDetailPage";
import CommunicationsPage from "../pages/CommunicationsPage";
import ReportCardPage from "../pages/ReportCardPage";
import BulletinsListPage from "../pages/BulletinsListPage";
import GradesPage from "../pages/GradesPage";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRouter() {
  const STAFF = ["super_admin", "admin", "director", "teacher"];

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Pages réservées au Staff (Écoles, Classes, Élèves, Devoirs prof) */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={STAFF}><DashboardPage /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute allowedRoles={STAFF}><StudentsPage /></ProtectedRoute>} />
      <Route path="/classrooms" element={<ProtectedRoute allowedRoles={["super_admin", "admin", "director"]}><ClassroomsPage /></ProtectedRoute>} />
      <Route path="/schools" element={<ProtectedRoute allowedRoles={["super_admin"]}><SchoolsPage /></ProtectedRoute>} />
      <Route path="/assignments" element={<ProtectedRoute allowedRoles={STAFF}><AssignmentsPage /></ProtectedRoute>} />
      <Route path="/assignment/:assignmentId" element={<ProtectedRoute allowedRoles={[...STAFF, "parent"]}><AssignmentDetailPage /></ProtectedRoute>} />
      <Route path="/communications" element={<ProtectedRoute allowedRoles={[...STAFF, "parent"]}><CommunicationsPage /></ProtectedRoute>} />
      <Route path="/bulletins" element={<ProtectedRoute allowedRoles={[...STAFF, "parent"]}><BulletinsListPage /></ProtectedRoute>} />
      <Route path="/bulletin/:studentId" element={<ProtectedRoute allowedRoles={[...STAFF, "parent"]}><ReportCardPage /></ProtectedRoute>} />
      <Route path="/notes/:studentId" element={<ProtectedRoute allowedRoles={[...STAFF, "parent"]}><GradesPage /></ProtectedRoute>} />
      
      {/* Page réservée aux Parents */}
      <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={["parent"]}><ParentDashboardPage /></ProtectedRoute>} />
      
      {/* Page publique */}
      <Route path="/devoirs" element={<ViewDevoirPage />} />
    </Routes>
  );
}

export default AppRouter;