import { useNavigate } from "react-router-dom";

export default function SignOutButton({ onSignOut }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        onSignOut?.();
        navigate("/login", { replace: true });
      }}
    >
      Sign Out
    </button>
  );
}
