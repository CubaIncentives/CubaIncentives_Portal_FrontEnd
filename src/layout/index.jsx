import React from 'react';
import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

import Header from './Header.jsx';

const Layout = ({ children }) => {
  return (
    <div id='main' className='main'>
      <div className='h-full'>
        <Header />
        <main className='relative'>{children ? children : <Outlet />}</main>
      </div>
    </div>
  );
};

export default Layout;

Layout.propTypes = {
  children: PropTypes.node,
};
