import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 w-full">
      <div>
        <div className="flex justify-start space-x-12 items-center h-16">
          <div className="flex items-center">
            <Link
              to="/dashboard"
               className="text-2xl ms-5 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-slide-up">
                  CarrierNest
            </Link>
          </div>
          <div className="flex  justify-between items-center space-x-4">
            <button
              onClick={handleHomeClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Home
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
