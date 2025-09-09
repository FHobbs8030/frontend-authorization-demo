import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AppContext from "../context/AppContext.jsx";

export default function NavBar() {
  const { signOut, isLoggedIn } = useContext(AppContext);
  return (
    <ul>
      <li><NavLink to="/ducks">Ducks</NavLink></li>
      <li><NavLink to="/my-profile">My Profile</NavLink></li>
      {isLoggedIn && <li><button onClick={signOut}>Sign Out</button></li>}
    </ul>
  );
}
