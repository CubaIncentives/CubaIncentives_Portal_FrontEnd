import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useWindowSize } from '@/hooks/useWindowSize';
import { classNames } from '@/utils/helper.jsx';

import navigationData from './SidebarData';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const activePath = location?.pathname?.split('/')[3];
  const subMenuRef = useRef(null);

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState(
    activePath ? activePath : ''
  );

  useEffect(() => {
    if (!isSubMenuOpen) {
      setSelectedSubMenu(activePath);
    }
  }, [isSubMenuOpen]);

  const [width] = useWindowSize();

  useEffect(() => {
    if (width <= 1280) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [width]);

  useOutsideClick(subMenuRef, () => {
    if (isSubMenuOpen) setIsSubMenuOpen(false);
  });
  const sidebarData = {
    organization: navigationData().subMenuListOrg,
    config: navigationData().subMenuListConfig,
    employees: navigationData().subMenuListEmployees,
  };

  return (
    <div
      ref={subMenuRef}
      className={classNames(
        'bg-indigo-700',
        sidebarOpen ? 'w-[220px]' : 'w-[65px]',
        'duration-300 relative min-h-[calc(100vh-60px)]'
      )}
    >
      <nav className='py-5 px-2 overflow-y-auto overflow-x-hidden sidebar-container min-h-[calc(100vh-116px)] max-h-[calc(100vh-116px)] h-auto'>
        <ul role='list' className='space-y-2 sidebar-container'>
          {navigationData().navigation?.length > 0 &&
            navigationData().navigation?.map((item) => {
              return (
                <li
                  title={item?.title}
                  key={item?.name}
                  className='group'
                  onClick={() => {
                    if (item.isSidemenu) {
                      setIsSubMenuOpen(true);
                    } else {
                      setIsSubMenuOpen(false);
                    }
                  }}
                >
                  {item?.isSidemenu ? (
                    <div
                      className={classNames(
                        selectedSubMenu === item?.name
                          ? 'bg-indigo-600 text-white'
                          : 'text-white hover:bg-indigo-600 ',
                        'cursor-pointer flex items-center gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold whitespace-nowrap'
                      )}
                      onClick={() => {
                        setSelectedSubMenu(item?.name);
                      }}
                    >
                      <span
                        className={classNames(
                          selectedSubMenu === item?.name
                            ? 'text-white'
                            : 'text-indigo-200 group-hover:text-white',
                          'h-6 w-6 shrink-0 whitespace-nowrap flex items-center justify-center text-xl',
                          item?.iconClass
                        )}
                      ></span>
                      {sidebarOpen && (
                        <>
                          <p>{item?.title}</p>
                          {item?.isSidemenu && (
                            <ChevronRightIcon className='block ml-auto text-xl text-indigo-300 h-6 w-6' />
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item?.href}
                      className={classNames(
                        selectedSubMenu === item?.name
                          ? 'bg-indigo-600 text-white'
                          : 'text-white hover:bg-indigo-600',
                        'flex items-center gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold whitespace-nowrap'
                      )}
                    >
                      <span
                        className={classNames(
                          selectedSubMenu === item?.name
                            ? 'text-white'
                            : 'text-indigo-200 group-hover:text-white',
                          'h-6 w-6 shrink-0 whitespace-nowrap flex items-center justify-center text-xl',
                          item?.iconClass
                        )}
                      ></span>
                      {sidebarOpen && (
                        <>
                          <p>{item?.title}</p>
                          {item?.isSidemenu && (
                            <ChevronDoubleRightIcon className='block ml-auto text-xl text-indigo-300' />
                          )}
                        </>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
        </ul>
        <div
          className={classNames(
            'z-[99] bg-gray-50 h-[calc(100vh-60px)] absolute top-0 duration-300 overflow-hidden shadow-md',
            isSubMenuOpen ? 'w-[260px]' : 'w-[0px]',
            sidebarOpen ? 'left-[220px]' : 'left-[68px]'
          )}
        >
          <div className='p-5'>
            <h3 className='text-black font-medium text-md capitalize'>
              {selectedSubMenu || 'title'}
            </h3>
            <ul className='mt-4'>
              {sidebarData[selectedSubMenu]?.length > 0 &&
                sidebarData[selectedSubMenu]?.map((submenuItem, subIndex) => {
                  return (
                    <li
                      key={subIndex}
                      className='px-3 py-2'
                      title={submenuItem?.title}
                    >
                      <Link
                        to={submenuItem?.link}
                        className='flex items-center cursor-pointer'
                      >
                        <p className='text-gray-600 text-sm font-semibold text-nowrap '>
                          {submenuItem?.title}
                        </p>
                        {submenuItem?.isPlusIcon && (
                          <span
                            title={submenuItem?.plusIconTitle}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className='icon-plus-square block ml-auto text-xl text-gray-800'
                          ></span>
                        )}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </nav>
      <div
        className={classNames(
          `group flex items-center py-[18px] px-8 gap-x-2 text-sm leading-6 font-semibold whitespace-nowrap bg-indigo-800 text-indigo-200 cursor-pointer ${
            sidebarOpen ? 'justify-start' : 'justify-center'
          }`
        )}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <>
            <ChevronDoubleLeftIcon className='text-xl block text-white h-5 w-5' />
            <p className='text-sm font-medium text-white'>Collapse</p>
          </>
        ) : (
          <ChevronDoubleRightIcon className='block ml-auto text-xl text-white h-5 w-5' />
        )}
      </div>
    </div>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
