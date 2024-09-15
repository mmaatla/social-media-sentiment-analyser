import React, { useState, useEffect } from "react";
import axios from "axios";

function TestConnection() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/test");
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to connect to the backend");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Backend Connection Test</h2>
      <p>{message}</p>
    </div>
  );
}

export default TestConnection;
