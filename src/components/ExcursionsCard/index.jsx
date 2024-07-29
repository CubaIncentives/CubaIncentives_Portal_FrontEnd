import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PriceTableModal from '@/pages/Excursions/PriceTableModal';
import PropTypes from 'prop-types';

import { ReactComponent as EyeIcon } from '@/assets/images/eye-icon.svg';
import noImage from '@/assets/images/no-image.png';

import { CommonModal } from '../Common';

const ExcursionsCard = (props) => {
  const { excursions } = props;

  const navigate = useNavigate();

  const [selectedExcursion, setSelectedExcursion] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);

  return (
    <>
      {excursions?.map((excursion, index) => (
        <div
          key={index}
          className='col-span-1 rounded-lg cursor-pointer border hover:border-blueColor hover:shadow-lg bg-black-cover'
          onClick={() => navigate(`/excursion/${excursion?.id}`)}
        >
          <div className='relative '>
            <button
              type='button'
              className='absolute top-[10px] right-[12px] z-10 rounded-md bg-white drop-shadow-2xl shadow-lg p-1.5'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedExcursion(excursion);
                setShowPriceModal(true);
              }}
            >
              <EyeIcon className='w-5 h-5' />
            </button>
          </div>
          <img
            src={
              excursion?.images?.find((item) => item?.image_type === '0')
                ?.image_path
            }
            alt={excursion?.excursion_name}
            onError={(e) => {
              e.target.src = noImage;
            }}
            className='rounded-t-lg min-h-[160px] h-[190px] w-full object-cover'
          />
          <div className='py-3 px-4'>
            <p className='font-semibold first-letter:uppercase text-lg xl:text-xl truncate'>
              {excursion?.excursion_name}
            </p>
            <div className='flex justify-between items-center'>
              <p className='xl:text-base text-sm first-letter:uppercase mt-1 font-semibold text-blueColor truncate'>
                {excursion?.city}
              </p>
            </div>
          </div>
        </div>
      ))}
      {showPriceModal && (
        <CommonModal
          saveText='Verify'
          maxWidth='sm:max-w-2xl'
          ModalHeader={selectedExcursion?.excursion_name}
          isOpen={showPriceModal}
          onClose={setShowPriceModal}
        >
          <PriceTableModal
            selectedExcursion={selectedExcursion}
            setShowPriceModal={setShowPriceModal}
          />
        </CommonModal>
      )}
    </>
  );
};

ExcursionsCard.propTypes = {
  excursions: PropTypes.array,
};

export default ExcursionsCard;
