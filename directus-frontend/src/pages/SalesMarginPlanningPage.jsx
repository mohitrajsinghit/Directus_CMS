import { useEffect, useState } from "react";
import axios from "axios";
import { embedDashboard } from "@superset-ui/embedded-sdk";

const supersetUrl = "http://localhost:9004";
const dashboardId = "82ddaf15-df9e-4dfb-bc46-f8ad07b7d06d";

async function getGuestToken() {
  try {
    const loginBody = {
      username: "admin",
      password: "Welcome@123",
      provider: "db",
      refresh: true,
    };

    // Fetch Access Token
    const { data: loginData } = await axios.post(
      `${supersetUrl}/api/v1/security/login`,
      loginBody,
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    const accessToken = loginData.access_token;
    if (!accessToken) throw new Error("Failed to retrieve access token");

    // Fetch CSRF Token
    const { data: csrfData } = await axios.get(`${supersetUrl}/api/v1/security/csrf_token/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    const csrfToken = csrfData.result;
    if (!csrfToken) throw new Error("Failed to retrieve CSRF token");

    // Fetch Guest Token
    const { data: guestTokenData } = await axios.post(
      `${supersetUrl}/api/v1/security/guest_token/`,
      {
        resources: [{ type: "dashboard", id: dashboardId }],
        user: {
          username: "GuestUser",
          first_name: "Guest",
          last_name: "User",
        },
        rls: [],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      }
    );

    return guestTokenData.token;
  } catch (error) {
    console.error("Error retrieving guest token:", error);
    return null;
  }
}

export default function EmbedDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function embedSupersetDashboard() {
      const guestToken = await getGuestToken();
      if (!guestToken) return;

      const container = document.getElementById("superset-container");
      if (!container) return;

      embedDashboard({
        id: dashboardId,
        supersetDomain: supersetUrl,
        mountPoint: container,
        fetchGuestToken: () => guestToken,
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: true,
          filters: { expanded: false },
        },
      });

      // Adjust iframe styles
      setTimeout(() => {
        const iframe = document.querySelector("iframe");
        if (iframe) {
          iframe.style.width = "100%";
          iframe.style.minHeight = "80vh";
        }
      }, 1000);

      setLoading(false);
    }

    embedSupersetDashboard();
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", padding: "1rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>Planning and Approval State Report Dashboard</h1>
      {loading && <p style={{ textAlign: "center" }}>Loading dashboard...</p>}
      <div id="superset-container" style={{ width: "100%", height: "85vh" }}></div>
    </div>
  );
}
