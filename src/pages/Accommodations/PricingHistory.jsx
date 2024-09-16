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
    const res = await api.get(`pricing-history?module=room&id=${roomId}`);

    return res.data;
  };

  const { isFetching, isLoading, data } = useQuery(['get-price-history'], () =>
    getPricesData()
  );

  const [selectedKey, setSelectedKey] = useState('current_year');
  const [selectedSpecialYearKey, setSelectedSpecialYearKey] = useState(null);

  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    if (data && selectedKey) {
      setSelectedSpecialYearKey(null);
      setTableData(data[selectedKey]);
    }
  }, [data, selectedKey]);

  const isDateInSeasonsRange = (seasonDate) => {
    if (selectedSpecialYearKey) {
      const fromDate = new Date(selectedSpecialYearKey.from);
      const toDate = new Date(selectedSpecialYearKey.to);
      const startDate = new Date(seasonDate.from_date);
      const endDate = new Date(seasonDate.to_date);

      return (
        fromDate >= startDate &&
        fromDate <= endDate &&
        toDate >= startDate &&
        toDate <= endDate
      );
    } else {
      return false;
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

          {tableData?.specials && tableData?.specials.length > 0 ? (
            <div className='flex flex-col flex-wrap py-2 gap-3'>
              <span className='text-base text-customBlack'>
                This season had a special available. Select the date below to
                view the prices for bookings within the validity of the special.
              </span>
              <div className='flex flex-wrap gap-1'>
                {tableData?.specials.map((specialOfferData, index) => {
                  const bookingDate = specialOfferData?.booking;
                  const seasonDate = specialOfferData?.season;

                  return (
                    <BadgeButton
                      key={index}
                      isSelected={selectedSpecialYearKey === seasonDate}
                      onClick={() => {
                        if (
                          selectedKey &&
                          (selectedSpecialYearKey == null ||
                            selectedSpecialYearKey !== seasonDate)
                        ) {
                          setSelectedSpecialYearKey(seasonDate);
                        } else {
                          setSelectedSpecialYearKey(null);
                        }
                      }}
                      className={classNames(
                        selectedKey ? 'cursor-pointer' : 'cursor-not-allowed',
                        'select-none'
                      )}
                    >
                      Bookings between {bookingDate?.from}{' '}
                      <ArrowRightIcon className='w-4 h-5' /> {bookingDate?.to}{' '}
                    </BadgeButton>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className='my-4 border rounded-md max-h-96  h-full overflow-auto'>
            <table className='w-full price-table'>
              <tbody className='bg-[#FAFAFA]'>
                <tr className='border-b'>
                  <th className='p-4 !max-w-[35%] font-medium text-sm self-center text-gray-700'>
                    Seasons
                  </th>
                  {tableData?.roomTypeList &&
                    tableData?.roomTypeList?.map((key, value) => {
                      return (
                        <th
                          key={value}
                          className='px-4 py-3 font-medium self-center text-sm text-gray-700 max-w-[16%] first-letter:uppercase'
                        >
                          {key}
                        </th>
                      );
                    })}
                </tr>

                {tableData?.data.length > 0 &&
                  tableData?.data?.map((selectedYearData, index) => {
                    let historyData = {};

                    tableData?.roomTypeList &&
                      tableData?.roomTypeList?.forEach((fieldName) => {
                        const data = {
                          [fieldName]:
                            selectedYearData?.room?.type[fieldName][
                              'history'
                            ] ?? [],
                        };

                        historyData = { ...historyData, ...data };
                      });

                    const isShowSpecialPrice = isDateInSeasonsRange(
                      selectedYearData?.date_plan
                    );

                    return (
                      <React.Fragment key={index}>
                        <tr
                          key={`${selectedYearData?.date_plan?.to_date}-${index}`}
                          className='align-baseline border-b last:border-0 bg-white hover:bg-gray-100'
                        >
                          <td className='px-4 py-3 flex items-center max-w-[35%] text-base text-customBlack'>
                            {selectedYearData?.date_plan?.from_date}
                            <ArrowRightIcon className='h-5 w-5 mx-2 text-gray-400' />{' '}
                            {selectedYearData?.date_plan?.to_date}
                          </td>

                          {tableData?.roomTypeList &&
                            tableData?.roomTypeList?.map((fieldName, index) => {
                              return (
                                <td
                                  className='px-4 py-3 max-w-[16%]  flex flex-wrap'
                                  key={index}
                                >
                                  {isShowSpecialPrice ? (
                                    <div className='mr-2.5'>
                                      <span
                                        className={classNames(
                                          'text-customBlue font-semibold group-hover:font-extrabold'
                                        )}
                                      >
                                        {CURRENCY +
                                          ' ' +
                                          selectedYearData?.room?.type[
                                            fieldName
                                          ]['discount']}
                                      </span>
                                    </div>
                                  ) : null}

                                  <div>
                                    {selectedYearData?.room?.type[fieldName][
                                      'price'
                                    ] !== '' &&
                                    selectedYearData?.room?.type[fieldName][
                                      'price'
                                    ] !== undefined &&
                                    selectedYearData?.room?.type[fieldName][
                                      'price'
                                    ] !== null ? (
                                      <span
                                        className={classNames(
                                          ' font-semibold group-hover:font-extrabold',
                                          isShowSpecialPrice
                                            ? 'line-through text-gray-400'
                                            : 'text-customBlue'
                                        )}
                                      >
                                        {CURRENCY +
                                          ' ' +
                                          selectedYearData?.room?.type[
                                            fieldName
                                          ]['price']}
                                      </span>
                                    ) : (
                                      'N/A'
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                        </tr>

                        {Object.keys(historyData).length > 0 &&
                          Object.keys(historyData).map(
                            (roomType) =>
                              historyData[roomType].length > 0 &&
                              historyData[roomType].map(
                                (historyItem, colIndex) => (
                                  <tr
                                    className='border-t border-dashed hover:bg-gray-100'
                                    key={`${roomType}-${colIndex}`}
                                  >
                                    <td className='px-4 py-3 flex items-center max-w-[35%] text-base text-customBlack'>
                                      <ArrowTurnDownRightIcon className='h-3 w-3 mx-2 text-gray-400' />
                                      {`Price before change for ${historyItem.date}`}
                                    </td>

                                    {tableData?.roomTypeList &&
                                      tableData?.roomTypeList?.map(
                                        (fieldName, index) => {
                                          return (
                                            <td
                                              className='px-4 py-3 max-w-[16%]'
                                              key={index}
                                            >
                                              {fieldName === roomType &&
                                              historyItem.price !== undefined &&
                                              historyItem.price !== '' &&
                                              historyItem.price !== null ? (
                                                <span className='text-customBlue font-semibold group-hover:font-extrabold'>
                                                  {CURRENCY +
                                                    ' ' +
                                                    historyItem.price}
                                                </span>
                                              ) : (
                                                'N/A'
                                              )}
                                            </td>
                                          );
                                        }
                                      )}
                                  </tr>
                                )
                              )
                          )}
                      </React.Fragment>
                    );
                  })}

                {tableData?.data.length === 0 ? (
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
