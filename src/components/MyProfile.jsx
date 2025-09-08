import "./styles/MyProfile.css";

export default function MyProfile({ user }) {
  const fromStorage = (() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  const effectiveUser = user || fromStorage;
  const username = effectiveUser?.username ?? "—";
  const email = effectiveUser?.email ?? "—";

  return (
    <div className="profile">
      <h2 className="profile__title">My profile</h2>
      <div className="profile__card">
        <div className="profile__row">
          <span>Username:</span>
          <span>{username}</span>
        </div>
        <div className="profile__row">
          <span>Email:</span>
          <span>{email}</span>
        </div>
      </div>
    </div>
  );
}
