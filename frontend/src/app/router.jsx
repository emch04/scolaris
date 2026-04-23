import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ParentDashboardPage from "../pages/ParentDashboardPage";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import StudentsPage from "../pages/StudentsPage";
import ClassroomsPage from "../pages/ClassroomsPage";
import SchoolsPage from "../pages/SchoolsPage";
import ParentsPage from "../pages/ParentsPage";
import TeachersPage from "../pages/TeachersPage";
import AssignmentsPage from "../pages/AssignmentsPage";
import AttendancePage from "../pages/AttendancePage";
import TimetablePage from "../pages/TimetablePage";
import MessagesPage from "../pages/MessagesPage";
import ClassroomChatPage from "../pages/ClassroomChatPage";
import LibraryPage from "../pages/LibraryPage";
import CalendarPage from "../pages/CalendarPage";
import NetworkContactPage from "../pages/NetworkContactPage";
import CoursePlanPage from "../pages/CoursePlanPage";
import ViewDevoirPage from "../pages/ViewDevoirPage";
import AssignmentDetailPage from "../pages/AssignmentDetailPage";
import CommunicationsPage from "../pages/CommunicationsPage";
import ReportCardPage from "../pages/ReportCardPage";
import BulletinsListPage from "../pages/BulletinsListPage";
import ContactPage from "../pages/ContactPage";
import GradesPage from "../pages/GradesPage";
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";
import SchoolRegistrationPage from "../pages/SchoolRegistrationPage";
import AboutPage from "../pages/AboutPage";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRouter() {
  const STAFF = ["super_admin", "admin", "director", "teacher"];

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-school" element={<SchoolRegistrationPage />} />
      <Route path="/a-propos" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      
      {/* Pages réservées au Staff (Écoles, Classes, Élèves, Devoirs prof) */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={STAFF}><DashboardPage /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute allowedRoles={STAFF}><StudentsPage /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute allowedRoles={STAFF}><AttendancePage /></ProtectedRoute>} />
      <Route path="/attendance/student/:studentId" element={<ProtectedRoute allowedRoles={[...STAFF, "parent"]}><AttendancePage /></ProtectedRoute>} />
      <Route path="/timetable" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><TimetablePage /></ProtectedRoute>} />
      <Route path="/timetable/classroom/:classroomId" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><TimetablePage /></ProtectedRoute>} />
      <Route path="/chat/:classroomId" element={<ProtectedRoute allowedRoles={[...STAFF, "student"]}><ClassroomChatPage /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute allowedRoles={[...STAFF, "student"]}><LibraryPage /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><CalendarPage /></ProtectedRoute>} />
      <Route path="/network-contacts" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><NetworkContactPage /></ProtectedRoute>} />
      <Route path="/course-plans" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><CoursePlanPage /></ProtectedRoute>} />
      <Route path="/course-plans/:classroomId" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><CoursePlanPage /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><MessagesPage /></ProtectedRoute>} />
      <Route path="/parents" element={<ProtectedRoute allowedRoles={["super_admin", "admin", "director"]}><ParentsPage /></ProtectedRoute>} />
      <Route path="/teachers" element={<ProtectedRoute allowedRoles={["super_admin", "admin", "director"]}><TeachersPage /></ProtectedRoute>} />
      <Route path="/classrooms" element={<ProtectedRoute allowedRoles={["super_admin", "admin", "director"]}><ClassroomsPage /></ProtectedRoute>} />
      <Route path="/schools" element={<ProtectedRoute allowedRoles={["super_admin"]}><SchoolsPage /></ProtectedRoute>} />
      <Route path="/assignments" element={<ProtectedRoute allowedRoles={STAFF}><AssignmentsPage /></ProtectedRoute>} />
      <Route path="/assignment/:assignmentId" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><AssignmentDetailPage /></ProtectedRoute>} />
      <Route path="/communications" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><CommunicationsPage /></ProtectedRoute>} />
      <Route path="/bulletins" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><BulletinsListPage /></ProtectedRoute>} />
      <Route path="/bulletin/:studentId" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><ReportCardPage /></ProtectedRoute>} />
      <Route path="/notes/:studentId" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><GradesPage /></ProtectedRoute>} />
      
      {/* Page réservée aux Parents */}
      <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={["parent"]}><ParentDashboardPage /></ProtectedRoute>} />
      
      {/* Page réservée aux Élèves */}
      <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboardPage /></ProtectedRoute>} />
      
      {/* Pages réservées aux utilisateurs connectés */}
      <Route path="/devoirs" element={<ProtectedRoute allowedRoles={[...STAFF, "parent", "student"]}><ViewDevoirPage /></ProtectedRoute>} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}

export default AppRouter;