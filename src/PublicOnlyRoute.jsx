import { Navigate, useLocation } from "react-router-dom";

export default function PublicOnlyRoute({ loggedIn, children }) {
  const location = useLocation();
  if (loggedIn) {
    const dest = location.state?.from?.pathname || "/ducks";
    return <Navigate to={dest} replace />;
  }
  return children;
}
