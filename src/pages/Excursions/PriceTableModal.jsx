import React, { useEffect } from 'react';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import moment from 'moment';
import PropTypes from 'prop-types';

import api from '@/utils/api';
import { CURRENCY } from '@/utils/constants';
import { classNames } from '@/utils/helper';

const PriceTableModal = ({ selectedExcursion }) => {
  const fetchAllExcursionsPrices = async () => {
    let url = `/excursion/agency/${selectedExcursion.id}/price-per-person`;

    const res = await api.get(url);

    return res.data;
  };

  const ExcursionPricesMutation = useMutation({
    mutationFn: fetchAllExcursionsPrices,
  });

  useEffect(() => {
    ExcursionPricesMutation.mutate();
  }, []);

  return (
    <div className='overflow-auto max-modal-height pr-2'>
      {ExcursionPricesMutation?.data?.data?.length > 0 ? (
        <table className='w-full price-table border'>
          <tbody>
            <tr className='border-b'>
              <th className='px-4 py-2 first-column !max-w-[45%]'>Seasons</th>
              <th className='px-4 py-2 font-semibold text-base text-gray-700'>
                Price per person
              </th>
            </tr>

            {ExcursionPricesMutation?.data?.data?.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className='align-baseline text-base hover:bg-gray-100'
              >
                <td
                  className={classNames(
                    'px-4 py-2 flex items-center first-column !max-w-[45%]',
                    rowIndex === 0 ? 'pt-4' : ''
                  )}
                >
                  {moment(item?.date_plan?.from_date).format('DD-MM-YYYY')}{' '}
                  <ArrowRightIcon className='h-5 w-5 mx-2 text-gray-400' />{' '}
                  {moment(item?.date_plan?.to_date).format('DD-MM-YYYY')}
                </td>

                <td
                  className={classNames(
                    'px-4 py-2',
                    rowIndex === 0 ? 'pt-4' : ''
                  )}
                >
                  {item?.price_per_person
                    ? `${CURRENCY} ${item.price_per_person}`
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className='flex gap-2 items-center'>
          <FaceFrownIcon className='h-6 w-6' /> No prices found for this
          excursion
        </p>
      )}
    </div>
  );
};

PriceTableModal.propTypes = {
  selectedExcursion: PropTypes.object,
};

export default PriceTableModal;
