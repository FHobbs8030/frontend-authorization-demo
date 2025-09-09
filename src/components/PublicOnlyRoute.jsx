import { Navigate } from "react-router-dom";

export default function PublicOnlyRoute({ loggedIn, children }) {
  return loggedIn ? <Navigate to="/ducks" replace /> : children;
}
