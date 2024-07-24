import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import PropTypes from 'prop-types';

import { CommonTable, SearchInput } from '@/components/Common';
import api from '@/utils/api';

const OfficeLocations = ({ companyId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const subHeaders = [
    { label: 'City', className: 'max-w-[150px]', key: 'city' },
    {
      label: 'Address',
      className: 'max-w-[240px]',
      key: 'address',
    },
    { label: 'Phone', className: 'max-w-[150px]', key: 'phone' },
    {
      label: 'Hours',
      className: 'max-w-[180px]',
      key: 'office_hours',
    },
  ];

  const fetchAllOfficeLocations = async () => {
    let url = `car-rental/company/${companyId}/office-location`;

    if (searchTerm) url = url + `?search=${searchTerm}`;

    const res = await api.get(url);

    return res.data;
  };

  const OfficeLocationListMutation = useMutation({
    mutationFn: fetchAllOfficeLocations,
  });

  const handlePagination = () => {
    OfficeLocationListMutation.mutate();
  };

  useEffect(() => {
    if (searchTerm) {
      if (searchTerm?.length > 1) {
        const delayDebounceFn = setTimeout(() => {
          handlePagination();
        }, 800);

        return () => clearTimeout(delayDebounceFn);
      }
    } else {
      handlePagination();
    }
  }, [searchTerm]);

  return (
    <div>
      <div className='max-w-[250px]'>
        <SearchInput
          id='searchKey'
          name='searchKey'
          type='text'
          value={searchTerm}
          placeholder='Search location'
          onChange={(e) => setSearchTerm(e.target.value)}
          setSearchTerm={setSearchTerm}
          disabled={
            OfficeLocationListMutation?.isFetching ||
            OfficeLocationListMutation?.isLoading ||
            OfficeLocationListMutation?.data?.data?.length === 0
          }
        />
      </div>

      <div className='mt-4 overflow-auto w-full'>
        <div className='overflow-hidden'>
          <CommonTable
            headers={[]}
            subHeaders={subHeaders}
            data={OfficeLocationListMutation?.data?.data}
            showSkeleton={
              !OfficeLocationListMutation?.isFetching &&
              !OfficeLocationListMutation?.isLoading
            }
          />
        </div>
      </div>
    </div>
  );
};

OfficeLocations.propTypes = {
  companyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default OfficeLocations;
