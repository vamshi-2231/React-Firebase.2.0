import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import Navbar from "./components/Navbar";

function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />      {/* Default route for HomePage */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
