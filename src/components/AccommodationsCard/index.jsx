import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PriceTableModal from '@/pages/Accommodations/PriceTableModal';
import { StarIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { CommonModal } from '@/components/Common';
import { CURRENCY } from '@/utils/constants';
import { ReactComponent as EyeIcon } from '@/assets/images/eye-icon.svg';
import noImage from '@/assets/images/no-image.png';
import SpecialImg from '@/assets/images/special-img.png';

const AccommodationsCard = (props) => {
  const { accommodations } = props;

  const navigate = useNavigate();
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);

  return (
    <>
      {accommodations?.map((accommodation, index) => (
        <div
          key={index}
          className='col-span-1 rounded-lg cursor-pointer border hover:border-blueColor hover:shadow-lg'
          onClick={() => navigate(`/accommodation/${accommodation?.id}`)}
        >
          <div className='relative'>
            {accommodation?.has_room_special && (
              <div className='block absolute z-[9] top-[7px] left-0 text-right drop-shadow-2xl'>
                <img src={SpecialImg} alt='special' className='h-10' />
              </div>
            )}

            <button
              type='button'
              className='absolute top-[7px] right-[10px] z-10 rounded-md bg-white drop-shadow-2xl shadow-lg p-1.5'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedAccommodation(accommodation);
                setShowPriceModal(true);
              }}
            >
              <EyeIcon className='w-5 h-5' />
            </button>
            <img
              src={
                accommodation?.images?.find((item) => item?.image_type === '0')
                  ?.image_path
              }
              onError={(e) => {
                e.target.src = noImage;
              }}
              alt={accommodation?.name}
              className='rounded-t-lg min-h-[160px] h-[190px] w-full object-cover'
            />
            {accommodation?.early_bird && (
              <div className='absolute right-[10px] bottom-[10px] z-10 overflow-hidden bg-gradient-to-r from-customRed1 to-customRed2 px-[8px] py-[4px] rounded-md shadow-[0px_0px_20px_0px_#00000080]'>
                <p className='text-xs font-medium text-white'>
                  Early Bird Discount
                </p>
              </div>
            )}
          </div>

          <div className='flex justify-between items-center py-3 px-3.5'>
            <div className='w-full max-w-[70%]'>
              <p className='text-sm xl:text-base  font-semibold first-letter:uppercase text-customBlack  truncate '>
                {accommodation?.name}
              </p>
              <div className='flex mt-1'>
                {[...Array(accommodation?.star_rating)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className='text-yellow-400'
                    aria-hidden='true'
                    width={15}
                    height={15}
                  />
                ))}
              </div>
              <p className='text-sm first-letter:uppercase font-semibold text-blueColor  mt-2.5 truncate'>
                {accommodation?.city}
              </p>
            </div>

            <div className='border rounded-md p-3.5 text-center min-w-[85px]'>
              <p className='text-xs font-light'>From</p>
              <p className='text-xl font-bold text-customBlue break-words'>
                {CURRENCY} {accommodation?.price_start_from}
              </p>
            </div>
          </div>
        </div>
      ))}
      {showPriceModal && (
        <CommonModal
          saveText='Verify'
          maxWidth='sm:max-w-3xl'
          ModalHeader={selectedAccommodation?.name}
          isOpen={showPriceModal}
          onClose={setShowPriceModal}
        >
          <PriceTableModal selectedAccommodation={selectedAccommodation} />
        </CommonModal>
      )}
    </>
  );
};

AccommodationsCard.propTypes = {
  accommodations: PropTypes.array,
};

export default AccommodationsCard;
