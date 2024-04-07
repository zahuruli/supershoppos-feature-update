import React from "react";
import "./themeToggle.css";
import { useTheme } from "../../DashboardComponent/context/ThemeContext";
import sun from "../Images/sun.png";
import moon from "../Images/moon.png";
const ThemeToggle = () => {
  const [theme, toggle] = useTheme();

  return (
    <div
      className="theme_container"
      onClick={toggle}
      style={
        theme === "dark" ? { background: "#a3c5b2" } : { background: "#0f172a" }
      }
    >
      <img src={moon} alt="moon" width={15} height={15} />
      <div
        className="ball"
        style={
          theme === "dark"
            ? { left: 1, background: "#0f172a" }
            : { right: 1, background: "white" }
        }
      ></div>
      <img src={sun} alt="sun" width={15} height={15} />
    </div>
  );
};

export default ThemeToggle;
