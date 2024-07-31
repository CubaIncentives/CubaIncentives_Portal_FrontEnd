import React, { useEffect, useState } from 'react';
import { ArrowTurnDownRightIcon } from '@heroicons/react/20/solid';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';

import { CustomSpinner, NoDataFound } from '@/components/Common';
import BadgeButton from '@/components/Common/BadgeButton';
import api from '@/utils/api';
import { CURRENCY } from '@/utils/constants';
import { classNames } from '@/utils/helper';

const PricingHistory = ({ roomId }) => {
  const getPricesData = async () => {
    const res = await api.get(`pricing-history?module=car_model&id=${roomId}`);

    return res.data;
  };

  const { isFetching, isLoading, data } = useQuery(['get-price-history'], () =>
    getPricesData()
  );

  const [selectedKey, setSelectedKey] = useState('current_year');

  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    if (data && selectedKey) {
      setTableData([]);

      setTableData(data[selectedKey]);
    }
  }, [data, selectedKey]);

  const groupByActionId = (data) => {
    if (data && data.length > 0) {
      return data.reduce((acc, item) => {
        if (!acc[item.action_id]) {
          acc[item.action_id] = [];
        }
        acc[item.action_id].push(item);

        return acc;
      }, {});
    } else {
      return [];
    }
  };

  return (
    <div>
      {(isFetching || isLoading) && (
        <div className='bg-white h-[300px] flex flex-col justify-center'>
          <CustomSpinner className='h-[50px] w-[40px] flex justify-center items-center'></CustomSpinner>
        </div>
      )}

      {!Object.keys(data ?? {}).length && !isFetching && !isLoading && (
        <div className='bg-white h-[calc(100vh-390px)] flex flex-col justify-center'>
          <NoDataFound title='No pricing history found' />
        </div>
      )}

      {!isFetching && Object.keys(data ?? {}).length > 0 && (
        <div className='w-full h-full overflow-auto'>
          <div className='flex gap-2'>
            <BadgeButton
              isSelected={selectedKey === 'past_year'}
              onClick={() => {
                setSelectedKey('past_year');
              }}
            >
              {data?.past_year?.start} <ArrowRightIcon className='w-4 h-5' />{' '}
              {data?.past_year?.end}{' '}
            </BadgeButton>

            <BadgeButton
              isSelected={selectedKey === 'current_year'}
              onClick={() => {
                setSelectedKey('current_year');
              }}
            >
              {data?.current_year?.start} <ArrowRightIcon className='w-4 h-5' />{' '}
              {data?.current_year?.end}{' '}
            </BadgeButton>
          </div>
          <div className='my-4 border rounded-md max-h-96 h-full overflow-auto'>
            <table className='w-full price-table'>
              <tbody className='bg-[#FAFAFA]'>
                <tr className='border-b'>
                  <th className='p-4 !max-w-[35%] font-medium text-sm self-center text-gray-700'>
                    Seasons
                  </th>
                  {tableData &&
                    tableData?.plans &&
                    tableData?.plans?.map((data) => {
                      return (
                        <th
                          key={data?.id}
                          className='px-4 py-3 font-medium self-center text-sm text-gray-700 max-w-[16%] first-letter:uppercase'
                        >
                          {data?.min_days} - {data?.max_days}
                        </th>
                      );
                    })}
                </tr>

                {tableData &&
                  tableData?.data.length > 0 &&
                  tableData?.data?.map((selectedYearData, index) => {
                    let historyData =
                      groupByActionId(selectedYearData?.history) ?? [];

                    return (
                      <React.Fragment key={index}>
                        <tr
                          key={`${selectedYearData?.date?.to_date}-${index}`}
                          className='align-baseline border-b last:border-0 bg-white'
                        >
                          <td className='px-4 py-3 flex items-center max-w-[35%] text-base text-customBlack'>
                            {selectedYearData?.date?.from_date}
                            <ArrowRightIcon className='h-5 w-5 mx-2 text-gray-400' />{' '}
                            {selectedYearData?.date?.to_date}
                          </td>

                          {tableData?.plans &&
                            tableData?.plans?.map((data, index) => {
                              const matchingItem = selectedYearData?.plans.find(
                                (item) =>
                                  item.pricePlan.price_plan_id === data?.id
                              );

                              return (
                                <td
                                  className='px-4 py-3 max-w-[16%]  flex flex-wrap'
                                  key={
                                    'price' +
                                    matchingItem?.price_plan_id +
                                    index
                                  }
                                >
                                  {matchingItem?.price ? (
                                    <span
                                      className={classNames(
                                        ' font-semibold group-hover:font-extrabold text-customBlue'
                                      )}
                                    >
                                      {CURRENCY + ' ' + matchingItem?.price}
                                    </span>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>
                              );
                            })}
                        </tr>
                        {Object.keys(historyData).length > 0 &&
                          Object.entries(historyData).map(
                            ([actionId, historyItems], actionIndex) => (
                              <tr
                                className='border-t border-dashed'
                                key={`history-${actionId}-${actionIndex}`}
                              >
                                <td className='px-4 py-3 flex items-center max-w-[35%] text-base text-customBlack'>
                                  <ArrowTurnDownRightIcon className='h-3 w-3 mx-2 text-gray-400' />
                                  {`Price before change for ${historyItems[0]['date']}`}
                                </td>

                                {tableData?.plans &&
                                  tableData?.plans?.map((data, index) => {
                                    const matchingItem = historyItems.find(
                                      (item) => item.price_plan_id === data?.id
                                    );

                                    return (
                                      <td
                                        className='px-4 py-3 max-w-[16%]  flex flex-wrap'
                                        key={
                                          'price' +
                                          matchingItem?.price_plan_id +
                                          index
                                        }
                                      >
                                        {matchingItem?.price ? (
                                          <span
                                            className={classNames(
                                              ' font-semibold group-hover:font-extrabold text-customBlue'
                                            )}
                                          >
                                            {CURRENCY +
                                              ' ' +
                                              matchingItem?.price}
                                          </span>
                                        ) : (
                                          'N/A'
                                        )}
                                      </td>
                                    );
                                  })}
                              </tr>
                            )
                          )}
                      </React.Fragment>
                    );
                  })}

                {tableData && tableData?.data.length === 0 ? (
                  <tr className='align-baseline border-b last:border-0 bg-white'>
                    <td className='text-center py-3 text-gray-500 font-medium'>
                      No any price history available
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

PricingHistory.propTypes = {
  roomId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default PricingHistory;
