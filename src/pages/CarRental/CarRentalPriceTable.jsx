import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import PropTypes from 'prop-types';

import { CURRENCY } from '@/utils/constants';
import { classNames } from '@/utils/helper';

const CarRentalPriceTable = ({ model, showSkeleton }) => {
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
    <div className='max-modal-height overflow-auto border rounded-md'>
      {prices?.length > 0 && (
        <table className='w-full price-table'>
          <tbody className='bg-[#FAFAFA]'>
            <tr className='border-b bg-[#EFEFEF]'>
              <th className='px-4 py-3 max-w-[40%] font-semibold text-sm text-customBlack'>
                Seasons
              </th>
              {uniquePricePlans?.map((plan, index) => (
                <th
                  key={index}
                  className='px-4 py-3 font-semibold text-sm text-customBlack max-w-[15%]'
                >
                  {plan} days
                </th>
              ))}
            </tr>

            {showSkeleton ? (
              <Skeleton count={4} height={40} className='mt-2' />
            ) : (
              prices?.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className='align-baseline border-b last:border-0 hover:bg-gray-100'
                >
                  <td
                    className={classNames(
                      'px-4 py-3 flex items-center text-base text-customBlack max-w-[40%]'
                    )}
                  >
                    {moment(item?.date?.from_date).format('DD-MM-YYYY')}{' '}
                    <ArrowRightIcon className='h-5 w-5 mx-2' />{' '}
                    {moment(item?.date?.to_date).format('DD-MM-YYYY')}
                  </td>

                  {uniquePricePlans.map((plan, planIndex) => {
                    const pricePlan = item.pricePlans.find(
                      (p) => `${p.min_days}-${p.max_days}` === plan
                    );

                    return (
                      <td className='px-4 py-3 max-w-[15%]' key={planIndex}>
                        {pricePlan.price !== undefined &&
                        pricePlan.price !== '' &&
                        pricePlan.price !== null ? (
                          <span className='text-customBlue font-semibold group-hover:font-extrabold'>
                            {CURRENCY + ' ' + pricePlan.price}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

CarRentalPriceTable.propTypes = {
  model: PropTypes.object,
  showSkeleton: PropTypes.bool,
};

export default CarRentalPriceTable;
