import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

function handleLogout() {
  localStorage.removeItem("authToken");
  navigate("/signin");
}

return (
  <nav className="bg-white shadow-sm">
    <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-semibold text-indigo-600">
        Paytm-Clone
      </Link>
      <div className="space-x-3">
        {!token ? (
          <>
            <Link to="/signin" className="text-sm">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-sm px-3 py-1 rounded bg-indigo-600 text-white"
            >
              Sign up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded bg-red-500 text-white"
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  </nav>
  );
}
