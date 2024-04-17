import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [value, setValue] = useState('');

  return (
    <ThemeContext.Provider value={{ value, setValue }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.any,
};
