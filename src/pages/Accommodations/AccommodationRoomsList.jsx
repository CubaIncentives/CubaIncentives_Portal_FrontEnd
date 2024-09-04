import React, { useState } from 'react';
import { HomeIcon } from '@heroicons/react/20/solid';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Badge } from '@/components/Common';
import CommonModal from '@/components/Common/CommonModal';
import { CURRENCY } from '@/utils/constants';
import { capitalize, classNames } from '@/utils/helper';

import ChildCasa from './ChildCasa';
import PricingHistory from './PricingHistory';

const AccommodationRoomsList = ({ data, accommodationData, priceMargin }) => {
  const prices = data?.pricing || [];

  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [isShowHotelData, setShowHotelData] = useState(false);

  const getTypeKeys = (data) => {
    if (data && data.length > 0) {
      return Object.keys(data[0]?.room?.type);
    }

    return [];
  };

  const regularHeader = getTypeKeys(prices?.common);

  const renderCell = (colIndex, header, item) => {
    let displayPrice = item?.room?.cost_price?.type?.[header];
    let discountPrice = item?.room?.cost_price?.discount?.[header];

    return (
      <td className='px-4 py-3 max-w-[16%]' key={colIndex}>
        {displayPrice !== '' &&
        displayPrice !== undefined &&
        displayPrice !== null ? (
          <>
            {discountPrice ? (
              <span className='tooltip'>
                <span className='text-customBlue font-semibold group-hover:font-extrabold'>
                  {CURRENCY + ' ' + discountPrice}
                </span>
                <span className='tooltiptext text-xs !w-[120px] !top-[140%] !-ml-[50px]'>
                  Discounted price
                </span>
                &nbsp; &nbsp;
              </span>
            ) : null}
            <span className='tooltip'>
              <span
                className={classNames(
                  ' font-semibold group-hover:font-extrabold',
                  discountPrice
                    ? 'line-through text-gray-400'
                    : 'text-customBlue'
                )}
              >
                {CURRENCY + ' ' + displayPrice}
              </span>
              <span className='tooltiptext text-xs !w-[50px] !top-[140%] !-ml-[25px]'>
                Price
              </span>
            </span>
          </>
        ) : (
          'N/A'
        )}
      </td>
    );
  };

  return (
    <div>
      <div className='bg-white p-4 mb-8 border rounded-md shadow-md'>
        <div className='flex justify-between'>
          <div className='flex items-center'>
            <p className='text-customBlack font-semibold text-lg mr-2 first-letter:uppercase'>
              {data?.name}
            </p>
            <Badge className='bg-blueLight-500 text-white mr-0' size='sm'>
              Mealplan:{' '}
              <span className='uppercase'>{data?.meal_plan_type}</span>
            </Badge>
            {data?.pricing?.has_room_special && (
              <Badge className='bg-[#fbca32] text-black mx-2 ' size='sm'>
                Special running
              </Badge>
            )}

            {data?.pricing?.portal_specials_booking_dates.length > 0 ? (
              <div className='flex flex-row flex-wrap'>
                <Badge
                  className='bg-grayNeutral-500 text-white mx-2 '
                  size='sm'
                >
                  BOOKING WINDOW :&nbsp;
                  {data?.pricing?.portal_specials_booking_dates.map(
                    (dates, index) => {
                      let totalData = index + 1;

                      return (
                        <span key={index}>
                          {dates?.from
                            ? moment(dates?.from).format('DD/MM/YYYY')
                            : '-'}
                          &nbsp;to&nbsp;
                          {dates?.to
                            ? moment(dates?.to).format('DD/MM/YYYY')
                            : '-'}
                          {data?.pricing?.portal_specials_booking_dates
                            .length === totalData
                            ? ''
                            : ','}
                        </span>
                      );
                    }
                  )}
                </Badge>
              </div>
            ) : null}
          </div>

          <div className='flex items-center gap-4'>
            {accommodationData?.parent_accommodation?.id === 0 &&
            accommodationData?.type === 'casa' ? (
              <div
                className='flex select-none flex-row gap-1 rounded-lg bg-blue-500 text-white  hover:bg-gray-700 hover:text-white cursor-pointer text-xs p-1 font-medium'
                onClick={() => setShowHotelData(true)}
              >
                <HomeIcon className='w-4 h-4' />
                <span> View standard casas</span>
              </div>
            ) : null}
            <p className='text-xs text-gray-400 font-medium'>
              <span className='text-[#787878]'>Last price update: </span>
              <span className='text-customBlack'>
                {accommodationData?.last_date
                  ? moment(accommodationData?.last_date).format('DD-MM-YYYY')
                  : '-'}
              </span>
            </p>
            <p
              className='cursor-pointer text-xs text-customBlue text-gradient font-semibold'
              onClick={() => setOpenHistoryModal(true)}
            >
              Price History
            </p>
          </div>
        </div>

        {prices?.common?.length > 0 && (
          <div className='mt-4 border rounded-md'>
            <table className='w-full price-table '>
              <tbody className='bg-[#FAFAFA]'>
                <tr className='border-b bg-[#EFEFEF]'>
                  <th className='p-4 max-w-[30%] font-semibold text-sm text-customBlack content-center'>
                    Seasons
                  </th>
                  {regularHeader?.map((header, index) => (
                    <th
                      key={index}
                      className='px-4 py-3 max-w-[16%] first-letter:uppercase content-center font-semibold text-sm text-customBlack'
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

                {prices?.common?.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className='align-baseline border-b last:border-0 hover:bg-gray-100'
                  >
                    <td className='px-4 py-3 flex items-center max-w-[30%] text-base text-customBlack'>
                      {moment(item?.date_plan?.from_date).format('DD-MM-YYYY')}{' '}
                      <ArrowRightIcon className='h-5 w-5 mx-2 text-gray-400' />{' '}
                      {moment(item?.date_plan?.to_date).format('DD-MM-YYYY')}
                    </td>

                    {regularHeader?.map((header, colIndex) =>
                      renderCell(colIndex, header, item)
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CommonModal
        maxWidth='max-w-4xl xl:max-w-7xl'
        ModalHeader={`${accommodationData?.name ?? ''} - ${data?.name}`}
        isOpen={isShowHotelData}
        onClose={setShowHotelData}
        onSuccess={() => {}}
        showActionBtn={false}
      >
        <ChildCasa casaId={accommodationData?.id ?? 0} />
      </CommonModal>

      {openHistoryModal && (
        <CommonModal
          maxWidth='max-w-5xl'
          ModalHeader={`Pricing History: ${capitalize(data?.name)}`}
          isOpen={openHistoryModal}
          onClose={setOpenHistoryModal}
          onSuccess={() => {}}
          showActionBtn={false}
        >
          <PricingHistory roomId={data?.id} />
        </CommonModal>
      )}
    </div>
  );
};

AccommodationRoomsList.propTypes = {
  data: PropTypes.object,
  accommodationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accommodationData: PropTypes.object,
  priceMargin: PropTypes.number,
};

export default AccommodationRoomsList;
