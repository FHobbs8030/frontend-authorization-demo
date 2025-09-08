export default function Profile({ user }) {
  return (
    <main className="page">
      <h2>My Profile</h2>
      <div>Name: {user?.name || "Anonymous"}</div>
      <div>Email: {user?.email || "unknown@example.com"}</div>
    </main>
  );
}

