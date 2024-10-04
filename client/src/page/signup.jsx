import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RegisterPendings, SignupComponent } from "../components";
import { setLoading } from "../redux/loading";
import "./style.scss";

const Signup = () => {
  const { user } = useSelector((state) => state);
  const [pending, setPending] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      if (location?.pathname === "/signup" || location?.pathname === "/signup/") {
        setPending(false);
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      } else {
        // Simulate checking pending registration
        const checkPending = () => {
          setTimeout(() => {
            if (id === "validId") {
              // Simulate valid pending state
              setPending(true);
            } else {
              alert("Invalid ID or request.");
              navigate("/signup");
            }
            dispatch(setLoading(false)); // Simulate loading state completion
          }, 1000); // Simulate backend delay
        };

        checkPending();
      }
    }
  }, [location]);

  return (
    <div className="Auth">
      <div className="inner">
        {pending ? (
          <RegisterPendings _id={id} />
        ) : (
          <>
            <SignupComponent />

            <div className="bottum">
              <div className="start">
                <p>Terms of use</p>
              </div>
              <div className="end">
                <p>Privacy Policy</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
