import React, { useEffect, useLayoutEffect, useState, Suspense } from "react";
import { Menu } from "./components";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./components/loading/loading";
import { lazy } from "react";
const Main = lazy(() => import("./page/chat"));
const Login = lazy(() => import("./page/login"));
const Signup = lazy(() => import("./page/signup"));
const Forgot = lazy(() => import("./page/forgot"));
const ErrorPage = lazy(() => import("./page/error"));

const App = () => {
  const [offline, setOffline] = useState(!window.navigator.onLine);

  const { loading, user } = useSelector((state) => state);

  const changeColorMode = (to) => {
    if (to) {
      localStorage.setItem("darkMode", true);
      document.body.className = "dark";
    } else {
      localStorage.removeItem("darkMode");
      document.body.className = "light";
    }
  };

  // Dark & Light Mode
  useLayoutEffect(() => {
    let mode = localStorage.getItem("darkMode");
    if (mode) {
      changeColorMode(true);
    } else {
      changeColorMode(false);
    }
  });

  // Offline
  useEffect(() => {
    window.addEventListener("online", () => {
      location.reload();
    });

    window.addEventListener("offline", () => {
      setOffline(true);
    });

    return () => {
      window.removeEventListener("online", () => {
        location.reload();
      });
      window.removeEventListener("offline", () => {
        setOffline(true);
      });
    };
  }, []);

  return (
    <section className={user ? "main-grid" : null}>
      {user && (
        <div>
          <Menu changeColorMode={changeColorMode} />
        </div>
      )}

      {loading && <Loading />}

      {offline && (
        <ErrorPage
          status={503}
          content={"Website in offline check your network."}
        />
      )}

      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Main routes without ProtectedRoute */}
          <Route exact path="/" element={<Login />} />
          <Route path="/chat" element={<Main />} />
          <Route path="/chat/:id" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/auth" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/pending/:id" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/forgot/set/:userId/:secret" element={<Forgot />} />
          
          {/* Error handling */}
          <Route
            path="*"
            element={
              <ErrorPage status={404} content={"This page could not be found."} />
            }
          />
        </Routes>
      </Suspense>
    </section>
  );
};

export default App;
