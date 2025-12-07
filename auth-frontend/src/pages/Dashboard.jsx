// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [me, setMe] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMe(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMe();
  }, [token]);

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>Dashboard</h2>
        <p>Welcome, {user?.name}</p>
        {me && (
          <div className="user-info">
            <p>
              <strong>Email:</strong> {me.email}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(me.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
