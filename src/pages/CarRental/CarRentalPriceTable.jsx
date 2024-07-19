import React, { useEffect, useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import PropTypes from 'prop-types';

import { CURRENCY } from '@/utils/constants';
import { classNames } from '@/utils/helper';

const CarRentalPriceTable = ({ model }) => {
  const [prices, setPrices] = useState([]);

  const transformData = (data) => {
    const map = new Map();

    data.forEach((item) => {
      const dateKey = JSON.stringify(item.date);

      if (!map.has(dateKey)) {
        map.set(dateKey, {
          date: item.date,
          pricePlans: [{ ...item.pricePlan, price: item.price, id: item?.id }],
        });
      } else {
        map.get(dateKey).pricePlans.push({
          ...item.pricePlan,
          price: item.price,
          id: item?.id,
        });
      }
    });

    return Array.from(map.values());
  };
  const getUniquePricePlans = (data) => {
    const uniquePlansSet = new Set();

    if (data?.length > 0) {
      data?.forEach((item) => {
        item?.pricePlans?.forEach((plan) => {
          uniquePlansSet.add(`${plan.min_days}-${plan.max_days}`);
        });
      });
    }

    return Array.from(uniquePlansSet);
  };

  useEffect(() => {
    if (model?.date_plans?.length > 0) {
      const transformedData = transformData(model?.date_plans);

      setPrices(transformedData);
    } else {
      setPrices([]);
    }
  }, [model]);

  const uniquePricePlans = getUniquePricePlans(prices);

  return (
    <div className='max-modal-height overflow-auto'>
      {prices?.length > 0 && (
        <table className='w-full price-table border rounded-md'>
          <tbody>
            <tr className='border-b bg-[#E4E5E8]'>
              <th className='px-4 py-2 max-w-[40%]'></th>
              {uniquePricePlans?.map((plan, index) => (
                <th
                  key={index}
                  className='px-4 py-2 font-medium text-sm text-gray-700 max-w-[15%]'
                >
                  {plan} days
                </th>
              ))}
            </tr>

            {prices?.map((item, rowIndex) => (
              <tr key={rowIndex} className='align-baseline'>
                <td
                  className={classNames(
                    'px-4 py-2 flex items-center text-base max-w-[40%]',
                    rowIndex === 0 ? 'pt-4' : ''
                  )}
                >
                  {moment(item?.date?.from_date).format('DD-MM-YYYY')}{' '}
                  <ArrowRightIcon className='h-5 w-5 mx-2 text-gray-400' />{' '}
                  {moment(item?.date?.to_date).format('DD-MM-YYYY')}
                </td>

                {uniquePricePlans.map((plan, planIndex) => {
                  const pricePlan = item.pricePlans.find(
                    (p) => `${p.min_days}-${p.max_days}` === plan
                  );

                  return (
                    <td
                      className={classNames(
                        'px-4 py-2 max-w-[15%]',
                        rowIndex === 0 ? 'pt-4' : ''
                      )}
                      key={planIndex}
                    >
                      {pricePlan.price
                        ? CURRENCY + ' ' + pricePlan.price
                        : 'N/A'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

CarRentalPriceTable.propTypes = {
  model: PropTypes.object,
};

export default CarRentalPriceTable;
