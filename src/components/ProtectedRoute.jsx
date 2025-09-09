import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ loggedIn, children }) {
  const location = useLocation();
  return loggedIn ? children : <Navigate to="/signin" replace state={{ from: location }} />;
}
