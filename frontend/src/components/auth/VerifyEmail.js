import { useLocation } from "react-router-dom"; // React Router to handle query params
import { useEffect, useState } from "react";
import {  verifyEmail } from "../../services/api" // Adjust this according to where your API logic resides

const VerifyEmail = () => {
  const location = useLocation();  // Hook to access query parameters
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }
    verifyEmail();
  }, [location.search]);  // Trigger effect when URL changes

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
