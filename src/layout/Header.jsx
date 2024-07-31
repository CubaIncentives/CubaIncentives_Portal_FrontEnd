import { useCallback, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
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
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';

import { Profile } from '@/components/Common';
import api from '@/utils/api';
import {
  capitalize,
  classNames,
  clearLocalStorage,
  getLocalStorageItem,
  getSearchTopicUrl,
} from '@/utils/helper';
import { GLOBAL_SEARCH_NOT_FOUND } from '@/utils/validationMessages';
import { ReactComponent as AccommodationIcon } from '@/assets/images/accommodations.svg';
import { ReactComponent as CarRentalIcon } from '@/assets/images/car-rental.svg';
import { ReactComponent as ExcursionIcon } from '@/assets/images/excursion.svg';
import { ReactComponent as HomeIcon } from '@/assets/images/home.svg';
import logo from '@/assets/images/logo.png';
import { ReactComponent as SearchIcon } from '@/assets/images/search-icon.svg';
import { ReactComponent as TransportIcon } from '@/assets/images/transport.svg';

const userNavigation = [
  { name: 'Account settings', href: '/change-password' },
  { name: 'Terms & Conditions', href: '/terms-and-conditions' },
];

const navigationTemplate = [
  { name: 'Home', href: '/home', current: false, icon: HomeIcon },
  {
    name: 'Accommodations',
    href: '/accommodations',
    current: false,
    icon: AccommodationIcon,
  },
  {
    name: 'Excursions',
    href: '/excursions',
    current: false,
    icon: ExcursionIcon,
  },
  {
    name: 'Car rental',
    href: '/car-rental',
    current: false,
    icon: CarRentalIcon,
  },
  {
    name: 'Transport',
    href: '/transport',
    current: false,
    icon: TransportIcon,
  },
];

const intialSearchData = {
  isShowNoData: false,
  isLoading: false,
  data: [],
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location?.pathname?.split('/')[1];

  const userData = getLocalStorageItem('userData')
    ? JSON.parse(getLocalStorageItem('userData'))
    : {};

  const [searchTerm, setSearchTerm] = useState('');
  const [navigation, setNavigation] = useState(() => {
    const savedNavigation = localStorage.getItem('navigation');

    if (savedNavigation) {
      const parsedNavigation = JSON.parse(savedNavigation);

      return parsedNavigation.map((item, index) => ({
        ...item,
        icon: navigationTemplate[index].icon,
      }));
    }

    return navigationTemplate;
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
    navigate('/home');

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

  const inputSearchRef = useRef(null);

  const searchUserInputData = async () => {
    const response = await api.get(
      `search?query=${encodeURIComponent(searchTerm)}`
    );

    return response.data;
  };

  const debounce = (func, delay) => {
    let timeoutId;

    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const useGlobalSearch = () => {
    const [searchData, setSearchData] = useState(intialSearchData);
    const globalSearch = useMutation(searchUserInputData, {
      onSuccess: (data) => {
        setSearchData({
          isLoading: false,
          isShowNoData: data?.data && data?.data?.length === 0,
          data: data?.data,
        });
      },
      onError: () => {
        setSearchData(intialSearchData);
      },
    });

    return { globalSearch, searchData, setSearchData };
  };

  const { globalSearch, searchData, setSearchData } = useGlobalSearch();

  const handleSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.length >= 3) {
        setSearchData({ ...intialSearchData, isLoading: true });
        globalSearch.mutate(searchTerm);
      } else {
        setSearchData(intialSearchData);
      }
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputSearchRef.current &&
        !inputSearchRef.current.contains(event.target)
      ) {
        setSearchData(intialSearchData);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Disclosure as='header' className='bg-white shadow '>
      {({ open }) => (
        <>
          <div className='mx-auto'>
            <div className='flex justify-center  w-full'>
              <div className='flex justify-center max-w-[1920px] w-full'>
                <div className='relative w-full flex h-[70px] justify-between px-6 sm:px-8 lg:px-6 min-[2000px]:px-4'>
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
                  <div className='relative z-10 flex flex-1 items-center justify-center px-2'>
                    <div
                      ref={inputSearchRef}
                      className=' w-full sm:max-w-xs md:max-w-md lg:max-w-xl'
                    >
                      <div className='relative'>
                        <label htmlFor='search' className='sr-only'>
                          Search
                        </label>
                        <div className='relative'>
                          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                            <SearchIcon
                              className='h-5 w-5 text-gray-400'
                              aria-hidden='true'
                            />
                          </div>

                          <input
                            id='search'
                            name='search'
                            autoComplete='off'
                            className='bg-[#F5F6F9] block p-2 leading-7 rounded-lg pl-12 pr-10 w-full appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 placeholder:text-sm focus:border-blueColor focus:bg-white focus:outline-none sm:text-sm h-[40px]'
                            placeholder='Search for accommodation, excursion, car rentals, etc...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e?.target?.value)}
                          />

                          {searchTerm?.length > 0 && (
                            <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                              <div
                                className='cursor-pointer flex items-center h-4 w-4 bg-lightRed rounded-full justify-center'
                                onClick={() => {
                                  setSearchTerm('');
                                  setSearchData(intialSearchData);
                                }}
                              >
                                <XMarkIcon
                                  className='block h-3 w-3 transform text-darkRed'
                                  aria-hidden='true'
                                  title='delete'
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {searchData?.isLoading ? (
                        <div className=' w-full max-h-[300px] h-auto bg-white  rounded-lg sm:max-w-xs md:max-w-md lg:max-w-xl absolute  mt-2 top-14'>
                          <div className='h-full flex flex-col gap-4 overflow-y-auto px-3.5'>
                            <Skeleton count={6} height={42} />
                          </div>
                        </div>
                      ) : null}

                      {searchData?.isShowNoData && !searchData?.isLoading ? (
                        <div className=' w-full max-h-[300px] h-auto bg-grayNeutral-50 hover:bg-white  rounded-lg sm:max-w-xs md:max-w-md lg:max-w-xl absolute  mt-2 top-14 shadow-md '>
                          <div className='h-full flex flex-col gap-4 overflow-y-auto py-2 px-3.5'>
                            <span className='text-sm text-customBlack py-2'>
                              {GLOBAL_SEARCH_NOT_FOUND}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      {!searchData?.isShowNoData &&
                      !searchData?.isLoading &&
                      searchData?.data?.length > 0 ? (
                        <div className=' w-full bg-white  rounded-lg sm:max-w-xs md:max-w-md lg:max-w-xl absolute  mt-2 top-14'>
                          <ul className=' rounded-md max-h-[280px] h-auto overflow-y-auto border-gray-100 shadow-md '>
                            {searchData?.data.map((data, index) => {
                              const slug = getSearchTopicUrl(
                                data?.type,
                                data?.slug
                              );

                              return (
                                <li
                                  key={index}
                                  className='px-3.5 break-words py-2 border-b-2 bg-white border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900 '
                                  onClick={() => {
                                    navigate(slug ?? '');
                                    setSearchTerm('');
                                    setSearchData(intialSearchData);
                                  }}
                                >
                                  <b className='text-base'>
                                    {data?.title ? capitalize(data?.title) : ''}
                                  </b>
                                  {data?.location && (
                                    <>
                                      &nbsp;|&nbsp;
                                      <span className='text-sm'>
                                        {capitalize(data.location)}
                                      </span>
                                    </>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className='relative z-10 flex items-center lg:hidden'>
                    {/* Mobile menu button */}
                    <DisclosureButton className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                      <span className='absolute -inset-0.5' />
                      <span className='sr-only'>Open menu</span>
                      {open ? (
                        <XMarkIcon
                          className='block h-6 w-6'
                          aria-hidden='true'
                        />
                      ) : (
                        <Bars3Icon
                          className='block h-6 w-6'
                          aria-hidden='true'
                        />
                      )}
                    </DisclosureButton>
                  </div>
                  <div className='hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center'>
                    <Link
                      to='/terms-and-conditions'
                      className='text-sm font-medium'
                    >
                      Terms & Conditions
                    </Link>
                    <div className='h-10 w-px ml-[30px] bg-slate-200'></div>
                    {/* Profile dropdown */}
                    <Menu as='div' className='relative ml-[30px] flex-shrink-0'>
                      <div>
                        <MenuButton className='relative flex rounded-full bg-white focus:outline-none'>
                          <span className='absolute -inset-1.5' />
                          <span className='sr-only'>Open user menu</span>
                          <div className='text-left flex items-center'>
                            <div>
                              <p className='text-sm font-semibold'>
                                {userData?.name}
                              </p>
                              <p className='text-gray-500 text-xs font-medium mt-1'>
                                {userData?.company}
                              </p>
                            </div>

                            <ChevronDownIcon className='h-5 w-5 ml-4' />
                          </div>
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
              </div>
            </div>

            <nav
              className='hidden lg:flex lg:justify-center xl:space-x-14 lg:space-x-11 lg:py-px bg-primaryColor h-[70px] px-6'
              aria-label='Global'
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'text-secondaryColor border-secondaryColor font-semibold'
                      : 'text-white border-primaryColor',
                    'group uppercase inline-flex items-center px-4 py-3 text-base font-medium hover:text-secondaryColor border-b-4 hover:border-secondaryColor'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={() => handleClick(item.name)}
                >
                  {item.icon && (
                    <item.icon
                      className={classNames(
                        'mr-2 h-5 w-5',
                        item.current ? 'text-secondaryColor' : 'text-white',
                        'group-hover:text-secondaryColor'
                      )}
                    />
                  )}

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
