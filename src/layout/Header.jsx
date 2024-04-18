import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import CommonDropdown from '@/components/Common/CommonDropdown';
import { clearLocalStorage, getLocalStorageItem } from '@/utils/helper.jsx';
import logo from '@/assets/images/logo.png';

import Profile from '../components/Common/Profile';

const Header = () => {
  const wrapperRef = useRef(null);

  const userData = getLocalStorageItem('userData')
    ? JSON.parse(getLocalStorageItem('userData'))
    : {};

  const navigate = useNavigate();
  const [menuToggle, setMenuToggle] = useState(false);

  const handleLogout = () => {
    clearLocalStorage();
    navigate('/sign-in');
  };

  const profileMenuOption = [
    {
      render: () => (
        <Link to='/change-password' className='w-full block px-4 py-2'>
          Change Password
        </Link>
      ),
    },
    {
      render: () => (
        <button
          type='button'
          onClick={handleLogout}
          className='block w-full text-left px-4 py-2'
        >
          Logout
        </button>
      ),
    },
  ];

  return (
    <div className='sticky top-0 z-[60] h-[60px] border-b border-gray-200 bg-white shadow-sm '>
      <div className='py-2 px-6 flex items-center w-full justify-between'>
        <div>
          <img
            src={logo}
            alt='cuba'
            className='max-w-[170px] w-full h-[40px]'
          />
        </div>
        <div className='flex items-center'>
          <div className='relative' ref={wrapperRef}>
            <CommonDropdown
              setMenuToggle={setMenuToggle}
              menuToggle={menuToggle}
              menuOption={profileMenuOption}
              wrapperRef={wrapperRef}
            >
              <button
                className='flex items-center'
                onClick={() => setMenuToggle(!menuToggle)}
              >
                <span className='sr-only'>Open user menu</span>

                <Profile
                  employeeName={userData?.name}
                  profilePicture={null}
                  textClass='text-base'
                  customClass='w-10 h-10'
                />
              </button>
            </CommonDropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
