import { Navigate, Outlet} from "react-router-dom";

// Function to auto login if the auth_token exists
const AutoLogin = () => {
  const isAuthenticated = localStorage.getItem("career-nest-token");
  return isAuthenticated ?  <Navigate to="/"/> :<Outlet/> ;
};

export default AutoLogin;