import React from "react";
import { useState } from "react";
import supershopimg from "../../image/supershop.webp";
import supershoplogo from "../../image/logo.png";
import "./sign_up.css";
import { FaEye } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import { FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SuperShopRegister = () => {
  const [passShow, setPassShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const [selectedRoles, setSelectedRoles] = useState("seller");
  const [isDisabledOTPButton, setIsDisabledOTPButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const toastId = React.useRef(null);

  const handleOptionChange = (event) => {
    setSelectedRoles(event.target.value);
  };

  // Handle Click From Submition
  const handleFromSubmit = async (event) => {
    event.preventDefault();

    // Input Validtion

    const newErrors = {};

    if (!userName) {
      newErrors.userName = "Username is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!OTP) {
      newErrors.OTP = "OTP is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (selectedRoles.length === 0) {
      newErrors.selectedRoles = "Select at least one role";
    }

    // If there are validation errors, display toast messages
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(error, {
            position: "bottom-center",
          });
        }
      });
      return;
    }
    // Input Validation End
    setIsLoading(true);
    setIsDisabledOTPButton(false);

    try {
      await fetch(
        "http://194.233.87.22:" +
          process.env.REACT_APP_BACKEND_PORT +
          "/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
            OTPemail: "merinasoft.official@gmail.com",
            USERemail: email,
            OTP: OTP,
            password: password,
            roles: [selectedRoles],
          }),
        }
      ).then(async function (response) {
        const text = await response.text();
        sleep(1000).then(() => {
          setIsLoading(false);
        });
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast(text);
        }

        // toast(text);
        console.log(text); //here you can access it
      });

      console.log("Data saved successfully");
    } catch (error) {
      setIsLoading(false);
      console.error("Error saving data:", error);
    }
  };

  // Hand Click Send OTP
  const handleOtp = async (event) => {
    event.preventDefault();

    // Input validation
    if (!email) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Email is required", {
          position: "bottom-center",
        });
      }

      return;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Invalid email format", {
          position: "bottom-center",
        });
      }

      return;
    }
    // input validation end
    setIsLoading(true);
    setIsDisabledOTPButton(true);

    try {
      await fetch(
        "http://194.233.87.22:" +
          process.env.REACT_APP_BACKEND_PORT +
          "/api/auth/otp",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      ).then(async function (response) {
        const text = await response.text();
        sleep(1000).then(() => {
          setIsLoading(false);
        });
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast(text);
        }
        // toast(text);
        console.log(text); //here you can access it
      });

      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  console.log(OTP);
  return (
    <div className="full_div_register_page">
      <img className="img-full-view" src={supershopimg} alt="" />
      <div className="bg-tranparant-background"></div>
      <div className="container_super_shop_register">
        <div className="container_super_shop_all">
          <span className="heading">Sign-Up</span>

          {/* User Rules Start */}
          <div className="rules_register">
            <div className="input_field_roles">
              <input
                type="radio"
                id="admin"
                name="userType"
                value="admin"
                checked={selectedRoles === "admin"}
                onChange={handleOptionChange}
              />
              <label htmlFor="admin">Admin</label>
            </div>
            <div className="input_field_roles">
              <input
                type="radio"
                id="seller"
                name="userType"
                value="seller"
                checked={selectedRoles === "seller"}
                onChange={handleOptionChange}
              />
              <label htmlFor="seller">Seller</label>
            </div>
            <div className="input_field_roles">
              <input
                type="radio"
                id="moderator"
                name="userType"
                value="moderator"
                checked={selectedRoles === "moderator"}
                onChange={handleOptionChange}
              />
              <label htmlFor="moderator">Moderator</label>
            </div>
          </div>
          {/* User Rules Start */}

          <div className="logo-register-container">
            <img
              className="super-shop-logo-register"
              src={supershoplogo}
              alt=""
            />
            <div className="bg-tranparant-register"></div>
          </div>

          {/* Start Form Register */}
          <form className="from_super_shop_register" action="">
            <div className="input_field_super_shop_register">
              <input
                type="text"
                placeholder="Username"
                onChange={(event) => setUserName(event.target.value)}
              />
            </div>
            <div className="input_field_super_shop_register">
              <input
                type="email"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="input_field_super_shop_register">
              <input
                type={!passShow ? "password" : "text"}
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
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
            <div
              className="input_field_super_shop_register"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <input
                placeholder="OTP"
                style={{ width: "11vw" }}
                onChange={(event) => setOTP(event.target.value)}
              />
              <button
                className="sm-buttom"
                disabled={isDisabledOTPButton}
                onClick={handleOtp}
              >
                Send
              </button>
            </div>
            <button
              className="register-button"
              type="submit"
              onClick={handleFromSubmit}
            >
              Sign Up
            </button>
          </form>
          {/* End Form Register */}
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

export default SuperShopRegister;
