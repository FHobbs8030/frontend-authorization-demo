import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext.jsx";

export default function ProtectedRoute({ children, anonymous = false }) {
  const location = useLocation();
  const { isLoggedIn } = useContext(AppContext);
  const from = location.state?.from || "/ducks";

  if (anonymous && isLoggedIn) return <Navigate to={from} replace />;
  if (!anonymous && !isLoggedIn) return <Navigate to="/signin" replace state={{ from: location }} />;

  return children;
}
