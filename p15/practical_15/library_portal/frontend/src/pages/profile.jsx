import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("http://localhost:5000/profile", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setUser(data);
      else navigate("/");
    }
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const res = await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();

    if (res.ok) {
      alert(
        `Goodbye ${data.user.name}\nLogin Time: ${data.user.loginTime}\nLogout Time: ${data.user.logoutTime}`
      );
      navigate("/"); // redirect to login
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Welcome, {user.name}</h1>
      <p>
        <strong>Login Time:</strong> {user.loginTime}
      </p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
