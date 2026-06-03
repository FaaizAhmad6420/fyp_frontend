import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Resumes from "./pages/Resumes";
import UploadResume from "./pages/UploadResume";
import Applications from "./pages/Applications";
import ApplicationEditor from "./pages/ApplicationEditor";
import ApplicationDetail from "./pages/ApplicationDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/upload-resume" element={<UploadResume />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
          <Route path="/applications/:id/edit" element={<ApplicationEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
