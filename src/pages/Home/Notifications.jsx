import { useEffect, useState } from 'react';
import { FaceFrownIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';

import api from '@/utils/api';
import { classNames } from '@/utils/helper';
import { ReactComponent as AccommodationsIcon } from '@/assets/images/accommodations.svg';
import { ReactComponent as CarRentalIcon } from '@/assets/images/car-rental.svg';
import { ReactComponent as ExcursionIcon } from '@/assets/images/excursion.svg';
import { ReactComponent as PrivateTransportIcon } from '@/assets/images/private-transfers.svg';
import { ReactComponent as TransportIcon } from '@/assets/images/transport.svg';
import { ReactComponent as ViazulTransportIcon } from '@/assets/images/viazul.svg';

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

const Notifications = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [pageNo, setPageNo] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isChangeTab, setTabChange] = useState(true);

  const getNotificationsData = async () => {
    let url = `dashboard/latest-notifications?per_page=6&page=${pageNo}`;

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
      <h3 className='font-semibold 2xl:text-2xl lg:text-xl text-lg pb-4'>
        Notifications
      </h3>
      <div className='border w-full rounded-lg'>
        <nav
          aria-label='Tabs'
          className='-mb-px flex xl:space-x-8 lg:space-x-4 px-4 border-b'
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
                  ? 'border-secondaryColor text-customBlack font-bold'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'group inline-flex cursor-pointer items-center border-b-2 px-1 py-4 xl:text-sm text-xs font-medium'
              )}
            >
              <tab.icon
                aria-hidden='true'
                className={classNames(
                  tab.slug === selectedTab
                    ? 'text-customBlack font-bold'
                    : 'text-gray-400 group-hover:text-gray-500 ',
                  '-ml-0.5 mr-2 h-5 w-5'
                )}
              />
              <span
                className={classNames(
                  tab.slug === selectedTab
                    ? 'text-customBlack font-bold'
                    : ' text-gray-500 hover:text-gray-700',
                  ' cursor-pointer '
                )}
              >
                {tab.name}
              </span>
            </a>
          ))}
        </nav>

        <div className='flex flex-col gap-1 h-[550px] px-4 py-5 overflow-auto'>
          {notifications && notifications.length > 0 ? (
            notifications.map((data, index) => {
              return (
                <div
                  className={classNames(
                    'flex flex-row xl:py-5 py-4',
                    index === notifications.length - 1 ? '' : ' border-b'
                  )}
                  key={data?.id}
                >
                  <div className='flex items-center gap-3'>
                    <div className=' px-2 py-2 bg-[#E9EFFF] rounded-full'>
                      {data?.category === 'accommodations' ? (
                        <AccommodationsIcon className='w-4 h-4' />
                      ) : null}
                      {data?.category === 'excursions' ? (
                        <ExcursionIcon className='w-4 h-4' />
                      ) : null}
                      {data?.category === 'group_transfer' ? (
                        <TransportIcon className='w-4 h-4 fill-black stroke-black' />
                      ) : null}
                      {data?.category === 'private_transfer' ? (
                        <PrivateTransportIcon className='w-4 h-4 fill-black stroke-black' />
                      ) : null}
                      {data?.category === 'viazul' ? (
                        <ViazulTransportIcon className='w-4 h-4 fill-black stroke-black' />
                      ) : null}
                      {data?.category === 'car_rental' ? (
                        <CarRentalIcon className='w-4 h-4' />
                      ) : null}
                    </div>
                    <div className='flex flex-wrap'>
                      <span className='text-wrap break-words xl:text-base lg:text-sm text-xs'>
                        {data?.message}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : isChangeTab ? null : (
            <div className='flex flex-row py-5'>
              <div className='flex items-center gap-3'>
                <FaceFrownIcon className='h-6 w-6' />
                <div className='flex flex-wrap'>
                  <span className='text-wrap break-words normal-case'>
                    No new notifications for{' '}
                    {tabs.find((tab) => tab.slug === selectedTab).name ?? ''}{' '}
                    related.
                  </span>
                </div>
              </div>
            </div>
          )}
          {totalPage <= pageNo ? null : (
            <span
              className='text-customBlue text-base underline text-center cursor-pointer '
              onClick={() => {
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
