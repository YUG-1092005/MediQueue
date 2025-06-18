import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Navbar } from "./Navbar/navbar";
import { Footer } from "./Footer/footer";
import axios from "axios";
import AppRoutes from "./Approutes";

function App() {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    // Verify if the user is already authenticated
    const verifyAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_MAIN_SERVER_URL}/user/verify`,
          {
            withCredentials: true, 
          }
        );
        if (response.data.success) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader-wrapper">
          <video
            autoPlay
            loop
            muted
            className="loader-video"
            onLoadedData={(e) => {
              e.target.playbackRate = 2.0;
            }}
          >
            <source src="/loader.webm" type="video/webm" />
          </video>
        </div>
      ) : (
        <BrowserRouter>
          <Navbar
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
          <AppRoutes setIsAuthenticated={setIsAuthenticated} />
          <Footer />
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
