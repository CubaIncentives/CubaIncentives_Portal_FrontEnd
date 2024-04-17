import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper.jsx';

import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => {
  const initialSidebarState = () => {
    if (window.innerWidth <= 1280) return false;

    return true;
  };

  const [sidebarOpen, setSidebarOpen] = useState(() => initialSidebarState());

  return (
    <div id='main' className='main'>
      <div className='h-full'>
        <Header />
        <main className='relative flex'>
          <div>
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>

          <div
            className={classNames(
              'w-full bg-gray-100 overflow-x-auto',
              'p-6 pb-0  h-[calc(100vh-60px)]'
            )}
          >
            {children ? (
              children
            ) : (
              <Outlet
                context={{
                  sidebarOpen,
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

Layout.propTypes = {
  children: PropTypes.node,
};
