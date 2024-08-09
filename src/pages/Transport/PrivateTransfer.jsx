import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';

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

const headers = [
  { label: '', className: 'max-w-[15%]' },
  { label: '', className: 'max-w-[4%]' },
  { label: '', className: 'max-w-[14%]' },
  { label: 'Taxi', className: 'max-w-[16%]', colSpan: 2 },
  { label: 'Bus', className: '', colSpan: 5 },
];

const subHeaders = [
  { label: 'From', className: 'max-w-[15%]', key: 'from_location.name' },
  { label: '', className: 'max-w-[4%]', key: 'separator', side: 'both' },
  { label: 'To', className: 'max-w-[14%]', key: 'to_location.name' },
  { label: '1 pax', className: 'max-w-[8%]', key: 'taxi_price_one_pax' },
  { label: '2 pax', className: 'max-w-[8%]', key: 'taxi_price_two_pax' },
  { label: '3 pax', className: 'max-w-[8%]', key: 'minibus_price_three_pax' },
  { label: '4 pax', className: 'max-w-[8%]', key: 'minibus_price_four_pax' },
  { label: '5 pax', className: 'max-w-[8%]', key: 'minibus_price_five_pax' },
  { label: '6 pax', className: 'max-w-[8%]', key: 'minibus_price_six_pax' },
  { label: '7 pax', className: 'max-w-[8%]', key: 'minibus_price_seven_pax' },
  { label: '8 pax', className: 'max-w-[8%]', key: 'minibus_price_eight_pax' },
];

const stopHeaders = [
  { label: 'To', className: '', key: 'to_text' },
  { label: '1 pax', className: 'max-w-[8%]', key: 'taxi_price_one_pax' },
  { label: '2 pax', className: 'max-w-[8%]', key: 'taxi_price_two_pax' },
  { label: '3 pax', className: 'max-w-[8%]', key: 'minibus_price_three_pax' },
  { label: '4 pax', className: 'max-w-[8%]', key: 'minibus_price_four_pax' },
  { label: '5 pax', className: 'max-w-[8%]', key: 'minibus_price_five_pax' },
  { label: '6 pax', className: 'max-w-[8%]', key: 'minibus_price_six_pax' },
  { label: '7 pax', className: 'max-w-[8%]', key: 'minibus_price_seven_pax' },
  { label: '8 pax', className: 'max-w-[9%]', key: 'minibus_price_eight_pax' },
];

const PrivateTransfer = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  const userData = getLocalStorageItem('userData')
    ? JSON.parse(getLocalStorageItem('userData'))
    : {};

  const [notificationData, setNotificationData] = useState({});

  const [isShowNotificationModal, setIsShowNotificationModal] = useState(false);

  const getNotificationData = async () => {
    const res = await api.get(`notification?category=private_transfer`);

    return res.data;
  };

  const getLocations = async () => {
    let url = `/backend/location?type=private_transfer`;

    const res = await api.get(url);

    return res.data;
  };

  const {
    data: locationList,
    isFetching: isLocationFetching,
    isLoading: isLocationLoading,
  } = useQuery(['get-location-list'], () => getLocations());

  const fetchAllTransfers = async (fromLocation, toLocation) => {
    let url = '/transfer/private';

    const params = [];

    if (fromLocation) {
      params.push(`from=${fromLocation?.value}`);
    }
    if (toLocation) {
      params.push(`to=${toLocation?.value}`);
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
    const newLocation = selected ? selected : '';

    if (type === 'from') {
      setFromLocation(newLocation);
      TransfersMutation.mutate({ fromLocation: newLocation, toLocation });
    }

    if (type === 'to') {
      setToLocation(newLocation);
      TransfersMutation.mutate({ fromLocation, toLocation: newLocation });
    }
  };

  const getTransfers = () => {
    TransfersMutation.mutate({ fromLocation: '', toLocation: '' });
  };

  const NotificationQuery = useQuery(
    ['get-pricate-transfer-notification'],
    getNotificationData,
    {
      onSuccess: (data) => {
        setNotificationData(data?.data);
        setIsShowNotificationModal(
          data?.data?.pop_up && data?.data?.pop_up?.length > 0
        );
        getTransfers();
      },
      onError: () => {
        getTransfers();
      },
    }
  );

  const pages = [
    { name: 'Transport', href: '/transport', current: false },
    { name: 'Private Transfer', href: '', current: true },
  ];

  return (
    <div className='px-6 sm:px-8 lg:px-10 py-6 flex justify-center'>
      <div className='max-w-[1920px] w-full'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Private Transfers {PAGE_TITLE_SUFFIX}</title>
        </Helmet>
        <div>
          <div className='pb-10'>
            <Breadcrumbs pages={pages} />
          </div>
          <div className='flex items-center justify-between mb-2'>
            <h1 className='font-semibold text-3xl'>Private Transfers</h1>
            <div>
              <div className='flex gap-2'>
                <Button size='sm' onClick={() => setShowInfoModal(true)}>
                  Information for stops
                </Button>
                {(userData?.role === 'admin' || userData?.role === 'staff') && (
                  <Button
                    size='sm'
                    isOutlined={true}
                    onClick={() => {
                      redireacToAdminSite('private-transfers');
                    }}
                  >
                    Backend
                  </Button>
                )}
              </div>
            </div>
          </div>
          <NotificationList
            notifications={notificationData}
            parentCss='!p-0 !pt-2'
          />
        </div>

        <div className='border shadow-md mt-5 py-4 px-3 rounded-lg'>
          <div className='flex gap-3'>
            <div className='w-full max-w-[260px]'>
              <SearchableSelect
                placeholder='From'
                selected={fromLocation}
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
              headers={headers}
              subHeaders={subHeaders}
              stopHeaders={stopHeaders}
              data={TransfersMutation?.data?.data?.transfers}
              showSkeleton={
                !TransfersMutation?.isFetching &&
                !TransfersMutation?.isLoading &&
                !NotificationQuery?.isFetching &&
                !NotificationQuery?.isLoading
              }
              name='private_transfer'
            />
          </div>
        </div>

        {showInfoModal && (
          <CommonModal
            maxWidth='sm:max-w-2xl'
            ModalHeader='Information for stops during transfers'
            isOpen={showInfoModal}
            onClose={setShowInfoModal}
            onSuccess={() => {}}
            showActionBtn={false}
          >
            {TransfersMutation?.data?.data?.stopInfo?.description ? (
              <div
                className='break-words max-h-[500px] overflow-auto'
                dangerouslySetInnerHTML={{
                  __html: TransfersMutation?.data?.data?.stopInfo?.description,
                }}
              ></div>
            ) : (
              <p>Information for stops not available</p>
            )}

            <p className='text-xs text-gray-400 font-medium mt-4'>
              Last update:{' '}
              {moment(
                TransfersMutation?.data?.data?.stopInfo?.updated_at
              ).format('DD-MM-YYYY')}
            </p>
          </CommonModal>
        )}

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

export default PrivateTransfer;
