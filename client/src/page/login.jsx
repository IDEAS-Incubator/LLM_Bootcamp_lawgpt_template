import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GptIcon, RobotIcon } from "../assets"; // Assumed both are from assets
import { LoginComponent } from "../components";
import { setLoading } from "../redux/loading";
import "./style.scss";

const Login = () => {
  const location = useLocation();
  const [auth, setAuth] = useState(false);
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate setting the loading state for login
    if (!user) {
      if (location?.pathname === "/login/auth") {
        setAuth(true);
        setTimeout(() => {
          dispatch(setLoading(false)); // Simulating loading finish
        }, 1000);
      } else {
        setAuth(false);
        setTimeout(() => {
          dispatch(setLoading(false)); // Simulating loading finish
        }, 1000);
      }
    }
  }, [location]);

  const handleLogin = () => {
    // Simulate login logic
    alert("Simulated login process");
  };

  return (
    <div className="Auth">
      <div className="inner">
        {auth ? (
          <LoginComponent />
        ) : (
          <div className="suggection">
            <div>
              <RobotIcon />
            </div>

            <div>
              <p>Welcome to LawGPT</p>
              <p>Log in with your LawGPT account to continue</p>
            </div>

            <div className="btns">
              <button
                onClick={() => {
                  navigate("/login/auth");
                }}
              >
                Log in
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign up
              </button>
            </div>
          </div>
        )}

        <div className="bottum">
          <div className="start">
            <p>Terms of use</p>
          </div>
          <div className="end">
            <p>Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
