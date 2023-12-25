// src/context/ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('default'); // default theme
  

  const themeStyles = {
    '--hover-background-color': theme === 'default' ? '#111' : 
                                theme === 'deuteranopia' ? '#e0c49b' :
                                theme === 'protanopia' ? '#61e868' :
                                theme === 'tritanopia' ? '#f0b062' :
                                theme === 'highContrast' ? '#1e3ea6' : '#111',
    '--hover-select-color':     theme === 'default' ? '#04AA6D' :
                                theme === 'deuteranopia' ? '#007bff' :
                                theme === 'protanopia' ? '#17a2b8' :
                                theme === 'tritanopia' ? '#d63384' :
                                theme === 'highContrast' ? '#dc3545' : '#04AA6D',
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div style={themeStyles}>
        <ThemeContext.Provider value={{ theme, changeTheme }}>
          {children}
        </ThemeContext.Provider>
    </div>
  );
};

export const useTheme = () => useContext(ThemeContext);
