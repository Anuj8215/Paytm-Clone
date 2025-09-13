import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
function RequireAuth({ children }) {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/signin" replace />;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};


export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
