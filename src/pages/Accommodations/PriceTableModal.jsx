import React, { useEffect } from 'react';
import TableSkeleton from '@/skeletons/TableSkeleton';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import PropTypes from 'prop-types';

import api from '@/utils/api';

import PriceTable from './PriceTable';

const PriceTableModal = ({ selectedAccommodation }) => {
  const fetchAllAccommodationPrices = async () => {
    let url = `/accommodation/agency/${selectedAccommodation.id}/room`;

    const res = await api.get(url);

    return res.data;
  };

  const AccommodationPricesMutation = useMutation({
    mutationFn: fetchAllAccommodationPrices,
  });

  useEffect(() => {
    AccommodationPricesMutation.mutate();
  }, []);

  return (
    <div>
      {AccommodationPricesMutation?.isLoading && <TableSkeleton />}

      {AccommodationPricesMutation?.data?.data?.length > 0 &&
      !AccommodationPricesMutation?.isLoading ? (
        <div className='overflow-auto max-modal-height pr-2'>
          {AccommodationPricesMutation?.data?.data?.map((item, index) => (
            <PriceTable room={item} key={index} />
          ))}
        </div>
      ) : (
        !AccommodationPricesMutation?.isLoading && (
          <p className='flex gap-2 items-center'>
            <FaceFrownIcon className='h-6 w-6' /> No prices found for this
            accommodation
          </p>
        )
      )}
    </div>
  );
};

PriceTableModal.propTypes = {
  selectedAccommodation: PropTypes.object,
};

export default PriceTableModal;
