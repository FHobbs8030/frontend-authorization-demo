import { Link } from "react-router-dom";
import "./styles/Ducks.css";

export default function Ducks({ onSignOut }) {
  return (
    <div className="ducks">
      <nav className="topnav">
        <Link to="/ducks">Ducks</Link>
        <Link to="/my-profile">My Profile</Link>
        <button className="signout" onClick={onSignOut}>Sign Out</button>
      </nav>

      <div className="ducks__content">
        {/* ... */}
      </div>
    </div>
  );
}
