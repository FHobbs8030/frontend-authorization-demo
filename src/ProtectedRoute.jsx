import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ loggedIn, children }) {
  const location = useLocation();
  if (!loggedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return children;
}
