import React, { useState } from 'react';
import TableSkeleton from '@/skeletons/TableSkeleton';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import PropTypes from 'prop-types';

import api from '@/utils/api';
import { CURRENCY } from '@/utils/constants';
import { classNames } from '@/utils/helper';

const PriceTableModal = ({ selectedExcursion }) => {
  const [priceTableKeys, setPriceTableKeys] = useState([]);

  const fetchAllExcursionsPrices = async () => {
    let url = `/excursion/agency/${selectedExcursion.id}/price-per-person`;

    const res = await api.get(url);

    return res.data;
  };

  const { isFetching, data: ExcursionPricesMutation } = useQuery(
    ['get-excursion-price'],
    () => fetchAllExcursionsPrices(),
    {
      onSuccess: (response) => {
        if (response?.data?.length > 0) {
          const keysToCheck = {
            price_per_person: 'Price per person',
            taxi_price_two_pax: '2 pax',
            minibus_price_three_pax: '3 pax',
            minibus_price_four_pax: '4 pax',
            minibus_price_five_pax: '5 pax',
            minibus_price_six_pax: '6 pax',
            minibus_price_seven_pax: '7 pax',
            minibus_price_eight_pax: '8 pax',
          };

          const nullPassengerLabels = [];

          for (let key in keysToCheck) {
            const isNullForAll = response?.data.every(
              (obj) => obj[key] === null
            );

            if (!isNullForAll) {
              nullPassengerLabels.push({ [key]: keysToCheck[key] });
            }
          }

          setPriceTableKeys(nullPassengerLabels);
        }
      },
    }
  );

  if (isFetching) {
    return (
      <div className='overflow-auto max-modal-height pr-2  min-w-[500px]'>
        <TableSkeleton rowCount={4} />{' '}
      </div>
    );
  } else {
    return (
      <div className='overflow-auto max-modal-height pr-2  min-w-[500px]'>
        {ExcursionPricesMutation &&
        ExcursionPricesMutation?.data?.length > 0 &&
        priceTableKeys &&
        priceTableKeys.length > 0 ? (
          <table className='w-full price-table border'>
            <tbody>
              <tr className='border-b'>
                <th className='px-4 py-2 flex items-center first-column  !w-max  !max-w-[50%] 2xl:max-w-fit content-center'>
                  Seasons
                </th>

                {priceTableKeys.map((item, index) => (
                  <td
                    key={index}
                    className={classNames(
                      'px-4 py-3 font-semibold text-base max-w-[10%] text-gray-700 text-center content-center',
                      Object.keys(item)[0] === 'price_per_person'
                        ? ' min-w-40'
                        : ' min-w-32'
                    )}
                  >
                    {Object.values(item)[0]}
                  </td>
                ))}
              </tr>

              {ExcursionPricesMutation?.data?.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className='align-baseline text-base hover:bg-gray-100'
                >
                  <td
                    className={classNames(
                      'px-4 py-2 flex items-center first-column  !w-max !max-w-[50%]  2xl:!max-w-fit   content-center'
                    )}
                  >
                    {moment(item?.date_plan?.from_date).format('DD-MM-YYYY')}{' '}
                    <ArrowRightIcon className='h-5 w-5 mx-2 text-gray-400' />{' '}
                    {moment(item?.date_plan?.to_date).format('DD-MM-YYYY')}
                  </td>

                  {priceTableKeys
                    .map((item) => Object.keys(item)[0])
                    .map((data, index) => {
                      return (
                        <td
                          key={index}
                          className={classNames(
                            'px-4 py-3 max-w-[10%] text-center content-center',
                            data === 'price_per_person'
                              ? ' min-w-36'
                              : ' min-w-32'
                          )}
                        >
                          <span
                            className={classNames(
                              item?.[data] !== null &&
                                item?.[data] !== '' &&
                                item?.[data] !== undefined
                                ? 'text-customBlue  font-semibold text-base group-hover:font-extrabold'
                                : ''
                              // rowIndex === 0 ? 'pt-4' : ''
                            )}
                          >
                            {item?.[data] !== null &&
                            item?.[data] !== '' &&
                            item?.[data] !== undefined
                              ? CURRENCY + item?.[data]
                              : 'N/A'}
                          </span>
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='flex gap-2 items-center min-h-32 content-center justify-center'>
            <FaceFrownIcon className='h-6 w-6' /> No prices found for this
            excursion
          </p>
        )}
      </div>
    );
  }
};

PriceTableModal.propTypes = {
  selectedExcursion: PropTypes.object,
};

export default PriceTableModal;
