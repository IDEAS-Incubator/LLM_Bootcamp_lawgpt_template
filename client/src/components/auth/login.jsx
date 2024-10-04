import React, { useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormFeild from "./FormFeild";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { insertUser } from "../../redux/user";
// import instance from "../../config/instance";
import "./style.scss";
// import ReCAPTCHA from "react-google-recaptcha";

const reducer = (state, { type, status }) => {
  switch (type) {
    case "filled":
      return { filled: status };
    case "error":
      return { error: status, filled: state.filled };
    default:
      return state;
  }
};

const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [state, stateAction] = useReducer(reducer, {
    filled: false,
    error: false,
  });

  const [formData, setFormData] = useState({
    email: "",
    pass: "",
    manual: true,
  });

  // const [captchaToken, setCaptchaToken] = useState("");

  // const handleRecaptchaChange = (token) => {
  //   setCaptchaToken(token);
  // };

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const googleAuth = useGoogleLogin({
    onSuccess: (response) => {
      formHandle(null, {
        manual: false,
        token: response.access_token,
      });
    },
  });

  const formHandle = (e, googleData) => {
    e?.preventDefault();
    
    // Frontend logic for handling login (no API call)
    if (formData.email && formData.pass) {
      stateAction({ type: "error", status: false });
      dispatch(insertUser({ email: formData.email }));
      navigate("/");
    } else {
      stateAction({ type: "error", status: true });
    }
  };

  return (
    <div className="Contain">
      <div className="icon">{/*<GptIcon />*/}</div>

      <div>
        {!state.filled ? <h1>Welcome back</h1> : <h1>Enter your password</h1>}
      </div>

      {!state.filled ? (
        <div className="options">
          <form
            className="manual"
            onSubmit={(e) => {
              e.preventDefault();
              stateAction({ type: "filled", status: true });
            }}
          >
            <div>
              <FormFeild
                value={formData.email}
                name={"email"}
                label={"Email address"}
                type={"email"}
                handleInput={handleInput}
              />
            </div>
            <div>
              <button type="submit">Continue</button>
            </div>
          </form>

          <div data-for="acc-sign-up-login">
            <span>Don't have an account?</span>
            <Link to={"/signup"}>Sign up</Link>
          </div>

          {/*<div className="extra">
              <div className="divide">
                  <span>OR</span>
              </div>

              <div className="btns">
                  <button onClick={googleAuth} ><Google /> Continue with Google</button>
                  <button><Microsoft /> Continue with Microsoft Account</button> 
              </div>
          </div>*/}
        </div>
      ) : (
        <form className="Form" onSubmit={formHandle}>
          <div>
            <div className="email">
              <button
                type="button"
                onClick={() => {
                  stateAction({ type: "filled", status: false });
                }}
              >
                Edit
              </button>

              <FormFeild
                value={formData.email}
                name={"email"}
                type={"email"}
                isDisabled
              />
            </div>

            {/* Hide Recaptcha */}
            {/* <ReCAPTCHA
              sitekey={import.meta.env.VITE_SITE_KEY}
              onChange={handleRecaptchaChange}
            /> */}

            <div className="password">
              <FormFeild
                value={formData.pass}
                name={"pass"}
                label={"Password"}
                type={"password"}
                handleInput={handleInput}
                error={state?.error}
              />
            </div>

            <div>
              {state?.error && (
                <div className="error">
                  <div>!</div> Email or password is incorrect.
                </div>
              )}
            </div>

            <button type="submit">Continue</button>

            <div className="forgot">
              <Link to={"/forgot"}>Forgot password?</Link>
            </div>
          </div>
          <div data-for="acc-sign-up-login">
            <span>Don't have an account?</span>
            <Link to={"/signup"}>Sign up</Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginComponent;
