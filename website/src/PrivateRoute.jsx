import { Navigate, Outlet} from "react-router-dom";

// Allow access to private routes if user is logged in else show login page
const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("devlinktoken");
  return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
};

export default PrivateRoute;