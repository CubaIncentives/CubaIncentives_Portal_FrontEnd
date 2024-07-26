import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { FaceFrownIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';

import api from '@/utils/api';
import { classNames } from '@/utils/helper';
import { ReactComponent as AccommodationsNotificationIcon } from '@/assets/images/accommodations_notification.svg';
import { ReactComponent as AccommodationsIcon } from '@/assets/images/accommodations.svg';
import { ReactComponent as CarRentalNotificationIconIcon } from '@/assets/images/car_rental_notification.svg';
import { ReactComponent as CarRentalIcon } from '@/assets/images/car-rental.svg';
import { ReactComponent as ExcursionIcon } from '@/assets/images/excursion.svg';
import { ReactComponent as ExcursionsNotificationIcon } from '@/assets/images/excursions_notification.svg';
import { ReactComponent as GroupTransportNotificationIcon } from '@/assets/images/group_transfer_notification.svg';
import { ReactComponent as PrivateTransportNotificationIcon } from '@/assets/images/private_transfer_notification.svg';
import { ReactComponent as TransportIcon } from '@/assets/images/transport.svg';
import { ReactComponent as ViazulTransportNotificationIcon } from '@/assets/images/viazul_transfer_notification.svg';

const tabs = [
  { name: 'All', slug: 'all', icon: Squares2X2Icon },
  {
    name: 'Accommodations',
    slug: 'accommodations',
    icon: AccommodationsIcon,
  },
  {
    name: 'Excursions',
    slug: 'excursions',
    icon: ExcursionIcon,
  },
  {
    name: 'Car Rentals',
    slug: 'car_rental',
    icon: CarRentalIcon,
  },
  {
    name: 'Transport',
    slug: 'transfers',
    icon: TransportIcon,
  },
];

const Loader = () => {
  return (
    <div className='flex gap-5 flex-col'>
      <Skeleton count={7} className='rounded-lg  w-10 h-[46px] mb-5' />
    </div>
  );
};

const Notifications = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [pageNo, setPageNo] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isChangeTab, setTabChange] = useState(true);
  const [isShowLoadMoreLoader, setIsShowLoadMoreLoader] = useState(false);

  const getNotificationsData = async () => {
    let url = `dashboard/latest-notifications?per_page=4&page=${pageNo}`;

    if (selectedTab !== 'all') {
      url += `&category=${selectedTab}`;
    }
    const res = await api.get(url);

    return res.data;
  };

  const { isFetching, isLoading, refetch } = useQuery(
    ['latest-notification'],
    () => getNotificationsData(),
    {
      enabled: !!pageNo,
      onSuccess: (data) => {
        const response = data?.data;

        setTotalPage(data?.meta?.last_page);
        setNotifications((notifications) => [...notifications, ...response]);
        setTabChange(false);
        setIsShowLoadMoreLoader(false);
      },
    }
  );

  useEffect(() => {
    if (!isLoading && !isFetching) {
      setTabChange(true);
      setNotifications([]);
      setTotalPage(1);
      setPageNo(1);
      setTimeout(() => {
        refetch();
      }, 300);
    }
  }, [selectedTab]);

  return (
    <div className='flex flex-col w-full'>
      <h3 className='font-extrabold  2xl:text-[34px] xl:text-3xl lg:text-2xl text-lg pb-[30px]'>
        Notifications
      </h3>
      <div className='border w-full h-screen 2xl:max-h-[610px] xl:max-h-[610px] lg:max-h-[560px] max-[400px] rounded-lg'>
        <nav
          aria-label='Tabs'
          className='-mb-px flex 2xl:space-x-8 lg:space-x-4 px-4 border-b bg-grayTrue-25 overflow-y-auto'
        >
          {tabs.map((tab) => (
            <a
              key={tab.name}
              onClick={() => {
                setSelectedTab(tab.slug);
              }}
              aria-current={tab.slug === selectedTab ? 'page' : undefined}
              className={classNames(
                tab.slug === selectedTab
                  ? 'border-secondaryColor border-b  font-bold '
                  : 'border-transparent text-customBlack font-normal',
                'group inline-flex cursor-pointer  text-customBlack items-center border-b-4 px-4 py-4 2xl:text-lg xl:text-lg text-lg '
              )}
            >
              <tab.icon
                aria-hidden='true'
                className={classNames(
                  tab.slug === selectedTab
                    ? 'text-customBlack '
                    : 'text-customBlack ',
                  '-ml-0.5 mr-2 h-5 w-5'
                )}
              />
              <span
                className={classNames(
                  tab.slug === selectedTab
                    ? 'text-customBlack '
                    : ' text-customBlack ',
                  ' cursor-pointer '
                )}
              >
                {tab.name}
              </span>
            </a>
          ))}
        </nav>
        {/* xl:max-h-[550px] lg:max-h-[500px] max-h-[550px] */}
        <div className='flex flex-col gap-1 h-full xl:max-h-[90%] lg:h-[85%]  px-4 py-5 overflow-auto'>
          {notifications && notifications.length > 0 ? (
            notifications.map((data, index) => {
              let title = '';

              if (data?.category === 'car_rental') {
                title = 'Car rental';
              } else if (data?.category === 'accommodations') {
                title = 'Accommodations';
              } else if (data?.category === 'excursions') {
                title = 'Excursions';
              } else if (data?.category === 'group_transfer') {
                title = 'Group Transfer';
              } else if (data?.category === 'viazul') {
                title = 'Viazul';
              } else if (data?.category === 'private_transfer') {
                title = 'Private Transfer';
              }

              return (
                <div
                  className={classNames(
                    'flex flex-row xl:py-5 py-4',
                    index === notifications.length - 1 ? '' : ' border-b'
                  )}
                  key={data?.id}
                >
                  <div className='flex items-start gap-3'>
                    <div className=' px-2 py-2 bg-[#E9EFFF] rounded-full'>
                      {data?.category === 'accommodations' ? (
                        <AccommodationsNotificationIcon className='w-5 h-5' />
                      ) : null}
                      {data?.category === 'excursions' ? (
                        <ExcursionsNotificationIcon className='w-5 h-5' />
                      ) : null}
                      {data?.category === 'group_transfer' ? (
                        <GroupTransportNotificationIcon className='w-5 h-5 ' />
                      ) : null}
                      {data?.category === 'private_transfer' ? (
                        <PrivateTransportNotificationIcon className='w-5 h-5 ' />
                      ) : null}
                      {data?.category === 'viazul' ? (
                        <ViazulTransportNotificationIcon className='w-5 h-5  ' />
                      ) : null}
                      {data?.category === 'car_rental' ? (
                        <CarRentalNotificationIconIcon className='w-5 h-5' />
                      ) : null}
                    </div>
                    <div className='flex flex-col flex-wrap'>
                      <span className='text-wrap break-words 2xl:text-xl lg:text-lg font-extrabold text-xs'>
                        {data?.content_id?.name ?? title}
                      </span>

                      <span className='text-wrap break-words 2xl:text-lg lg:text-base text-xs font-medium text-[#585858]'>
                        {data?.message}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : isChangeTab ? (
            <Loader />
          ) : (
            <div className='flex flex-row py-5'>
              <div className='flex items-center gap-3'>
                <FaceFrownIcon className='h-6 w-6' />
                <div className='flex flex-wrap'>
                  <span className='text-wrap break-words  2xl:text-xl lg:text-base font-extrabold text-xs text-[#585858] normal-case'>
                    No new notifications for{' '}
                    {tabs.find((tab) => tab.slug === selectedTab).name ?? ''}{' '}
                    related.
                  </span>
                </div>
              </div>
            </div>
          )}

          {isShowLoadMoreLoader ? <Loader /> : null}

          {totalPage <= pageNo && !isShowLoadMoreLoader ? null : (
            <span
              className='text-customBlue text-base font-normal underline text-center cursor-pointer pb-5'
              onClick={() => {
                setIsShowLoadMoreLoader(true);
                setPageNo((prevPageNo) => prevPageNo + 1);
                setTimeout(() => {
                  refetch();
                }, 300);
              }}
            >
              Load More
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
