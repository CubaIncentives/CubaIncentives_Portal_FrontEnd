import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Badge } from '@/components/Common';
import CommonModal from '@/components/Common/CommonModal';
import { CURRENCY } from '@/utils/constants';
import { capitalize } from '@/utils/helper';

// import PricingHistory from './PricingHistory';

const AccommodationRoomsList = ({
  data,
  accommodationId,
  accommodationData,
}) => {
  const navigate = useNavigate();
  const prices = data?.pricing || [];

  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  const getTypeKeys = (data) => {
    if (data && data.length > 0) {
      return Object.keys(data[0]?.room?.type);
    }

    return [];
  };

  const regularHeader = getTypeKeys(prices?.common);

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
  const renderCell = (colIndex, header, item) => {
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
      const discountPrice =
        item?.room?.type?.discount || item?.room?.type?.triple || 0;

      displayPrice = calculateDisplayPrice(
        colIndex,
        basePrice,
        supplementPrice,
        discountPrice
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
      <td className='px-4 py-3 max-w-[16%]' key={colIndex}>
        {displayPrice ? (
          <span className='text-customBlue font-semibold group-hover:font-extrabold'>
            {CURRENCY + ' ' + displayPrice}
          </span>
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
              <button
                type='button'
                onClick={() => {
                  navigate(`/accommodation/view/${accommodationId}/specials`, {
                    state: {
                      accommodationData: accommodationData,
                      isAddSpecial: data?.pricing?.common?.length > 0,
                    },
                  });
                }}
              >
                <Badge
                  className='bg-[#fbca32] text-black mx-2 cursor-pointer'
                  size='sm'
                >
                  Special running
                </Badge>
              </button>
            )}

            {/* {accommodationData?.early_bird && (
              <button type='button' onClick={() => setOpenEarlyBirdModal(true)}>
                <Badge
                  className='bg-palette5 text-white mr-5 cursor-pointer'
                  size='sm'
                >
                  Early bird
                </Badge>
              </button>
            )} */}
          </div>

          <div className='flex items-center gap-4'>
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
                    className='align-baseline border-b last:border-0'
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

      {openHistoryModal && (
        <CommonModal
          maxWidth='sm:max-w-2xl'
          ModalHeader={`Pricing History: ${capitalize(data?.name)}`}
          isOpen={openHistoryModal}
          onClose={setOpenHistoryModal}
          onSuccess={() => {}}
          showActionBtn={false}
        >
          Pricing history
          {/* <PricingHistory
            accommodationId={accommodationId}
            roomId={data?.id}
            accommodationData={accommodationData}
          /> */}
        </CommonModal>
      )}
    </div>
  );
};

AccommodationRoomsList.propTypes = {
  data: PropTypes.object,
  accommodationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accommodationData: PropTypes.object,
};

export default AccommodationRoomsList;
