import React, { useState, useEffect } from "react";
import "./ThemeSelector.css";
import { useTheme } from "../context/ThemeContext";

const ThemeSelector = ({ isHidden }) => {
  const { changeTheme } = useTheme();

  const [animationState, setAnimationState] = useState("");
  const [renderCount, setRenderCount] = useState(0);

  const handleThemeChange = (event) => {
    changeTheme(event.target.value);
  };

  useEffect(() => {
    if (renderCount >= 1) {
      if (isHidden) {
        setAnimationState("hide");
      } else {
        setAnimationState("show");
      }
    }
    setRenderCount(renderCount + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHidden]);

  const { theme } = useTheme();

  return (
    <select
      onChange={handleThemeChange}
      defaultValue="default"
      className={`select-dropdown z-50 w-full md:w-64 lg:w-96 text-xl h-12 bg-${theme}-secondary text-${theme}-text border-4 border-gray-300 rounded-md p-1 hover:border-${theme}-primary focus:outline-none focus:border-${theme}-primary transition duration-300 
      ${animationState}`}
    >
      <option value="default">Default</option>
      <option value="deuteranopia">Deuteranopia</option>
      <option value="protanopia">Protanopia</option>
      <option value="tritanopia">Tritanopia</option>
      <option value="highContrast">High Contrast</option>
      {/* Add more options for additional themes */}
    </select>
  );
};

export default ThemeSelector;
