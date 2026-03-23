import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/src/components/Layout";
import Landing from "@/src/pages/Landing";
import Dashboard from "@/src/pages/Dashboard";
import Chat from "@/src/pages/Chat";
import PatientForm from "@/src/pages/PatientForm";
import Profile from "@/src/pages/Profile";
import History from "@/src/pages/History";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/patient-form" element={<PatientForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
