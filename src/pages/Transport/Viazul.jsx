import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  Button,
  CommonModal,
  CommonTable,
  SearchableSelect,
} from '@/components/Common';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import NotificationList from '@/components/Notification/NotificationList';
import NotificationListModal from '@/components/Notification/NotificationListModal';
import api from '@/utils/api';
import { NotificationModalTitle, PAGE_TITLE_SUFFIX } from '@/utils/constants';
import {
  getLocalStorageItem,
  redireacToAdminSite,
  transformSearchableSelectOptions,
} from '@/utils/helper';

const subHeaders = [
  { label: 'From', className: 'max-w-[15%]', key: 'from_location.name' },
  { label: '', className: 'max-w-[5%]', key: 'separator', side: 'right' },
  { label: 'To', className: 'max-w-[15%]', key: 'to_location.name' },
  {
    label: 'Price per person',
    className: 'max-w-[30%]',
    key: 'price_per_person',
  },
  { label: 'Pickup time', className: 'max-w-[35%]', key: 'time' },
];

const Viazul = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const userData = getLocalStorageItem('userData')
    ? JSON.parse(getLocalStorageItem('userData'))
    : {};

  const [notificationData, setNotificationData] = useState({});

  const [isShowNotificationModal, setIsShowNotificationModal] = useState(false);

  const getNotificationData = async () => {
    const res = await api.get(`notification?category=viazul`);

    return res.data;
  };

  const getLocations = async () => {
    let url = `/backend/location`;

    const res = await api.get(url);

    return res.data;
  };

  const {
    data: locationList,
    isFetching: isLocationFetching,
    isLoading: isLocationLoading,
  } = useQuery(['get-location-list'], () => getLocations());

  const fetchAllTransfers = async (fromLocation, toLocation) => {
    let url = '/transfer/viazul';

    const params = [];

    if (fromLocation) {
      params.push(`from=${fromLocation}`);
    }
    if (toLocation) {
      params.push(`to=${toLocation}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const res = await api.get(url);

    return res.data;
  };

  const TransfersMutation = useMutation({
    mutationFn: ({ fromLocation, toLocation }) =>
      fetchAllTransfers(fromLocation, toLocation),
  });

  const handleSelect = (selected, type) => {
    const newLocation = selected ? selected.value : '';

    if (type === 'from') {
      setFromLocation(newLocation);
      TransfersMutation.mutate({ fromLocation: newLocation, toLocation });
    }

    if (type === 'to') {
      setToLocation(newLocation);
      TransfersMutation.mutate({ fromLocation, toLocation: newLocation });
    }
  };

  const NotificationQuery = useQuery(
    ['get-viazul-notification'],
    getNotificationData,
    {
      onSuccess: (data) => {
        setNotificationData(data?.data);
        setIsShowNotificationModal(
          data?.data?.important?.length > 0 ||
            data?.data?.information?.length > 0
        );
        TransfersMutation.mutate({ fromLocation: '', toLocation: '' });
      },
      onError: () => {
        TransfersMutation.mutate({ fromLocation: '', toLocation: '' });
      },
    }
  );

  const pages = [
    { name: 'Transport', href: '/transport', current: false },
    { name: 'Viazul', href: '', current: true },
  ];

  return (
    <div className='px-6 sm:px-8 lg:px-10 py-6 flex justify-center'>
      <div className='max-w-[1920px] w-full'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Viazul {PAGE_TITLE_SUFFIX}</title>
        </Helmet>
        <div>
          <div className='pb-10'>
            <Breadcrumbs pages={pages} />
          </div>
          <div className='flex items-center justify-between mb-2'>
            <h1 className='font-semibold text-3xl'>Viazul</h1>
            {(userData?.role === 'admin' || userData?.role === 'staff') && (
              <Button
                size='sm'
                isOutlined={true}
                onClick={() => {
                  redireacToAdminSite('viazul-transfers');
                }}
              >
                Backend
              </Button>
            )}
          </div>
          <NotificationList
            notifications={notificationData}
            parentCss='!p-0 !pt-2'
          />
        </div>

        <div className='border shadow-md mt-5 py-4 px-3 rounded-lg'>
          <div className='flex gap-5'>
            <div className='w-full max-w-[260px]'>
              <SearchableSelect
                placeholder='From'
                options={transformSearchableSelectOptions(locationList?.data)}
                loading={isLocationFetching || isLocationLoading}
                disabled={isLocationFetching || isLocationLoading}
                onChange={(e) => {
                  handleSelect(e, 'from');
                }}
              />
            </div>

            <div className='w-full max-w-[260px]'>
              <SearchableSelect
                placeholder='To'
                options={transformSearchableSelectOptions(locationList?.data)}
                loading={isLocationFetching || isLocationLoading}
                disabled={isLocationFetching || isLocationLoading}
                onChange={(e) => {
                  handleSelect(e, 'to');
                }}
              />
            </div>
          </div>
          <div className='mt-5'>
            <CommonTable
              headers={[]}
              subHeaders={subHeaders}
              data={TransfersMutation?.data?.data}
              showSkeleton={
                !TransfersMutation?.isFetching &&
                !TransfersMutation?.isLoading &&
                !NotificationQuery?.isFetching &&
                !NotificationQuery?.isLoading
              }
            />
          </div>
        </div>
        <CommonModal
          maxWidth='max-w-5xl'
          ModalHeader={NotificationModalTitle}
          isOpen={isShowNotificationModal}
          onClose={setIsShowNotificationModal}
          onSuccess={() => {}}
          showActionBtn={false}
        >
          <NotificationListModal notifications={notificationData} />
        </CommonModal>
      </div>
    </div>
  );
};

export default Viazul;
