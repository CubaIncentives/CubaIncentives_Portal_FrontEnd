import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Button, CommonTable, SearchableSelect } from '@/components/Common';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import {
  getLocalStorageItem,
  redireacToAdminSite,
  transformSearchableSelectOptions,
} from '@/utils/helper';

const subHeaders = [
  { label: 'From', className: 'max-w-[15%]', key: 'from_location.name' },
  { label: '', className: 'max-w-[4%]', key: 'separator', side: 'right' },
  { label: 'To', className: 'max-w-[15%]', key: 'to_location.name' },
  {
    label: 'Price per person',
    className: 'max-w-[30%]',
    key: 'price_per_person',
  },
  { label: 'Pickup time', className: 'max-w-[30%]', key: 'time' },
];

const GroupTransfer = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const userData = getLocalStorageItem('userData')
    ? JSON.parse(getLocalStorageItem('userData'))
    : {};

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
    let url = '/transfer/group';

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

  useEffect(() => {
    TransfersMutation.mutate({ fromLocation: '', toLocation: '' });
  }, []);

  const pages = [
    { name: 'Transport', href: '/transport', current: false },
    { name: 'Group Transfer', href: '', current: true },
  ];

  return (
    <div className='px-6 sm:px-8 lg:px-10 py-6 flex justify-center'>
      <div className='max-w-[1920px] w-full'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Group Transfers {PAGE_TITLE_SUFFIX}</title>
        </Helmet>
        <div>
          <div className='pb-10'>
            <Breadcrumbs pages={pages} />
          </div>
          <div className='flex items-center justify-between mb-2'>
            <h1 className='font-semibold text-3xl'>Group Transfers</h1>
            {(userData?.role === 'admin' || userData?.role === 'staff') && (
              <Button
                size='sm'
                isOutlined={true}
                onClick={() => {
                  redireacToAdminSite('group-transfers');
                }}
              >
                Backend
              </Button>
            )}
          </div>
        </div>

        <div className='bg-[#FFF9E5] p-3 rounded-lg mt-4 text-customBlack border border-[#FFDE69]'>
          <p className='text-base font-semibold'>NOTE:</p>
          <p className='mt-4 text-sm font-medium'>
            Transfers are one way only. Return not always possible.
          </p>
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
                !TransfersMutation?.isFetching && !TransfersMutation?.isLoading
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupTransfer;
