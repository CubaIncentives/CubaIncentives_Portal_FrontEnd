import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { Profile } from '@/components/Common';
import {
  classNames,
  clearLocalStorage,
  getLocalStorageItem,
} from '@/utils/helper';
import logo from '@/assets/images/logo.png';

const userNavigation = [
  { name: 'Account settings', href: '/change-password' },
  { name: 'Terms & conditions', href: '/terms-and-conditions' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location?.pathname?.split('/')[1];

  const userData = getLocalStorageItem('userData')
    ? JSON.parse(getLocalStorageItem('userData'))
    : {};

  const [navigation, setNavigation] = useState(() => {
    const savedNavigation = localStorage.getItem('navigation');

    if (savedNavigation) {
      return JSON.parse(savedNavigation);
    }

    return [
      { name: 'Accommodations', href: '/accommodations', current: false },
      { name: 'Excursions', href: '/excursions', current: false },
      { name: 'Car rental', href: '/car-rental', current: false },
      { name: 'Transport', href: '/transport', current: false },
    ];
  });

  const handleLogout = () => {
    clearLocalStorage();
    navigate('/sign-in');
  };

  const handleClick = (name) => {
    const updatedNavigation = navigation.map((item) =>
      item.name === name
        ? { ...item, current: true }
        : { ...item, current: false }
    );

    setNavigation(updatedNavigation);
    localStorage.setItem('navigation', JSON.stringify(updatedNavigation));
  };

  const handleDashboard = () => {
    navigate('/dashboard');

    const updatedNavigation = navigation.map((item) => ({
      ...item,
      current: false,
    }));

    setNavigation(updatedNavigation);
    localStorage.setItem('navigation', JSON.stringify(updatedNavigation));
  };

  useEffect(() => {
    const updatedNavigation = navigation.map((item) => {
      const cleanHref = item.href.startsWith('/')
        ? item.href.slice(1)
        : item.href;

      const isActive =
        cleanHref === activePath || cleanHref.includes(activePath);

      return { ...item, current: isActive };
    });

    setNavigation(updatedNavigation);
    localStorage.setItem('navigation', JSON.stringify(updatedNavigation));
  }, [location]);

  const profileMenuOption = [
    {
      render: () => (
        <Link
          to='/change-password'
          className='w-full block px-4 py-2 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        >
          Account settings
        </Link>
      ),
    },
    {
      render: () => (
        <button
          type='button'
          onClick={handleLogout}
          className='block w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        >
          Logout
        </button>
      ),
    },
  ];

  return (
    <Disclosure as='header' className='bg-white shadow'>
      {({ open }) => (
        <>
          <div className='mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-6'>
            <div className='relative flex h-16 justify-between'>
              <div className='relative z-10 flex px-2 lg:px-0'>
                <div className='flex flex-shrink-0 items-center'>
                  <img
                    src={logo}
                    alt='cuba'
                    className='max-w-[170px] w-full h-[50px] cursor-pointer'
                    onClick={() => handleDashboard()}
                  />
                </div>
              </div>
              <div className='relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0'>
                <div className='w-full sm:max-w-xs md:max-w-md lg:max-w-xl'>
                  <label htmlFor='search' className='sr-only'>
                    Search
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <MagnifyingGlassIcon
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </div>
                    <input
                      id='search'
                      name='search'
                      className='block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      placeholder='Search'
                      type='search'
                    />
                  </div>
                </div>
              </div>
              <div className='relative z-10 flex items-center lg:hidden'>
                {/* Mobile menu button */}
                <DisclosureButton className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                  <span className='absolute -inset-0.5' />
                  <span className='sr-only'>Open menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </DisclosureButton>
              </div>
              <div className='hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center'>
                <Link
                  to='/terms-and-conditions'
                  className='text-gray-500 text-sm font-semibold'
                >
                  Terms & conditions
                </Link>
                {/* Profile dropdown */}
                <Menu as='div' className='relative ml-4 flex-shrink-0'>
                  <div>
                    <MenuButton className='relative flex rounded-full bg-white focus:outline-none'>
                      <span className='absolute -inset-1.5' />
                      <span className='sr-only'>Open user menu</span>
                      <Profile
                        employeeName={userData?.name}
                        profilePicture={null}
                        textClass='text-base'
                        customClass='w-10 h-10'
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className='absolute right-0 z-[99] mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
                  >
                    {profileMenuOption.map((item, index) => (
                      <MenuItem key={index}>{item.render()}</MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <nav
              className='hidden lg:flex lg:space-x-8 lg:py-2'
              aria-label='Global'
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                    'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={() => handleClick(item.name)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <DisclosurePanel as='nav' className='lg:hidden' aria-label='Global'>
            <div className='space-y-1 px-2 pb-3 pt-2'>
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as='a'
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className='border-t border-gray-200 pb-3 pt-4'>
              <div className='flex items-center px-4'>
                <div className='flex-shrink-0'>
                  <Profile
                    employeeName={userData?.name}
                    profilePicture={null}
                    textClass='text-base'
                    customClass='w-10 h-10'
                  />
                </div>
                <div className='ml-3'>
                  <div className='text-base font-medium text-gray-800'>
                    {userData.name}
                  </div>
                  <div className='text-sm font-medium text-gray-500'>
                    {userData.email}
                  </div>
                </div>
              </div>
              <div className='mt-3 space-y-1 px-2'>
                {userNavigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as='a'
                    href={item.href}
                    className='block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  >
                    {item.name}
                  </DisclosureButton>
                ))}

                <DisclosureButton
                  as='button'
                  onClick={() => handleLogout()}
                  className='block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                >
                  Sign out
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
