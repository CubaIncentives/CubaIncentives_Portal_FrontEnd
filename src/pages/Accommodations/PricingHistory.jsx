import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import PropTypes from 'prop-types';

import { CustomSpinner, NoDataFound } from '@/components/Common';
import api from '@/utils/api';
import { CURRENCY } from '@/utils/constants';
import { classNames } from '@/utils/helper';

const PricingHistory = ({ accommodationId, roomId, accommodationData }) => {
  const getPricesData = async () => {
    const res = await api.get(
      `/accommodation/plans/room/pricing?accommodation_id=${accommodationId}&room_id=${roomId}&isDates=0&history=1`
    );

    return res.data;
  };

  const { isFetching, isLoading, data } = useQuery(['get-price-plans'], () =>
    getPricesData()
  );

  const allDates = data?.data;

  const getTypeKeys = (data) => {
    if (data && data.length > 0) {
      return Object.keys(data[0]?.room?.type);
    }

    return [];
  };

  const regularHeader = getTypeKeys(allDates?.regular);

  const calculateDisplayPrice = (
    colIndex,
    basePrice,
    supplementPrice,
    discountPrice
  ) => {
    let displayPrice = 0;

    if (colIndex === 0) {
      displayPrice = basePrice;
    } else if (colIndex === 1) {
      displayPrice = supplementPrice;
    } else if (colIndex === 2) {
      displayPrice = discountPrice;
    }

    return displayPrice;
  };
  const renderCell = (rowIndex, colIndex, header, item) => {
    const types = ['base', 'supplement', 'discount'];
    const itemTypes = types?.some((type) => item?.roomTypes?.includes(type));

    let displayPrice;

    if (
      (itemTypes || accommodationData?.room_price_type === 'per_person') &&
      !item?.roomTypes?.includes('room')
    ) {
      const basePrice = item?.room?.type?.base || item?.room?.type?.single || 0;
      const supplementPrice =
        item?.room?.type?.supplement || item?.room?.type?.double || 0;
      const discountPercentage =
        item?.room?.type?.discount || item?.room?.type?.triple || 0;

      displayPrice = calculateDisplayPrice(
        colIndex,
        basePrice,
        supplementPrice,
        discountPercentage
      );

      if (displayPrice % 1 !== 0) {
        displayPrice = Math.round(displayPrice);
      }
    } else {
      displayPrice = item?.room?.type[header] || 0;

      if (displayPrice % 1 !== 0) {
        displayPrice = Math.round(displayPrice);
      }
    }

    return (
      <td
        key={colIndex}
        className={classNames(
          'px-4 py-2 other-columns',
          rowIndex === 0 ? 'pt-4' : ''
        )}
      >
        {CURRENCY} {displayPrice}
      </td>
    );
  };

  return (
    <div>
      {isFetching && (
        <div className='bg-white h-[300px] flex flex-col justify-center'>
          <CustomSpinner className='h-[50px] w-[40px] flex justify-center items-center'></CustomSpinner>
        </div>
      )}

      {!allDates?.common?.length && !isFetching && !isLoading && (
        <div className='bg-white h-[calc(100vh-390px)] flex flex-col justify-center'>
          <NoDataFound title='No pricing history found' />
        </div>
      )}

      {!isFetching && (
        <div className='max-modal-height overflow-auto'>
          {allDates?.common?.length > 0 && (
            <table className='w-full price-table border'>
              <tbody>
                <tr className='border-b'>
                  <th className='p-4 first-column !max-w-[45%]'></th>
                  {regularHeader?.map((header, index) => (
                    <th
                      key={index}
                      className='px-4 py-2 font-medium text-sm text-gray-700 other-columns first-letter:uppercase'
                    >
                      {header === 'base'
                        ? 'Single'
                        : header === 'supplement'
                          ? 'Double'
                          : header === 'discount'
                            ? 'triple'
                            : header}
                    </th>
                  ))}
                </tr>

                {allDates?.common?.map((item, rowIndex) => (
                  <tr key={rowIndex} className='align-baseline'>
                    <td
                      className={classNames(
                        'px-4 py-2 flex items-center first-column text-base !max-w-[45%]',
                        rowIndex === 0 ? 'pt-4' : ''
                      )}
                    >
                      {moment(item?.date_plan?.from_date).format('DD-MM-YYYY')}{' '}
                      <ArrowRightIcon className='h-5 w-5 mx-2 text-gray-400' />{' '}
                      {moment(item?.date_plan?.to_date).format('DD-MM-YYYY')}
                    </td>

                    {regularHeader?.map((header, colIndex) =>
                      renderCell(rowIndex, colIndex, header, item)
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

PricingHistory.propTypes = {
  accommodationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  roomId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accommodationData: PropTypes.object,
};

export default PricingHistory;
