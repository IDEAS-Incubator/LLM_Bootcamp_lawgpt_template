import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ForgotComponent } from "../components";
import { setLoading } from "../redux/loading";
import "./style.scss";

const Forgot = () => {
  const { user } = useSelector((state) => state);
  const { userId = null, secret = null } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRequest, setIsRequest] = useState(true);

  useEffect(() => {
    if (!user) {
      if (
        location?.pathname === "/forgot/" ||
        location?.pathname === "/forgot"
      ) {
        setIsRequest(true);
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      } else {
        // Simulate backend check for resetting password
        const getResponse = () => {
          setTimeout(() => {
            if (userId && secret) {
              // Simulate success/failure response
              if (userId === "validUserId" && secret === "validSecret") {
                setIsRequest(false); // Allow password reset
              } else {
                alert("Invalid userId or secret.");
                navigate("/forgot"); // Redirect on failure
              }
            } else {
              navigate("/forgot");
            }
            dispatch(setLoading(false));
          }, 1000);
        };

        getResponse();
      }
    }
  }, [location]);

  return (
    <div className="Auth">
      <div className="inner">
        <ForgotComponent isRequest={isRequest} userId={userId} secret={secret} />
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

export default Forgot;
