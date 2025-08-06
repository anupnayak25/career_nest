import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300">
              Career Nest
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleHomeClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              Home
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
