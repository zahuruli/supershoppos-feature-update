import React from "react";
import { useState } from "react";
import supershopimg from "../../image/supershop.webp";
import supershoplogo from "../../image/logo.png";
import "./loginpage.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useAuth } from "./Auth";
const SuperShopLogin = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [isLoading, setIsLoading] = useState(false);
  const [passShow, setPassShow] = useState(false);
  const toastId = React.useRef(null);
  const { login } = useAuth();

  // Handle Click From Submition
  const handleFromSignIn = async (event) => {
    event.preventDefault();

    // Input validation
    if (!userName) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Username is required", {
          position: "bottom-center",
        });
      }

      return;
    }

    if (!password) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Password is required", {
          position: "bottom-center",
        });
      }

      return;
    } else if (password.length < 6) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error(
          "Password must be at least 6 characters long",
          {
            position: "bottom-center",
          }
        );
      }
      return;
    }

    setIsLoading(true);
    try {
      await fetch(
        "http://194.233.87.22:" +
          process.env.REACT_APP_BACKEND_PORT +
          "/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },

          body: JSON.stringify({
            username: userName,
            password: password,
            // roles: [selectedOption],
          }),
        }
      ).then(async function (response) {
        const text = await response.json();

        const lastStatus = response.status;
        if (lastStatus === 200) {
          login(text.accessToken, text.roles[0]);
          //console.log(textJson.accessToken, textJson.roles[0]);
          localStorage.setItem("username", userName);
          console.log("textJson" + text);
          console.log("text.id" + text.id);
          console.log("text.accessToken" + text.accessToken);
          if (text.roles[0] === "ROLE_SELLER") {
            navigate("/salepage", {
              state: {
                id: text.id,
                username: text.username,
                email: text.email,
                roles: text.roles,
                accessToken: text.accessToken,
              },
            });
          } else {
            navigate("/home", {
              state: {
                id: text.id,
                username: text.username,
                email: text.email,
                roles: text.roles,
                accessToken: text.accessToken,
              },
            });
          }
        }

        setIsLoading(false);
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast("Username Or Password is Not Correct.");
        }

        // toast(lastStatus);
      });
    } catch (error) {
      console.error("Error saving data:" + error);
      setIsLoading(false);
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast("Error sending data: " + error);
      }
    }
  };

  return (
    <div className="full_div_login_page">
      <img className="img-full-view" src={supershopimg} alt="" />
      <div className="bg-tranparant-background"></div>
      <div className="container_super_shop_login">
        <div className="container_super_shop_all">
          {/* <img className="super-shop-img" src={supershopimg} alt="" /> */}
          <span className="heading">Sign-In</span>
          <div className="logo-login-container">
            <img className="super-shop-logo" src={supershoplogo} alt="" />
            <div className="bg-tranparant-login"></div>
          </div>
          <form className="from_super_shop_login" action="">
            <div className="input_field_super_shop_login">
              <input
                type="text"
                placeholder="Username"
                onChange={(event) => setUserName(event.target.value)}
                required
              />
            </div>
            <div className="input_field_super_shop_login">
              <input
                type={!passShow ? "password" : "text"}
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {passShow ? (
                <FaEye
                  className="icon-login"
                  onClick={() => setPassShow(!passShow)}
                />
              ) : (
                <FaEyeSlash
                  className="icon-login"
                  onClick={() => setPassShow(!passShow)}
                />
              )}
            </div>
            <button
              className="login-button"
              type="submit"
              onClick={handleFromSignIn}
            >
              Sign In
            </button>
          </form>
          {isLoading && (
            <div className="loader-container">
              <RotatingLines color="#333" height={50} width={50} />
            </div>
          )}
        </div>
      </div>
      <ToastContainer stacked autoClose={1000} position="bottom-center" />
    </div>
  );
};

export default SuperShopLogin;
