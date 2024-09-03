import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import ServicesPage from "./pages/ServicesPage";  // Import the Services page
import AboutPage from "./pages/AboutPage";        // Import the About page
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/services" element={<ServicesPage />} /> {/* Add Services route */}
        <Route path="/about" element={<AboutPage />} />        {/* Add About route */}
      </Routes>
    </Router>
  );
}

export default App;
