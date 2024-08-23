import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Badge } from '@/components/Common';
import { CURRENCY } from '@/utils/constants';
import { classNames } from '@/utils/helper';

const PriceTable = ({ room }) => {
  const allDates = room?.pricing;
  const getTypeKeys = (data) => {
    if (data && data.length > 0) {
      return Object.keys(data[0]?.room?.type);
    }

    return [];
  };

  const regularHeader = getTypeKeys(allDates?.common);

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

    if (itemTypes && !item?.roomTypes?.includes('room')) {
      const basePrice = item?.room?.type?.base || item?.room?.type?.single || 0;
      const supplementPrice =
        item?.room?.type?.supplement || item?.room?.type?.double || 0;
      const discountPercentage =
        (item?.room?.type?.discount || item?.room?.type?.triple || 0) / 100;

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
          'px-4 py-2 max-w-[16%]',
          rowIndex === 0 ? 'pt-4' : ''
        )}
      >
        {displayPrice !== undefined &&
        displayPrice !== null &&
        displayPrice !== ''
          ? `${CURRENCY} ${displayPrice}`
          : 'N/A'}
      </td>
    );
  };

  return (
    <div className='mb-6 border'>
      <div className='flex items-center border-b'>
        <p className='text-gray-600 font-semibold text-lg mr-2 first-letter:uppercase p-2 pl-4'>
          {room?.name}
        </p>
        <Badge className='bg-palette5 text-white mr-5' size='sm'>
          Mealplan: <span className='uppercase'>{room?.meal_plan_type}</span>
        </Badge>
      </div>

      {allDates?.common?.length > 0 && (
        <table className='w-full price-table'>
          <tbody>
            <tr className='border-b'>
              <th className='p-4 !max-w-[45%] font-medium text-sm self-center text-gray-700'>
                Seasons
              </th>
              {regularHeader?.map((header, index) => (
                <th
                  key={index}
                  className='px-4 py-2 font-medium self-center text-sm text-gray-700 max-w-[16%] first-letter:uppercase'
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
              <tr key={rowIndex} className='align-baseline hover:bg-gray-100'>
                <td
                  className={classNames(
                    'px-4 py-2 flex items-center text-base !max-w-[45%]',
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
  );
};

PriceTable.propTypes = {
  room: PropTypes.object,
};

export default PriceTable;
